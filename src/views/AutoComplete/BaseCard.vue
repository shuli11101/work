<script setup>
defineProps({
  title: { type: String, default: '' },
})
</script>

<template>
  <el-card class="base-card" shadow="hover">
    <template v-if="title" #header>
      <span class="card-title">{{ title }}</span>
    </template>
    <slot />
  </el-card>
</template>

<style lang="scss" scoped>
.base-card {
  border-radius: 8px;

  .card-title {
    font-size: 15px;
    font-weight: 600;
    color: #303133;
  }

  :deep(.el-card__header) {
    border-bottom: 0;
    padding: 6px 16px;
  }

  :deep(.el-card__body) {
    padding: 8px;
  }
}
</style>
