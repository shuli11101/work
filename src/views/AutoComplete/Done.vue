<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import StepProgress from '@/components/StepProgress.vue'
import ScorePie from '@/components/ScorePie.vue'
import RightCard from '@/components/RightCard.vue'
import { getKnowledgeMastery } from '@/api/index.js'
import page1 from '@/assets/picture/page/Page_1_docsmall.com.jpg'
import page2 from '@/assets/picture/page/Page_2_docsmall.com.jpg'
import page3 from '@/assets/picture/page/Page_3_docsmall.com.jpg'
import page4 from '@/assets/picture/page/Page_4_docsmall.com.jpg'
import { ArrowLeft, ArrowRight } from '@icon-park/vue-next'

// 试卷
const page = [page1, page2, page3, page4]

const router = useRouter()

const currentSide = ref(0)

// 右侧题型分布
const typeList = ref([
  { key: 'single', title: '选择题', percentage: 30 },
  { key: 'multiple', title: '填空题', percentage: 60 },
  { key: 'blank', title: '解答题', percentage: 50 },
  { key: 'shortAnswer', title: '应用探究题', percentage: 70 },
])

// 右侧知识点覆盖
const knowledgeList = ref([
  { key: 'knowledge1', title: '知识点1', percentage: 80 },
  { key: 'knowledge2', title: '知识点2', percentage: 70 },
  { key: 'knowledge3', title: '知识点3', percentage: 60 },
  { key: 'knowledge4', title: '知识点4', percentage: 50 },
  { key: 'knowledge5', title: '知识点5', percentage: 40 },
])

// 右侧图表 题型概览
const knowledgeTypeList = ref([])
const difficultyStats = ref({ easy: 0, medium: 0, hard: 0 })

const getKnowledge = async () => {
  try {
    const res = await getKnowledgeMastery()
    if (res.code === 200) {
      knowledgeTypeList.value = res.list
    }
  } catch (error) {
    console.error('获取知识点掌握度失败:', error)
  }
}

// 生成弹窗
const showGenerating = ref(true)

onMounted(() => {
  getKnowledge()
  setTimeout(() => {
    showGenerating.value = false
  }, 2000)
})
</script>

