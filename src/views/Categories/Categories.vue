<template>
  <div class="user-management">
        <div class="management_1">
        <el-page-header>
          <template #content>
            <div class="flex items-center"><span class="text-large font-600 mr-3"> 类别管理 </span></div>   
          </template>
          <template #extra>
            <div class="flex items-center">
               <el-button type="primary" icon="Plus" class="management_1_1" @click="dialogFormVisible = true">新增类别</el-button>
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

      <el-table-column prop="categoryId" label="ID" v-if="false"  />

      <el-table-column prop="name" label="类别名"   />

      <el-table-column prop="updatedTime" label="创建时间"  />

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
  <el-dialog v-model="dialogFormVisible" title="添加类别" width="500">
    <el-form :model="form">
      <el-form-item label="类别名" :label-width="formLabelWidth">
        <el-input v-model="form.name" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="onSubmit">提交</el-button>
      </div>
    </template>
  </el-dialog>

  <el-dialog v-model="dialogFormVisible2" title="修改类别" width="500">
    <el-form :model="form2">
      <el-form-item label="类别名" :label-width="formLabelWidth">
        <el-input v-model="form2.code" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible2 = false">取消</el-button>
        <el-button type="primary" @click="onUpdate">确认修改</el-button>
      </div>
    </template>
  </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive ,onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Categories_GetList,Categories_Add,Categories_Dlete,TCategories_Update } from '@/api/auth'
const userList = ref([])
const selection = ref([])
const dialogFormVisible = ref(false)
const dialogFormVisible2 = ref(false)
const formLabelWidth = '140px'
const form = reactive({
  name: '',
})
const form2 = reactive({
  categoryId:'',
  name: ''
})
onMounted(() => {
   GetList()
})

// 获取列表
const GetList = async () => {
  try {
    const response = await Categories_GetList()
    userList.value = response || []
  } catch (error) {
    ElMessage.info(`获取列表失败: ${error}`)
  }
}
// 添加
const onSubmit = async () => {
  try {
    if (form.name == "") {
      ElMessage.error('字段不能为空')
      return
    }
    
    const userData = {
      name: form.name
    }
    
    console.log('提交的用户数据:', userData)
    
    // 调用添加用户接口
    const response = await Categories_Add(userData)
    
    ElMessage.success('添加成功')
    dialogFormVisible.value = false
    
    // 重置表单
    form.name = ''

    // 刷新用户列表
    GetList()
    
  } catch (error) {
    ElMessage.error(`添加失败: ${error}`)
  }
}
// 删除
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(`确定要删除该类别吗 "${row.name}" 吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    // 调用删除接口
    await Categories_Dlete(row.categoryId)
    ElMessage.success('删除成功')

    // 刷新用户列表
    GetList()
  } catch (error) {
    // 用户取消
  }
}
// 编辑
const handleEdit = (row) => {
  form2.categoryId = row.categoryId
  form2.name = row.name

  dialogFormVisible2.value = true
}
// 提交修改
const onUpdate = async () =>  {
    try {
        if (form2.name == "") {
      ElMessage.error('字段不能为空')
      return
    }
    
    const userData = {
      categoryId: form2.categoryId,
      name:form2.name
    }

    console.log('选中的ID:', form2.categoryId)
    
    // 调用修改用户接口
    const response = await Tools_Update(userData)
    
    ElMessage.success('修改成功')
    dialogFormVisible2.value = false
    
    // 重置表单
    form2.categoryId = ''
    form2.name = ''
    
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