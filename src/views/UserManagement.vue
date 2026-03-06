<template>
  <div class="user-management">
        <div class="management_1">
        <el-page-header>
          <template #content>
            <div class="flex items-center"><span class="text-large font-600 mr-3"> 用户管理 </span></div>   
          </template>
          <template #extra>
            <div class="flex items-center">
               <el-button type="primary" icon="Plus" class="management_1_1" @click="dialogFormVisible = true">新增用户</el-button>
               <el-button type="danger" icon="Delete" :disabled="selection.length === 0">批量删除</el-button>
               <el-button type="primary" class="ml-2" icon="RefreshLeft" @click="GetList()">刷新</el-button>
            </div> 
          </template>
        </el-page-header>
      </div>    
    <el-table
      :data="userList"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      
      <el-table-column prop="userId" label="ID" width="150" v-if="false"  />
      
      <el-table-column prop="roleId" label="RoleID" width="150" v-if="false"  />
      
      <el-table-column prop="username" label="姓名"/>
      
        <el-table-column prop="gender" label="性别">
        <template #default="scope">
           {{ scope.row.gender === true ? '男' : '女' }}
        </template>
      </el-table-column>
            
      <el-table-column prop="locked" label="锁定"  >
      <template #default="scope">
           {{ scope.row.locked === true ? '是' : '否' }}
        </template>
      </el-table-column>

      <el-table-column prop="enabled" label="启用" >
     <template #default="scope">
           {{ scope.row.enabled === true ? '是' : '否' }}
        </template>
      </el-table-column>

      <el-table-column prop="name" label="权限" >
        <template #default="scope">
          <el-tag :type="scope.row.name === '系统管理员用户' ? 'danger' : 'primary'">
            {{ scope.row.name }}
          </el-tag>
        </template>
      </el-table-column>
      
      <el-table-column prop="createdTime" label="创建时间" width="200" />

      <el-table-column label="操作" width="200">
        <template #default="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope.row)">
            修改
          </el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope.row)">
            删除
          </el-button>
          <el-button type="primary" size="small" @click="handleEdit2(scope.row)">
            权限
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  <el-dialog v-model="dialogFormVisible" title="添加用户" width="500">
    <el-form :model="form">
      <el-form-item label="用户名" :label-width="formLabelWidth">
        <el-input v-model="form.username" autocomplete="off" />
      </el-form-item>
      <el-form-item label="密码" :label-width="formLabelWidth">
        <el-input v-model="form.password" autocomplete="off" />
      </el-form-item>
      <el-form-item label="角色" :label-width="formLabelWidth">
        <el-select v-model="form.role" placeholder="请选择角色权限">
          <el-option v-for="role in roleList" 
          :key="role.roleId"
          :label="role.name" 
          :value="role.roleId"/>
        </el-select>
      </el-form-item>
      <el-form-item label="性别" :label-width="formLabelWidth">
        <el-select v-model="form.gender" placeholder="请选择性别">
           <el-option label="男" value="男" />
          <el-option label="女" value="女" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="onSubmit">提交</el-button>
      </div>
    </template>
  </el-dialog>

  <el-dialog v-model="dialogFormVisible2" title="修改用户" width="500">
    <el-form :model="form2">
      <el-form-item label="请输入新用户名" :label-width="formLabelWidth">
        <el-input v-model="form2.username" autocomplete="off" />
      </el-form-item>
      <el-form-item label="请输入新密码" :label-width="formLabelWidth">
        <el-input v-model="form2.password" autocomplete="off" />
      </el-form-item>
      <el-form-item label="角色" :label-width="formLabelWidth">
        <el-select v-model="form2.role" placeholder="请选择角色权限">
          <el-option v-for="role in roleList" 
          :key="role.roleId"
          :label="role.name" 
          :value="role.roleId"/>
        </el-select>
      </el-form-item>
      <el-form-item label="性别" :label-width="formLabelWidth">
        <el-select v-model="form2.gender" placeholder="请选择性别">
           <el-option label="男" value="男" />
          <el-option label="女" value="女" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible2 = false">取消</el-button>
        <el-button type="primary" @click="onUpdate">提交修改</el-button>
      </div>
    </template>
  </el-dialog>

    <el-dialog v-model="dialogFormVisible3" title="用户权限" width="500">
    <el-form :model="form2">
      <el-form-item label="请输入新用户名" :label-width="formLabelWidth">
        <el-input v-model="form2.username" autocomplete="off" />
      </el-form-item>
      <el-form-item label="请输入新密码" :label-width="formLabelWidth">
        <el-input v-model="form2.password" autocomplete="off" />
      </el-form-item>
      <el-form-item label="角色" :label-width="formLabelWidth">
        <el-select v-model="form2.role" placeholder="请选择角色权限">
          <el-option v-for="role in roleList" 
          :key="role.roleId"
          :label="role.name" 
          :value="role.roleId"/>
        </el-select>
      </el-form-item>
      <el-form-item label="性别" :label-width="formLabelWidth">
        <el-select v-model="form2.gender" placeholder="请选择性别">
           <el-option label="男" value="男" />
          <el-option label="女" value="女" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible3 = false">取消</el-button>
        <el-button type="primary" @click="onUpdate">提交修改</el-button>
      </div>
    </template>
  </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive ,onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Users_GetList,Roles_GetList,Users_Add,Users_Dlete,Users_Update } from '@/api/auth'
