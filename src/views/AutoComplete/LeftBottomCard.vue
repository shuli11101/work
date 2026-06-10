<script setup>
defineProps({
  title: { type: String, required: true },
})
</script>

<template>
  <el-card class="left-bottom-card" shadow="hover">
    <template #header>
      <span class="card-title">{{ title }}</span>
    </template>
    <slot />
  </el-card>
</template>

<style lang="scss" scoped>
.left-bottom-card {
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .card-title {
    font-size: 15px;
    font-weight: 600;
    color: #303133;
  }

  :deep(.el-card__header) {
    border-bottom: 0;
    padding: 6px 16px;
    flex-shrink: 0;
  }

  :deep(.el-card__body) {
    padding: 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
  }

  :deep(.el-table) {
    flex: 1;
    min-height: 0;
  }

  :deep(.el-table__body-wrapper) {
    overflow-y: auto;
    flex: 1;
    min-height: 0;
  }
}

:deep(.el-table .el-table__cell) {
  padding: 2px 0;
}
</style>
