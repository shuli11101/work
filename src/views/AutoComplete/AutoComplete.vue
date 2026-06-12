<script setup>
import { ref, onMounted, onUnmounted, reactive } from 'vue'

import { useRouter } from 'vue-router'
import { Check } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import StepProgress from '@/components/StepProgress.vue'
import spriteImage1 from '../../assets/picture/001-removebg-preview.png'
import spriteImage2 from '../../assets/picture/002-removebg-preview.png'
import spriteImage3 from '../../assets/picture/003-removebg-preview.png'
import spriteImage4 from '../../assets/picture/004-removebg-preview.png'
import spriteImage5 from '../../assets/picture/005-removebg-preview.png'
import dayjs from 'dayjs'



const spriteImages = [spriteImage1, spriteImage2, spriteImage3, spriteImage4, spriteImage5]

const router = useRouter()

// 功能卡片数据
const features = [
  { title: '靶向补弱', description: '基于学情数据，针对薄弱知识点智能组卷，精准提升', iconIndex: 0, backgroundColor: '#f3f7fd' },
  { title: '分层作业', description: '根据学生水平分层出题，因材施教，提高效率', iconIndex: 1, backgroundColor: '#f2fdf9' },
  { title: '单元复习', description: '聚焦单元知识点覆盖，巩固学习成果，提升效率', iconIndex: 2, backgroundColor: '#fef8f3' },
  { title: '单元冲刺', description: '模拟真是考试环境，提升应试能力，冲刺高分', iconIndex: 3, backgroundColor: '#f9f6ff' },
  { title: '自定义组合', description: '自由配置题目策略，满足个性化需求', iconIndex: 4, backgroundColor: '#f5f9ff' },
]

// 临时数据
// 学段与可选年级的映射
const gradeMap = {
  '小学':
    [{ label: '一年级', value: '一年级', key: '一年级' },
    { label: '二年级', value: '二年级', key: '二年级' },
    { label: '三年级', value: '三年级', key: '三年级' },
    { label: '四年级', value: '四年级', key: '四年级' },
    { label: '五年级', value: '五年级', key: '五年级' },
    { label: '六年级', value: '六年级', key: '六年级' }],
  '初中':
    [{ label: '初一', value: '初一', key: '初一' },
    { label: '初二', value: '初二', key: '初二' },
    { label: '初三', value: '初三', key: '初三' }],
  '高中':
    [{ label: '高一', value: '高一', key: '高一' },
    { label: '高二', value: '高二', key: '高二' },
    { label: '高三', value: '高三', key: '高三' },
    { label: '高四', value: '高四', key: '高四' }]
};

// 学段与可选科目的映射
const subjectMap = {
  '小学':
    [{ label: '语文', value: '语文', key: '语文' },
    { label: '数学', value: '数学', key: '数学' },
    { label: '英语', value: '英语', key: '英语' },
    { label: '科学', value: '科学', key: '科学' }],
  '初中':
    [{ label: '语文', value: '语文', key: '语文' },
    { label: '数学', value: '数学', key: '数学' },
    { label: '英语', value: '英语', key: '英语' },
    { label: '物理', value: '物理', key: '物理' },
    { label: '化学', value: '化学', key: '化学' },
    { label: '生物', value: '生物', key: '生物' },
    { label: '历史', value: '历史', key: '历史' },
    { label: '地理', value: '地理', key: '地理' },
    { label: '政治', value: '政治', key: '政治' }],
};

// 班级
const classes = [
  { label: '一班', value: '一班', key: '一班' },
  { label: '二班', value: '二班', key: '二班' },
  { label: '三班', value: '三班', key: '三班' },
  { label: '四班', value: '四班', key: '四班' },
  { label: '五班', value: '五班', key: '五班' },
  { label: '六班', value: '六班', key: '六班' },
]

// 教材
const textBooksMap = [
  { label: '教材1', value: '教材1', key: '教材1' },
  { label: '教材2', value: '教材2', key: '教材2' },
  { label: '教材3', value: '教材3', key: '教材3' },
  { label: '教材4', value: '教材4', key: '教材4' },
]

// 章节范围
const chapterRangeMap = [
  { label: '1-10', value: '1-10', key: '1-10' },
  { label: '11-20', value: '11-20', key: '11-20' },
  { label: '21-30', value: '21-30', key: '21-30' },
  { label: '31-40', value: '31-40', key: '31-40' },
]

