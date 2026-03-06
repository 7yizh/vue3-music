<template>
  <div class="home-container">
    <!-- 侧边栏 -->
    <aside class="sidebar">
      <div class="logo">
        <h2>RFID智能工具管理平台</h2>
      </div>
      
      <el-menu
        :default-active="activeMenu"
        class="el-menu-vertical"
        @select="handleMenuSelect"
      >
        <el-menu-item index="/home/dashboard">
          <el-icon><PieChart /></el-icon>
          <span>仪表盘</span>
        </el-menu-item>

        <el-menu-item index="/home/inventotry">
          <el-icon><Odometer /></el-icon>
          <span>盘点信息</span>
        </el-menu-item>
        
        <el-menu-item index="/home/users">
          <el-icon><User /></el-icon>
          <span>用户管理</span>
        </el-menu-item>

        <el-menu-item index="/home/brand">
          <el-icon><PriceTag /></el-icon>
          <span>品牌管理</span>
        </el-menu-item>

        <el-menu-item index="/home/toolkits">
          <el-icon><SuitcaseLine /></el-icon>
          <span>工具包管理</span>
        </el-menu-item>
        
        <el-menu-item index="/home/bindTools">
          <el-icon><Paperclip /></el-icon>
          <span>工具绑定</span>
        </el-menu-item>

        <el-menu-item index="/home/tools">
          <el-icon><Coordinate /></el-icon>
          <span>工具管理</span>
        </el-menu-item>

        <el-menu-item index="/home/categories">
          <el-icon><Paperclip /></el-icon>
          <span>类别管理</span>
        </el-menu-item>

        <el-menu-item index="/home/modules">
          <el-icon><Notification /></el-icon>
          <span>模块管理</span>
        </el-menu-item>

         <el-menu-item index="/home/video">
          <el-icon><VideoPlay /></el-icon>
          <span>录像视频</span>
        </el-menu-item>

        <el-menu-item index="/home/locationStatistics">
          <el-icon><DataAnalysis  /></el-icon>
          <span>坐标统计</span>
        </el-menu-item>

        <el-menu-item index="/home/utilzationStatistics">
          <el-icon><DataAnalysis  /></el-icon>
          <span>利用率统计</span>
        </el-menu-item>

        <el-menu-item index="/home/settings">
          <el-icon><Setting /></el-icon>
          <span>系统设置</span>
        </el-menu-item>
      </el-menu>
    </aside>
    
    <!-- 主内容区 -->
    <div class="main-content">
      <!-- 顶部导航栏 -->
      <header class="header">
        <div class="header-left">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item v-for="item in breadcrumb" :key="item.path">
              {{ item.meta?.title || item.name }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        
        <div class="header-right">
          <el-dropdown @command="handleCommand">
            <span class="user-info">
              <el-avatar :size="32" :src="userAvatar" />
              <span class="username">{{ userName }}</span>
              <el-icon><ArrowDown /></el-icon>
            </span>
            
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">个人中心</el-dropdown-item>
                <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </header>
      
      <!-- 内容区 -->
      <div class="content">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessageBox } from 'element-plus'

const router = useRouter()
const route = useRoute()

const activeMenu = ref('')
const userAvatar = ref('https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png')

// 计算面包屑
const breadcrumb = computed(() => {
  const matched = route.matched
  return matched.filter(item => item.meta && item.meta.title)
})

// 计算用户名
const userName = computed(() => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  return user
})

onMounted(() => {
  updateActiveMenu()
})

const updateActiveMenu = () => {
  activeMenu.value = route.path
}

const handleMenuSelect = (index) => {
  router.push(index)
}

const handleCommand = async (command) => {
  if (command === 'logout') {
    try {
      await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      
      // 调用退出接口
      //await logout()
      
      // 清除本地存储
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('accessTokenExpiry')
      
      // 跳转到登录页
      router.push('/login')
    } catch (error) {
      // 用户取消退出
    }
  } else if (command === 'profile') {
    // 跳转到个人中心
    console.log('跳转到个人中心')
  }
}

// 监听路由变化更新激活菜单
router.afterEach(() => {
  updateActiveMenu()
})
</script>

<style scoped>
.home-container {
  display: flex;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #f5f8ff 0%, #eef2ff 100%);
}

.sidebar {
  width: 260px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  color: #333;
  position: relative;
  z-index: 100;
  box-shadow: 4px 0 20px rgba(0, 100, 200, 0.08);
  border-right: 1px solid #e4e9f2;
}

.sidebar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #0066ff, #00c6ff, #0066ff);
  z-index: 101;
}

.logo {
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #e4e9f2;
  background: white;
  position: relative;
  overflow: hidden;
}

.logo::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 10%;
  width: 80%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #0066ff, transparent);
}

