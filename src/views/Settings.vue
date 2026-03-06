<template>
  <div class="settings">
    <h2>系统设置</h2>
    
    <el-tabs v-model="activeTab">
      <el-tab-pane label="基本设置" name="basic">
        <el-form :model="settingsForm" label-width="100px">
          <el-form-item label="系统名称">
            <el-input v-model="settingsForm.systemName" placeholder="请输入系统名称" />
          </el-form-item>
          
          <el-form-item label="系统Logo">
            <el-upload
              class="avatar-uploader"
              action="#"
              :show-file-list="false"
              :auto-upload="false"
              :on-change="handleLogoChange"
            >
              <img v-if="logoUrl" :src="logoUrl" class="avatar" />
              <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </el-upload>
          </el-form-item>
          
          <el-form-item label="系统描述">
            <el-input
              v-model="settingsForm.description"
              type="textarea"
              :rows="4"
              placeholder="请输入系统描述"
            />
          </el-form-item>
          
          <el-form-item>
            <el-button type="primary" @click="handleSaveSettings">保存设置</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      
      <el-tab-pane label="安全设置" name="security">
        <el-form label-width="100px">
          <el-form-item label="密码策略">
            <el-checkbox-group v-model="passwordPolicies">
              <el-checkbox label="必须包含数字" value="type" />
              <el-checkbox label="必须包含字母" value="type" />
              <el-checkbox label="必须包含特殊字符" value="type" />
              <el-checkbox label="密码长度至少8位" value="type" />
            </el-checkbox-group>
          </el-form-item>
          
          <el-form-item label="登录失败限制">
            <el-input-number v-model="maxLoginAttempts" :min="1" :max="10" />
            <span style="margin-left: 10px; color: #999;">次失败后锁定账号</span>
          </el-form-item>
          
          <el-form-item label="会话超时">
            <el-input-number v-model="sessionTimeout" :min="5" :max="120" />
            <span style="margin-left: 10px; color: #999;">分钟</span>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      
      <el-tab-pane label="通知设置" name="notification">
        <el-form label-width="100px">
          <el-form-item label="邮件通知">
            <el-switch v-model="emailNotification" />
          </el-form-item>
          
          <el-form-item label="短信通知">
            <el-switch v-model="smsNotification" />
          </el-form-item>
          
          <el-form-item label="站内信通知">
            <el-switch v-model="internalNotification" />
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const activeTab = ref('basic')

const settingsForm = reactive({
  systemName: '管理系统',
  description: '管理系统'
})

const logoUrl = ref('')

const passwordPolicies = ref(['必须包含数字', '必须包含字母', '密码长度至少8位'])
const maxLoginAttempts = ref(5)
const sessionTimeout = ref(30)

const emailNotification = ref(true)
const smsNotification = ref(false)
const internalNotification = ref(true)

const handleLogoChange = (file) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    logoUrl.value = e.target.result
  }
  reader.readAsDataURL(file.raw)
}

const handleSaveSettings = () => {
  ElMessage.success('设置已保存')
}

const handleReset = () => {
  Object.assign(settingsForm, {
    systemName: '管理系统',
    description: '这是一个管理系统'
  })
  logoUrl.value = ''
  ElMessage.info('设置已重置')
}
</script>

<style scoped>
.settings {
  padding: 20px;
}

.avatar-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
  width: 120px;
  height: 120px;
}

.avatar-uploader:hover {
  border-color: var(--el-color-primary);
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  text-align: center;
  line-height: 120px;
}

.avatar {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}
</style>