// 试卷名称
const paperNameMap = [
  { label: '试卷1', value: '试卷1', key: '试卷1' },
  { label: '试卷2', value: '试卷2', key: '试卷2' },
  { label: '试卷3', value: '试卷3', key: '试卷3' },
  { label: '试卷4', value: '试卷4', key: '试卷4' },
]

// 总分
const totalScore = [
  { label: '80分', value: '80分', key: '80分' },
  { label: '100分', value: '100分', key: '100分' },
  { label: '120分', value: '120分', key: '120分' },
  { label: '150分', value: '150分', key: '150分' },
]

// 难易度
const difficulty = [
  { label: '简单', value: '简单', key: '简单' },
  { label: '中等', value: '中等', key: '中等' },
  { label: '困难', value: '困难', key: '困难' },
]

// 试卷核心作用
const corePurpose = ref('')
function selectPurpose(item) {
  corePurpose.value = corePurpose.value?.title === item.title ? null : item
}

// 表单收集数据
const baseFormRef = ref(null)
const baseForm = reactive({
  levelSubmit: '',
  gradeSubmit: '',
  subjectSubmit: '',
  classSubmit: '',
  textbookSubmit: '',
  chapterRangeSubmit: '',
  paperNameSubmit: '',
  paperUseSubmit: '',
})
const baseRules = reactive({
  levelSubmit: [{ required: true, message: '请选择学段', trigger: 'click' }],
  gradeSubmit: [{ required: true, message: '请选择年级', trigger: 'click' }],
  subjectSubmit: [{ required: true, message: '请选择科目', trigger: 'click' }],
  classSubmit: [{ required: true, message: '请选择班级', trigger: 'click' }],
  textbookSubmit: [{ required: true, message: '请选择教材', trigger: 'click' }],
  chapterRangeSubmit: [{ required: true, message: '请选择章节范围', trigger: 'click' }],
  paperNameSubmit: [{ required: true, message: '请输入试卷名称', trigger: 'blur' }],
  paperUseSubmit: [{ required: true, message: '请选择试卷用途', trigger: 'click' }],
})

const ruleFormRef = ref(null)
const ruleForm = reactive({
  totalScoreSubmit: '',
  difficultySubmitSubmit: '',
  sameTypeSubmit_first: true,
  sameTypeSubmit_second: false,
  avoidRepeatSubmit_first: true,
  avoidRepeatSubmit_second: false,
})
const ruleRules = reactive({
  totalScoreSubmit: [{ required: true, message: '请输入总分', trigger: 'blur' }],
  difficultySubmitSubmit: [{ required: true, message: '请选择难度', trigger: 'click' }],
  sameTypeSubmit: [{ required: true, message: '请选择同题型连续出题', trigger: 'change' }],
  avoidRepeatSubmit: [{ required: true, message: '请选择避免相同知识点', trigger: 'change' }],
})

// 点击下一步
const handleSubmit = async () => {

  // await baseFormRef.value.validate()
  // await ruleFormRef.value.validate()
  // 如果是靶向补弱
  // 提交表单数据
  if (corePurpose.value?.title === '靶向补弱') {
    router.push('/auto-complete/select-object')
  } else if (corePurpose.value?.title === '单元复习') {
    router.push('/auto-complete/unit-review')
  }
  console.log('下一步')
}

// 图表
// 临时数据
const top5Data = [
  { rank: 1, name: '三角函数', rate: '62%' },
  { rank: 2, name: '立体几何', rate: '68%' },
  { rank: 3, name: '数列', rate: '71%' },
  { rank: 4, name: '概率统计', rate: '75%' },
  { rank: 5, name: '解析几何', rate: '78%' },
]

const chartRef = ref(null)
let chartInstance = null

