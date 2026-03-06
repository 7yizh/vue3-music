<template>
  <div class="user-management">
        <div class="management_1">
        <el-page-header>
          <template #content>
            <div class="flex items-center"><span class="text-large font-600 mr-3"> 品牌管理 </span></div>   
          </template>
          <template #extra>
            <div class="flex items-center">
               <el-button type="primary" icon="Plus" class="management_1_1" @click="dialogFormVisible = true">新增品牌</el-button>
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
      
      <el-table-column prop="brandId" label="ID" v-if="false"   />

      <el-table-column prop="creatorId" label="CreatorID"  v-if="false"  />
      
      <el-table-column prop="name" label="品牌名"   />
    
            
      <el-table-column prop="createdTime" label="创建时间"  />

      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope.row)">
            修改
          </el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  <el-dialog v-model="dialogFormVisible" title="添加品牌" width="500">
    <el-form :model="form">
      <el-form-item label="品牌名" :label-width="formLabelWidth">
        <el-input v-model="form.username" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="onSubmit">提交</el-button>
      </div>
    </template>
  </el-dialog>

  <el-dialog v-model="dialogFormVisible2" title="修改品牌" width="500">
    <el-form :model="form2">
      <el-form-item label="请输入新品牌名" :label-width="formLabelWidth">
        <el-input v-model="form2.name" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible2 = false">取消</el-button>
        <el-button type="primary" @click="onUpdate">提交修改</el-button>
      </div>
    </template>
  </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive ,onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Brands_GetList,Brands_Add,Brands_Dlete,Brands_Update } from '@/api/auth'
const userList = ref([])
const selection = ref([])
const dialogFormVisible = ref(false)
const dialogFormVisible2 = ref(false)
const formLabelWidth = '140px'
const form = reactive({
  username: '',
})
const form2 = reactive({
  brandId: '',
  name: '',
  creatorId:'',
})
onMounted(() => {
   GetList()
})

// 获取列表
const GetList = async () => {
  try {
    const response = await Brands_GetList()
    userList.value = response || []
  } catch (error) {
    ElMessage.info(`获取列表失败: ${error}`)
  }
}
// 添加
const onSubmit = async () => {
  try {
    if (form.username == "") {
      ElMessage.error('字段不能为空')
      return
    }
    
    const userData = {
      name: form.username,
    }
    
    console.log('提交的用户数据:', userData)
    
    // 调用添加用户接口
    const response = await Brands_Add(userData)
    
    ElMessage.success('用户添加成功')
    dialogFormVisible.value = false
    
    // 重置表单
    form.username = ''
    
    // 刷新用户列表
    GetList()
    
  } catch (error) {
    ElMessage.error(`添加失败: ${error}`)
  }
}
// 删除
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(`确定要删除品牌吗 "${row.name}" 吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    // 调用删除接口
    await Brands_Dlete(row.brandId)
    ElMessage.success('删除成功')

    // 刷新用户列表
    GetList()
  } catch (error) {
    // 用户取消
  }
}
// 编辑
const handleEdit = (row) => {
  form2.brandId = row.brandId
  form2.name = row.name
  form2.creatorId = row.creatorId

  dialogFormVisible2.value = true
}
// 提交修改
const onUpdate = async () =>  {
    try {
    if (form2.name == "") {
      console.log(form2.name)
      ElMessage.error('字段不能为空')
      return
    }

    const userData = {
      brandId : form2.brandId,
      name:form2.name,
      creatorId:form2.creatorId
    }
    
    console.log('选中的ID:', form2.brandId)
    
    // 调用修改用户接口
    const response = await Brands_Update(userData)
    
    ElMessage.success('修改成功')
    dialogFormVisible2.value = false
    
    // 重置表单
    form2.userId = ''
    form2.username = ''
    
    // 刷新用户列表
    GetList()
    
  } catch (error) {
    ElMessage.error(`修改失败: ${error}`)
  }
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