<template>
  <div class="done-layout">
    <h2 class="page-title">靶向补弱</h2>
    <span class="second-title">基于学情数据，精准定位薄弱知识点，智能生成个性化练习</span>

    <StepProgress :active="3" />

    <el-row :gutter="12" class="cards-row">
      <el-col :span="16" class="left-col">
        <el-card class="left-card" shadow="hover">
          <!-- 试卷预览 -->
          <div class="preview-section">
            <div class="preview-header">
              <span class="preview-bar"></span>
              <span class="preview-title">试卷预览</span>
            </div>
            <div class="preview-body">
              <!-- 左侧缩略图 + 上下翻页 -->
              <el-card class="thumb-card">
                <div class="thumbnails-col">
                  <button class="nav-btn nav-up" :disabled="currentSide === 0" @click="currentSide--">
                    <span class="nav-arrow">▲</span>
                  </button>
                  <div class="thumbnails">
                    <div class="thumb-group">
                      <div class="thumb-item" :class="{ active: currentSide === 0 }" @click="currentSide = 0">
                        <div class="thumb-img">
                          <img :src="page[0]" class="short-img" />
                        </div>
                        <div class="thumb-tag" :class="{ active: currentSide === 0 }">1</div>
                      </div>
                      <div class="thumb-item" :class="{ active: currentSide === 1 }" @click="currentSide = 1">
                        <div class="thumb-img">
                          <img :src="page[1]" class="short-img" />
                        </div>
                        <div class="thumb-tag" :class="{ active: currentSide === 1 }">2</div>
                      </div>
                    </div>
                    <div class="thumb-group">
                      <div class="thumb-item" :class="{ active: currentSide === 2 }" @click="currentSide = 2">
                        <div class="thumb-img">
                          <img :src="page[2]" class="short-img" />
                        </div>
                        <div class="thumb-tag" :class="{ active: currentSide === 2 }">3</div>
                      </div>
                      <div class="thumb-item" :class="{ active: currentSide === 3 }" @click="currentSide = 3">
                        <div class="thumb-img">
                          <img :src="page[3]" class="short-img" />
                        </div>
                        <div class="thumb-tag" :class="{ active: currentSide === 3 }">4</div>
                      </div>
                    </div>
                  </div>
                  <button class="nav-btn nav-down" :disabled="currentSide === 3" @click="currentSide++">
                    <span class="nav-arrow">▼</span>
                  </button>
                </div>
              </el-card>
              <div class="right-card">
                <!-- 右侧大图预览区 -->
                <div class="preview-main">
                  <div class="page-img-wrap"><img :src="page[currentSide]" class="page-img" />
                  </div>
                </div>
                <!-- 试卷概览统计 -->
                <div class="stats-bar">
                  <div class="page-contain">
                    <button :disabled="currentSide === 0" @click="currentSide--" class="page-button">
                      <ArrowLeft />
                    </button>
                    <span class="page-info">{{ currentSide + 1 }} / 4 页</span>
                    <button :disabled="currentSide === 3" @click="currentSide++" class="page-button">
                      <ArrowRight />
                    </button>
                  </div>
                  <button class="fullscreen-btn">
                    <span class="fs-icon">⛶</span>
                    全屏预览
                  </button>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8" class="right-col">
        <RightCard title="题型概览" style="flex: 1;">
          <div class="overview-section">
            <ScorePie :center-value="100" center-unit="总分数" :legends="[
              { color: '#03BC96', name: '总分值', value: 1, percent: '0%' },
              { color: '#1E77FA', name: '考试时长', value: 2, percent: '0%' },
              { color: '#FD8F37', name: '题量', value: 3, percent: '0%' },
              { color: '#FD7C9A', name: '覆盖知识点', value: 4, percent: '0%' },
            ]" />
          </div>
          <div class="overview-section">
            <h4 class="overview-section-title">题型分布</h4>
            <div class="type-grid">
              <div class="type-item" v-for="item in typeList" :key="item.key">
                <div class="type-header">
                  <span class="type-dot"></span>
                  <span class="type-title">{{ item.title }}</span>
                </div>
                <div class="type-footer">
                  <el-progress :percentage="item.percentage" color="#075DFE" class="type-progress" />
                </div>
              </div>
            </div>
          </div>
          <!-- 知识点覆盖 -->
          <div class="overview-section">
            <h4 class="overview-section-title">知识点覆盖</h4>
            <div class="type-grid">
              <div class="type-item" v-for="item in knowledgeList" :key="item.key">
                <div class="type-header">
                  <span class="type-title">{{ item.title }}</span>
                </div>
                <div class="type-footer">
                  <el-progress :percentage="item.percentage" color="#075DFE" class="type-progress" />
                </div>
              </div>
            </div>
          </div>
        </RightCard>
      </el-col>
    </el-row>

    <div class="footer-btns">
      <el-button class="btn-prev" @click="router.back()">完成</el-button>
      <el-button class="btn-next" @click="() => { }">下载试卷</el-button>
    </div>
  </div>

  <!-- 生成弹窗 -->
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="showGenerating" class="generating-overlay">
        <div class="generating-modal">
          <button class="generating-close" @click="showGenerating = false">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="#333" stroke-width="1.5">
              <path d="M1 1L9 9M9 1L1 9" />
            </svg>
          </button>
          <div class="generating-bars">
            <span class="bar"></span>
            <span class="bar"></span>
            <span class="bar"></span>
            <span class="bar"></span>
            <span class="bar"></span>
            <span class="bar"></span>
            <span class="bar"></span>
            <span class="bar"></span>
            <span class="bar"></span>
            <span class="bar"></span>
          </div>
          <div class="generating-text">生成中···</div>
          <div class="generating-percent">(9%)</div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
.done-layout {
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

.left-card {
  flex: 1;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.left-card :deep(.el-card__body) {
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
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

  .btn-next {
    border: 3px solid #3279fe;
    color: #6198fe;
    width: 200px;
    height: 40px;
    border-radius: 8px;
  }

  .btn-prev {
    background-color: #075dfe;
    color: white;
    width: 200px;
    height: 40px;
    border-radius: 8px;
  }
}

// ---- 左侧：试卷预览 ----
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

  .stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;

    .stat-value {
      font-size: 18px;
      font-weight: 600;
      color: #000;
    }

    .stat-unit {
      font-size: 14px;
      color: #5A6382;
    }

    .stat-label {
      font-size: 12px;
      color: #999;
    }
  }

  .stat-divider {
    width: 1px;
    height: 32px;
    background: #D9D9D9;
  }
}

