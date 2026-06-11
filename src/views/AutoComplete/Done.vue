<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import StepProgress from '@/components/StepProgress.vue'
import ScorePie from '@/components/ScorePie.vue'
import RightCard from '@/components/RightCard.vue'
import { getKnowledgeMastery } from '@/api/index.js'
import { paperSides } from '@/mock/examPaper.js'

const router = useRouter()

const currentSide = ref(0)
const paperHtml = computed(() => paperSides[currentSide.value])

// 右侧题型分布
const typeList = ref([
  { key: 'single', title: '选择题', percentage: 30 },
  { key: 'multiple', title: '填空题', percentage: 60 },
  { key: 'blank', title: '解答题', percentage: 50 },
  { key: 'shortAnswer', title: '应用探究题', percentage: 70 },
])

// 右侧图表
const knowledgeList = ref([])
const difficultyStats = ref({ easy: 0, medium: 0, hard: 0 })

const getKnowledge = async () => {
  try {
    const res = await getKnowledgeMastery()
    if (res.code === 200) {
      knowledgeList.value = res.list
    }
  } catch (error) {
    console.error('获取知识点掌握度失败:', error)
  }
}

onMounted(() => {
  getKnowledge()
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
              <!-- 左侧缩略图 -->
              <div class="thumbnails">
                <div class="thumb-group">
                  <div class="thumb-item" :class="{ active: currentSide === 0 }" @click="currentSide = 0">
                    <div class="thumb-img"></div>
                    <div class="thumb-tag" :class="{ active: currentSide === 0 }">1</div>
                  </div>
                  <div class="thumb-item" :class="{ active: currentSide === 1 }" @click="currentSide = 1">
                    <div class="thumb-img"></div>
                    <div class="thumb-tag" :class="{ active: currentSide === 1 }">2</div>
                  </div>
                </div>
                <div class="thumb-group">
                  <div class="thumb-item" :class="{ active: currentSide === 2 }" @click="currentSide = 2">
                    <div class="thumb-img"></div>
                    <div class="thumb-tag" :class="{ active: currentSide === 2 }">3</div>
                  </div>
                  <div class="thumb-item" :class="{ active: currentSide === 3 }" @click="currentSide = 3">
                    <div class="thumb-img"></div>
                    <div class="thumb-tag" :class="{ active: currentSide === 3 }">4</div>
                  </div>
                </div>
              </div>
              <!-- 右侧大图预览区 -->
              <div class="preview-main">
                <div class="paper-scroll" v-html="paperHtml"></div>
              </div>
            </div>
          </div>
          <!-- 试卷概览统计 -->
          <div class="stats-bar">
            <span>{{ currentSide + 1 }} / 4 面</span>
            <button class="fullscreen-btn">
              <span class="fs-icon">⛶</span>
              全屏预览
            </button>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8" class="right-col">
        <RightCard title="试卷出题内容概览" style="flex: 1;">
          <div class="overview-section">
            <h4 class="overview-section-title">试卷总分</h4>
            <ScorePie :center-value="100" center-unit="总分数" :legends="[
              { color: '#03BC96', name: '容易', value: 1, percent: '0%' },
              { color: '#1E77FA', name: '中等', value: 2, percent: '0%' },
              { color: '#FD8F37', name: '困难', value: 3, percent: '0%' },
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
                  <el-progress :percentage="item.percentage" class="type-progress" />
                </div>
              </div>
            </div>
          </div>
        </RightCard>
      </el-col>
    </el-row>

    <div class="footer-btns">
      <el-button class="btn-prev" plain @click="router.back()">上一步</el-button>
      <el-button class="btn-next" @click="() => { }">下一步</el-button>
    </div>
  </div>
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
  overflow-y: auto;
}

.left-card :deep(.el-card__body) {
  padding: 16px;
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

// ---- 左侧：试卷预览 ----
.preview-section {
  margin-bottom: 16px;
  height: 639px;
}

.preview-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;

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
      background: #F2F2F2;
      border-radius: 12px;
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

.preview-main {
  flex: 1;
  position: relative;
  border: 1px solid #D9D9D9;
  background-color: #f8f9f9;
  border-radius: 12px;
  min-height: 400px;
  max-height: 680px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  .paper-scroll {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    padding: 24px;
    box-sizing: border-box;
    font-family: 'SimSun', '宋体', serif;
  }

  .preview-placeholder {
    color: #999;
    font-size: 16px;
  }

  .fullscreen-btn {
    position: absolute;
    top: 16px;
    right: 16px;
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 6px 12px;
    border: 1px solid #D9D9D9;
    border-radius: 6px;
    background: #fff;
    font-size: 18px;
    color: #1A1A1A;
    cursor: pointer;

    .fs-icon {
      font-size: 24px;
      color: #666;
    }
  }
}

// ---- 统计条 ----
.stats-bar {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 12px 24px;
  background: #F8F9FB;
  border-radius: 8px;
  margin-bottom: 24px;

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
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }

  .overview-section-title {
    margin: 0 0 8px 0;
    font-size: 16px;
    font-weight: 500;
    line-height: 22px;
    color: #5A6382;
    padding-left: 8px;
    margin-bottom: 20px;
  }

  .type-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 6px;

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
</style>
