<script setup>
import { getStudentList, getKnowledgeMastery } from '@/api/index.js'
import { computed, onMounted, ref } from 'vue'
import { User } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import StepLayout from '../../components/StepLayout.vue'

const top10Data = [
  { name: '三角函数', rate: 62, distribution: '62' },
  { name: '立体几何', rate: 68, distribution: '68' },
  { name: '数列', rate: 71, distribution: '71' },
  { name: '概率统计', rate: 75, distribution: '75' },
  { name: '解析几何', rate: 78, distribution: '78' },
  { name: '函数与导数', rate: 55, distribution: '55' },
  { name: '平面向量', rate: 60, distribution: '60' },
  { name: '不等式', rate: 65, distribution: '65' },
  { name: '复数', rate: 80, distribution: '80' },
  { name: '排列组合', rate: 73, distribution: '73' },
]

const studentList = ref([])
const sortStudentList = computed(() => {
  const l = [...studentList.value]
  l.sort((a, b) => a.mastery - b.mastery)
  return l.slice(0, 10)
})
const getStudent = async () => {
  try {
    const res = await getStudentList()
    if (res.code === 200) {
      studentList.value = res.list
    }
  } catch (error) {
    console.error('获取学生列表失败:', error)
  }
}

const selectCount = ref(0)
const selectedAll = computed({
  get() {
    selectCount.value = sortStudentList.value.filter(item => item.checked).length
    return sortStudentList.value.length > 0 && sortStudentList.value.every(item => item.checked)
  },
  set(val) {
    sortStudentList.value.forEach(item => item.checked = val)
    selectCount.value = sortStudentList.value.filter(item => item.checked).length
  }
})

// 清除选择
const clearSelect = () => {
  sortStudentList.value.forEach(item => item.checked = false)
  selectCount.value = 0
}

// 右侧题型分布
const typeList = ref([
  { key: 'single', title: '单项选择题', count: '30题', score: '30分' },
  { key: 'multiple', title: '多项选择题', count: '30题', score: '30分' },
  { key: 'blank', title: '填空题', count: '30题', score: '30分' },
  { key: 'shortAnswer', title: '简答题', count: '30题', score: '30分' },
])



// 右下角覆盖知识点
const coverKnowledge = computed(() => {
  return [...new Set(sortStudentList.value.filter(item => item.checked).map(item => item.weakPoints).flat())]
})

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
      initChart()
    }
  } catch (error) {
    console.error('获取知识点掌握度失败:', error)
  }
}



const chartRef = ref(null)

function initChart() {
  if (!chartRef.value) return
  const chart = echarts.init(chartRef.value)
  chart.setOption({
    tooltip: { trigger: 'item' },
    series: [
      {
        type: 'pie',
        radius: ['65%', '85%'],
        avoidLabelOverlap: false,
        label: {
          show: true,
          position: 'center',
          formatter: '{a|100}\n{b|总分数}',
          rich: {
            a: { fontSize: 40, fontWeight: 600, lineHeight: 56, color: '#000000' },
            b: { fontSize: 18, fontWeight: 400, lineHeight: 25, color: '#5A6382' }
          }
        },
        emphasis: { scale: false },
        data: [
          { value: difficultyStats.value.easy, name: '简单', itemStyle: { color: '#409eff' } },
          { value: difficultyStats.value.medium, name: '中等', itemStyle: { color: '#e6a23c' } },
          { value: difficultyStats.value.hard, name: '困难', itemStyle: { color: '#f56c6c' } },
        ],
      },
    ],
  })
  chart.resize()
}

onMounted(() => {
  getStudent()
  getKnowledge()
})
</script>