// ---- 底部网格 ----
.bottom-grid {
  display: flex;
  gap: 24px;
}

.bottom-section {
  flex: 1;

  .section-title {
    margin: 0 0 12px 0;
    font-size: 16px;
    font-weight: 500;
    color: #5A6382;
  }

  .progress-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .progress-row {
    display: flex;
    align-items: center;
    gap: 8px;

    .progress-bar-bg {
      flex: 1;
      height: 8px;
      background: #F0F0F0;
      border-radius: 99px;
      overflow: hidden;

      .progress-bar-fill {
        height: 100%;
        border-radius: 99px;
        transition: width 0.3s ease;
      }
    }

    .progress-name {
      min-width: 80px;
      font-size: 16px;
      color: #1A1A1A;
    }

    .progress-percent {
      min-width: 40px;
      text-align: right;
      font-size: 16px;
      color: #000;
    }
  }
}

.mid-divider {
  width: 1px;
  background: #D9D9D9;
  margin: 0 8px;
}

// ---- 右侧样式 ----
.overview-section {
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }

  +.overview-section {
    border-top: 1px solid #E5E7EB;
    padding-top: 8px;
  }

  .overview-section-title {
    margin: 0 0 8px 0;
    font-size: 16px;
    font-weight: 500;
    line-height: 22px;
    color: #5A6382;
    padding-left: 8px;
    margin-bottom: 12px;
  }

  .type-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 3px;

    .type-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 6px 10px;
      border-radius: 6px;

      .type-header {
        display: flex;
        align-items: center;
        gap: 8px;

        .type-dot {
          background-image: url('@/assets/picture/dot.png');
          background-size: cover;
          width: 18px;
          height: 18px;
          border-radius: 50%;
        }

        .type-score {
          font-size: 16px;
          font-weight: 400;
        }
      }

      .type-footer {
        display: flex;
        justify-content: space-around;
        align-items: center;
        gap: 8px;
        width: 300px;

        .type-title {
          font-size: 16px;
          color: #1A1A1A;
        }

        .type-progress {
          flex: 1;
          width: 100%;
          height: 8px;
        }


        .type-count {
          font-size: 16px;
          font-weight: 600;
          color: #1F2329;
        }
      }
    }
  }
}

// 生成弹窗
.generating-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.generating-modal {
  position: relative;
  width: 818px;
  height: 290px;
  background: linear-gradient(180deg, #E8E7F9 0%, #FFFFFF 100%);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.generating-close {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: none;
  background: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.generating-bars {
  display: flex;
  align-items: flex-end;
  gap: 4px;
  height: 70px;

  .bar {
    width: 6px;
    border-radius: 99px;
    background: linear-gradient(180deg, #63CCE8 0%, #5C74F8 27%, #DFA0DC 52%, #5C74F8 75%, #63CCE8 100%);
    animation: barWave 1.2s ease-in-out infinite;

    &:nth-child(1) {
      height: 52px;
      animation-delay: 0s;
    }

    &:nth-child(2) {
      height: 28px;
      animation-delay: 0.1s;
    }

    &:nth-child(3) {
      height: 26px;
      animation-delay: 0.2s;
    }

    &:nth-child(4) {
      height: 12px;
      animation-delay: 0.3s;
    }

    &:nth-child(5) {
      height: 26px;
      animation-delay: 0.4s;
    }

    &:nth-child(6) {
      height: 12px;
      animation-delay: 0.5s;
    }

    &:nth-child(7) {
      height: 26px;
      animation-delay: 0.6s;
    }

    &:nth-child(8) {
      height: 28px;
      animation-delay: 0.7s;
    }

    &:nth-child(9) {
      height: 52px;
      animation-delay: 0.8s;
    }

    &:nth-child(10) {
      height: 12px;
      animation-delay: 0.9s;
    }
  }
}

@keyframes barWave {

  0%,
  100% {
    opacity: 0.4;
  }

  50% {
    opacity: 1;
  }
}

.generating-text {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  font-family: 'PingFang SC', sans-serif;
}

.generating-percent {
  font-size: 12px;
  font-weight: 600;
  color: #999;
  font-family: 'PingFang SC', sans-serif;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
