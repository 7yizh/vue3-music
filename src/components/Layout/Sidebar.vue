<template>
  <el-menu
    :default-active="activeIndex"
    class="sidebar-menu"
    @select="handleSelect"
  >
    <el-menu-item index="1">
      <el-icon><PieChart /></el-icon>
      <span>仪表盘</span>
    </el-menu-item>
    
    <el-sub-menu index="2">
      <template #title>
        <el-icon><User /></el-icon>
        <span>用户管理</span>
      </template>
      <el-menu-item index="2-1">用户列表</el-menu-item>
      <el-menu-item index="2-2">角色管理</el-menu-item>
    </el-sub-menu>
    
    <el-menu-item index="3">
      <el-icon><Setting /></el-icon>
      <span>系统设置</span>
    </el-menu-item>
  </el-menu>
</template>

<script setup>
import { ref } from 'vue'

const activeIndex = ref('1')

const handleSelect = (index, indexPath) => {
  console.log('选中菜单:', index, indexPath)
}
</script>

<style scoped>
.sidebar-menu {
  height: 100%;
  border-right: none;
}
</style>