const chartOption = {
  tooltip: { trigger: 'item' },
  series: [{
    type: 'pie',
    radius: ['65%', '85%'],
    center: ['50%', '50%'],
    avoidLabelOverlap: false,
    label: {
      show: true,
      position: 'center',
      formatter: '{a|45}\n{b|总人数}',
      rich: {
        a: { fontSize: 40, fontWeight: 600, lineHeight: 44, color: '#000000' },
        b: { fontSize: 18, fontWeight: 600, lineHeight: 24, color: '#5A6382' }
      }
    },
    emphasis: { scale: false },
    data: [
      { value: 75, name: '优秀', itemStyle: { color: '#409eff' } },
      { value: 50, name: '良好', itemStyle: { color: '#67c23a' } },
      { value: 40, name: '中等', itemStyle: { color: '#e6a23c' } },
      { value: 35, name: '待提高', itemStyle: { color: '#f56c6c' } },
    ]
  }]
}

// 班级薄弱知识点更新时间
const updateTime = ref('')

onMounted(() => {
  // 初始化班级时间
  updateTime.value = dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')
  // 初始化图表
  if (chartRef.value) {
    chartInstance = echarts.init(chartRef.value)
    chartInstance.setOption(chartOption)
  }
})

onUnmounted(() => {
  chartInstance?.dispose()
})
</script>

