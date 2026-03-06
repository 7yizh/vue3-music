<template>
  <div class="bike-info-container">
    <!-- 顶部背景装饰 -->
    <div class="header-wave">
      <div class="wave-content">
        <h2 class="title">🚲 自行车防伪查询</h2>
        <p class="sub-title">NFC识别成功 · 正品验证</p>
      </div>
    </div>

    <!-- 核心卡片：自行车信息 -->
    <div class="info-card">
      <!-- 品牌与型号 -->
      <div class="model-section">
        <span class="brand-tag">TREK</span>
        <h1 class="model-name">MADONE SLR 9</h1>
        <p class="model-category">空气动力学公路车 · 顶级竞赛级</p>
      </div>

      <!-- 防伪状态徽章 -->
      <div class="status-badge">
        <el-tag type="success" effect="dark" size="large" class="verify-tag">
          <el-icon><Check /></el-icon> 正品已验证
        </el-tag>
        <span class="verify-date">查询时间: 2024-01-15 14:30</span>
      </div>

      <!-- 详细参数列表（卡片式） -->
      <el-descriptions
        class="info-detail"
        :column="1"
        border
        direction="vertical"
      >
        <el-descriptions-item label="车架号 (NFC UID)">
          <span class="mono-text">TK23M8SLR9A6B21C</span>
          <el-icon class="copy-icon" @click="copyText('TK23M8SLR9A6B21C')"><DocumentCopy /></el-icon>
        </el-descriptions-item>
        <el-descriptions-item label="生产批次">2023-08 (第32周)</el-descriptions-item>
        <el-descriptions-item label="官方零售价">¥78,800</el-descriptions-item>
        <el-descriptions-item label="主要配置">
          <div>车架: OCLV 800 碳纤维</div>
          <div>套件: Shimano Dura-Ace Di2 R9200</div>
          <div>轮组: Bontrager Aeolus RSL 62</div>
        </el-descriptions-item>
        <el-descriptions-item label="防伪查询次数">首次查询 (该设备)</el-descriptions-item>
      </el-descriptions>

      <!-- 保修与说明 -->
      <div class="warranty-box">
        <el-icon><Warning /></el-icon>
        <span>官方质保: 车架终身保修 | 配件2年</span>
      </div>
    </div>

    <!-- 底部操作栏 (模拟NFC重新识别或返回) -->
    <div class="action-bar">
      <el-button type="primary" size="large" plain @click="simulateNfcScan" :loading="scanning">
        <el-icon><Pointer /></el-icon> 再次读取NFC
      </el-button>
      <el-button size="large" @click="goBack">
        <el-icon><Back /></el-icon> 返回
      </el-button>
    </div>

    <!-- 防伪提示小字 -->
    <p class="foot-note">* 本信息由NFC芯片读取，防伪码唯一且不可复制</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Check, DocumentCopy, Warning, Pointer, Back } from '@element-plus/icons-vue'
// 如果项目未全局注册图标，需单独引入，这里假设已配置

// 模拟扫码加载状态
const scanning = ref(false)

// 模拟NFC重新识别 (实际项目中会触发新的NFC读取或路由参数变化)
const simulateNfcScan = () => {
  scanning.value = true
  // 模拟网络请求或NFC轮询
  setTimeout(() => {
    scanning.value = false
    ElMessage.success('NFC识别成功，信息已更新')
    // 这里可以修改为从新NFC读取的数据，目前是静态展示，故仅做提示
  }, 1500)
}

// 复制车架号到剪贴板
const copyText = (text) => {
  navigator.clipboard?.writeText(text).then(() => {
    ElMessage.success('车架号已复制')
  }).catch(() => {
    // 降级处理
    const textarea = document.createElement('textarea')
    textarea.value = text
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    ElMessage.success('车架号已复制')
  })
}

// 返回上一页 (根据实际路由调整)
const goBack = () => {
  // 如果是从NFC调起，可能返回首页，此处简单模拟
  history.back()
}
</script>

