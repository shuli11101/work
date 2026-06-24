<script setup>
import { computed, ref } from 'vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import router from '@/router'
import ExamOverview from '@/components/ExamOverview.vue'
import page1 from '@/assets/picture/page/Page_1_docsmall.com.jpg'
import page2 from '@/assets/picture/page/Page_2_docsmall.com.jpg'
import page3 from '@/assets/picture/page/Page_3_docsmall.com.jpg'
import page4 from '@/assets/picture/page/Page_4_docsmall.com.jpg'

// 统计卡片数据
const statCards = [
  {
    label: '试卷总数',
    value: '128',
    trend: 12,
    percent: '10.3%',
    trendUp: true,
    img: 'stat-total.svg',
  },
  {
    label: '已启用',
    value: '128',
    trend: 12,
    percent: '10.3%',
    trendUp: true,
    img: 'stat-enabled.svg',
  },
  {
    label: '已停用',
    value: '128',
    trend: 12,
    percent: '10.3%',
    trendUp: false,
    img: 'stat-disabled.svg',
  },
  {
    label: '本周新增',
    value: '128',
    trend: 12,
    percent: '10.3%',
    trendUp: true,
    img: 'stat-new.svg',
  },
]

// form数据收集
const searchText = ref('')
const formList = ref({
  school: '',
  stage: '',
  grade: '',
  subject: '',
  teacher: '',
  difficulty: '',
  type: '',
  purpose: '',
  createTime: []
})

// 表格数据
const tableData = ref([
  {
    name: '2024年秋季学期期末考试',
    school: '第一中学',
    stage: '高中',
    subject: '数学',
    type: '单元测试',
    difficulty: '中等',
    questionCount: 30,
    totalScore: 100,
    status: '已启用',
    createTime: '2024-01-15',
    useCount: 128,
  },
  {
    selected: false,
    name: '2024年秋季学期期末考试',
    school: '第一中学',
    stage: '高中',
    subject: '数学',
    type: '单元测试',
    difficulty: '中等',
    questionCount: 30,
    totalScore: 100,
    status: '已启用',
    createTime: '2024-01-15',
    useCount: 128,
  },
])

// 底部表格数据
const bottomTableData = ref([
  {
    name: '2024年秋季学期期末考试',
    subject: '数学',
    gradeName: '高中',
    totalScore: 100,
    createTime: '2024-01-15',
    createUser: '张三',
    purpose: '单元测试',
    status: '已启用',
  },
])

const handleQuery = () => {
  console.log('查询')
}

// 重置筛选
const handleReset = () => {
  formList.value = {
    school: '',
    stage: '',
    grade: '',
    subject: '',
    teacher: '',
    difficulty: '',
    type: '',
    purpose: ''
  }
}

// 已选数量
const selectedRows = ref([])
const handleSelectionChange = (rows) => {
  selectedRows.value = rows
}
const selectedCount = computed(() => selectedRows.value.length)

// 分页
const page = ref(1)
const pageSize = ref(10)
const total = ref(2)
const handlePageChange = () => {
  // TODO: 重新请求数据
}

// 预览
const previewVisible = ref(false)
const previewPages = ref([page1, page2, page3, page4])
const handlePreview = () => {
  previewVisible.value = true
}

// 编辑
const handleEdit = (row) => {
  console.log('编辑', row)
  router.push(`/paper-list/paper-edit/${row.name}`)
}
</script>