<template>
  <svg width="0" height="0" style="position: absolute; visibility: hidden;">
    <defs>
      <linearGradient id="orangeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#fdc151" />
        <stop offset="100%" stop-color="#ffb03f" />
      </linearGradient>
      <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#c8b3ff" />
        <stop offset="100%" stop-color="#ae9cff" />
      </linearGradient>
      <linearGradient id="blueGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#3B82F6" />
        <stop offset="100%" stop-color="#93C5FD" />
      </linearGradient>
    </defs>
  </svg>
  <div class="home">
    <div class="header-content">
      <h2 class="title">AI智能组卷</h2>
      <p class="subtitle">基于人工智能技术，根据知识点和难度自动生成高质量试卷</p>
    </div>
    <el-main class="home-main">
      <div class="card-layout">
        <div class="left-cards">
          <!-- 顶部：功能选择 -->
          <el-card class="card top-card" shadow="hover">
            <div class="feature-list">
              <div @click="selectPurpose(item)" v-for="item in features" :key="item.title" class="feature-item"
                :class="{ selected: corePurpose?.title === item.title }"
                :style="{ backgroundColor: item.backgroundColor }">
                <div class="sprite-icon" :style="{ backgroundImage: `url(${spriteImages[item.iconIndex]})` }"></div>
                <div class="feature-info">
                  <h3 class="feature-title">{{ item.title }}</h3>
                  <p class="feature-description">{{ item.description }}</p>
                </div>
                <div class="select-circle" :class="{ checked: corePurpose?.title === item.title }">
                  <el-icon v-if="corePurpose?.title === item.title" :size="12" color="#fff">
                    <Check />
                  </el-icon>
                </div>
              </div>
            </div>
          </el-card>
          <!-- 底部：表单 -->
          <el-card class="card form-card" shadow="hover">
            <div class="form-container">
              <!-- 步骤 -->
              <StepProgress :active="1" />

              <div class="divider"></div>

              <!-- 基础信息设置 -->
              <div class=" section-header">
                <span class="section-bar"></span>
                <h4 class="section-title">基础信息设置</h4>
              </div>
              <el-form ref="baseFormRef" class="form-grid" label-position="top" :model="baseForm" :rules="baseRules">
                <el-form-item label="学段" prop="levelSubmit">
                  <el-select :teleported="false" placeholder="请选择" v-model="baseForm.levelSubmit">
                    <el-option label="小学" value="小学" key="小学"></el-option>
                    <el-option label="初中" value="初中" key="初中"></el-option>
                    <el-option label="高中" value="高中" key="高中"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="年级" prop="gradeSubmit">
                  <el-select :teleported="false" placeholder="请选择" v-model="baseForm.gradeSubmit">
                    <el-option v-for="item in gradeMap[baseForm.levelSubmit]" :key="item.key" :label="item.label"
                      :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="学科" prop="subjectSubmit">
                  <el-select :teleported="false" placeholder="请选择" v-model="baseForm.subjectSubmit">
                    <el-option v-for="item in subjectMap[baseForm.levelSubmit]" :key="item.key" :label="item.label"
                      :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="选择班级" prop="classSubmit">
                  <el-select :teleported="false" placeholder="请选择" v-model="baseForm.classSubmit">
                    <el-option v-for="item in classes" :key="item.key" :label="item.label"
                      :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="教材" prop="textbookSubmit">
                  <el-select :teleported="false" placeholder="请选择" v-model="baseForm.textbookSubmit">
                    <el-option v-for="item in textBooksMap" :key="item.key" :label="item.label"
                      :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="章节范围" prop="chapterRangeSubmit">
                  <el-select :teleported="false" placeholder="请选择" v-model="baseForm.chapterRangeSubmit">
                    <el-option v-for="item in chapterRangeMap" :key="item.key" :label="item.label"
                      :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="试卷名称" prop="paperNameSubmit">
                  <el-select :teleported="false" placeholder="请选择" v-model="baseForm.paperNameSubmit">
                    <el-option v-for="item in paperNameMap" :key="item.key" :label="item.label"
                      :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="试卷用途" prop="paperUseSubmit">
                  <el-input placeholder="请输入" v-model="baseForm.paperUseSubmit" />
                </el-form-item>
              </el-form>

              <!-- 试卷规则设置 -->
              <div class="rule-section">
                <h4 class="rule-title">试卷规则设置</h4>
                <div class="rule-body">
                  <div class="rule-item">
                    <label>总分</label>
                    <el-select :teleported="false" placeholder="请选择" v-model="ruleForm.totalScoreSubmit"
                      class="rule-select">
                      <el-option v-for="item in totalScore" :key="item.key" :label="item.label"
                        :value="item.value"></el-option>
                    </el-select>
                  </div>
                  <div class="rule-divider"></div>
                  <div class="rule-item">
                    <label>题目难易度</label>
                    <el-select :teleported="false" class="difficulty-select" placeholder="请选择"
                      v-model="ruleForm.difficultySubmitSubmit">
                      <el-option v-for="item in difficulty" :key="item.key" :label="item.label"
                        :value="item.value"></el-option>
                    </el-select>
                  </div>
                  <div class="rule-divider"></div>
                  <div class="rule-item">
                    <label style="text-align: center;">同题型连续出题</label>
                    <el-switch v-model="ruleForm.sameTypeSubmit_first" :active-value="true" :inactive-value="false" />
                    <el-switch v-model="ruleForm.sameTypeSubmit_second" :active-value="true" :inactive-value="false" />
                  </div>
                  <div class="rule-divider"></div>
                  <div class="rule-item">
                    <label style="text-align: center;">避免重复知识点</label>
                    <el-switch v-model="ruleForm.avoidRepeatSubmit_first" :active-value="true"
                      :inactive-value="false" />
                    <el-switch v-model="ruleForm.avoidRepeatSubmit_second" :active-value="true"
                      :inactive-value="false" />
                  </div>
                </div>
              </div>

              <!-- 下一步 -->
              <div class="form-footer">
                <el-button class="btn-next" @click="handleSubmit">下一步</el-button>
              </div>
            </div>
          </el-card>
        </div>
        <!-- 右侧 -->
        <el-card class="card card-right" shadow="hover">
          <div class="right-content">
            <div class="right-header">
              <span class="right-header-bar"></span>
              <h4 class="right-title">班级学情概览</h4>
            </div>

            <div class="stats-overview">
              <div ref="chartRef" class="chart-container"></div>
              <div class="chart-legend">
                <div class="legend-item">
                  <span class="legend-dot dot-excellent"></span>
                  <span class="legend-label" style="color: #03BC96">优秀</span>
                  <span class="legend-count">8人（18%）</span>
                </div>
                <div class="legend-item">
                  <span class="legend-dot dot-good"></span>
                  <span class="legend-label" style="color: #1E77FA">良好</span>
                  <span class="legend-count">14人（31%）</span>
                </div>
                <div class="legend-item">
                  <span class="legend-dot dot-medium"></span>
                  <span class="legend-label" style="color: #FD8F37">中等</span>
                  <span class="legend-count">15人（33%）</span>
                </div>
                <div class="legend-item">
                  <span class="legend-dot dot-poor"></span>
                  <span class="legend-label" style="color: #FD7C9A">待提升</span>
                  <span class="legend-count">8人（18%）</span>
                </div>
              </div>
            </div>

            <div class="stats-row">
              <div class="stat-card">
                <div class="stat-label">班级平均掌握度</div>
                <div class="stat-value">62<span class="stat-unit">%</span></div>
                <div class="stat-compare">
                  <span class="compare-text">较上次</span>
                  <div class="compare-item">
                    <span class="compare-icon icon-up"></span>
                    <span class="compare-value compare-up">6%</span>
                  </div>
                </div>
              </div>
              <div class="stat-card">
                <div class="stat-label">平均正确率</div>
                <div class="stat-value">65<span class="stat-unit">%</span></div>
                <div class="stat-compare">
                  <span class="compare-text">较上次</span>
                  <div class="compare-item">
                    <span class="compare-icon icon-down"></span>
                    <span class="compare-value compare-down">6%</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="top5-header">
              <span class="right-header-bar"></span>
              <h4 class="right-title">班级薄弱知识点TOP5</h4>
              <span style="margin-left: auto; color: #999999; font-size: 12px;">更新于 {{ updateTime }}</span>
            </div>
            <el-table :data="top5Data" style="width: 100%" size="small" class="top5-table">
              <el-table-column prop="rank" label="排名" width="45" />
              <el-table-column prop="name" label="知识点" width="180" />
              <el-table-column prop="rate" label="掌握率" />
              <el-table-column prop="rate" label="未掌握" width="70" />
            </el-table>
          </div>
        </el-card>
      </div>
    </el-main>
  </div>
