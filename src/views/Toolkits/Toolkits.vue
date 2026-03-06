<template>
  <div class="user-management">
        <div class="management_1">
        <el-page-header>
          <template #content>
            <div class="flex items-center"><span class="text-large font-600 mr-3"> 工具包管理 </span></div>   
          </template>
          <template #extra>
            <div class="flex items-center">
               <el-button type="primary" icon="Paperclip" class="management_1_1" @click="dialogFormVisible = true">绑定工具</el-button>
               <el-button type="primary" icon="Plus" class="management_1_1" @click="dialogFormVisible = true">新增工具包</el-button>
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

      <el-table-column prop="toolkitId" label="ID" v-npmif="false"  />

      <el-table-column prop="creatorId" label="CreatorID" v-if="false"  />

      <el-table-column prop="consumer.name" label="使用人"  v-if="false"  />

      <el-table-column prop="code" label="工具包名"   />
      
      <el-table-column prop="cameraCode" label="相机编码"   />
      
      <el-table-column prop="rfidCode" label="RFID编码"   /> 
            
      <el-table-column prop="mqttClientId" label="MQTT客户端ID"  />

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
  <!-- 新增 -->
  <el-dialog v-model="dialogFormVisible" title="添加工具包" width="500">
    <el-form :model="form">
      <el-form-item label="工具包名" :label-width="formLabelWidth">
        <el-input v-model="form.code" autocomplete="off" />
      </el-form-item>

      <el-form-item label="相机编码" :label-width="formLabelWidth">
        <el-input v-model="form.cameraCode" autocomplete="off" />
       </el-form-item> 

       <el-form-item label="RFID编码" :label-width="formLabelWidth">
        <el-input v-model="form.rfidCode" autocomplete="off" />
      </el-form-item>

       <el-form-item label="MQTT客户端ID" :label-width="formLabelWidth">
        <el-input v-model="form.mqttClientId" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="onSubmit">提交</el-button>
      </div>
    </template>
  </el-dialog>
  <!-- 修改 -->
  <el-dialog v-model="dialogFormVisible2" title="修改工具包" width="500">
    <el-form :model="form2">
      <el-form-item label="工具包名" :label-width="formLabelWidth">
        <el-input v-model="form2.code" autocomplete="off" />
      </el-form-item>

      <el-form-item label="相机编码" :label-width="formLabelWidth">
        <el-input v-model="form2.cameraCode" autocomplete="off" />
       </el-form-item> 

       <el-form-item label="RFID编码" :label-width="formLabelWidth">
        <el-input v-model="form2.rfidCode" autocomplete="off" />
      </el-form-item>

       <el-form-item label="MQTT客户端ID" :label-width="formLabelWidth">
        <el-input v-model="form2.mqttClientId" autocomplete="off" />
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
import { Toolkits_GetList,Toolkits_Add,Toolkits_Dlete,Toolkits_Update } from '@/api/auth'
const userList = ref([])
const selection = ref([])
const dialogFormVisible = ref(false)
const dialogFormVisible2 = ref(false)
const formLabelWidth = '140px'
const form = reactive({
  code: '',
  rfidCode: '',
  mqttClientId: '',
  cameraCode: ''
})
const form2 = reactive({
  toolkitId:'',
  code: '',
  rfidCode: '',
  mqttClientId: '',
  cameraCode: '',
  creatorId:''
})
onMounted(() => {
   GetList()
})

// 获取列表
const GetList = async () => {
  try {
    const response = await Toolkits_GetList()
    userList.value = response || []

    console.log('userList6666:', userList)
  } catch (error) {
    ElMessage.info(`获取列表失败: ${error}`)
  }
}
// 添加
const onSubmit = async () => {
  try {
    if (form.code == ""||form.rfidCode == ""||form.mqttClientId == ""||form.cameraCode == "") {
      ElMessage.error('字段不能为空')
      return
    }
    
    const userData = {
      code: form.code,
      rfidCode: form.rfidCode,
      mqttClientId: form.mqttClientId,
      cameraCode: form.cameraCode
    }
    
    console.log('提交的用户数据:', userData)
    
    // 调用添加用户接口
    const response = await Toolkits_Add(userData)
    
    ElMessage.success('用户添加成功')
    dialogFormVisible.value = false
    
    // 重置表单
    form.code = ''
    form.rfidCode = ''
    form.mqttClientId = ''
    form.cameraCode = ''
    // 刷新用户列表
    GetList()
    
  } catch (error) {
    ElMessage.error(`添加失败: ${error}`)
  }
}
// 删除
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(`确定要删除工具包吗 "${row.code}" 吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    // 调用删除接口
    await Toolkits_Dlete(row.toolkitId)
    ElMessage.success('删除成功')

    // 刷新用户列表
    GetList()
  } catch (error) {
    // 用户取消
  }
}
// 编辑
const handleEdit = (row) => {
  form2.toolkitId = row.toolkitId
  form2.code = row.code
  form2.rfidCode = row.rfidCode
  form2.cmqttClientIdode = row.mqttClientId
  form2.cameraCode = row.cameraCode
  form2.creatorId = row.creatorId
  dialogFormVisible2.value = true
}                                                                              
// 提交修改
const onUpdate = async () =>  {
    try {
        if (form2.code == ""||form2.rfidCode == ""||form2.mqttClientId == ""||form2.cameraCode == "") {
      ElMessage.error('字段不能为空')
      return
    }
    const userData = {
      toolkitId:form2.toolkitId,
      code: form2.code,
      rfidCode: form2.rfidCode,
      mqttClientId: form2.mqttClientId,
      cameraCode: form2.cameraCode,
      creatorId:form2.creatorId
    }

    console.log('userData6666:', userData)
    
    // 调用修改用户接口
    const response = await Toolkits_Update(userData)
    
    ElMessage.success('修改成功')
    dialogFormVisible2.value = false
    
    // 重置表单
    form2.toolkitId = ''
    form2.code = ''
    form2.rfidCode = ''
    form2.mqttClientId = ''
    form2.cameraCode = ''
    
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