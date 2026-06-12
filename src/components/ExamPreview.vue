<script setup>
import { ArrowLeft, ArrowRight } from '@icon-park/vue-next'
import { ref, computed } from 'vue'

const props = defineProps({
  page: {
    type: Array,
    required: true,
  },
  currentSide: {
    type: Number,
    default: 0,
  },
  isLayer: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:currentSide', 'fullscreen'])

const examType = ref(0)

const currentPages = computed(() => props.page[examType.value] || [])

const thumbList = computed(() => {
  const list = []
  const pages = currentPages.value
  for (let g = 0; g < Math.ceil(pages.length / 2); g++) {
    const group = []
    for (let i = 0; i < 2; i++) {
      const idx = g * 2 + i
      if (idx < pages.length) {
        group.push({ index: idx, label: idx + 1, src: pages[idx] })
      }
    }
    list.push(group)
  }
  return list
})

const handlePrev = () => {
  if (props.currentSide > 0) {
    emit('update:currentSide', props.currentSide - 1)
  }
}

const handleNext = () => {
  if (props.currentSide < currentPages.value.length - 1) {
    emit('update:currentSide', props.currentSide + 1)
  }
}

const handleJump = (index) => {
  emit('update:currentSide', index)
}

const changeExamType = (type) => {
  examType.value = type
  emit('update:currentSide', 0)
}
</script>

<template>
  <div class="preview-section">
    <div class="preview-header">
      <span class="preview-bar"></span>
      <span class="preview-title">试卷预览</span>
      <div class="head-btn" v-if="isLayer">
        <el-button class="btn" :class="{ active: examType === 0 }" size="small" @click="changeExamType(0)">A卷
          基础</el-button>
        <el-button class="btn" :class="{ active: examType === 1 }" size="small" @click="changeExamType(1)">B卷
          提升</el-button>
        <el-button class="btn" :class="{ active: examType === 2 }" size="small" @click="changeExamType(2)">C卷
          拓展</el-button>
      </div>
    </div>
    <div class="preview-body">
      <!-- 左侧缩略图 + 上下翻页 -->
      <el-card class="thumb-card">
        <div class="thumbnails-col">
          <button class="nav-btn nav-up" :disabled="currentSide === 0" @click="handlePrev">
            <span class="nav-arrow">▲</span>
          </button>
          <div class="thumbnails">
            <div v-for="(group, gIdx) in thumbList" :key="gIdx" class="thumb-group">
              <div v-for="item in group" :key="item.index" class="thumb-item"
                :class="{ active: currentSide === item.index }" @click="handleJump(item.index)">
                <div class="thumb-img">
                  <img :src="item.src" class="short-img" />
                </div>
                <div class="thumb-tag" :class="{ active: currentSide === item.index }">
                  {{ item.label }}
                </div>
              </div>
            </div>
          </div>
          <button class="nav-btn nav-down" :disabled="currentSide === currentPages.length - 1" @click="handleNext">
            <span class="nav-arrow">▼</span>
          </button>
        </div>
      </el-card>
      <div class="right-card">
        <!-- 右侧大图预览区 -->
        <div class="preview-main">
          <div class="page-img-wrap">
            <img :src="currentPages[currentSide]" class="page-img" />
          </div>
        </div>
        <!-- 试卷概览统计 -->
        <div class="stats-bar">
          <div class="page-contain">
            <button :disabled="currentSide === 0" @click="handlePrev" class="page-button">
              <ArrowLeft />
            </button>
            <span class="page-info">{{ currentSide + 1 }} / {{ currentPages.length }} 页</span>
            <button :disabled="currentSide === currentPages.length - 1" @click="handleNext" class="page-button">
              <ArrowRight />
            </button>
          </div>
          <button class="fullscreen-btn" @click="emit('fullscreen')">
            <span class="fs-icon">⛶</span>
            全屏预览
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.preview-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.preview-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  flex-shrink: 0;

  .preview-bar {
    width: 3px;
    height: 24px;
    background: #075DFE;
    border-radius: 2px;
  }

  .preview-title {
    font-size: 18px;
    font-weight: 600;
    color: #075DFE;
    width: 100px;
  }

  .head-btn {
    display: flex;
    width: 80%;
    gap: 8px;
    align-items: center;
    justify-content: space-between;
    margin-left: 200px;
    margin-right: 100px;

    .btn {
      width: 212px !important;
      height: 41px !important;
      border-radius: 6px;
      font-size: 18px;
      font-weight: 600;
      color: #ffffff !important;
      background-color: #999999 !important;
      border-color: #999999 !important;

      &.active {
        background-color: #075DFE !important;
        border-color: #075DFE !important;
      }
    }
  }
}

.preview-body {
  display: flex;
  gap: 24px;
  flex: 1;
  min-height: 0;
}

.thumbnails {
  display: flex;
  flex-direction: column;
  gap: 16px;

  .thumb-group {
    display: flex;
    flex-direction: column;
    gap: 8px;

    .thumb-sheet-label {
      font-size: 12px;
      font-weight: 600;
      color: #999;
      text-align: center;
      letter-spacing: 2px;
    }
  }

  .thumb-item {
    position: relative;
    width: 168px;
    height: 213px;
    border-radius: 12px;
    overflow: hidden;
    border: 2px solid transparent;

    &:hover {
      border-color: #075DFE;
      cursor: pointer;
    }

    &.active {
      border-color: #075DFE;
    }

    .thumb-img {
      width: 100%;
      height: 100%;
      background: #ffffff;
      border-radius: 12px;

      .short-img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
      }
    }

    .thumb-tag {
      position: absolute;
      bottom: 12px;
      left: 12px;
      width: 24px;
      height: 24px;
      border-radius: 4px;
      background: #999;
      color: #fff;
      font-size: 14px;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;

      &.active {
        background: #075DFE;
      }
    }
  }
}

