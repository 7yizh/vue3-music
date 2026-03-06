import request from '@/utils/request'

//登录接口
export function login(data) {
  return request.post('/Authorities/GetToken', data)
}


//获取用户列表
export function Users_GetList() {
  return request.get('/Users/GetList')
}
//添加用户
export function Users_Add(data) {
  return request.post('/Users/Add', data)
}
//管理员删除用户
export function Users_Dlete(id) {
  return request.delete('/Users/Delete', {
      id: id
  })
}


//修改用户
export function Users_Update(data) {
  return request.put('/Users/Update', data)
}


//获取品牌列表
export function Brands_GetList() {
  return request.get('/Brands/GetList')
}
//添加品牌
export function Brands_Add(data) {
  return request.post('/Brands/Add', data)
}
//删除品牌
export function Brands_Dlete(id) {
  return request.delete('/Brands/Delete', {
      id: id
  })
}
//修改品牌
export function Brands_Update(data) {
  return request.put('/Brands/Update', data)
}



//获取工具包列表
export function Toolkits_GetList() {
  return request.get('/Toolkits/GetList')
}
//添加工具包
export function Toolkits_Add(data) {
  return request.post('/Toolkits/Add', data)
}
//删除工具包
export function Toolkits_Dlete(id) {
  return request.delete('/Toolkits/Delete', {
      id: id
  })
}
//修改工具包
export function Toolkits_Update(data) {
  return request.put('/Toolkits/Update', data)
}


//获取工具包与工具的绑定关系的列表
export function Relations_GetList() {
  return request.get('/Relations/GetList')
}
//工具包与工具的绑定关系
export function Relations_SaveList(data) {
  return request.post('/Relations/SaveList', data)
}
//工具包之间的工具调拨
export function Relations_MoveTo(data) {
  return request.patch('/Relations/MoveTo', data)
}


//获取工具列表
export function Tools_GetList() {
  return request.get('/Tools/GetList')
}
//添加工具
export function Tools_Add(data) {
  return request.post('/Tools/Add', data)
}
//删除工具
export function Tools_Dlete(id) {
  return request.delete('/Tools/Delete', {
      id: id
  })
}
//修改工具
export function Tools_Update(data) {
  return request.put('/Tools/Update', data)
}



//获取类别列表
export function Categories_GetList() {
  return request.get('/Categories/GetList')
}
//添加类别
export function Categories_Add(data) {
  return request.post('/Categories/Add', data)
}
//删除类别
export function Categories_Dlete(id) {
  return request.delete('/Categories/Delete', {
      id: id
  })
}
//修改类别
export function TCategories_Update(data) {
  return request.put('/Categories/Update', data)
}



//获取模块列表
export function Modules_GetList() {
  return request.get('/Modules/GetList')
}
//添加模块
export function Modules_Add(data) {
  return request.post('/Modules/Add', data)
}
//删除模块
export function Modules_Dlete(id) {
  return request.delete('/Modules/Delete', {
      id: id
  })
}
//修改模块
export function Modules_Update(data) {
  return request.put('/Modules/Update', data)
}



//获取盘点列表
export function Inventories_GetList() {
  return request.get('/Inventories/GetList')
}
//删除盘点记录
export function Inventories_Dlete(id) {
  return request.delete('/Inventories/Delete', {
      id: id
  })
}



// 获取视频列表
export function Videos_GetPageList(page = 1, limit = 50) {
  return request.get('/Videos/GetPageList', {
      page,
      limit
  })
}
// 获取回放链接
export function Videos_GetHttpUrlByCode(code, filename) {
  return request.get('/Videos/GetHttpUrlByCode', {
      code,
      filename
  })
}
// 获取直播链接
export function Videos_GetRtmpUrlByCode(code) {
  return request.get('/Videos/GetRtmpUrlByCode', {
      code
  })
}



//获取坐标统计列表
export function Inventories_GetToolkitLocationList() {
  return request.get('/Inventories/GetToolkitLocationList')
}

//获取角色列表
export function Roles_GetList() {
  return request.get('/Roles/GetList')
}