</template>

<style scoped lang="scss">
.home {
  padding: 6px;
  padding-top: 0;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.header-content {
  text-align: flex-start;
  margin-bottom: 4px;
}

.title {
  margin: 0 0 4px 0;
  font-size: 24px;
  font-weight: 600;
  line-height: 32px;
  color: #1F2329;
}

.subtitle {
  margin: 0;
  font-size: 13px;
  font-weight: 400;
  line-height: 18px;
  color: #666666;
}

.home-main {
  flex: 1;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  padding: 10px;
  --el-main-padding: 0px;
}

:deep(.el-main) {
  padding: 0 !important;
}

.card-layout {
  height: 100%;
  display: flex;
  gap: 8px;
}

.left-cards {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.card {
  border-radius: 12px;
}

.top-card {
  width: 100%;
  height: 322px;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
}

.form-card {
  width: 100%;
  height: 537px;
  flex-shrink: 0;


  overflow :deep(.el-card__body) {
    padding-top: 10px;
  }
}

:deep(.el-card__body) {
  padding-top: 0px;
}

.card-right {
  width: 521px;
  height: 875px;
  flex-shrink: 0;
}

/* ========== 右侧内容 ========== */
.right-content {
  padding: 16px 16px 12px;
}

.right-header,
.top5-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.right-header-bar {
  width: 3px;
  height: 20px;
  background: #075dfe;
  border-radius: 2px;
  flex-shrink: 0;
}

.right-title {
  margin: 17px 10px;
  font-size: 18px;
  font-weight: 600;
  line-height: 20px;
  color: #075DFE;
}

/* 统计概览（饼图 + 总人数） */
.stats-overview {
  position: relative;
  display: flex;
  gap: 0;
  margin-bottom: 10px;
}

.chart-container {
  width: 217px;
  height: 217px;
  flex-shrink: 0;
}

.chart-legend {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 12px;
  padding-left: 12px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;

  &.dot-excellent {
    background: #03BC96;
  }

  &.dot-good {
    background: #1E77FA;
  }

  &.dot-medium {
    background: #FD8F37;
  }

  &.dot-poor {
    background: #FD7C9A;
  }
}

.legend-label {
  color: #1F2329;
  min-width: 48px;
}

.legend-count {
  color: #666666;
  font-size: 14px;
  margin-left: auto;
}

/* 统计卡片 */
.stats-row {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.stat-card {
  flex: 1;
  border: 1px solid #e6e6e6;
  border-radius: 8px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  gap: 4px;
  width: 230px;
  height: 170px;

  .stat-label {
    font-size: 18px;
    font-weight: 600;
    line-height: 100%;
    color: #5A6382;
  }

  .stat-value {
    font-size: 40px;
    font-weight: 600;
    color: #1F2329;
    line-height: 100%;
  }

  .stat-unit {
    font-size: 28px;
    font-weight: 600;
    color: #1F2329;
  }

  .stat-compare {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 4px;


    .compare-text {
      font-size: 18px;
      font-weight: 400;
      line-height: 16px;
      color: #5A6382;
    }

    .compare-item {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .compare-value {
      font-size: 12px;
      font-weight: 600;

      &.compare-up {
        color: #03bc1f;
      }

      &.compare-down {
        color: #ee0000;
      }
    }

    .compare-icon {
      display: flex;
      align-items: center;
    }

    .icon-up {
      background-image: url('@/assets/picture/up.png');
      width: 13px;
      height: 13px;
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
    }

    .icon-down {
      background-image: url('@/assets/picture/down.png');
      width: 13px;
      height: 13px;
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
    }
  }
}

/* 更新時間 */
.update-time {
  text-align: right;
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
  color: #999999;
  margin-top: 4px;
}

/* top5 表格行高 */
.top5-table {
  :deep(.el-table__row) {
    height: 45px;
  }
}

/* ========== 功能卡片 ========== */
.feature-list {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.sprite-icon {
  width: 80px;
  height: 80px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  flex-shrink: 0;
}

.feature-item {
  position: relative;
  z-index: 1;
  display: flex;
  max-width: 224px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 0 12px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  flex: 1;
  min-height: 274px;
  margin: 0;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  &.selected {
    outline: 2px solid #1e77fa;
  }
}

.feature-info {
  text-align: center;
}

.feature-title {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 600;
  color: #1A1A1A;
}

.feature-description {
  margin: 12px 12px;
  font-size: 14px;
  color: #333333;
  line-height: 22px;
}

.select-circle {
  position: absolute;
  bottom: 12px;
  right: 12px;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  border: 2px solid #dcdfe6;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &.checked {
    background: #075dfe;
    border-color: #075dfe;
  }
}

/* ========== 表单卡片 ========== */
.form-container {
  padding: 0 24px;
}

.divider {
  height: 1px;
  background: #d9d9d9;
  margin: 0 0 16px;
}

/* 基础信息设置标题 */
.section-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.section-bar {
  width: 3px;
  height: 24px;
  background: #075dfe;
  border-radius: 2px;
  flex-shrink: 0;
}

.section-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  color: #1F2329;
}

/* 表单网格 */
.form-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px 45px;
  margin-bottom: 16px;
}

:deep(.form-grid .el-form-item) {
  margin-bottom: 0;
}

:deep(.form-grid .el-form-item__label) {
  font-size: 14px;
  color: #333333;
  font-weight: 400;
  padding-bottom: 4px;
}

:deep(.form-grid .el-select),
:deep(.form-grid .el-input) {
  width: 100%;
}

/* 必填标点改为蓝色圆点 */
:deep(.el-form-item.is-required > .el-form-item__label::before) {
  content: '' !important;
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #075dfe;
  margin-right: 5px;
  margin-top: 6px;
  flex-shrink: 0;
}

/* 规则设置 */
.rule-section {
  background-image: url('@/assets/picture/rule-bg.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 16px;
}

.rule-title {
  margin: 0 0 10px;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  color: #fff;
}

.rule-body {
  display: flex;
  align-items: center;
  gap: 24px;
}

.rule-item {
  display: flex;
  flex-direction: column;
  gap: 0;
  color: #fff;
  flex: 1;
  align-items: center;

  label {
    font-size: 14px;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.9);
    text-align: left;
    width: 70%;
  }

  :deep(.el-select) .el-select__wrapper {
    background: rgba(255, 255, 255, 0.1);
    border: 0;
    color: #fff;
  }

  :deep(.el-select) .el-select__placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  :deep(.el-switch) {
    --el-switch-on-color: #075dfe;
    --el-switch-off-color: #64748b;
    margin-bottom: -8px;
    margin-top: 0;
  }

  :deep(.difficulty-select) {
    width: 155px;
  }

  :deep(.rule-select) {
    width: 155px;
  }

  :deep(.rule-select) .el-select__wrapper {
    height: 36px;
  }
}

.rule-divider {
  width: 1px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  flex-shrink: 0;
}

/* 下一步 */
.form-footer {
  display: flex;
  justify-content: center;
  padding: 0 0 8px;
}

.btn-next {
  width: 203px;
  height: 40px;
  background: #075dfe;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
}
</style>
