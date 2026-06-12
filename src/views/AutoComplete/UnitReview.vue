<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Notebook, Tickets, User } from '@element-plus/icons-vue'
import { getKnowledgeMastery } from '@/api/index.js'
import ScorePie from '../../components/ScorePie.vue'
import StepLayout from '../../components/StepLayout.vue'

const router = useRouter()

const handleNext = () => {
  router.push('/auto-complete/done')
}

const reviewList = ref([
  { checked: false, name: '知识点', description: '掌握单元核心概念与基本规律', importance: 4, achievement: '80%' },
  { checked: false, name: '考点', description: '提升综合应用与问题解决能力', importance: 4, achievement: '70%' },
  { checked: false, name: '易错点查询', description: '查询易错点，提升学习效率', importance: 5, achievement: '90%' },
  { checked: false, name: '情景化运用', description: '运用情景化问题，提升解决问题的能力', importance: 3, achievement: '80%' },
])

// 右侧题型分布
const contentList = ref([
  { key: 'single', title: '知识点', count: '30题', score: '30分', color: "#FD8103" },
  { key: 'multiple', title: '考点', count: '30题', score: '30分', color: "#1B69FA" },
  { key: 'blank', title: '易错点', count: '30题', score: '30分', color: "#FB4A51" },
  { key: 'shortAnswer', title: '情景应用点', count: '30题', score: '30分', color: "#48BF5E" },
])

// 右侧题型结构分布
const structList = ref([
  { key: 'single', title: '单项选择题', count: '30题', score: '30分' },
  { key: 'multiple', title: '多项选择题', count: '30题', score: '30分' },
  { key: 'blank', title: '填空题', count: '30题', score: '30分' },
  { key: 'shortAnswer', title: '解答题', count: '30题', score: '30分' },
])

// 右侧图表
const knowledgeList = ref([])
const difficultyStats = computed(() => {
  const easy = knowledgeList.value.filter(k => k.mastery >= 80).length
  const medium = knowledgeList.value.filter(k => k.mastery >= 60 && k.mastery < 80).length
  const hard = knowledgeList.value.filter(k => k.mastery < 60).length
  return { easy, medium, hard }
})

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

// 知识体系结构列表
const structureList = ref([
  {
    id: 1,
    name: '第二章:不等式的概念与性质',
    children: [
      { icon: 'Notebook', label: '知识点', text: '充分条件与必要条件的定义/命题与条件的关系/集合视角下的条件关系', count: '8-10题' },
      { icon: 'Tickets', label: '考点', text: '不等式的性质与解法/一元二次不等式的解集', count: '6-8题' },
    ],
  },
  {
    id: 2,
    name: '第三章:函数的基本性质',
    children: [
      { icon: 'Notebook', label: '知识点', text: '函数的概念与表示/函数的单调性与奇偶性', count: '10-12题' },
    ],
  },
  {
    id: 3,
    name: '第四章:指数函数与对数函数',
    children: [
      { icon: 'Notebook', label: '知识点', text: '指数运算与指数函数/对数运算与对数函数', count: '8-10题' },
    ],
  },
  {
    id: 4,
    name: '第五章:三角函数',
    children: [
      { icon: 'Notebook', label: '知识点', text: '三角函数的定义与图像/三角恒等变换', count: '8-10题' },
    ],
  },
])

// 下拉框展开项
const activeNames = ref([1, 2, 3, 4])
</script>

