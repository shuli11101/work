<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { HomeFilled, Aim, Fold, Expand } from '@element-plus/icons-vue'

const router = useRouter()
const isCollapse = ref(false)

const menuItems = [
  { path: '/home', label: '首页', icon: HomeFilled },
  { path: '/auto-complete', label: 'AI自动组卷', icon: Aim },
]

const currentLabel = computed(() => {
  const item = menuItems.find((item) => item.path === router.currentRoute.value.path)
  return item ? item.label : ''
})

function handleSelect(index) {
  router.push(index)
}

function toggleCollapse() {
  isCollapse.value = !isCollapse.value
}
</script>

<template>
  <el-container class="app-content">
    <el-aside :width="isCollapse ? '0px' : '200px'"
      style="background-color: #304156; transition: width 0.3s; overflow: hidden">
      <el-menu :default-active="router.currentRoute.value.path" :collapse="isCollapse" background-color="#304156"
        text-color="#bfcbd9" active-text-color="#409eff" @select="handleSelect">
        <el-menu-item v-for="item in menuItems" :key="item.path" :index="item.path">
          <el-icon>
            <component :is="item.icon" />
          </el-icon>
          <template #title>{{ item.label }}</template>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container style="flex-direction: column">
      <el-header style="
          height: 50px;
          background-color: #fff;
          display: flex;
          align-items: center;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
          z-index: 10;
        ">
        <el-icon :size="15" style="cursor: pointer; margin-right: 16px" @click="toggleCollapse">
          <Fold v-if="!isCollapse" />
          <Expand v-else />
        </el-icon>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">{{ currentLabel }}</el-breadcrumb-item>
          <el-breadcrumb-item v-if="currentLabel">AI</el-breadcrumb-item>
        </el-breadcrumb>
      </el-header>
      <el-main style="background-color: #fff; display: flex; justify-content: center;">
        <div class="page-container">
          <router-view />
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
.app-content {
  width: 1920px;
  height: 1080px;
  margin: 0 auto;
}

.el-aside {
  overflow-y: auto;
}

.el-menu {
  border-right: none;
}

.el-header {
  padding: 0 20px;
}

.page-container {
  width: 100%;
  height: 100%;
}
</style>
