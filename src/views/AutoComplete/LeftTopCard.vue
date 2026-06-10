<script setup>
defineProps({
  title: { type: String, required: true },
})
</script>

<template>
  <el-card class="left-top-card" shadow="hover">
    <template #header>
      <span class="card-title">{{ title }}</span>
    </template>
    <slot />
  </el-card>
</template>

<style lang="scss" scoped>
.left-top-card {
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
    height: calc(100% - 40px);
    overflow: auto;
    padding: 8px;
  }
}

:deep(.el-table .el-table__cell) {
  padding: 2px 0;
}
</style>
