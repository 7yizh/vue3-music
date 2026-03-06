<template>
  <div class="user-management">
    <div class="management_1">
        <el-page-header>
          <template #content>
            <div class="flex items-center"><span class="text-large font-600 mr-3"> 盘点信息 </span></div>   
          </template>
          <template #extra>
            <div class="flex items-center">
               <!-- 背包名称：<el-cascader v-model="cascaderProps" :options="bagList" clearable clear-icon="CloseBold" placeholder="请选择背包名"  /> -->
               背包名称：<el-select v-model="selectedToolkitId" clearable placeholder="请选择背包名" style="width: 200px; margin-right: 10px;">
                <el-option v-for="item in bagList" :key="item.toolkitId" :label="item.code" :value="item.toolkitId" /></el-select>
               日期： <el-date-picker v-model="value" type="daterange" start-placeholder="开始时间" end-placeholder="结束时间" value-format="YYYY-MM-DD HH:mm:ss" :default-time="defaultTime" /> 
               <el-button type="primary" icon="Search" class="management_1_1">查询盘点信息</el-button>
               <el-button type="primary" icon="Location" @click="handleGuiJi">查看轨迹信息</el-button>
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
      <el-table-column type="selection" width="55"  />

      <el-table-column prop="inventoryId" label="InventoryID"  v-if="false"  />

      <el-table-column prop="toolkitId" label="ToolkitID" v-if="false"  />

      <el-table-column prop="longitude" label="经度"  />

      <el-table-column prop="latitude" label="纬度"   />
      
      <el-table-column prop="toolkit.code" label="工具包"   /> 
            
      <el-table-column prop="createdTime" label="盘点时间"  />

      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="danger" size="small" @click="handleDelete(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
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
import { Toolkits_GetList,Inventories_GetList,Inventories_Dlete } from '@/api/auth'
const router = useRouter()
const userList = ref([])
const selectedToolkitId = ref('') // 存储选中的 toolkitId
const bagList = ref([]) // 背包列表数据
const value = ref('')
const longitudes = ref([])// 存储经度和纬度的数组
const latitudes = ref([])
const bagitudes = ref([])
onMounted(() => {
   GetList()
   GetBagList()
})
// 删除
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(`确定要删除盘点记录吗 "${row.toolkit.code}" 的盘点记录吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    // 调用删除接口
    await Inventories_Dlete(row.inventoryId)
    ElMessage.success('删除成功')

    // 刷新用户列表
    GetList()
  } catch (error) {
    // 用户取消
  }
}
// 查看轨迹信息
const handleGuiJi = () => {
  if (userList.value.length === 0) {
    ElMessage.warning('没有可显示的轨迹数据')
    return
  }
  
  // 一次性处理所有数据，确保每个点的数据完整
  const trajectoryData = userList.value
    .filter(item => {
      // 确保经纬度有效
      const lng = parseFloat(item.longitude);
      const lat = parseFloat(item.latitude);
      return !isNaN(lng) && !isNaN(lat) && item.longitude !== null && item.latitude !== null;
    })
    .map(item => ({
      lng: parseFloat(item.longitude),
      lat: parseFloat(item.latitude),
      bagName: item.toolkit?.code || '未知背包'
    }));
  
  if (trajectoryData.length === 0) {
    ElMessage.warning('没有有效的经纬度数据')
    return
  }
  
  // 分开存储三个数组
  longitudes.value = trajectoryData.map(item => item.lng);
  latitudes.value = trajectoryData.map(item => item.lat);
  bagitudes.value = trajectoryData.map(item => item.bagName);
  
  console.log('跳转之前的数据：', trajectoryData);

  // 传递数据到轨迹页面
  router.push({
    path: '/home/trajectory',
    query: {
      longitudes: JSON.stringify(longitudes.value),
      latitudes: JSON.stringify(latitudes.value),
      bagitudes: JSON.stringify(bagitudes.value),
    }
  })
}
// 获取盘点列表
const GetList = async () => {
  try {
    const response = await Inventories_GetList()
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
// 配置项数据结构
const cascaderProps = {
  value: 'toolkitId',    // 实际值字段
  label: 'code',         // 显示文本字段
}
const handleSelectionChange = (val) => {
  selection.value = val
}
// 获取bag的id
const assignValue = () => {
  // 赋值单个背包的 ID
  selectedToolkitId.value = 2 // 选中 "包1"
  
  // 或者根据某些条件赋值
  const targetBag = bagList.value.find(item => item.code === '包2')
  if (targetBag) {
    selectedToolkitId.value = targetBag.toolkitId
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