.logo h2 {
  color: #1890ff;
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  background: linear-gradient(135deg, #0066ff, #00c6ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 0.5px;
}

.el-menu-vertical {
  border-right: none;
  background: transparent;
  padding: 20px 0;
}

.el-menu-vertical :deep(.el-menu-item) {
  color: #5a6675;
  height: 48px;
  line-height: 48px;
  margin: 4px 15px;
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  font-size: 14px;
  font-weight: 500;
}

.el-menu-vertical :deep(.el-menu-item)::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 3px;
  height: 0;
  background: linear-gradient(to bottom, #0066ff, #00c6ff);
  transition: height 0.3s;
}

.el-menu-vertical :deep(.el-menu-item:hover) {
  background: linear-gradient(90deg, rgba(24, 144, 255, 0.08) 0%, rgba(24, 144, 255, 0.05) 100%);
  color: #1890ff;
  transform: translateX(3px);
}

.el-menu-vertical :deep(.el-menu-item:hover)::before {
  height: 100%;
}

.el-menu-vertical :deep(.el-menu-item.is-active) {
  background: linear-gradient(135deg, rgba(24, 144, 255, 0.1) 0%, rgba(24, 144, 255, 0.05) 100%);
  color: #1890ff;
  border-left: 3px solid #1890ff;
}

.el-menu-vertical :deep(.el-menu-item.is-active) .el-icon {
  color: #1890ff;
  animation: icon-float 2s ease-in-out infinite;
}

.el-menu-vertical :deep(.el-icon) {
  color: #6b7b93;
  font-size: 18px;
  margin-right: 12px;
  transition: all 0.3s;
}

.el-menu-vertical :deep(.el-menu-item:hover) .el-icon {
  color: #1890ff;
  transform: scale(1.1);
}

@keyframes icon-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #f5f7fa;
}

.header {
  height: 70px;
  padding: 0 25px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: white;
  border-bottom: 1px solid #e4e9f2;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.header-left {
  flex: 1;
}

:deep(.el-breadcrumb__item) {
  font-size: 14px;
}

:deep(.el-breadcrumb__inner) {
  color: #6b7b93;
  transition: all 0.3s;
}

:deep(.el-breadcrumb__separator) {
  color: #c0c8d2;
}

:deep(.el-breadcrumb__item:last-child .el-breadcrumb__inner) {
  color: #1890ff;
  font-weight: 600;
}

:deep(.el-breadcrumb__inner:hover) {
  color: #1890ff;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 8px;
  transition: all 0.3s;
  background: white;
  border: 1px solid #e4e9f2;
}

.user-info:hover {
  background: linear-gradient(135deg, rgba(24, 144, 255, 0.05) 0%, rgba(24, 144, 255, 0.02) 100%);
  border-color: #1890ff;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.1);
}

:deep(.el-avatar) {
  border: 2px solid #f0f5ff;
  transition: all 0.3s;
}

.user-info:hover :deep(.el-avatar) {
  border-color: #1890ff;
  box-shadow: 0 0 0 3px rgba(24, 144, 255, 0.1);
}

.username {
  margin: 0 12px;
  color: #333;
  font-weight: 500;
  font-size: 14px;
}

.user-info .el-icon {
  color: #8c9bb0;
  font-size: 14px;
  transition: transform 0.3s;
}

.user-info:hover .el-icon {
  color: #1890ff;
}

:deep(.el-dropdown-menu) {
  background: white;
  border: 1px solid #e4e9f2;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
}

:deep(.el-dropdown-menu__item) {
  color: #5a6675;
  padding: 10px 20px;
  font-size: 14px;
  transition: all 0.3s;
}

:deep(.el-dropdown-menu__item:hover) {
  background: linear-gradient(90deg, rgba(24, 144, 255, 0.08) 0%, rgba(24, 144, 255, 0.04) 100%);
  color: #1890ff;
}

:deep(.el-dropdown-menu__item--divided) {
  border-top: 1px solid #e4e9f2;
}

.content {
  flex: 1;
  padding: 25px;
  overflow: auto;
  background: white;
  border-radius: 8px;
  margin: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

/* 自定义滚动条 */
.content::-webkit-scrollbar {
  width: 6px;
}

.content::-webkit-scrollbar-track {
  background: #f5f7fa;
  border-radius: 3px;
}

.content::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #c0c8d2, #8c9bb0);
  border-radius: 3px;
}

.content::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #8c9bb0, #6b7b93);
}

/* 过渡动画增强 */
.fade-enter-active {
  animation: fadeIn 0.4s ease;
}

.fade-leave-active {
  animation: fadeOut 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-8px);
  }
}

/* 科技感细节 */
.el-menu-vertical :deep(.el-menu-item) {
  position: relative;
}

.el-menu-vertical :deep(.el-menu-item::after) {
  content: '';
  position: absolute;
  right: -20px;
  top: 50%;
  transform: translateY(-50%);
  width: 6px;
  height: 6px;
  background: #1890ff;
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.3s, right 0.3s;
}

.el-menu-vertical :deep(.el-menu-item:hover::after) {
  opacity: 1;
  right: 15px;
}

.el-menu-vertical :deep(.el-menu-item.is-active::after) {
  opacity: 1;
  right: 15px;
  animation: dot-pulse 1.5s infinite;
}

@keyframes dot-pulse {
  0%, 100% { transform: translateY(-50%) scale(1); }
  50% { transform: translateY(-50%) scale(1.2); }
}

/* 响应式调整 */
@media (max-width: 768px) {
  .sidebar {
    width: 60px;
  }
  
  .logo h2 {
    font-size: 0;
  }
  
  .logo h2::after {
    content: "RFID";
    font-size: 14px;
  }
  
  .el-menu-vertical :deep(span) {
    display: none;
  }
  
  .el-menu-vertical :deep(.el-icon) {
    margin-right: 0;
    font-size: 20px;
  }
  
  .content {
    margin: 10px;
    padding: 15px;
  }
}

/* 添加一些科技感线条装饰 */
.header::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, transparent, #e4e9f2, transparent);
}

/* 侧边栏图标科技感 */
.el-menu-vertical :deep(.el-menu-item.is-active) .el-icon {
  position: relative;
}

.el-menu-vertical :deep(.el-menu-item.is-active) .el-icon::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 30px;
  height: 30px;
  background: radial-gradient(circle, rgba(24, 144, 255, 0.1) 0%, transparent 70%);
  border-radius: 50%;
  z-index: -1;
}
</style>