// src/utils/request.js
import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'

// 从环境变量获取配置
const BASE_URL = import.meta.env.VITE_APP_BASE_API || ''
const TIMEOUT = import.meta.env.VITE_APP_TIMEOUT || 30000

// 创建axios实例
const service = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
})

// 是否正在刷新的标记
let isRefreshing = false
// 重试队列，每一项将是一个待执行的函数形式
let requests = []

// 存储token相关函数
const TokenManager = {
  // 获取token
  getToken() {
    return localStorage.getItem('token') || ''
  },
  
  // 获取refreshToken
  getRefreshToken() {
    return localStorage.getItem('refreshToken') || ''
  },
  
  // 获取token过期时间
  getTokenExpiry() {
    return localStorage.getItem('accessTokenExpiry') || ''
  },
  
  // 设置token
  setToken(token) {
    localStorage.setItem('token', token)
  },
  
  // 设置refreshToken
  setRefreshToken(refreshToken) {
    localStorage.setItem('refreshToken', refreshToken)
  },
  
  // 设置token过期时间
  setTokenExpiry(expiry) {
    localStorage.setItem('accessTokenExpiry', expiry)
  },
  
  // 清除所有token
  clearTokens() {
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('accessTokenExpiry')
    localStorage.removeItem('user')
  },
  
  // 检查token是否即将过期（提前5分钟刷新）
  isTokenExpired() {
    const expiry = this.getTokenExpiry()
    if (!expiry) return true
    
    const expiryTime = new Date(expiry).getTime()
    const now = new Date().getTime()
    const bufferTime = 5 * 60 * 1000 // 5分钟缓冲时间
    
    return expiryTime - now <= bufferTime
  }
}

// 刷新token的函数
async function refreshToken() {
  try {
    const refreshToken = TokenManager.getRefreshToken()
    if (!refreshToken) {
      throw new Error('缺少refreshToken')
    }
    
    // 这里需要根据你的实际刷新token接口来修改
    const response = await axios({
      method: 'post',
      url: BASE_URL + '/Authorities/RefreshToken',
      data: {
        accessToken:localStorage.getItem('token'),
        refreshToken: refreshToken
      },
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      }
    })
    
    const { data } = response
    if (data.code === 0 && data.data) {
      // 更新本地存储的token
      TokenManager.setToken(data.data.accessToken)
      TokenManager.setRefreshToken(data.data.refreshToken)
      TokenManager.setTokenExpiry(data.data.accessTokenExpiry)
      
      return data.data.accessToken
    } else {
      throw new Error('刷新token失败')
    }
  } catch (error) {
    console.error('刷新token失败:', error)
    // 清除所有token，跳转到登录页
    TokenManager.clearTokens()
    handleUnauthorized()
    throw error
  }
}

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 显示loading（可选）
    // if (config.showLoading !== false) {
    //   // 可以在这里全局loading
    // }
    
    // 添加token
    const token = TokenManager.getToken()
    if (token && config.needToken !== false) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // 添加时间戳防止缓存（GET请求）
    if (config.method === 'get' || config.method === 'GET') {
      config.params = {
        ...config.params,
        _t: Date.now()
      }
    }
    
    return config
  },
  error => {
    console.error('请求配置错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    // 隐藏loading（如果需要）
    // hideLoading()
    
    const { data, config } = response

    console.log('响应拦截器：',response)
    // 处理二进制数据（如文件下载）
    if (config.responseType === 'blob' || config.responseType === 'arraybuffer') {
      return data
    }
    
    // 根据后端API结构处理
    return handleResponse(data, config)
  },
  async error => {
    // 隐藏loading（如果需要）
    // hideLoading()
    
    const { response, config } = error
    const originalRequest = config
    
    // 如果是401错误，尝试刷新token
    if (response && response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      if (isRefreshing) {
        // 如果正在刷新token，将请求加入队列
        return new Promise(resolve => {
          requests.push(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            resolve(service(originalRequest))
          })
        })
      }
      
      // 开始刷新token
      isRefreshing = true
      
      try {
        const newToken = await refreshToken()
        
        // 用新token重试当前请求
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        
        // 执行等待队列中的请求
        requests.forEach(callback => callback(newToken))
        requests = []
        
        // 重试原始请求
        return service(originalRequest)
      } catch (refreshError) {
        // 刷新失败，清除队列
        requests = []
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }
    
    return handleError(error)
  }
)