<template>
  <div class="paper-manage">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2 class="page-title">试卷列表</h2>
      <p class="page-desc">统一管理已生成的试卷，支持搜索、筛选、编辑、打印、启停、导出等操作。</p>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-row">
      <div class="stat-card" v-for="card in statCards" :key="card.label">
        <img :src="`/src/assets/picture/${card.img}`" class="stat-icon" />
        <div class="stat-info">
          <span class="stat-label">{{ card.label }}</span>
          <span class="stat-value">{{ card.value }}</span>
          <div class="stat-trend">
            <span class="trend-label">较上周</span>
            <svg class="trend-arrow" :style="{ transform: card.trendUp ? 'rotate(0)' : 'rotate(180deg)' }" width="16"
              height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 11L3 5H13L8 11Z" :fill="card.trendUp ? '#EE0000' : '#029D59'" />
            </svg>
            <span class="trend-value" :style="{ color: card.trendUp ? '#EE0000' : '#029D59' }">{{ card.trend }}</span>
            <span class="trend-percent">({{ card.percent }})</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 筛选区域 -->
    <div class="filter-section">
      <el-form :model="formList" label-position="left">
        <!-- 搜索框 + 第一行 -->
        <el-row :gutter="24" align="bottom" justify="space-between">
          <el-col :span="3">
            <el-form-item label="学校">
              <el-select v-model="formList.school" placeholder="请选择" style="width:100%">
                <el-option label="全部" value="" />
                <el-option label="第一中学" value="第一中学" />
                <el-option label="第二中学" value="第二中学" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="学段">
              <el-select v-model="formList.stage" placeholder="请选择" style="width:100%">
                <el-option label="全部" value="" />
                <el-option label="高中" value="高中" />
                <el-option label="初中" value="初中" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="年级">
              <el-select v-model="formList.grade" placeholder="请选择" style="width:100%">
                <el-option label="全部" value="" />
                <el-option label="高一" value="高一" />
                <el-option label="高二" value="高二" />
                <el-option label="高三" value="高三" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="科目">
              <el-select v-model="formList.subject" placeholder="请选择" style="width:100%">
                <el-option label="全部" value="" />
                <el-option label="语文" value="语文" />
                <el-option label="数学" value="数学" />
                <el-option label="英语" value="英语" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="教师">
              <el-select v-model="formList.teacher" placeholder="请选择" style="width:100%">
                <el-option label="全部" value="" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-input v-model="searchText" placeholder="搜索" class="search-input" clearable style="flex:1">
                <template #prefix>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="10" cy="10" r="7" stroke="#999" stroke-width="1.5" />
                    <path d="M15 15L21 21" stroke="#999" stroke-width="1.5" stroke-linecap="round" />
                  </svg>
                </template>
              </el-input>
              <el-button type="primary" class="btn-query" @click="handleQuery">查询</el-button>
              <el-button plain class="btn-reset" @click="handleReset">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 第二行 -->
        <el-row :gutter="24" style="margin-top: 10px;">
          <el-col :span="3" style="margin-right: 40px;">
            <el-form-item label="难度">
              <el-select v-model="formList.difficulty" placeholder="请选择" style="width:100%">
                <el-option label="全部" value="" />
                <el-option label="简单" value="简单" />
                <el-option label="中等" value="中等" />
                <el-option label="困难" value="困难" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3" style="margin-right: 40px;">
            <el-form-item label="题型">
              <el-select v-model="formList.type" placeholder="请选择" style="width:100%">
                <el-option label="全部" value="" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4" style="margin-right: 40px;">
            <el-form-item label="试卷用途">
              <el-select v-model="formList.purpose" placeholder="请选择" style="width:100%">
                <el-option label="全部" value="" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="入库时间">
              <el-date-picker v-model="formList.createTime" type="daterange" value-format="yyyy-MM-dd"
                range-separator="—" start-placeholder="开始日期" end-placeholder="结束日期" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <!-- 表格 -->
    <div class="table-section">
      <div class="table-header">
        <div class="table-header-title">已选{{ selectedCount }} 项</div>
        <div class="table-header-actions">
          <button class="btn-header btn-header-default">
            <img src="/src/assets/picture/batch-disable.svg" class="btn-header-icon" />
            批量停用</button>
          <button class="btn-header btn-header-primary">
            <img src="/src/assets/picture/batch-delete.svg" class="btn-header-icon" />
            批量删除</button>
        </div>
      </div>
      <el-table :data="bottomTableData" style="width: 100%" stripe @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="name" label="试卷名称" min-width="200" />
        <el-table-column prop="subject" label="科目名称" min-width="100" />
        <el-table-column prop="gradeName" label="年级名称" min-width="80" />
        <el-table-column prop="totalScore" label="总分" min-width="80" />
        <el-table-column prop="createTime" label="创建时间" min-width="100" />
        <el-table-column prop="createUser" label="创建人" min-width="80" />
        <el-table-column prop="purpose" label="试卷用途" min-width="80" />
        <el-table-column prop="status" label="试卷状态" min-width="80" />
        <el-table-column label="操作" min-width="200" fixed="right">
          <template #default="{ row }">
            <div class="action-links">
              <span class="action-link status-link" @click="row.status = '停用'">停用</span>
              <span class="action-link" @click="handlePreview">预览</span>
              <span class="action-link" @click="handleEdit(row)">编辑</span>
              <span class="action-link">下载</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="table-footer">
      <el-config-provider :locale="zhCn">
        <el-pagination v-model:current-page="page" v-model:page-size="pageSize" :page-sizes="[10, 20, 50, 100]"
          :total="total" layout="total, sizes, prev, pager, next, jumper" @current-change="handlePageChange"
          @size-change="handlePageChange" background />
      </el-config-provider>

    </div>
  </div>

  <ExamOverview :pages="previewPages" v-model:visible="previewVisible" />
