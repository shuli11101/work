<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import StepProgress from '@/components/StepProgress.vue'
import ScorePie from '@/components/ScorePie.vue'
import RightCard from '@/components/RightCard.vue'
import { getKnowledgeMastery } from '@/api/index.js'
import page1 from '@/assets/picture/page/Page_1_docsmall.com.jpg'
import page2 from '@/assets/picture/page/Page_2_docsmall.com.jpg'
import page3 from '@/assets/picture/page/Page_3_docsmall.com.jpg'
import page4 from '@/assets/picture/page/Page_4_docsmall.com.jpg'
import ExamOverview from '@/components/ExamOverview.vue'
import ExamPreview from '@/components/ExamPreview.vue'

// 试卷
const page = [
  [page1, page2, page3, page4],
  [page1, page2, page3, page4],
  [page1, page2, page3],
]

const router = useRouter()
const route = useRoute()

const currentSide = ref(0)
const isLayer = computed(() => route.query.from === 'layer')

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

// 点击全屏预览
const handleOverview = ref(false)

// 点击完成按钮
const handleComplete = () => {
  console.log('完成')
  router.back()
}

// 标题
const title = ref('')

// 点击下载试卷按钮
const handleDownload = () => {
  console.log('下载试卷')
}

onMounted(() => {
  getKnowledge()
  setTimeout(() => {
    showGenerating.value = false
  }, 2000)

  // 路由判断
  console.log(route.query)
  if (route.query.from === 'layer') {
    title.value = '分层作业'
  } else if (route.query.from === 'review') {
    title.value = '单元复习'
  } else if (route.query.from === 'custom') {
    title.value = '自定义组卷'
  } else if (route.query.from === 'monitorGo') {
    title.value = '冲刺模拟'
  } else {
    title.value = '靶向补弱'
  }
})

const reTitle = computed(() => {
  if (route.query.from === 'layer') {
    return '根据学生水平分层出题，因材施教，提高效率 '
  } else if (route.query.from === 'review') {
    return '聚焦单元知识点覆盖，巩围学习成果，提升效率 '
  } else if (route.query.from === 'custom') {
    return '自由配置题目类型、题量和难度，满足个性化需求'
  } else if (route.query.from === 'monitorGo') {
    return '模拟真实考试场景，针对重点难点进行专项冲刺，提升应试能力'
  } else {
    return '基于学情数据，精准定位薄弱知识点，智能生成个性化练习'
  }
})

</script>

<template>
  <div class="done-layout">
    <h2 class="page-title">{{ title }}</h2>
    <span class="second-title">{{ reTitle }}</span>

    <StepProgress :active="3" />

    <el-row :gutter="12" class="cards-row">
      <el-col :span="16" class="left-col">
        <el-card class="left-card" shadow="hover">
          <ExamPreview :page="page" v-model:current-side="currentSide" :is-layer="isLayer"
            @fullscreen="handleOverview = true" />
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
          <div class="line"></div>
          <div class="overview-section">
            <h4 class="overview-section-title">题型分布（预计）</h4>
            <div class="type-grid">
              <div class="type-item" v-for="item in typeList" :key="item.key">
                <div class="type-header">
                  <span class="type-dot"></span>
                  <span class="type-title">{{ item.title }}</span>
                </div>
                <div class="type-footer">
                  <el-progress :percentage="item.percentage" color="#075DFE" class="type-progress" :format="() => ''" />
                  <span class="type-percent">{{ item.percentage }}%</span>
                </div>
              </div>
            </div>
          </div>
          <div class="line"></div>
          <!-- 知识点覆盖 -->
          <div class="overview-section">
            <h4 class="overview-section-title">知识点覆盖（预计）</h4>
            <div class="type-grid">
              <div class="type-item" v-for="item in knowledgeList" :key="item.key">
                <div class="type-header">
                  <span class="type-title">{{ item.title }}</span>
                </div>
                <div class="type-footer">
                  <el-progress :percentage="item.percentage" color="#075DFE" class="type-progress" :format="() => ''" />
                  <span class="type-percent">{{ item.percentage }}%</span>
                </div>
              </div>
            </div>
          </div>
        </RightCard>
      </el-col>
    </el-row>

    <div class="footer-btns">
      <el-button class="btn-prev" @click="handleComplete">完成</el-button>
      <el-button class="btn-next" @click="handleDownload">下载试卷</el-button>
    </div>
  </div>

  <!-- 生成弹窗 -->
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="showGenerating" class="generating-overlay">
        <div class="generating-modal">
          <!-- 关闭按钮 -->
          <div class="generating-close" @click="showGenerating = false">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M1 1L9 9M9 1L1 9" stroke="#333" stroke-width="1.5" stroke-linecap="round" />
            </svg>
          </div>
          <!-- 内容 -->
          <div class="generating-content">
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
            </div>
            <div class="generating-text">生成中···</div>
            <div class="generating-percent">(9%)</div>
          </div>
        </div>
      </div>
    </Transition>
    <ExamOverview :pages="page[0]" v-model:visible="handleOverview" />
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