<style scoped>
/* 全局样式重置与字体 */
.bike-info-container {
  min-height: 100vh;
  background: linear-gradient(145deg, #f5f7fa 0%, #e9ecf0 100%);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  padding: 0 16px 24px 16px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

/* 顶部波浪装饰 */
.header-wave {
  background: linear-gradient(135deg, #1e2b3c 0%, #2c3e50 100%);
  margin: 0 -16px 20px -16px; /* 抵消容器padding */
  padding: 28px 20px 40px 20px;
  border-bottom-left-radius: 32px;
  border-bottom-right-radius: 32px;
  position: relative;
  color: white;
  box-shadow: 0 8px 20px rgba(0,0,0,0.1);
}

.wave-content {
  position: relative;
  z-index: 2;
}

.title {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 6px 0;
  letter-spacing: 1px;
}

.sub-title {
  font-size: 14px;
  opacity: 0.8;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 信息卡片 */
.info-card {
  background: #ffffff;
  border-radius: 28px;
  padding: 24px 20px;
  box-shadow: 0 10px 30px rgba(0, 20, 40, 0.08);
  margin-bottom: 20px;
  border: 1px solid rgba(255,255,255,0.5);
  backdrop-filter: blur(2px);
}

/* 型号区域 */
.model-section {
  margin-bottom: 24px;
  border-bottom: 1px dashed #eaeef2;
  padding-bottom: 16px;
}

.brand-tag {
  background: #1e2b3c;
  color: white;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 30px;
  display: inline-block;
  margin-bottom: 10px;
  letter-spacing: 0.5px;
}

.model-name {
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 6px 0;
  color: #1a2634;
  line-height: 1.2;
}

.model-category {
  color: #5e6f8d;
  font-size: 14px;
  margin: 0;
}

/* 状态徽章 */
.status-badge {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f0f9f0;
  padding: 12px 16px;
  border-radius: 48px;
  margin-bottom: 24px;
  border: 1px solid #c8e6c9;
}

.verify-tag {
  font-size: 15px;
  font-weight: 600;
  padding: 8px 18px;
  border-radius: 40px;
  background: #2e7d32 !important;
  border: none;
}

:deep(.verify-tag .el-icon) {
  margin-right: 6px;
}

.verify-date {
  color: #2e7d32;
  font-size: 13px;
  font-weight: 500;
  background: white;
  padding: 5px 12px;
  border-radius: 30px;
}

/* 详细描述列表样式覆盖 */
.info-detail {
  margin-bottom: 20px;
}

:deep(.el-descriptions) {
  --el-descriptions-table-border: #e4e9f0;
  --el-descriptions-item-bordered-label-background: #f8fafd;
}

:deep(.el-descriptions__cell) {
  padding: 14px 16px !important;
}

:deep(.el-descriptions__label) {
  font-weight: 600;
  color: #3a4b62;
  background: #f8fafd;
  width: 100px;
  font-size: 13px;
}

:deep(.el-descriptions__content) {
  color: #1e2b3c;
  font-size: 15px;
  word-break: break-word;
}

.mono-text {
  font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
  background: #f1f3f8;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 14px;
  margin-right: 8px;
}

.copy-icon {
  cursor: pointer;
  color: #5e6f8d;
  font-size: 16px;
  vertical-align: middle;
  transition: color 0.2s;
}

.copy-icon:hover {
  color: #1890ff;
}

/* 保修说明 */
.warranty-box {
  background: #f0f5fe;
  border-radius: 20px;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #1e3c72;
  font-size: 14px;
  border: 1px solid #d4e2fc;
  margin-top: 8px;
}

.warranty-box .el-icon {
  font-size: 20px;
  color: #2a6df4;
}

/* 底部操作栏 */
.action-bar {
  display: flex;
  gap: 12px;
  margin: 8px 0 16px 0;
}

.action-bar .el-button {
  flex: 1;
  height: 52px;
  border-radius: 60px;
  font-weight: 500;
  font-size: 15px;
  box-shadow: 0 6px 12px rgba(0,0,0,0.04);
}

.action-bar .el-button--primary {
  background: #1e2b3c;
  border: none;
}

.action-bar .el-button--primary:hover {
  background: #2c3e50;
}

.action-bar .el-button--primary.is-plain {
  background: white;
  color: #1e2b3c;
  border: 1.5px solid #cdd9e9;
}

.action-bar .el-button--primary.is-plain:hover {
  background: #f2f6fc;
}

/* 脚注 */
.foot-note {
  text-align: center;
  color: #8a9bb5;
  font-size: 12px;
  margin-top: 8px;
}

/* 针对手机小屏的优化 */
@media (max-width: 380px) {
  .model-name {
    font-size: 24px;
  }
  .status-badge {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  .verify-date {
    align-self: flex-end;
  }
  .action-bar {
    flex-direction: column;
  }
}
</style>