</template>

<style lang="scss" scoped>
.paper-manage {
  padding: 24px;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.page-header {
  .page-title {
    margin: 0 0 8px 0;
    font-size: 24px;
    font-weight: 600;
    color: #1A1A1A;
    line-height: 34px;
  }

  .page-desc {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: #5A6382;
    line-height: 22px;
  }
}

/* ===== 统计卡片 ===== */
.stats-row {
  display: flex;
  gap: 16px;
}

.stat-card {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  width: 81px;
  height: 81px;
  flex-shrink: 0;
}

.stat-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-label {
  font-size: 16px;
  font-weight: 600;
  color: #1A1A1A;
  line-height: 22px;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #1A1A1A;
  line-height: 34px;
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 4px;
}

.trend-label {
  font-size: 14px;
  font-weight: 600;
  color: #999;
  line-height: 20px;
}

.trend-arrow {
  flex-shrink: 0;
}

.trend-value {
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
}

.trend-percent {
  font-size: 14px;
  font-weight: 600;
  color: #999;
  line-height: 20px;
}

/* ===== 筛选区域 ===== */
.filter-section {
  padding: 24px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.15);
}

.filter-section :deep(.el-form-item__label) {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  font-family: 'PingFang SC', sans-serif;
}

.filter-section :deep(.el-input__wrapper) {
  border-radius: 6px;
  box-shadow: none !important;
  border: 1px solid #D9D9D9;
  height: 32px;
}

.filter-section :deep(.el-input__inner) {
  font-size: 14px;
  font-family: 'PingFang SC', sans-serif;
}

.filter-section :deep(.el-form-item__content) {
  gap: 8px;
}

.search-input :deep(.el-input__wrapper) {
  padding-left: 8px;
}

.search-input :deep(.el-input__prefix) {
  margin-right: 4px;
}

.filter-actions {
  display: flex;
  gap: 8px;
}

.filter-actions :deep(.el-form-item__content) {
  justify-content: flex-start;
}

.btn-query {
  background: #0F66F1;
  border-color: #0F66F1;
  border-radius: 8px;
  padding: 6px 20px;
  font-size: 14px;
  font-weight: 500;

}

:deep(.el-button) {
  margin-left: 1px;
}

.btn-reset {
  border: 1px solid #D6D7D9;
  color: #666;
  border-radius: 8px;
  padding: 6px 20px;
  font-size: 14px;
  font-weight: 500;
}

/* ===== 表格区域 ===== */
.table-section {
  flex: 1;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.15);
  overflow: auto;
}

.table-header {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 32px;
  padding: 12px 16px;
  background: #D0E3FF;
  border-radius: 12px 12px 0 0;
  color: #fff;
}

.table-header-title {
  font-size: 16px;
  font-weight: 600;
  line-height: 32px;
  color: #075DFE;
}

.table-header-actions {
  display: flex;
  gap: 8px;
}

.btn-header {
  height: 32px;
  padding: 0 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  line-height: 32px;
  transition: opacity 0.2s;
}

.btn-header:hover {
  opacity: 0.85;
}

.btn-header-primary {
  height: auto;
  padding: 2px 8px;
  line-height: normal;
  background: #FEEFEF;
  color: #EF0606;
  border: 1px solid rgba(239, 6, 6, 0.6);
}

.btn-header-default {
  height: auto;
  padding: 2px 8px;
  line-height: normal;
  background: #FEF5E5;
  color: #FD8103;
  border: 1px solid rgba(254, 152, 23, 0.6);
}

.btn-header-icon {
  width: 24px;
  height: 24px;
  vertical-align: middle;
}

.table-section :deep(.el-table) {
  margin: 0 16px 16px;
  width: calc(100% - 32px) !important;
}

.table-footer {
  display: flex;
  justify-content: flex-start;
  padding: 0 16px 16px;
}

.action-links {
  display: flex;
  gap: 16px;
  white-space: nowrap;
}

.action-link {
  font-size: 14px;
  font-weight: 600;
  color: #075DFE;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    text-decoration: underline;
  }
}

.status-link {
  color: #FD8103;
}
</style>