const userList = ref([])
const roleList = ref([])
const selection = ref([])
const dialogFormVisible = ref(false)
const dialogFormVisible2 = ref(false)
const dialogFormVisible3 = ref(false)
const formLabelWidth = '140px'
const form = reactive({
  username: '',
  password: '',
  role: '',
  gender: '',
})
const form2 = reactive({
  userId:'',
  username: '',
  password: '',
  role: '',
  gender: '',
})
onMounted(() => {
   GetList()
   GetRole()
})

// 获取用户列表
const GetList = async () => {
  try {
    const response = await Users_GetList()
    userList.value = response || []
  } catch (error) {
    ElMessage.info(`获取用户列表失败: ${error}`)
  }
}
// 获取角色列表
const GetRole = async ()=>{
  try {
    const response = await Roles_GetList()
    roleList.value = response || []
  } catch (error) {
    ElMessage.info(`获取角色列表失败: ${error}`)
  }
}
// 添加用户
const onSubmit = async () => {
  try {
    // 获取选中的角色信息
    const selectedRole = roleList.value.find(role => role.roleId == form.role)
    
    if (!selectedRole || form.username == "" || form.password == "" || form.gender == "") {
      ElMessage.error('字段不能为空')
      return
    }
    
    const userData = {
      roleId: form.role, // 这里获取到的是选中的 roleId
      username: form.username,
      password: form.password,
      name: selectedRole.name, // 这里获取到的是角色名称
      gender: form.gender === '男' ? true : false
    }
    
    console.log('提交的用户数据:', userData)
    console.log('选中的角色名称:', selectedRole.name)
    console.log('选中的角色ID:', form.role)
    
    // 调用添加用户接口
    const response = await Users_Add(userData)
    
    ElMessage.success('用户添加成功')
    dialogFormVisible.value = false
    
    // 重置表单
    form.username = ''
    form.password = ''
    form.role = ''
    form.gender = ''
    
    // 刷新用户列表
    GetList()
    
  } catch (error) {
    ElMessage.error(`添加失败: ${error}`)
  }
}
// 删除用户
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(`确定要删除用户 "${row.username}" 吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    // 调用删除接口
    await Users_Dlete(row.userId)
    ElMessage.success('删除成功')

    // 刷新用户列表
    GetList()
  } catch (error) {
    // 用户取消
  }
}
// 编辑用户
const handleEdit = (row) => {
  form2.userId = row.userId
  form2.username = row.username
  form2.role = ''
  form2.gender = row.gender === true ? '男' : '女'
  dialogFormVisible2.value = true
}
// 提交修改
const onUpdate = async () =>  {
    try {
    const selectedRole = roleList.value.find(role => role.roleId == form2.role)

    if (!selectedRole || form2.username == "" || form2.password == "" || form2.gender == "") {

      console.log(selectedRole)
      console.log(form2.username)
      console.log(form2.password)
      console.log(form2.gender)

      ElMessage.error('字段不能为空')
      return
    }

    const userData = {
      userId : form2.userId,
      roleId: form2.role, // 这里获取到的是选中的 roleId
      username: form2.username,
      password: form2.password,
      name: selectedRole.name, // 这里获取到的是角色名称
      gender: form2.gender === '男' ? true : false
    }
    
    console.log('提交的用户数据:', userData)
    console.log('选中的角色名称:', selectedRole.name)
    console.log('选中的角色ID:', form2.role)
    
    // 调用修改用户接口
    const response = await Users_Update(userData)
    
    ElMessage.success('用户修改成功')
    dialogFormVisible2.value = false
    
    // 重置表单
    form2.userId = ''
    form2.username = ''
    form2.password = ''
    form2.role = ''
    form2.gender = ''
    
    // 刷新用户列表
    GetList()
    
  } catch (error) {
    ElMessage.error(`修改失败: ${error}`)
  }
}
// 编辑用户
const handleEdit2 = (row) => {
  dialogFormVisible3.value = true
}
const handleSelectionChange = (val) => {
  selection.value = val
}
</script>

<style scoped>
.user-management {
  padding-left: 20px;
  padding-bottom: 20px;
}
.management_1{
    margin-bottom: 15px;
}
.operation-bar {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
}
</style>