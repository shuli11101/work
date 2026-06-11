<!-- 左上卡片 -->
<script setup>
defineProps({
  title: { type: String, required: true },
})
</script>

<template>
  <el-card class="left-top-card" shadow="hover">
    <template #header>
      <span class="card-title">
        <span class="badge-wrapper">
          <slot name="badge" />
        </span>
        {{ title }}
      </span>
    </template>
    <slot />
  </el-card>
</template>

<style lang="scss" scoped>
.left-top-card {
  border-radius: 8px;
  height: 289px;

  .card-title {
    font-size: 16px;
    font-weight: 600;
    line-height: 24px;
    color: #075DFE;
  }

  .badge-wrapper {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: #075dfe;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-left: auto;
    line-height: 1;
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