.right-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  flex: 1;
  min-width: 0;
}

.preview-main {
  flex: 1;
  border: 1px solid #D9D9D9;
  background-color: #f8f9f9;
  border-radius: 12px;
  min-height: 300px;
  overflow-y: auto;
  display: flex;
  align-items: flex-start;
  justify-content: center;

  .page-img-wrap {
    width: 100%;
    display: flex;
    align-items: flex-start;
    justify-content: center;

    .page-img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }
  }
}

.preview-placeholder {
  color: #999;
  font-size: 16px;
}

.fullscreen-btn {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 4px;
  width: 122px;
  height: 36px;
  padding: 6px 12px;
  border: 1px solid #D9D9D9;
  border-radius: 6px;
  background: #fff;
  font-size: 18px;
  color: #1A1A1A;
  cursor: pointer;

  .fs-icon {
    font-size: 18px;
    color: #666;
  }
}

.thumb-card {
  width: 204px;
  flex-shrink: 0;
  border-radius: 12px;
  overflow: hidden;
}

.thumb-card :deep(.el-card__body) {
  padding: 12px;
  height: 100%;
  box-sizing: border-box;
  overflow-y: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.thumbnails-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.nav-up {
  top: 0;
}

.nav-down {
  bottom: 0;
}

.nav-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid #D9D9D9;
  background: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  z-index: 100;

  &:hover:not(:disabled) {
    background: #075DFE;
    border-color: #075DFE;

    .nav-arrow {
      color: #fff;
    }
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  .nav-arrow {
    font-size: 14px;
    color: #666;
    line-height: 1;
  }
}

// ---- 统计条 ----
.stats-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  border-radius: 8px;
  flex-shrink: 0;

  .page-contain {
    display: flex;
    align-items: center;
    gap: 8px;

    .page-info {
      font-size: 16px;
      color: #1A1A1A;
      margin: 0 16px;
    }

    .page-button {
      width: 36px;
      height: 36px;
      border-radius: 6px;
      border: 1px solid #CCCCCC;

      &:hover {
        border-color: #075DFE;
      }
    }
  }
}
</style>
