<script setup>
import { getStudentList } from '@/api/index.js'
import { computed, onMounted, ref } from 'vue';

// 临时数据
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

// 获取学生
const studentList = ref([])
const sortStudentList = computed(() => {
  const l = [...studentList.value]
  l.sort((a, b) => a.mastery - b.mastery)
  return l
})
const getStudent = async () => {
  try {
    const res = await getStudentList()
    if (res.code === 200) {
      console.log(res)
      studentList.value = res.list
    }
  } catch (error) {
    console.error('获取学生列表失败:', error)
  }
}

onMounted(() => {
  // 获取top10学生
  getStudent()
})

</script>

<template>
  <div class="select-object">
    <!-- 标题 -->
    <h2 class="page-title">试卷自动组卷</h2>

    <!-- 步骤条 -->
    <div class="steps">
      <div class="step active">
        <span class="step-num">1</span>
        <div class="step-text">
          <span class="step-label">基础信息</span>
          <span class="step-status">请填写试卷基础信息</span>
        </div>
      </div>
      <div class="step-line"></div>
      <div class="step active">
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

    <!-- 卡片区域 -->
    <el-row :gutter="12" class="cards-row">
      <!-- 左侧两列卡片 -->
      <el-col :span="16">
        <el-row :gutter="0" class="left-cards">
          <el-col :span="24" class="card-wrapper">
            <el-card class="weak-card">
              <template #header>
                <span class="card-title">班级整体薄弱top10</span>
              </template>
              <el-table :data="top10Data.slice(0, 5).sort((a, b) => a.rate - b.rate)" style="width: 100%" size="small"
                stripe>
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
            </el-card>
          </el-col>
          <el-col :span="24" class="card-wrapper">
            <el-card class="weak-card">
              <template #header>
                <span class="card-title">学生薄弱分布top10</span>
              </template>
              <el-table :data="sortStudentList.slice(0, 10)" style="width: 100%;min-height: 600px">
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
                  <template #default='{ row }'>
                    <el-tag v-if="row.mastery <= 50" style="background-color: #feeaea; color: red">薄弱</el-tag>
                    <el-tag v-else-if="row.mastery <= 60" style="background-color: #fffecc; color: #e6c240">一般</el-tag>
                    <el-tag v-else style="background-color: #d6ffcd; color: green">良好</el-tag>
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
            </el-card>
          </el-col>
        </el-row>
      </el-col>

      <!-- 右侧卡片 -->
      <el-col :span="8">
        <el-card class="overview-card">
          <template #header>
            <span class="card-title">试卷出题内容概览</span>
          </template>
          <div class="card-body-placeholder" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.select-object {
  padding: 12px;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  overflow: hidden;
}

.page-title {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.steps {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 8px;
}

.step {
  display: flex;
  align-items: center;
  gap: 6px;
}

.step-text {
  display: flex;
  flex-direction: column;
  gap: 0px;
}

.step-status {
  font-size: 10px;
  color: #909399;
}

.step-num {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #dcdfe6;
  color: #fff;
  font-size: 14px;
  font-weight: bold;
}

.step.active .step-num {
  background: #075dfe;
}

.step-label {
  font-size: 14px;
  color: #909399;
}

.step.active .step-label {
  color: #0080ff;
  font-weight: 500;
}

.step-line {
  width: 40px;
  height: 1px;
  background: #004cff;
}

.cards-row {
  flex: 1;
}

.left-cards {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.card-wrapper {
  flex: 1;
}

.card-wrapper+.card-wrapper {
  margin-top: 8px;
}

.weak-card,
.overview-card {
  height: 100%;
  overflow: hidden;
}

.weak-card :deep(.el-card__body),
.overview-card :deep(.el-card__body) {
  height: calc(100% - 40px);
  overflow: auto;
  padding: 8px;
}

.weak-card :deep(.el-card__header),
.overview-card :deep(.el-card__header) {
  border-bottom: 0;
  padding: 6px 16px;
}

.card-body-placeholder {
  height: 100%;
  min-height: 160px;
}

.student-card :deep(.el-table__body-wrapper) {
  overflow-y: auto;
  flex: 1;
}

.weak-card :deep(.el-table .el-table__cell) {
  padding: 2px 0;
}

.card-title {
  font-size: 15px;
  font-weight: 600;
  color: #0055ff;
}

.overview-card {
  height: 100%;
}
</style>
