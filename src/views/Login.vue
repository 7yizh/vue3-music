<template>
  <div class="login-container">
    <div class="login-box">
      <h2 class="title">系统登录</h2>
      <el-form 
        ref="loginFormRef" 
        :model="loginForm" 
        class="login-form"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            prefix-icon="User"
            size="large"
          />
        </el-form-item>
        
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            prefix-icon="Lock"
            size="large"
            show-password
          />
        </el-form-item>
        
        <el-form-item>
          <el-checkbox v-model="loginForm.remember" value="记住密码">记住密码</el-checkbox>
        </el-form-item>
        
        <el-form-item>
          <el-button
            type="primary"
            size="large"
            :loading="loading"
            @click="handleLogin"
            class="login-button"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<!-- src/views/Login.vue -->
<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { login } from '@/api/auth'

const router = useRouter()
const route = useRoute()
const loginFormRef = ref()

const loginForm = reactive({
  username: 'root',
  password: 'root',
  remember: false
})

const loading = ref(false)

const handleLogin = async () => {
  try {
    await loginFormRef.value.validate()
    loading.value = true
    
    // 调用登录接口
    const response = await login({
      username: loginForm.username,
      password: loginForm.password
      
    })
    // 保存到本地存储
    localStorage.setItem('token', response.accessToken)
    localStorage.setItem('user', JSON.stringify(loginForm.username))
    localStorage.setItem('refreshToken', response.refreshToken)
    localStorage.setItem('accessTokenExpiry', response.accessTokenExpiry)

    ElMessage.success('登录成功')
    
    // 跳转到首页或重定向页面
    const redirect = route.query.redirect || '/home/dashboard'
    router.push(redirect)
    
  } catch (error) {
    console.error('登录失败:', error)
    // 根据错误类型显示不同消息
    if (error.code === 1001) {
      ElMessage.error('用户名或密码错误')
    } else if (error.code === 1002) {
      ElMessage.error('账号已被禁用')
    } else {
      ElMessage.error(error.message || '登录失败，请稍后重试')
    }
    
  } finally {
    loading.value = false
  }
}
</script>


<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f0f2f5;
  padding: 20px;
}

.login-box {
  width: 380px;
  padding: 48px 40px;
  background: white;
  border-radius: 12px;
  box-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.02),
    0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.login-box:hover {
  box-shadow: 
    0 4px 8px rgba(0, 0, 0, 0.04),
    0 8px 24px rgba(0, 0, 0, 0.08);
}

.title {
  text-align: center;
  margin-bottom: 36px;
  color: #1d2129;
  font-size: 26px;
  font-weight: 500;
}

  .login-button {
    width: 100%;
    height: 46px;
    font-size: 15px;
    font-weight: 500;
    border-radius: 8px;
    background: #1890ff;
    border: none;
    transition: all 0.2s ease;
  }
  
  .login-button:hover {
    background: #40a9ff;
    transform: none;
  }
  
  .login-button:active {
    background: #096dd9;
    transform: scale(0.98);
  
}

:deep(.el-input) {
  border-radius: 8px;
}

:deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px #dcdfe6 inset !important;
  transition: all 0.2s ease;
}

:deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #c0c4cc inset !important;
}

:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #1890ff inset !important;
}

:deep(.el-form-item) {
  margin-bottom: 24px;
}

:deep(.el-form-item:last-child) {
  margin-bottom: 0;
}

:deep(.el-checkbox) {
  color: #606266;
}

:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: #1890ff;
  border-color: #1890ff;
}

/* 添加一些装饰性元素 */
.login-box::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 0px;
  background: linear-gradient(90deg, #1890ff, #36cfc9);
  border-radius: 12px 12px 0 0;
}
</style>