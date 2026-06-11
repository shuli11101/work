<template>
  <div class="steps">
    <template v-for="(step, index) in steps" :key="index">
      <div class="step" :class="{ active: active >= index + 1 }">
        <span class="step-num">{{ index + 1 }}</span>
        <div class="step-text">
          <span class="step-label">{{ step.label }}</span>
          <span class="step-status">{{ step.status }}</span>
        </div>
      </div>
      <div v-if="index < steps.length - 1" class="step-line"></div>
    </template>
  </div>
</template>

<script setup>
defineProps({
  active: {
    type: Number,
    default: 1,
  },
})

const steps = [
  { label: '基础信息', status: '请填写试卷基础信息' },
  { label: '选择对象', status: '选择考试对象并配置范围' },
  { label: '生成完成', status: '生成试卷并预览' },
]
</script>

<style lang="scss" scoped>
.steps {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 50px;
  margin-bottom: 32px;
}

.step {
  display: flex;
  align-items: center;
  gap: 4px;

  .step-num {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: #dcdfe6;
    color: #fff;
    font-size: 22px;
    font-weight: 600;
  }

  &.active .step-num {
    background: #075dfe;
  }

  .step-text {
    display: flex;
    flex-direction: column;
    gap: 0;

    .step-label {
      font-size: 13px;
      font-weight: 600;
      line-height: 20px;
      color: #666666;
    }

    .step-status {
      font-size: 12px;
      font-weight: 400;
      line-height: 18px;
      color: #999999;
    }
  }

  &.active .step-label {
    color: #0080ff;
    font-weight: 500;
  }
}

.step-line {
  width: 200px;
  height: 1px;
  background: #D9D9D9;
}
</style>
