<script setup>
import LeftTopCard from './LeftTopCard.vue'
import LeftBottomCard from './LeftBottomCard.vue'
import RightCard from './RightCard.vue'

defineProps({
  activeStep: { type: Number, default: 0 },
  title: { type: String, default: '试卷自动组卷' },
  leftTopTitle: { type: String, default: '' },
  leftBottomTitle: { type: String, default: '' },
  rightTitle: { type: String, default: '' },
})

const emit = defineEmits(['prev', 'next'])
</script>

<template>
  <div class="step-layout">
    <h2 class="page-title">{{ title }}</h2>

    <div class="steps">
      <div class="step" :class="{ active: activeStep >= 0 }">
        <span class="step-num">1</span>
        <div class="step-text">
          <span class="step-label">基础信息</span>
          <span class="step-status">请填写试卷基础信息</span>
        </div>
      </div>
      <div class="step-line"></div>
      <div class="step" :class="{ active: activeStep >= 1 }">
        <span class="step-num">2</span>
        <div class="step-text">
          <span class="step-label">选择对象</span>
          <span class="step-status">选择考试对象并配置范围</span>
        </div>
      </div>
      <div class="step-line"></div>
      <div class="step" :class="{ active: activeStep >= 2 }">
        <span class="step-num">3</span>
        <div class="step-text">
          <span class="step-label">生成完成</span>
          <span class="step-status">生成试卷并预览</span>
        </div>
      </div>
    </div>

    <el-row :gutter="12" class="cards-row">
      <el-col :span="16" class="left-col">
        <LeftTopCard v-if="$slots.leftTopBody" :title="leftTopTitle">
          <slot name="leftTopBody" />
        </LeftTopCard>
        <LeftBottomCard v-if="$slots.leftBottomBody" :title="leftBottomTitle" style="margin-top: 8px; flex: 1;">
          <slot name="leftBottomBody" />
        </LeftBottomCard>
      </el-col>
      <el-col :span="8" class="right-col">
        <RightCard v-if="$slots.rightBody" :title="rightTitle" style="flex: 1;">
          <slot name="rightBody" />
        </RightCard>
      </el-col>
    </el-row>

    <div class="footer-btns">
      <el-button class="btn-prev" plain @click="emit('prev')">上一步</el-button>
      <el-button class="btn-next" @click="emit('next')">下一步</el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.step-layout {
  padding: 8px;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  overflow: hidden;
}

.page-title {
  margin: 0 0 4px 0;
  font-size: 15px;
  font-weight: 600;
  color: #303133;
}

.steps {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 4px;
}

.step {
  display: flex;
  align-items: center;
  gap: 4px;

  .step-num {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: #dcdfe6;
    color: #fff;
    font-size: 12px;
    font-weight: bold;
  }

  &.active .step-num {
    background: #075dfe;
  }

  .step-text {
    display: flex;
    flex-direction: column;
    gap: 0;

    .step-label {
      font-size: 12px;
      color: #909399;
    }

    .step-status {
      font-size: 9px;
      color: #909399;
    }
  }

  &.active .step-label {
    color: #0080ff;
    font-weight: 500;
  }
}

.step-line {
  width: 30px;
  height: 1px;
  background: #004cff;
}

.cards-row {
  flex: 1;
  min-height: 0;
}

.cards-row :deep(.el-col) {
  height: 100%;
}

.left-col {
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
}

.right-col {
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.footer-btns {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 12px;

  .btn-prev {
    border: 3px solid #3279fe;
    color: #6198fe;
    width: 200px;
    border-radius: 8px;
  }

  .btn-next {
    background-color: #075dfe;
    color: white;
    width: 200px;
    border-radius: 8px;
  }
}
</style>
