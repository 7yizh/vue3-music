<template>
  <div class="user-management">
        <div class="management_1">
        <el-page-header>
          <template #content>
            <div class="flex items-center"><span class="text-large font-600 mr-3"> 绑定工具管理 </span></div>   
          </template>
          <template #extra>
            <div class="flex items-center">
               <el-button type="primary" icon="Paperclip" class="management_1_1" @click="dialogFormVisible = true">绑定工具</el-button>
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

      <el-table-column prop="relationId" label="ID" v-if="false"  />

      <el-table-column prop="toolId" label="toolId" v-if="false"  />

      <el-table-column prop="code" label="code" v-if="false"  />

      <el-table-column prop="toolkitId" label="toolkitId" v-if="false"  />

      <el-table-column prop="toolkit.code" label="工具包名"   />
      
      <el-table-column prop="tool.name" label="工具"   />
      
      <el-table-column prop="code" label="code"   /> 

      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="primary" size="small" @click="handleDelete(scope.row)">
            移动
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  <!-- 新增 -->
  <el-dialog v-model="dialogFormVisible" title="添加工具" width="500">
    <el-form :model="form">
      <el-form-item label="工具包名" :label-width="formLabelWidth">
        <el-select v-model="form.bagId" placeholder="请选择工具包">
          <el-option v-for="role in List2" 
          :key="role.toolkitId"
          :label="role.code" 
          :value="role.toolkitId"/>
        </el-select>
      </el-form-item>

      <el-form-item label="工具名" :label-width="formLabelWidth">
        <el-select v-model="form.toolId" placeholder="请选择工具">
          <el-option v-for="role in List1" 
         :key="role.toolId"
          :label="role.name" 
          :value="role.toolId"/>
        </el-select>
      </el-form-item>

       <el-form-item label="Code" :label-width="formLabelWidth">
        <el-input v-model="form.code" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="onSubmit">提交</el-button>
      </div>
    </template>
  </el-dialog>
  <!-- 移动 -->
  <el-dialog v-model="dialogFormVisible2" title="移动工具" width="500">
    <el-form :model="form2">
        <el-form-item label="工具包名" :label-width="formLabelWidth">
        <el-select v-model="form2.toolkitId" placeholder="请选择工具包">
          <el-option v-for="role in List2" 
          :key="role.toolkitId"
          :label="role.code" 
          :value="role.toolkitId"/>
        </el-select>
      </el-form-item>

      <el-form-item label="工具名" :label-width="formLabelWidth">
        <el-input v-model="form2.tool" autocomplete="off" />
       </el-form-item> 
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible2 = false">取消</el-button>
        <el-button type="primary" @click="onUpdate">确认移动</el-button>
      </div>
    </template>
  </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive ,onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Relations_GetList,Tools_GetList,Toolkits_GetList,Relations_SaveList,Relations_MoveTo } from '@/api/auth'
const userList = ref([])
const selection = ref([])
const List1 = ref([])
const List2 = ref([])
const dialogFormVisible = ref(false)
const dialogFormVisible2 = ref(false)
const formLabelWidth = '140px'
const form = reactive({
  bagId: '',
  code: '',
  toolId: ''
})
const form2 = reactive({
  relationId:'',
  toolkitId: '',
  toolId: '',
  code: ''
})
onMounted(() => {
   GetList()
   GetList1()
   GetList2()
})
// 获取列表
const GetList = async () => {
  try {
    const response = await Relations_GetList()
    userList.value = response || []

    console.log("打印：",userList.value)
  } catch (error) {
    ElMessage.info(`获取列表失败: ${error}`)
  }
}
// 添加
const onSubmit = async () => {
  try {
    if (form.bagId == ""||form.code == ""||form.toolId == "") {
      ElMessage.error('字段不能为空')
      return
    }
  
    const postData = ref([
      {
        toolkitId: form.bagId,
        code: form.code,
        enabled: true,
        isAdded: true,
        toolId: form.toolId
      }
    ])
    // 调用添加用户接口
    console.log('发送的数据：', postData.value)
    console.log('发送的数据：', JSON.stringify(postData.value))
    const response = await Relations_SaveList(postData.value)
    ElMessage.success('用户添加成功')
    dialogFormVisible.value = false
    
    // 重置表单
    form.toolkitId = ''
    form.toolId = ''
    form.code = ''
    // 刷新用户列表
    GetList()
    
  } catch (error) {
    ElMessage.error(`添加失败: ${error}`)
  }
}
// 获取列表
const GetList1 = async () => {
  try {
    const response = await Tools_GetList()
    List1.value = response || []
  } catch (error) {
    ElMessage.info(`获取列表失败: ${error}`)
  }
}
// 获取列表
const GetList2 = async () => {
  try {
    const response = await Toolkits_GetList()
    List2.value = response || []
  } catch (error) {
    ElMessage.info(`获取列表失败: ${error}`)
  }
}
// 编辑
const handleDelete = (row) => {
  form2.relationId = row.relationId
  form2.toolkitId = row.toolkitId
  form2.toolId = row.toolId
  form2.code = row.code
  form2.tool = row.tool.name
  dialogFormVisible2.value = true

  console.log('form26666:', form2)
}                                                                              
// 提交修改
const onUpdate = async () =>  {
    try {
        if (form2.toolkit == ""||form2.tool == "") {
      ElMessage.error('字段不能为空')
      return
    }
    const userData = {
      relationId:form2.relationId,
      toolkitId: form2.toolkitId,
      toolId: form2.toolId,
      code: form2.code
    }

    console.log('userData6666:', userData)
    
    // 调用修改用户接口
    const response = await Relations_MoveTo(userData)
    
    ElMessage.success('修改成功')
    dialogFormVisible2.value = false
    
    // 重置表单
    form2.relationId = ''
    form2.toolkitId = ''
    form2.toolId = ''
    form2.code = ''
    
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