<template>
  <div class="user-management">
    <div class="management_1">
        <el-page-header>
          <template #content>
            <div class="flex items-center"><span class="text-large font-600 mr-3"> 坐标信息统计 </span></div>   
          </template>
          <template #extra>
            <div class="flex items-center">
               背包名称：<el-select v-model="selectedToolkitId" clearable placeholder="请选择背包名" style="width: 200px; margin-right: 10px;">
                <el-option v-for="item in bagList" :key="item.toolkitId" :label="item.code" :value="item.toolkitId" /></el-select>
               日期： <el-date-picker v-model="value" type="daterange" start-placeholder="开始时间" end-placeholder="结束时间" value-format="YYYY-MM-DD HH:mm:ss" :default-time="defaultTime" /> 
               <el-button type="primary" icon="Search" class="management_1_1">查询信息</el-button>
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

      <el-table-column prop="inventoryId" label="InventoryID" v-if="false"  />

      <el-table-column prop="consumer" label="客户名称"  />

      <el-table-column prop="toolkitCode" label="工具包 "  />

      <el-table-column prop="longitude" label="经度"   />
      
      <el-table-column prop="latitude" label="纬度"   /> 
            
      <el-table-column prop="createdTime" label="盘点时间"  />
    </el-table>
      <div class="main_3">
        <el-row :gutter="20">
          <el-col :span="6"><div class="grid-content ep-bg-purple" /></el-col>
          <el-col :span="6"><div class="grid-content ep-bg-purple" /></el-col>
          <el-col :span="6"><div class="grid-content ep-bg-purple" /></el-col>
          <el-col :span="6"><div class="grid-content ep-bg-purple" /><el-pagination background layout="prev, pager, next" :total="20" /></el-col>
        </el-row>        
      </div>      
  </div>
</template>
<script setup>
import { ref, reactive ,onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
import { Toolkits_GetList,Inventories_GetToolkitLocationList,Inventories_Dlete } from '@/api/auth'
const router = useRouter()
const userList = ref([])
const selectedToolkitId = ref('') // 存储选中的 toolkitId
const bagList = ref([]) // 背包列表数据
const value = ref('')
onMounted(() => {
   GetList()
   GetBagList()
})

// 获取盘点列表
const GetList = async () => {
  try {
    const response = await Inventories_GetToolkitLocationList()
    userList.value = response || []
  } catch (error) {
    ElMessage.info(`获取列表失败: ${error}`)
  }
}
// 获取背包列表
const GetBagList = async () => {
  try {
    const response = await Toolkits_GetList()
    bagList.value = response || []
  } catch (error) {
    ElMessage.info(`获取列表失败: ${error}`)
  }
}
const defaultTime = ref<[Date, Date]>([
  new Date(2000, 1, 1, 0, 0, 0),
  new Date(2000, 2, 1, 23, 59, 59),
])
</script>

<style scoped>
.user-management {
  padding-left: 20px;
  padding-bottom: 20px;
}
.management_1{
    margin-bottom: 15px;
}
.management_1_1{
    margin-left: 15px;
}
.operation-bar {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
}
.main_3{
    margin-top: 5px;
    padding: 10px;
    height: 50px;
    background-color: white;
}
</style>