.line {
  width: 473px;
  height: 1px;
  background: #D9D9D9;
  margin-bottom: 12px;
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
    margin-bottom: 12px;
  }

  .type-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 4px;

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
        align-items: center;
        width: 324px;

        :deep(.el-progress) {
          width: 100%;
        }

        .type-title {
          font-size: 16px;
          color: #1A1A1A;
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
</style>

<style>
.generating-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.generating-modal {
  position: relative;
  width: 818px;
  height: 290px;
  background: linear-gradient(180deg, rgba(232, 231, 249, 1) 0%, rgba(255, 255, 255, 1) 100%);
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.generating-close {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.generating-content {
  position: absolute;
  left: 50%;
  top: 86px;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 70px;
}

.generating-bars {
  display: flex;
  align-items: flex-end;
  width: 70px;
  height: 70px;
  position: relative;
}

.generating-bars .bar {
  position: absolute;
  top: 50%;
  background: linear-gradient(180deg, rgba(99, 204, 232, 1) 0%, rgba(92, 116, 248, 1) 27%, rgba(223, 160, 220, 1) 52%, rgba(92, 116, 248, 1) 75%, rgba(99, 204, 232, 1) 100%);
  border-radius: 99px;
  transform: translateY(-50%);
  transform-origin: center center;
  animation: bar-loading 1.2s ease-in-out infinite;
}

.generating-bars .bar:nth-child(1) {
  left: 1px;
  width: 3px;
  height: 12px;
  animation-delay: 0s;
}

.generating-bars .bar:nth-child(2) {
  left: 6.5px;
  width: 6px;
  height: 28px;
  animation-delay: 0.1s;
}

.generating-bars .bar:nth-child(3) {
  left: 15px;
  width: 6px;
  height: 52px;
  animation-delay: 0.2s;
}

.generating-bars .bar:nth-child(4) {
  left: 23.5px;
  width: 6px;
  height: 26px;
  animation-delay: 0.3s;
}

.generating-bars .bar:nth-child(5) {
  left: 32px;
  width: 6px;
  height: 12px;
  animation-delay: 0.4s;
}

.generating-bars .bar:nth-child(6) {
  left: 40.5px;
  width: 6px;
  height: 26px;
  animation-delay: 0.5s;
}

.generating-bars .bar:nth-child(7) {
  left: 49px;
  width: 6px;
  height: 52px;
  animation-delay: 0.6s;
}

.generating-bars .bar:nth-child(8) {
  left: 57.5px;
  width: 6px;
  height: 28px;
  animation-delay: 0.7s;
}

.generating-bars .bar:nth-child(9) {
  left: 66px;
  width: 3px;
  height: 12px;
  animation-delay: 0.8s;
}

@keyframes bar-loading {

  0%,
  100% {
    opacity: 0.3;
    transform: translateY(-50%) scaleY(0.8);
  }

  50% {
    opacity: 1;
    transform: translateY(-50%) scaleY(1);
  }
}

.generating-text {
  margin-top: 10px;
  font-size: 14px;
  font-weight: 600;
  color: #333333;
  font-family: 'PingFang SC', sans-serif;
  white-space: nowrap;
}

.generating-percent {
  margin-top: 3px;
  font-size: 12px;
  font-weight: 600;
  color: #999999;
  font-family: 'PingFang SC', sans-serif;
}
</style>
