<script setup>
import { getStudentList, getKnowledgeMastery } from '@/api/index.js'
import { computed, onMounted, ref } from 'vue'
import * as echarts from 'echarts'
import StepLayout from './StepLayout.vue'

const top10Data = [
  { name: '三角函数', rate: 62, distribution: '62%' },
  { name: '立体几何', rate: 68, distribution: '68%' },
  { name: '数列', rate: 71, distribution: '71%' },
  { name: '概率统计', rate: 75, distribution: '75%' },
  { name: '解析几何', rate: 78, distribution: '78%' },
  { name: '函数与导数', rate: 55, distribution: '55%' },
  { name: '平面向量', rate: 60, distribution: '60%' },
  { name: '不等式', rate: 65, distribution: '65%' },
  { name: '复数', rate: 80, distribution: '80%' },
  { name: '排列组合', rate: 73, distribution: '73%' },
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
        radius: ['35%', '65%'],
        avoidLabelOverlap: false,
        label: { show: false },
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
    @prev="$router.back()" @next="() => { }">
    <template #leftTopBody>
      <el-table :data="top10Data.slice(0, 5).sort((a, b) => a.rate - b.rate)" style="width: 100%" size="small" stripe>
        <el-table-column prop="name" label="知识点" min-width="100" />
        <el-table-column label="掌握度" min-width="140">
          <template #default="{ row }">
            <el-progress :percentage="row.rate" :stroke-width="5" :format="() => row.rate + '%'"
              :color="row.rate <= 65 ? '#f56c6c' : row.rate <= 75 ? '#e6a23c' : '#409eff'" />
          </template>
        </el-table-column>
        <el-table-column prop="distribution" label="班级学生分布" min-width="100" />
        <el-table-column label="操作" min-width="80">
          <template #default>
            <el-link type="primary" :underline="false">查看详情</el-link>
          </template>
        </el-table-column>
      </el-table>
    </template>

    <template #leftBottomBody>
      <el-table :data="sortStudentList" style="width: 100%">
        <el-table-column prop="checked" width="50">
          <template #default="{ row }">
            <el-checkbox v-model="row.checked" />
          </template>
        </el-table-column>
        <el-table-column prop="studentName" label="学生姓名">
          <template #default="{ row }">
            <el-avatar :size="24" style="margin-right: 8px">{{ row.name.charAt(0) }}</el-avatar>
            {{ row.name }}
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
              style="margin-right: 2px;">
              {{ point }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
      <div style="display: flex; padding: 8px; border-top: 1px solid #ebeef5;">
        <el-checkbox v-model="selectedAll">全选</el-checkbox>
        <div style="flex: 1; text-align: center; font-size: 15px;">已选择：{{ selectCount }}</div>
        <a href="#" @click.prevent="clearSelect" style="color:#00a1cc; text-decoration: none;">清空选择</a>
      </div>
    </template>

    <template #rightBody>
      <div class="overview-section">
        <h4 class="overview-section-title">试卷总分</h4>
        <div class="score-area">
          <div ref="chartRef" class="score-chart"></div>
          <div class="chart-legend">
            <div class="legend-item">
              <span class="dot dot-easy"></span>
              <span>简单</span>
            </div>
            <div class="legend-item">
              <span class="dot dot-medium"></span>
              <span>中等</span>
            </div>
            <div class="legend-item">
              <span class="dot dot-hard"></span>
              <span>困难</span>
            </div>
          </div>
        </div>
      </div>
      <div class="overview-section">
        <h4 class="overview-section-title">题型分布</h4>
        <div class="type-grid">
          <div class="type-item">
            <span class="type-label">单选</span>
            <span>--题</span>
            <span class="type-count">--分</span>
          </div>
          <div class="type-item">
            <span class="type-label">多选</span>
            <span>--题</span>
            <span class="type-count">--分</span>
          </div>
          <div class="type-item">
            <span class="type-label">填空</span>
            <span>--题</span>
            <span class="type-count">--分</span>
          </div>
          <div class="type-item">
            <span class="type-label">简答</span>
            <span>--题</span>
            <span class="type-count">--分</span>
          </div>
        </div>
      </div>
      <div class="overview-section">
        <h4 class="overview-section-title">覆盖知识点top5</h4>
        <div class="knowledge-tags">
          <el-tag v-for="tag in coverKnowledge" :key="tag" type="info" size="small" style="margin: 5px;">
            {{ tag }}
          </el-tag>
        </div>
      </div>
    </template>
  </StepLayout>
</template>

<style lang="scss" scoped>
.overview-section {
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }

  .overview-section-title {
    margin: 0 0 8px 0;
    font-size: 16px;
    font-weight: 600;
    line-height: 24px;
    color: #1F2329;
    padding-left: 8px;
    border-left: 3px solid #409eff;
  }

  .score-area {
    display: flex;
    align-items: center;
    gap: 12px;

    .score-chart {
      width: 200px;
      height: 200px;
      flex-shrink: 0;
    }

    .chart-legend {
      display: flex;
      flex-direction: column;
      gap: 8px;

      .legend-item {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 13px;
        color: #666666;

        .dot {
          display: inline-block;
          width: 10px;
          height: 10px;
          border-radius: 50%;

          &-easy {
            background: #409eff;
          }

          &-medium {
            background: #e6a23c;
          }

          &-hard {
            background: #f56c6c;
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
      background: #f5f7fa;
      border-radius: 6px;

      .type-label {
        font-size: 14px;
        color: #333333;
      }

      .type-count {
        font-size: 14px;
        font-weight: 600;
        color: #1F2329;
      }
    }
  }

  .knowledge-tags {
    min-height: 24px;
  }
}
</style>