// 处理响应数据
function handleResponse(data, config) {
  // 模式1：标准RESTful格式（推荐）
  if (data.code !== undefined) {
    if (data.code === 200 || data.code === 0) {
      return data.data || data
    } else {
      return handleBusinessError(data, config)
    }
  }
  
  // 模式2：直接返回数据（没有code字段）
  return data
}

// 处理业务错误
function handleBusinessError(data, config) {
  const { code, message } = data
  
  // 不显示错误消息的接口
  if (config.silent) {
    return Promise.reject(data)
  }
  
  // 根据错误码处理
  switch (code) {
    case 401:
      handleUnauthorized()
      break
    case 403:
      ElMessage.error('没有权限访问该资源')
      break
    case 404:
      ElMessage.error('请求的资源不存在')
      break
    case 500:
      ElMessage.error('服务器内部错误')
      break
    default:
      ElMessage.error(message || '操作失败')
  }
  
  return Promise.reject(data)
}

// 处理HTTP错误
function handleError(error) {
  if (!error.response) {
    // 网络错误
    ElMessage.error('网络连接失败，请检查网络设置')
    return Promise.reject(error)
  }
  
  const { status, data } = error.response
  
  switch (status) {
    case 400:
      ElMessage.error(data.message || '请求参数错误')
      break
    case 401:
      handleUnauthorized()
      break
    case 403:
      ElMessage.error('访问被拒绝')
      break
    case 404:
      ElMessage.error('请求的资源不存在')
      break
    case 405:
      ElMessage.error('请求方法不允许')
      break
    case 408:
      ElMessage.error('请求超时')
      break
    case 500:
      ElMessage.error('服务器内部错误')
      break
    case 502:
      ElMessage.error('网关错误')
      break
    case 503:
      ElMessage.error('服务不可用')
      break
    case 504:
      ElMessage.error('网关超时')
      break
    default:
      ElMessage.error(`请求失败: ${status}`)
  }
  
  return Promise.reject(error)
}

// 处理未授权
function handleUnauthorized() {
  ElMessage.error('登录已过期，请重新登录')
  
  // 清除本地存储
  TokenManager.clearTokens()
  
  // 跳转到登录页
  setTimeout(() => {
    router.push({
      path: '/login',
      query: {
        redirect: router.currentRoute.value.fullPath
      }
    })
  }, 1000)
}

// 封装请求方法
export default {
  // GET请求
  get(url, params = {}, config = {}) {
    return service({
      url,
      method: 'GET',
      params,
      ...config
    })
  },
  
  // POST请求
  post(url, data = {}, config = {}) {
    return service({
      url,
      method: 'POST',
      data,
      ...config
    })
  },
  
  // PUT请求
  put(url, data = {}, config = {}) {
    return service({
      url,
      method: 'PUT',
      data,
      ...config
    })
  },
  
  // DELETE请求
  delete(url, params = {}, config = {}) {
    return service({
      url,
      method: 'DELETE',
      params,
      ...config
    })
  },
  
  // PATCH请求
  patch(url, data = {}, config = {}) {
    return service({
      url,
      method: 'PATCH',
      data,
      ...config
    })
  },
  
  // 文件上传
  upload(url, file, config = {}) {
    const formData = new FormData()
    formData.append('file', file)
    
    return service({
      url,
      method: 'POST',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config.headers
      },
      ...config
    })
  },
  
  // 文件下载
  download(url, params = {}, filename = 'download') {
    return service({
      url,
      method: 'GET',
      params,
      responseType: 'blob'
    }).then(response => {
      // 创建下载链接
      const blob = new Blob([response])
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      
      // 尝试从响应头获取文件名
      const contentDisposition = response.headers['content-disposition']
      let downloadFilename = filename
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)
        if (filenameMatch && filenameMatch[1]) {
          downloadFilename = filenameMatch[1].replace(/['"]/g, '')
        }
      }
      
      link.download = downloadFilename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    })
  },
  
  // 批量上传
  uploadMultiple(url, files, config = {}) {
    const formData = new FormData()
    files.forEach((file, index) => {
      formData.append(`files[${index}]`, file)
    })
    
    return service({
      url,
      method: 'POST',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config.headers
      },
      ...config
    })
  },
  
  // 手动刷新token（可选，可以在登录后定时刷新）
  async refreshTokenManually() {
    try {
      const newToken = await refreshToken()
      return newToken
    } catch (error) {
      console.error('手动刷新token失败:', error)
      throw error
    }
  }
}