<template>
  <StepLayout :active-step="1" left-top-title="班级整体薄弱top10" left-bottom-title="学生薄弱分布top10" right-title="试卷出题内容概览"
    title="靶向补弱" second-title="基于学情数据，精准定位薄弱知识点，智能生成个性化练习" @prev="$router.back()" @next="() => { }">
    <template #leftTopBadge>
      <span style="color: #fff; font-size:15px;">!</span>
    </template>
    <template #leftBottomBadge>
      <el-icon size="24">
        <User />
      </el-icon>
    </template>
    <template #leftTopBody>
      <el-table :data="top10Data.sort((a, b) => a.rate - b.rate)" style="width: 100%" size="small" stripe
        class="knowledge-table">
        <el-table-column label="知识点" min-width="100">
          <template #default="{ $index, row }">
            <span class="head-index">{{ $index + 1 }}</span>
            <span class="knowledge-name">{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="掌握度（平均正确率）" min-width="140">
          <template #default="{ row }">
            <el-progress :percentage="row.rate" :stroke-width="8" :format="() => row.rate + '%'"
              :color="row.rate <= 65 ? '#FD5156' : row.rate <= 75 ? '#FDB05F' : '#03BC96'"
              style="width: 203px; gap: 12px;" />
          </template>
        </el-table-column>
        <el-table-column prop="distribution" label="未掌握分布" min-width="100" />
        <el-table-column label="操作" min-width="80">
          <template #default>
            <el-link type="primary" :underline="false" style="color: #075DFE; font-weight: 600;">查看详情</el-link>
          </template>
        </el-table-column>
      </el-table>
    </template>

    <template #leftBottomBody>
      <el-table :data="sortStudentList" style="width: 100%" class="student-table">
        <el-table-column prop="studentName" label="学生姓名">
          <template #default="{ row }">
            <el-avatar :size="24" class="student-avatar"></el-avatar>
            <span class="student-name">{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="mastery" label="掌握程度（平均正确率）">
          <template #default="{ row }">
            <div style="display: flex; align-items: center; gap: 4px;">
              <el-tag v-if="row.mastery <= 50" style="background-color: #feeaea; color: red; margin: 0">薄弱</el-tag>
              <el-tag v-else-if="row.mastery <= 60"
                style="background-color: #fffecc; color: #e6c240; margin: 0">一般</el-tag>
              <el-tag v-else style="background-color: #d6ffcd; color: green; margin: 0">良好</el-tag>
              <span>{{ row.mastery }}%</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="weakPoints" label="薄弱知识点TOP3">
          <template #default="{ row }">
            <el-tag v-for="point in row.weakPoints.slice(0, 3)" :key="point" type="info" size="small"
              style="margin-right: 32px;">
              {{ point }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </template>

    <template #rightBody>
      <div class="overview-section">
        <h4 class="overview-section-title">试卷总分</h4>
        <div class="score-area">
          <div ref="chartRef" class="score-chart"></div>
          <div class="chart-legend">
            <div class="legend-item">
              <span class="dot" style="background-color: #03BC96;"></span>
              <div class="legend-type">
                <span style="color: #03BC96">容易</span>
                <span class="legend-num">{{ difficultyStats?.easy || 0 }}分 (0%)</span>
              </div>
            </div>
            <div class="legend-item">
              <span class="dot" style="background-color: #1E77FA;"></span>
              <div class="legend-type">
                <span style="color: #1E77FA">中等</span>
                <span class="legend-num">{{ difficultyStats?.medium || 0 }}分 (0%)</span>
              </div>
            </div>
            <div class="legend-item">
              <span class="dot" style="background-color: #FD8F37;"></span>
              <div class="legend-type">
                <span style="color: #FD8F37">困难</span>
                <span class="legend-num">{{ difficultyStats?.hard || 0 }}分 (0%)</span>
              </div>
            </div>
          </div>
        </div>
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
              <span class="type-count">{{ item.count }}</span>
              <span class="type-score">{{ item.score }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="overview-section">
        <h4 class="overview-section-title">覆盖知识点（top5）</h4>
        <div class="knowledge-tags">
          <el-tag v-for="tag in coverKnowledge" :key="tag" type="info" size="small" class="knowledge-tag">
            {{ tag }}
          </el-tag>
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

.knowledge-table :deep(.el-table__body-wrapper .el-table__cell) {
  height: 46px;
  overflow: auto;
}

.knowledge-table :deep(.el-table__body-wrapper .el-table__cell .cell) {
  font-size: 14px !important;
}

.knowledge-table :deep(.el-table__header-wrapper th:first-child .cell),
.knowledge-table :deep(.el-table__body-wrapper td:first-child .cell) {
  margin-left: 22px;
}

.knowledge-table :deep(.el-table__header-wrapper th:nth-child(3) .cell),
.knowledge-table :deep(.el-table__body-wrapper td:nth-child(3) .cell),
.knowledge-table :deep(.el-table__header-wrapper th:nth-child(4) .cell),
.knowledge-table :deep(.el-table__body-wrapper td:nth-child(4) .cell) {
  text-align: center;
}


.student-avatar {
  vertical-align: middle;
  margin-right: 8px;
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  margin: 7px 6px;
}

.student-name {
  font-size: 14px;
  color: #000000;
  font-weight: 500;
  overflow: auto;
}

.student-table :deep(.el-table__header-wrapper .el-table__cell) {
  height: 46px;
  background-color: #F3F6FD;
  padding-left: 42px;
  color: #000000;
}

.student-table :deep(.el-table__body-wrapper .el-table__cell) {
  height: 46px;
  overflow: auto;
  padding-left: 42px;

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
    margin-bottom: 20px
  }

  .score-area {
    display: flex;
    align-items: center;
    gap: 12px;

    .score-chart {
      width: 217px;
      height: 217px;
      flex-shrink: 0;
    }

    .chart-legend {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 48px;
      padding-left: 70px;

      .legend-item {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        font-weight: 600;

        .dot {
          display: inline-block;
          width: 10px;
          height: 10px;
          border-radius: 50%;

        }

        .legend-type {
          display: flex;
          width: 100%;
          align-items: center;
          gap: 50px;

          .legend-num {
            font-size: 16px;
            font-weight: 600;
          }
        }
      }
    }
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
    min-height: 24px;
    margin-left: 30px;

    .knowledge-tag {
      padding: 4px 8px;
    }
  }
}
</style>
