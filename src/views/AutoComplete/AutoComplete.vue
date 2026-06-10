<script setup>
import { ref, onMounted, onUnmounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { Target, Layers, BookOpen, Trophy, Puzzle } from '@icon-park/vue-next'
import { Check } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import BaseCard from './BaseCard.vue'
import RightCard from './RightCard.vue'

const router = useRouter()

// 功能卡片数据
const features = [
  { title: '靶向补弱', description: '基于学情数据，针对薄弱知识点智能组卷，精准提升', icon: Target, iconFill: '#4e9dff', backgroundColor: '#f3f7fd' },
  { title: '分层作业', description: '根据学生水平分层出题，因材施教，提高效率', icon: Layers, iconFill: '#00e1ca', backgroundColor: '#f2fdf9' },
  { title: '单元复习', description: '聚焦单元知识点覆盖，巩固学习成果，提升效率', icon: BookOpen, iconFill: 'url(#orangeGrad)', backgroundColor: '#fef8f3' },
  { title: '单元冲刺', description: '模拟真是考试环境，提升应试能力，冲刺高分', icon: Trophy, iconFill: 'url(#purpleGrad)', backgroundColor: '#f9f6ff' },
  { title: '自定义组合', description: '自由配置题目策略，满足个性化需求', icon: Puzzle, iconFill: 'url(#blueGrad)', backgroundColor: '#f5f9ff' },
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
  sameTypeSubmit: false,
  avoidRepeatSubmit: false,
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
  router.push('/auto-complete/select-object')
  // 提交表单数据
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
  legend: {
    orient: 'vertical',
    left: '55%',
    top: 'center',
    itemWidth: 10,
    itemHeight: 10,
    textStyle: { fontSize: 12, color: '#606266' },
    formatter: (name) => {
      const map = { '优秀': '优秀 (75人)', '良好': '良好 (50人)', '中等': '中等 (40人)', '待提高': '待提高 (35人)' }
      return map[name] || name
    }
  },
  series: [{
    type: 'pie',
    radius: ['55%', '75%'],
    center: ['30%', '50%'],
    avoidLabelOverlap: false,
    label: { show: true, position: 'center', formatter: '85%', fontSize: 18, fontWeight: 'bold', color: '#303133' },
    emphasis: { scale: false },
    data: [
      { value: 75, name: '优秀', itemStyle: { color: '#409eff' } },
      { value: 50, name: '良好', itemStyle: { color: '#67c23a' } },
      { value: 40, name: '中等', itemStyle: { color: '#e6a23c' } },
      { value: 35, name: '待提高', itemStyle: { color: '#f56c6c' } },
    ]
  }]
}

onMounted(() => {
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
      <p class="subtitle">基于人工智能技术</p>
    </div>
    <el-main class="home-main">
      <div class="card-layout">
        <div class="left-cards">
          <BaseCard>
            <div class="feature-list">
              <div @click="selectPurpose(item)" v-for="item in features" :key="item.title" class="feature-item"
                :class="{ selected: corePurpose?.title === item.title }"
                :style="{ backgroundColor: item.backgroundColor }">
                <el-icon :size="48" class="feature-icon">
                  <component :is="item.icon" theme="outline" :fill="item.iconFill" />
                </el-icon>
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
          </BaseCard>
          <BaseCard style="flex: 1;">
            <div class="form-container">
              <!-- 步骤 -->
              <div class="steps">
                <div class="step active">
                  <span class="step-num">1</span>
                  <div class="step-text">
                    <span class="step-label">基础信息</span>
                    <span class="step-status">请填写试卷基础信息</span>
                  </div>
                </div>
                <div class="step-line"></div>
                <div class="step">
                  <span class="step-num">2</span>
                  <div class="step-text">
                    <span class="step-label">选择对象</span>
                    <span class="step-status">选择考试对象并配置范围</span>
                  </div>
                </div>
                <div class="step-line"></div>
                <div class="step">
                  <span class="step-num">3</span>
                  <div class="step-text">
                    <span class="step-label">生成完成</span>
                    <span class="step-status">生成试卷并预览</span>
                  </div>
                </div>
              </div>

              <!-- 基础信息设置 -->
              <h4 class="section-title">基础信息设置</h4>
              <el-form ref="baseFormRef" class="form-grid" label-position="top" :model="baseForm" :rules="baseRules">
                <el-form-item label="学段" prop="levelSubmit">
                  <el-select placeholder="请选择" v-model="baseForm.levelSubmit">
                    <el-option label="小学" value="小学" key="小学"></el-option>
                    <el-option label="初中" value="初中" key="初中"></el-option>
                    <el-option label="高中" value="高中" key="高中"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="年级" prop="gradeSubmit">
                  <el-select placeholder="请选择" v-model="baseForm.gradeSubmit">
                    <el-option v-for="item in gradeMap[baseForm.levelSubmit]" :key="item.key" :label="item.label"
                      :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="学科" prop="subjectSubmit">
                  <el-select placeholder="请选择" v-model="baseForm.subjectSubmit">
                    <el-option v-for="item in subjectMap[baseForm.levelSubmit]" :key="item.key" :label="item.label"
                      :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="选择班级" prop="classSubmit">
                  <el-select placeholder="请选择" v-model="baseForm.classSubmit">
                    <el-option v-for="item in classes" :key="item.key" :label="item.label"
                      :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="教材" prop="textbookSubmit">
                  <el-select placeholder="请选择" v-model="baseForm.textbookSubmit">
                    <el-option v-for="item in textBooksMap" :key="item.key" :label="item.label"
                      :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="章节范围" prop="chapterRangeSubmit">
                  <el-select placeholder="请选择" v-model="baseForm.chapterRangeSubmit">
                    <el-option v-for="item in chapterRangeMap" :key="item.key" :label="item.label"
                      :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="试卷名称" prop="paperNameSubmit">
                  <el-select placeholder="请选择" v-model="baseForm.paperNameSubmit">
                    <el-option v-for="item in paperNameMap" :key="item.key" :label="item.label"
                      :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="试卷用途" prop="paperUseSubmit">
                  <el-input placeholder="请输入" v-model="baseForm.paperUseSubmit" />
                </el-form-item>
              </el-form>

              <!-- 试卷规则设置 -->
              <h4 class="section-title">试卷规则设置</h4>
              <el-form ref="ruleFormRef" class="rule-row" label-position="top" :model="ruleForm" :rules="ruleRules">
                <el-form-item label="总分" prop="totalScoreSubmit">
                  <el-select placeholder="请选择" style="width: 140px" v-model="ruleForm.totalScoreSubmit">
                    <el-option v-for="item in totalScore" :key="item.key" :label="item.label"
                      :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
                <div class="line"></div>
                <el-form-item label="题目难易度" prop="difficultySubmitSubmit">
                  <el-select placeholder="请选择" style="width: 140px" v-model="ruleForm.difficultySubmitSubmit">
                    <el-option v-for="item in difficulty" :key="item.key" :label="item.label"
                      :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
                <div class="line"></div>
                <el-form-item label="同题型连续出题" prop="sameTypeSubmit">
                  <el-switch v-model="ruleForm.sameTypeSubmit" active-value="true" inactive-value="false" />
                </el-form-item>
                <div class="line"></div>
                <el-form-item label="避免重复知识点" prop="avoidRepeatSubmit">
                  <el-switch v-model="ruleForm.avoidRepeatSubmit" active-value="true" inactive-value="false" />
                </el-form-item>
              </el-form>

              <!-- 下一步 -->
              <div class="form-footer">
                <el-button @click="handleSubmit" type="primary" style="margin-top: 20px;">下一步</el-button>
              </div>
            </div>
          </BaseCard>
        </div>
        <!-- 右侧 -->
        <RightCard title="班级学情概览" style="width: 360px; flex-shrink: 0;">
          <div class="right-content">
            <div ref="chartRef" class="chart-container"></div>

            <div class="stats-row">
              <div class="stat-card">
                <div class="stat-title">
                  <span class="stat-label">班级平均掌握度</span>
                </div>
                <span class="stat-value">62%</span>
                <span class="stat-compare">
                  <span class="compare-text">较上次</span>
                  <span class="compare-value up">10%</span>
                </span>
              </div>
              <div class="stat-card">
                <div class="stat-title">
                  <span class="stat-label">平均正确率</span>
                </div>
                <span class="stat-value">65%</span>
                <span class="stat-compare">
                  <span class="compare-text">较上次</span>
                  <span class="compare-value up">10%</span>
                </span>
              </div>
            </div>

            <h4 class="right-title" style="margin-top: 16px">班级薄弱知识点TOP5</h4>
            <el-table :data="top5Data" style="width: 100%" size="small" class="top5-table">
              <el-table-column prop="rank" label="排名" width="45" />
              <el-table-column prop="name" label="知识点" />
              <el-table-column prop="rate" label="掌握率" width="70" />
              <el-table-column prop="rate" label="未掌握" width="70" />
            </el-table>
          </div>
        </RightCard>
      </div>
    </el-main>
  </div>
</template>

<style scoped lang="scss">
.home {
  padding: 20px;
  padding-top: 0;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.header-content {
  text-align: flex-start;
  margin-bottom: 10px;
}

.title {
  margin: 0 0 8px 0;
  font-size: 24px;
  color: #303133;
}

.subtitle {
  margin: 0;
  font-size: 14px;
  color: #909399;
}

.home-main {
  flex: 1;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  padding: 20px;
  --el-main-padding: 0px;
}

:deep(.el-main) {
  padding: 0 !important;
}

.card-layout {
  height: 100%;
  display: flex;
  gap: 16px;
}

.left-cards {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
}

.right-content {
  padding: 0;
}

.right-title {
  margin: 0 0 12px 0;
  font-size: 15px;
  color: #303133;
  font-weight: 600;
}

:deep(.top5-table .el-table__header-wrapper th) {
  background-color: rgb(237, 252, 254);
}

.chart-container {
  width: 100%;
  height: 200px;
}

.stats-row {
  display: flex;
  gap: 12px;
  margin-top: 4px;
}

.stat-card {
  flex: 1;
  background: #f5f7fa;
  border-radius: 8px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;

  .stat-title {
    display: flex;
    align-items: flex-start;
    gap: 4px;
  }
}

.stat-value {
  font-size: 22px;
  font-weight: bold;
  color: #409eff;
}

.stat-label {
  font-size: 12px;
  color: #909399;
}

.stat-compare {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: 4px;

  .compare-text {
    font-size: 11px;
    color: #c0c4cc;
  }

  .compare-value {
    font-size: 11px;
    color: #c0c4cc;

    &.up::before {
      content: '↑ ';
      color: #67c23a;
    }

    &.down::before {
      content: '↓ ';
      color: #f56c6c;
    }
  }
}

.feature-list {
  display: flex;
  gap: 16px;
}

.feature-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 15px;
  border-radius: 8px;
  transition: background-color 0.2s;
  cursor: pointer;
  flex: 1;

  &:hover {
    background-color: #f5f7fa;
  }
}

.feature-icon {
  flex-shrink: 0;
  margin-top: 2px;
}

.select-circle {
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid #dcdfe6;
  background: #fff;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  &.checked {
    background: #409eff;
    border-color: #409eff;
  }
}

.feature-info {
  flex: 1;
  min-width: 0;
  text-align: center;

  .feature-title {
    margin: 0 0 14px 0;
    font-size: 20px;
    color: #303133;
  }

  .feature-description {
    font-size: 12px;
    line-height: 1.5;
  }
}

.form-container {
  padding: 8px;
}

.steps {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 13px;
  margin-bottom: 24px;
}

.step {
  display: flex;
  align-items: center;
  gap: 8px;
}

.step-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.step-status {
  font-size: 12px;
  color: #909399;
}

.step-num {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #dcdfe6;
  color: #fff;
  font-size: 20px;
  font-weight: bold;
}

.step.active .step-num {
  background: #075dfe;
}

.step-label {
  font-size: 20px;
  color: #909399;
}

.step.active .step-label {
  color: #409eff;
  font-weight: 500;
}

.step-line {
  width: 100px;
  height: 1px;
  background: #dcdfe6;
}

.section-title {
  margin: 0 0 16px 0;
  font-size: 16px;
  color: #303133;
  padding-left: 10px;
  border-left: 3px solid #409eff;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
  margin-bottom: 12px;
}

:deep(.form-grid .el-form-item) {
  margin-bottom: 0;
}

:deep(.form-grid .el-form-item__label) {
  font-size: 11px;
  color: #606266;
  padding-bottom: 2px;
}

:deep(.form-grid .el-select),
:deep(.form-grid .el-input) {
  width: 100%;
}

:deep(.form-grid .el-select .el-select__wrapper) {
  height: 28px;
  min-height: 28px;
}

:deep(.form-grid .el-input .el-input__wrapper) {
  height: 28px;
}

.rule-row {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;

  .line {
    width: 1px;
    height: 36px;
    background: #dcdfe6;
  }
}

:deep(.rule-row .el-form-item) {
  margin-bottom: 0;
}

:deep(.rule-row .el-form-item__label) {
  font-size: 12px;
  color: #303133;
  font-weight: 500;
  padding-bottom: 4px;
}

.form-footer {
  display: flex;
  justify-content: center;

  :deep(.el-button) {
    width: 30%;
  }
}
</style>
