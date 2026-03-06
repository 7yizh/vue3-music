<template>
  <div class="dashboard">
    <h2>仪表盘</h2>
    
    <div class="stats-cards">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card shadow="hover">
            <div class="stat-item">
              <div class="stat-icon" style="background: #1890ff;">
                <el-icon><User /></el-icon>
              </div>
              <div class="stat-content">
                <div class="stat-value">1,234</div>
                <div class="stat-label">用户总数</div>
              </div>
            </div>
          </el-card>
        </el-col>
        
        <el-col :span="6">
          <el-card shadow="hover">
            <div class="stat-item">
              <div class="stat-icon" style="background: #52c41a;">
                <el-icon><ShoppingCart /></el-icon>
              </div>
              <div class="stat-content">
                <div class="stat-value">567</div>
                <div class="stat-label"></div>
              </div>
            </div>
          </el-card>
        </el-col>
        
        <el-col :span="6">
          <el-card shadow="hover">
            <div class="stat-item">
              <div class="stat-icon" style="background: #faad14;">
                <el-icon><Money /></el-icon>
              </div>
              <div class="stat-content">
                <div class="stat-value"> 89,000</div>
                <div class="stat-label"></div>
              </div>
            </div>
          </el-card>
        </el-col>
        
        <el-col :span="6">
          <el-card shadow="hover">
            <div class="stat-item">
              <div class="stat-icon" style="background: #f5222d;">
                <el-icon><Warning /></el-icon>
              </div>
              <div class="stat-content">
                <div class="stat-value">12</div>
                <div class="stat-label">待处理</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    
    <el-row :gutter="20" class="mt-20">
      <el-col :span="16">
        <el-card>
          <template #header>
            <span>访问统计</span>
          </template>
          <div style="height: 300px;">
            <!-- 这里可以放图表 -->
            <div style="display: flex; justify-content: center; align-items: center; height: 100%;">
              <span>暂无数据</span>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="8">
        <el-card>
          <template #header>
            <span>最新动态</span>
          </template>
          <el-timeline>
            <el-timeline-item timestamp="今天 14:00" placement="top">
              <el-card>
                <p>系统进行了安全更新</p>
              </el-card>
            </el-timeline-item>
            <el-timeline-item timestamp="今天 10:00" placement="top">
              <el-card>
                <p>新增了用户管理功能</p>
              </el-card>
            </el-timeline-item>
            <el-timeline-item timestamp="昨天 16:00" placement="top">
              <el-card>
                <p>修复了已知的bug</p>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
// 可以在这里添加数据获取逻辑
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.stats-cards {
  margin-top: 20px;
}

.stat-item {
  display: flex;
  align-items: center;
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
}

.stat-icon .el-icon {
  font-size: 24px;
  color: white;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.stat-label {
  font-size: 14px;
  color: #999;
  margin-top: 5px;
}

.mt-20 {
  margin-top: 20px;
}
</style>