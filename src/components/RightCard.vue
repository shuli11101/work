<!-- 右侧卡片 -->
<script setup>
defineProps({
  title: { type: String, required: true },
})
</script>

<template>
  <el-card class="right-card" shadow="hover">
    <template #header>
      <span class="card-title">
        <span class="badge-wrapper">
          <slot name="badge" />
        </span>
        <span class="line"></span>
        <span class="title-text">{{ title }}</span>
      </span>
    </template>
    <slot />
  </el-card>
</template>

<style lang="scss" scoped>
.right-card {
  border-radius: 8px;

  .card-title {
    font-size: 16px;
    font-weight: 600;
    line-height: 24px;
    color: #1F2329;
    display: inline-flex;
    align-items: center;
  }

  .badge-wrapper {
    margin-left: auto;
    background: #075dfe;
    border-radius: 4px;
    line-height: 1;
    display: inline-flex;
  }

  .line {
    height: 24px;
    width: 3px;
    background-color: #075DFE;
    display: inline-block;
    margin-top: 12px;
    margin-bottom: 12px;

  }

  .title-text {
    display: inline-flex;
    margin-top: 12px;
    margin-bottom: 12px;
    margin-left: 8px;
    font-size: 18px;
    color: #075DFE;
  }

  :deep(.el-card__header) {
    border-bottom: 0;
    padding: 6px 16px;
  }

  :deep(.el-card__body) {
    height: calc(100% - 40px);
    overflow-y: auto;
    padding: 8px;
  }
}
</style>
