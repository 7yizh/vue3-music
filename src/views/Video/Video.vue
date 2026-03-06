<template>
  <div class="user-management">
    <div class="management_1">
        <el-page-header>
          <template #content>
            <div class="flex items-center"><span class="text-large font-600 mr-3"> 录像视频 </span></div>   
          </template>
          <template #extra>
            <div class="flex items-center">
               背包名称：<el-select v-model="selectedToolkitId" clearable placeholder="请选择背包名" style="width: 200px; margin-right: 10px;">
                <el-option v-for="item in bagList" :key="item.toolkitId" :label="item.code" :value="item.toolkitId" /></el-select>
               日期： <el-date-picker v-model="value" type="daterange" start-placeholder="开始时间" end-placeholder="结束时间" value-format="YYYY-MM-DD HH:mm:ss" /> 
               <el-button type="primary" icon="Search" class="management_1_1">查询视频信息</el-button>
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

      <el-table-column prop="videoId" label="VideoID" v-if="false" />

      <el-table-column prop="filename" label="文件名"  />

      <el-table-column prop="extension" label="格式"  />

      <el-table-column prop="size" label="文件大小(b)"  />

      <el-table-column prop="cameraCode" label="相机编码"   />
            
      <el-table-column prop="createdTime" label="录像时间"  />

      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="primary" size="small" @click="handle1(scope.row)">
            回放
          </el-button>
          <el-button type="warning" size="small" @click="handle2(scope.row)">
            直播
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
      <!-- 视频播放弹窗 -->
    <div v-if="showVideoModal" class="video-modal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ videoTitle }}</h3>
          <button @click="closeVideoModal">×</button>
        </div>
        
        <div class="modal-body">
          <video 
            v-if="videoUrl"
            :src="videoUrl"
            controls
            autoplay
            class="modal-video"
          ></video>
          <div v-else class="loading">加载中...</div>
        </div>
        
        <!-- 添加全屏按钮 -->
        <div class="modal-footer">
          <el-button type="primary" @click="toggleFullscreen">全屏</el-button>
          <el-button @click="closeVideoModal">关闭</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive ,onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
import { Toolkits_GetList,Videos_GetPageList,Videos_GetHttpUrlByCode } from '@/api/auth'

const router = useRouter()
const userList = ref([])
const selectedToolkitId = ref('') // 存储选中的 toolkitId
const bagList = ref([]) // 背包列表数据
const value = ref('')
const showVideoModal = ref(false)
const videoUrl = ref('')
const videoTitle = ref('')

onMounted(() => {
   GetList()
   GetBagList()
})

// 获取视频列表
const GetList = async () => {
  try {
    // 传递页码和每页条数
    const response = await Videos_GetPageList(1, 20) // 第一页，每页20条
    userList.value = response.data || []
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

// 点击回放
const handle1 = async (row) => {
    try {
    const response = await Videos_GetHttpUrlByCode('包3',row.filename)
    videoUrl.value = response+'.mp4' // http://59.110.112.236:8082/recordings/8a2f9d0d-20260112-100827.mp4
    videoTitle.value = row.filename || '视频播放'
    showVideoModal.value = true

    ElMessage.success(response)

  } catch (error) {
    ElMessage.error('获取视频失败:', error)
  }
}

// 点击直播
const handle2 = async (row) => {
  try {
    await ElMessageBox.confirm(`确定要删除盘点记录吗 "${row.toolkit.code}" 的盘点记录吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    // 调用删除接口
    const response = await Inventories_Dlete(row.inventoryId)
    ElMessage.success(response)
  } catch (error) {
    // 用户取消
  }
}

// 关闭弹窗
const closeVideoModal = () => {
  showVideoModal.value = false
  videoUrl.value = ''
}

// 切换全屏
const toggleFullscreen = () => {
  const videoElement = document.querySelector('.modal-video')
  if (videoElement) {
    if (!document.fullscreenElement) {
      videoElement.requestFullscreen().catch(err => {
        console.error(`全屏请求失败: ${err.message}`)
      })
    } else {
      document.exitFullscreen()
    }
  }
}

// 监听全屏变化
document.addEventListener('fullscreenchange', () => {
  console.log('全屏状态变化')
})
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

/* 视频弹窗样式 - 主要修改这里 */
.video-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 1200px;
  height: 85vh; /* 增大高度为视口的85% */
  min-height: 600px; /* 最小高度600px */
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;
  border-bottom: 1px solid #eee;
  background: #f9f9f9;
  flex-shrink: 0; /* 防止header被压缩 */
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
  font-weight: 600;
}
.modal-header button {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.3s;
}

.modal-header button:hover {
  background: #f0f0f0;
}

.modal-body {
  padding: 0;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #000;
  min-height: 0; /* 允许内容区域滚动 */
}

.modal-video {
  width: 100%;
  height: 100%;
  object-fit: contain; /* 保持视频比例 */
}

.loading {
  color: white;
  font-size: 18px;
}

/* 添加模态框底部 */
.modal-footer {
  padding: 15px 30px;
  border-top: 1px solid #eee;
  background: #f9f9f9;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  flex-shrink: 0; /* 防止footer被压缩 */
}

/* 响应式调整 */
@media (max-width: 768px) {
  .modal-content {
    width: 95%;
    height: 80vh;
    min-height: 500px;
  }
  
  .modal-header {
    padding: 15px 20px;
  }
  
  .modal-footer {
    padding: 10px 20px;
  }
}

@media (max-height: 700px) {
  .modal-content {
    height: 90vh;
  }
}
</style>