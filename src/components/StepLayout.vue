<!-- 卡片大包装组件 -->
<script setup>
import LeftTopCard from './LeftTopCard.vue'
import LeftBottomCard from './LeftBottomCard.vue'
import RightCard from './RightCard.vue'

defineProps({
  activeStep: { type: Number, default: 0 },
  title: { type: String, default: '' },
  secondTitle: { type: String, default: '' },
  leftTopTitle: { type: String, default: '' },
  leftBottomTitle: { type: String, default: '' },
  rightTitle: { type: String, default: '' },
  nextLoading: { type: Boolean, default: false },
})

const emit = defineEmits(['prev', 'next'])
</script>

<template>
  <div class="step-layout">
    <h2 class="page-title">{{ title }}</h2>
    <span class="second-title">{{ secondTitle }}</span>
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
          <template #badge>
            <slot name="leftTopBadge" />
          </template>
          <slot name="leftTopBody" />
        </LeftTopCard>
        <LeftBottomCard v-if="$slots.leftBottomBody" :title="leftBottomTitle" style="margin-top: 8px; flex: 1;">
          <template #badge>
            <slot name="leftBottomBadge" />
          </template>
          <slot name="leftBottomBody" />
        </LeftBottomCard>
      </el-col>
      <el-col :span="8" class="right-col">
        <RightCard v-if="$slots.rightBody" :title="rightTitle" style="flex: 1;">
          <template #badge>
            <slot name="rightBadge" />
          </template>
          <slot name="rightBody" />
        </RightCard>
      </el-col>
    </el-row>

    <div class="footer-btns">
      <el-button class="btn-prev" plain @click="emit('prev')">上一步</el-button>
      <el-button class="btn-next" :loading="nextLoading" @click="emit('next')">下一步</el-button>
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
  font-size: 24px;
  font-weight: 600;
  line-height: 32px;
  color: #1F2329;
}

.second-title {
  font-size: 16px;
  font-weight: 600;
  line-height: 22px;
  color: #5A6382;
  margin-bottom: 24px;
}

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