<template>
  <StepLayout :active-step="1" left-top-title="复习目标统计" left-bottom-title="知识体系结构" right-title="复习方案概览" title="单元复习"
    second-title="聚焦单元知识点覆盖，巩围学习成果，提升效率" @prev="$router.back()" @next="handleNext">
    <template #leftTopBadge>
      <span style="color: #fff; font-size:15px;">!</span>
    </template>
    <template #leftBottomBadge>
      <el-icon size="24">
        <User />
      </el-icon>
    </template>
    <template #leftTopBody>
      <el-table :data="reviewList" style="width: 100%" size="small" stripe class="knowledge-table">
        <el-table-column min-width="25">
          <template #default="{ row }">
            <el-checkbox v-model="row.checked" class="large-checkbox" />
          </template>
        </el-table-column>
        <el-table-column label="目标维度" min-width="80" align="center">
          <template #default="{ row }">
            <span class="knowledge-name">{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="目标描述" min-width="120">
          <template #default="{ row }">
            <span>{{ row.description }}</span>
          </template>
        </el-table-column>
        <el-table-column label="重要性" min-width="80" align="center">
          <template #default="{ row }">
            <el-rate v-model="row.importance" disabled :colors="['#FD8F37', '#FD8F37', '#FD8F37']"
              style="margin-left: 0;" />
          </template>
        </el-table-column>
        <el-table-column label="目标达成率" min-width="80" align="center">
          <template #default="{ row }">
            <span>{{ row.achievement }}</span>
          </template>
        </el-table-column>
      </el-table>
    </template>

    <template #leftBottomBody>
      <el-collapse v-model="activeNames" class="structure-collapse">
        <el-collapse-item v-for="item in structureList" :key="item.id" :name="item.id">
          <template #title>
            <span class="structure-badge">
              <svg class="book-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="1.33" y="1.33" width="12.32" height="13.33" rx="1" fill="#4EC16D" />
                <rect x="2.93" y="1.33" width="10.13" height="13.33" rx="1" fill="#EDF7F1" />
                <rect x="11.87" y="1.33" width="1.2" height="2.05" fill="#4EC16D" />
                <rect x="12.53" y="1.33" width="2.13" height="2.05" fill="#4EC16D" />
                <rect x="12.53" y="2.93" width="2.13" height="0.53" fill="#4EC16D" />
              </svg>
              课时
            </span>
            <span class="structure-title">{{ item.name }}</span>
          </template>
          <div class="knowledge-cards">
            <div class="knowledge-card" :style="{ backgroundColor: kid.icon === 'Notebook' ? '#FEF6EF' : '#DDE9FF' }"
              v-for="(kid, index) in item.children" :key="index">
              <div class="card-body">
                <el-icon v-if="kid.icon === 'Notebook'" size="24" style="color: #FD8103">
                  <Notebook />
                </el-icon>
                <el-icon v-else size="24" style="color: #1E77FA">
                  <Tickets />
                </el-icon>
                <span class="card-badge" :style="{ color: kid.icon === 'Notebook' ? '#FD8103' : '#1E77FA' }">
                  知识点
                </span>
                <span class="card-separator">丨</span>
                <span class="card-icon">

                </span>
                <span class="card-text">{{ kid.text }}</span>
                <span class="card-count">{{ kid.count }}</span>
              </div>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </template>

    <template #rightBody>
      <div class=" chart-section">
        <ScorePie :center-value="100" center-unit="总分数" :legends="[
          { color: '#03BC96', name: '容易', value: difficultyStats.easy, percent: '0%' },
          { color: '#1E77FA', name: '中等', value: difficultyStats.medium, percent: '0%' },
          { color: '#FD8F37', name: '困难', value: difficultyStats.hard, percent: '0%' },
        ]" />
      </div>
      <div class="line"></div>
      <div class="overview-section">
        <h4 class="overview-section-title">内容模块分布</h4>
        <div class="type-grid">
          <div class="type-item" v-for="item in contentList" :key="item.key">
            <div class="type-header">
              <span class="type-dot"></span>
              <span class="type-title" :style="{ color: item.color }">{{ item.title }}</span>
            </div>
            <div class="type-footer">
              <span class="type-count">{{ item.count }}</span>
              <span class="type-score">{{ item.score }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="line"></div>
      <div class="overview-section">
        <h4 class="overview-section-title">题型结构分布</h4>
        <div class="type-grid">
          <div class="type-item" v-for="item in structList" :key="item.key">
            <div class="type-header">
              <span class="type-dot"></span>
              <span class="type-title" :style="{ color: item.color }">{{ item.title }}</span>
            </div>
            <div class="type-footer">
              <span class="type-count">{{ item.count }}</span>
              <span class="type-score">{{ item.score }}</span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </StepLayout>
</template>

<style lang="scss" scoped>
.knowledge-table :deep(.el-table__header-wrapper .el-table__cell) {
  height: 46px;
  background-color: #F3F6FD;
  font-size: 16px;

}

.knowledge-detail-table :deep(.el-table__header-wrapper .el-table__cell) {
  height: 46px;
  background-color: #F3F6FD;
  font-size: 16px;
}

.large-checkbox {
  font-size: 13px;
}

.structure-collapse {
  border: none;
  margin-left: 16px;

  :deep(.el-collapse-item__header) {
    display: flex;
    align-items: center;
    gap: 12px;
    height: auto;
    padding: 8px 12px;
    border: none;
    font-weight: normal;
    line-height: 1;
  }

  :deep(.el-collapse-item__wrap) {
    border: none;
  }

  :deep(.el-collapse-item__content) {
    padding: 0 12px 12px;
    font-size: 16px;
  }

  :deep(.el-collapse-item__arrow) {
    // 箭头在标题左侧
    order: -1;
    margin-right: 3px;
    margin-left: 0;

  }
}

.structure-badge {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 4px 12px;
  background-color: #EDF7F1;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  color: #4EC16D;
  font-family: 'PingFang SC', sans-serif;
  line-height: 1;
  flex-shrink: 0;
  margin-right: 12px;
}

.structure-title {
  font-size: 16px;
  font-weight: 600;
  color: #1A1A1A;
  font-family: 'PingFang SC', sans-serif;
  line-height: 22px;
}

.knowledge-cards {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.knowledge-card {
  border: 1px solid rgba(253, 129, 3, 0.2);
  border-radius: 12px;
  padding: 8px 16px;
}

.card-body {
  display: flex;
  align-items: center;
  gap: 4px;
}

.card-badge {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  font-size: 14px;
  font-weight: 500;

  font-family: 'PingFang SC', sans-serif;
  white-space: nowrap;
}

.card-separator {
  font-size: 14px;
  color: #666666;
  font-family: 'PingFang SC', sans-serif;
  margin: 0 4px;
}

.card-text {
  flex: 1;
  font-size: 14px;
  color: #666666;
  font-family: 'PingFang SC', sans-serif;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-count {
  font-size: 14px;
  font-weight: 600;
  color: #075DFE;
  font-family: 'PingFang SC', sans-serif;
  white-space: nowrap;
  margin-left: auto;
  margin-right: 12px;
}

.head-index {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  background-color: #FFE8EB;
  color: #FF4E60;
  border-radius: 4px;
  margin-right: 3px;
}

.knowledge-name {
  font-size: 14px;
  color: #333333;
  font-weight: 600;
  overflow: auto;
}

.line {
  width: 90%;
  margin: 0 auto;
  height: 1px;
  background-color: #E5E5E5;
}

.knowledge-table :deep(.el-table__body-wrapper .el-table__cell),
.knowledge-detail-table :deep(.el-table__body-wrapper .el-table__cell) {
  height: 46px;
  overflow: auto;
}

.knowledge-table :deep(.el-table__body-wrapper .el-table__cell .cell),
.knowledge-detail-table :deep(.el-table__body-wrapper .el-table__cell .cell) {
  font-size: 14px !important;
}

.knowledge-table :deep(.el-table__header-wrapper th:first-child .cell),
.knowledge-table :deep(.el-table__body-wrapper td:first-child .cell) {
  margin-left: 22px;
}

.knowledge-detail-table :deep(.el-table__header-wrapper th:first-child .cell),
.knowledge-detail-table :deep(.el-table__body-wrapper td:first-child .cell) {
  margin-left: 22px;
}

.knowledge-detail-table :deep(.el-table__header-wrapper th:nth-child(3) .cell),
.knowledge-detail-table :deep(.el-table__body-wrapper td:nth-child(3) .cell),
.knowledge-detail-table :deep(.el-table__header-wrapper th:nth-child(4) .cell),
.knowledge-detail-table :deep(.el-table__body-wrapper td:nth-child(4) .cell) {
  text-align: center;
}


.chart-section {
  margin-bottom: 0px;
  margin-top: 0px;
}

.overview-section {
  margin-bottom: 24px;
  margin-top: 24px;

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

        .type-count {
          font-size: 16px;
          font-weight: 600;
          color: #1F2329;
        }
      }
    }
  }

  .knowledge-tags {
    min-height: 24px;
    display: flex;
    flex-wrap: wrap;
    row-gap: 22px;
    column-gap: 61px;
    margin-left: 30px;

    .knowledge-tag {
      padding: 4px 8px;
    }
  }
}
</style>
