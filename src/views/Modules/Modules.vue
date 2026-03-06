<template>
  <div class="user-management">
        <div class="management_1">
        <el-page-header>
          <template #content>
            <div class="flex items-center"><span class="text-large font-600 mr-3"> 模块管理 </span></div>   
          </template>
          <template #extra>
            <div class="flex items-center">
               <el-button type="primary" icon="Plus" class="management_1_1" @click="dialogFormVisible = true">新增模块</el-button>
               <el-button type="primary" class="ml-2" icon="RefreshLeft" @click="GetList()">刷新</el-button>
            </div> 
          </template>
        </el-page-header>
      </div>    
    <el-table
      :data="userList"
      style="width: 100%"
    >
      <el-table-column type="selection" width="55" />

      <el-table-column prop="moduleId" label="ID" v-if="false" />

      <el-table-column prop="parentId" label="PID" v-if="false"  />

      <el-table-column prop="name" label="模块名"  />

      <el-table-column prop="url" label="路径"  />

      <el-table-column prop="enabled" label="是否禁用"  width="80" />

      <el-table-column prop="supportView" label="查看权限" width="80"  />

      <el-table-column prop="supportEdit" label="编辑权限"  width="80" />

      <el-table-column prop="supportDelete" label="删除权限"  width="80" />

      <el-table-column prop="supportImport" label="导入权限" width="80"  />

      <el-table-column prop="supportExport" label="导出权限" width="80" />

      <el-table-column prop="supportPrint" label="打印权限"  />
            
      <el-table-column prop="createdTime" label="创建时间"  />

      <el-table-column prop="updatedTime" label="更新时间"  />

      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="primary" size="small" @click="handle1(scope.row)">
            修改
          </el-button>
          <el-button type="danger" size="small" @click="handle2(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  <el-dialog v-model="dialogFormVisible" title="添加模块" width="500">
    <el-form :model="form">
      <el-form-item label="模块名" :label-width="formLabelWidth">
        <el-input v-model="form.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="路径" :label-width="formLabelWidth">
        <el-input v-model="form.url" autocomplete="off" />
      </el-form-item>
      <el-form-item label="是否禁用" :label-width="formLabelWidth">
        <el-select v-model="form.enabled" placeholder="请选择">
           <el-option label="是" value="false" />
          <el-option label="否" value="true" />
        </el-select>
      </el-form-item>
      <el-form-item label="查看权限" :label-width="formLabelWidth">
        <el-select v-model="form.supportView" placeholder="请选择">
           <el-option label="是" value="false" />
          <el-option label="否" value="true" />
        </el-select>
      </el-form-item>
      <el-form-item label="编辑权限" :label-width="formLabelWidth">
        <el-select v-model="form.supportEdit" placeholder="请选择">
           <el-option label="是" value="false" />
          <el-option label="否" value="true" />
        </el-select>
      </el-form-item>
      <el-form-item label="删除权限" :label-width="formLabelWidth">
        <el-select v-model="form.supportDelete" placeholder="请选择">
           <el-option label="是" value="false" />
          <el-option label="否" value="true" />
        </el-select>
      </el-form-item>
      <el-form-item label="导入权限" :label-width="formLabelWidth">
        <el-select v-model="form.supportImport" placeholder="请选择">
           <el-option label="是" value="false" />
          <el-option label="否" value="true" />
        </el-select>
      </el-form-item>
      <el-form-item label="导出权限" :label-width="formLabelWidth">
        <el-select v-model="form.supportExport" placeholder="请选择">
           <el-option label="是" value="false" />
          <el-option label="否" value="true" />
        </el-select>
      </el-form-item>
      <el-form-item label="打印权限" :label-width="formLabelWidth">
        <el-select v-model="form.supportPrint" placeholder="请选择">
           <el-option label="是" value="false" />
          <el-option label="否" value="true" />
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

    <el-dialog v-model="dialogFormVisible2" title="添加模块" width="500">
    <el-form :model="form2">
      <el-form-item label="模块名" :label-width="formLabelWidth">
        <el-input v-model="form2.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="路径" :label-width="formLabelWidth">
        <el-input v-model="form2.url" autocomplete="off" />
      </el-form-item>
      <el-form-item label="是否禁用" :label-width="formLabelWidth">
        <el-select v-model="form2.enabled" placeholder="请选择">
           <el-option label="是" value="false" />
          <el-option label="否" value="true" />
        </el-select>
      </el-form-item>
      <el-form-item label="查看权限" :label-width="formLabelWidth">
        <el-select v-model="form2.supportView" placeholder="请选择">
           <el-option label="是" value="false" />
          <el-option label="否" value="true" />
        </el-select>
      </el-form-item>
      <el-form-item label="编辑权限" :label-width="formLabelWidth">
        <el-select v-model="form2.supportEdit" placeholder="请选择">
           <el-option label="是" value="false" />
          <el-option label="否" value="true" />
        </el-select>
      </el-form-item>
      <el-form-item label="删除权限" :label-width="formLabelWidth">
        <el-select v-model="form2.supportDelete" placeholder="请选择">
           <el-option label="是" value="false" />
          <el-option label="否" value="true" />
        </el-select>
      </el-form-item>
      <el-form-item label="导入权限" :label-width="formLabelWidth">
        <el-select v-model="form2.supportImport" placeholder="请选择">
           <el-option label="是" value="false" />
          <el-option label="否" value="true" />
        </el-select>
      </el-form-item>
      <el-form-item label="导出权限" :label-width="formLabelWidth">
        <el-select v-model="form2.supportExport" placeholder="请选择">
           <el-option label="是" value="false" />
          <el-option label="否" value="true" />
        </el-select>
      </el-form-item>
      <el-form-item label="打印权限" :label-width="formLabelWidth">
        <el-select v-model="form2.supportPrint" placeholder="请选择">
           <el-option label="是" value="false" />
          <el-option label="否" value="true" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible2 = false">取消</el-button>
        <el-button type="primary" @click="onUpdate">提交</el-button>
      </div>
    </template>
  </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive ,onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Modules_GetList,Modules_Add,Modules_Dlete,Modules_Update } from '@/api/auth'
const userList = ref([])
const roleList = ref([])
const selection = ref([])
const dialogFormVisible = ref(false)
const dialogFormVisible2 = ref(false)
const formLabelWidth = '140px'
const form = reactive({
  name: '',
  url: '',
  enabled: '',
  supportView: '',
  supportEdit: '',
  supportDelete: '',
  supportImport: '',
  supportExport: '',
  supportPrint: ''
})
const form2 = reactive({
  moduleId:'',
  name: '',
  url: '',
  enabled: '',
  supportView: '',
  supportEdit: '',
  supportDelete: '',
  supportImport: '',
  supportExport: '',
  supportPrint: ''
})
onMounted(() => {
   GetList()
})

// 获取列表
const GetList = async () => {
  try {
    const response = await Modules_GetList()
    userList.value = response || []
  } catch (error) {
    ElMessage.info(`获取列表失败: ${error}`)
  }
}
// 添加
const onSubmit = async () => {
  try {
    if (form.name == ""||form.url == ""||form.enabled == ""||form.supportView == ""||form.supportEdit == ""||form.supportDelete == ""||form.supportImport == ""||form.supportExport == ""||form.supportPrint == "") {
      ElMessage.error('字段不能为空')
      return
    }
    
    const userData = {
      name: form.name,
      url: form.url,
      enabled: form.enabled === '是' ? true : false,
      supportView: form.supportView === '是' ? false : true,
      supportEdit: form.supportEdit === '是' ? false : true,
      supportDelete: form.supportDelete === '是' ? false : true,
      supportImport: form.supportImport === '是' ? false : true,
      supportExport: form.supportExport === '是' ? false : true,
      supportPrint: form.supportPrint === '是' ? false : true
    }
    
    console.log('提交的用户数据:', userData)
    
    // 调用添加用户接口
    const response = await Modules_Add(userData)
    
    ElMessage.success('用户添加成功')
    dialogFormVisible.value = false
    
    // 重置表单
    form.name = '',
    form.url = '',
    form.enabled = '',
    form.supportView = '',
    form.supportEdit = '',
    form.supportDelete = '',
    form.supportImport = '',
    form.supportExport = '',
    form.supportPrint = ''

    // 刷新用户列表
    GetList()
    
  } catch (error) {
    ElMessage.error(`添加失败: ${error}`)
  }
}
// 删除
const handle2 = async (row) => {
  try {
    await ElMessageBox.confirm(`确定要删除模块吗 "${row.name}" 吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    // 调用删除接口
    await Modules_Dlete(row.moduleId)
    ElMessage.success('删除成功')

    // 刷新用户列表
    GetList()
  } catch (error) {
    // 用户取消
  }
}
// 编辑
const handle1 = (row) => {
    form2.moduleId = row.moduleId,
    form2.name = row.name,
    form2.url = row.url,
    form2.enabled = row.enabled === true ? '是' : '否',
    form2.supportView = row.supportView=== true ? '是' : '否',
    form2.supportEdit = row.supportEdit=== true ? '是' : '否',
    form2.supportDelete = row.supportDelete=== true ? '是' : '否',
    form2.supportImport = row.supportImport=== true ? '是' : '否',
    form2.supportExport = row.supportExport=== true ? '是' : '否',
    form2.supportPrint = row.supportPrint=== true ? '是' : '否',

    dialogFormVisible2.value = true
}
// 提交修改
const onUpdate = async () =>  {
    try {
    if (form2.name == ""||form2.url == ""||form2.enabled == ""||form2.supportView == ""||form2.supportEdit == ""||form2.supportDelete == ""||form2.supportImport == ""||form2.supportExport == ""||form2.supportPrint == "") {
      ElMessage.error('字段不能为空')
      return
    }
      const userData = {
        moduleId : form2.moduleId,
        name: form2.name,
        url: form2.url,
        enabled: form2.enabled === '是' ? true : false,
        supportView: form2.supportView === '是' ? false : true,
        supportEdit: form2.supportEdit === '是' ? false : true,
        supportDelete: form2.supportDelete === '是' ? false : true,
        supportImport: form2.supportImport === '是' ? false : true,
        supportExport: form2.supportExport === '是' ? false : true,
        supportPrint: form2.supportPrint === '是' ? false : true
    }

    // 调用修改用户接口
    const response = await Modules_Update(userData)
    
    ElMessage.success('修改成功')
    dialogFormVisible2.value = false
  
    // 重置表单
    form2.moduleId = '',
    form2.name = '',
    form2.url = '',
    form2.enabled = '',
    form2.supportView = '',
    form2.supportEdit = '',
    form2.supportDelete = '',
    form2.supportImport = '',
    form2.supportExport = '',
    form2.supportPrint = ''

    // 刷新用户列表
    GetList()
    
  } catch (error) {
    ElMessage.error(`修改失败: ${error}`)
  }
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