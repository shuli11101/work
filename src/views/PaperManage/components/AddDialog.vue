<script setup>
import { ref, computed, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

import test from '@/assets/picture/test.png'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:visible'])

// 关闭组件
const handleClose = () => {
  emit('update:visible', false)
}

// 左侧 - 已选面板
const activeNames = ref([])
// 左侧 - 单元
const rawData = ref([
  {
    id: 1, name: '第一单元  时、分、秒',
    class: [{ id: 1, name: '课时一', content: '课时一内容' }, { id: 2, name: '课时二', content: '课时二内容' }]
  },
  {
    id: 2, name: '第二单元  一次函数',
    class: [{ id: 1, name: '课时一', content: '课时一内容' }, { id: 2, name: '课时二', content: '课时二内容' }]
  },
  {
    id: 3, name: '第三单元  加减法',
    class: [{ id: 1, name: '课时一', content: '课时一内容' }, { id: 2, name: '课时二', content: '课时二内容' }]
  }
])

// 左侧 - 单元选择框实现
const unitsList = ref(rawData.value.map(unit => ({
  ...unit,
  class: unit.class.map(c =>
    reactive({
      ...c,
      isChecked: false
    })
  ),
  get isChecked() {
    return this.class.every(c => c.isChecked)
  },
  set isChecked(val) {
    this.class.forEach(c => c.isChecked = val)
  },
  get indeterminate() {
    const some = this.class.some(c => c.isChecked)
    const every = this.class.every(c => c.isChecked)
    return some && !every
  },
})

))

// 右侧搜索栏
const filters = ref({
  type: '',
  difficulty: '',
  score: '',
})

// 题目数据
const questionData = ref([
  {
    id: 1,
    text: '甲、乙两车在同一直道上从同一地点同时出发，它们运动的位移x随时间/变化的关系如图所示，已知甲车由静止开始做匀加速直线运动，乙车做匀速直线运动，图线在5s末时相交，则下列说法不正确的是',
    options: [
      { label: 'A', text: '{a|a>-2}' },
      { label: 'B', text: '{a|a>-2}' },
      { label: 'C', text: '{a|a>-2}' },
      { label: 'D', text: '{a|a>-2}' },
    ],
    type: '单选题',
    difficulty: '中等',
  },
  {
    id: 2,
    text: '甲、乙两车在同一直道上从同一地点同时出发，它们运动的位移x随时间/变化的关系如图所示，已知甲车由静止开始做匀加速直线运动，乙车做匀速直线运动，图线在5s末时相交，则下列说法不正确的是',
    options: [
      { label: 'A', text: '{a|a>-2}' },
      { label: 'B', text: '{a|a>-2}' },
      { label: 'C', text: '{a|a>-2}' },
      { label: 'D', text: '{a|a>-2}' },
    ],
    type: '多选题',
    difficulty: '困难',
  },
  {
    id: 3,
    text: '甲、乙两车在同一直道上从同一地点同时出发，它们运动的位移x随时间/变化的关系如图所示，已知甲车由静止开始做匀加速直线运动，乙车做匀速直线运动，图线在5s末时相交，则下列说法不正确的是',
    options: [
      { label: 'A', text: '{a|a>-2}' },
      { label: 'B', text: '{a|a>-2}' },
      { label: 'C', text: '{a|a>-2}' },
      { label: 'D', text: '{a|a>-2}' },
    ],
    type: '单选题',
    difficulty: '简单',
  },
  {
    id: 4,
    text: '甲、乙两车在同一直道上从同一地点同时出发，它们运动的位移x随时间/变化的关系如图所示，已知甲车由静止开始做匀加速直线运动，乙车做匀速直线运动，图线在5s末时相交，则下列说法不正确的是',
    options: [
      { label: 'A', text: '{a|a>-2}' },
      { label: 'B', text: '{a|a>-2}' },
      { label: 'C', text: '{a|a>-2}' },
      { label: 'D', text: '{a|a>-2}' },
    ],
    type: '填空题',
    difficulty: '中等',
  },
  {
    id: 5,
    text: '甲、乙两车在同一直道上从同一地点同时出发，它们运动的位移x随时间/变化的关系如图所示，已知甲车由静止开始做匀加速直线运动，乙车做匀速直线运动，图线在5s末时相交，则下列说法不正确的是',
    options: [
      { label: 'A', text: '{a|a>-2}' },
      { label: 'B', text: '{a|a>-2}' },
      { label: 'C', text: '{a|a>-2}' },
      { label: 'D', text: '{a|a>-2}' },
    ],
    type: '简答题',
    difficulty: '困难',
  },
])

// 已选题目
const selectedQuestions = computed(() => {
  let total = 0
  unitsList.value.forEach(unit => {
    unit.class.forEach(c => {
      if (c.isChecked) {
        total++
      }
    })
  })
  console.log('total', total)
  return total
})

// 表格选中行
const selectedRows = ref([])
const handleSelectionChange = (rows) => {
  selectedRows.value = rows
}

// 分页
const page = ref(1)
const pageSize = ref(5)
const total = ref(questionData.value.length)

const handlePageChange = () => {
  // TODO: 重新请求数据
}

// 确认添加
const handleConfirm = () => {
  ElMessageBox.confirm('确定添加12道题。添加后分数需要手动调整', '添加题型', {
    confirmBottomText: '确认',
    cancelButtonText: '取消',
    customClass: 'my-custom-dialog',
  })
}

// 题型选项
const typeOptions = [
  { label: '全部', value: '' },
  { label: '单选题', value: '单选题' },
  { label: '多选题', value: '多选题' },
  { label: '填空题', value: '填空题' },
  { label: '简答题', value: '简答题' },
]

const difficultyOptions = [
  { label: '全部', value: '' },
  { label: '简单', value: '简单' },
  { label: '中等', value: '中等' },
  { label: '困难', value: '困难' },
]
</script>

<template>
  <el-dialog :model-value="props.visible" @update:model-value="emit('update:visible', $event)" title="添加题目"
    width="1575px" style="height: 896px;" :show-close="true" :close-on-click-modal="false" class="add-question-dialog"
    top="5vh">
    <div class="dialog-body">
      <!-- 左侧 - 已选面板 -->
      <div class="left-sidebar">
        <div class="left-header">
          <el-input placeholder="搜索" class="sidebar-search" :prefix-icon="Search"></el-input>
          <el-button class="btn-search">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="14" cy="12" r="4" stroke="white" stroke-width="1.5" />
              <path d="M15 15L17 19" stroke="white" stroke-width="1.5" stroke-linecap="round" />
              <path d="M2 4H16" stroke="white" stroke-width="1.5" stroke-linecap="round" />
              <path d="M2 10H8" stroke="white" stroke-width="1.5" stroke-linecap="round" />
              <path d="M2 17H6" stroke="white" stroke-width="1.5" stroke-linecap="round" />
            </svg>
            查询
          </el-button>
        </div>
        <!-- 标题 -->
        <div class="header-title">
          教材目录
        </div>
        <div class="line"></div>
        <div class="sidebar-list">
          <el-collapse v-model="activeNames">
            <!-- 单元 -->
            <el-collapse-item v-for="unit in unitsList" :key="unit.id">
              <template #title>
                <div class="list-item">
                  <el-checkbox class="unit-checkbox" v-model="unit.isChecked" :indeterminate="unit.indeterminate"
                    @click.stop @change="(val) => $emit('unitChange', unit, val)">
                    {{ unit.name }}
                  </el-checkbox>
                </div>
              </template>
              <!-- 课时 -->
              <div v-for="classItem in unit.class" :key="classItem.id">
                <el-checkbox class="class-checkbox" v-model="classItem.isChecked" @click.stop>
                  {{ classItem.name }}
                </el-checkbox>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
        <div class="sidebar-footer">
          <div class="footer-card">
            <div class="footer-card-icon">
              <img :src="test" alt="图标" class="footer-icon" />
            </div>
            <div class="footer-card-info">
              <span class="footer-card-title">已选择：<em style="color:#075DFE;font-style:normal;">{{
                selectedQuestions }}</em>个课时</span>
              <span class="footer-card-desc">覆盖知识点:4个</span>
            </div>
          </div>
          <div class="footer-card-info-clear">
            清空选择
          </div>
        </div>
      </div>

      <!-- 右侧 顶部 -->
      <div class="right-content">
        <!-- 筛选栏 -->
        <div class="filter-bar">
          <div class="filter-item">
            <label class="filter-label">题型</label>
            <el-select v-model="filters.type" placeholder="请选择" style="width:199px">
              <el-option v-for="opt in typeOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
            </el-select>
          </div>
          <div class="filter-item">
            <label class="filter-label">难度</label>
            <el-select v-model="filters.difficulty" placeholder="请选择" style="width:127px">
              <el-option v-for="opt in difficultyOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
            </el-select>
          </div>
          <div class="filter-item">
            <label class="filter-label">分数</label>
            <el-input v-model="filters.score" placeholder="请输入" style="width:127px" />
          </div>
        </div>

        <!-- 右侧：题目列表 -->
        <div class="question-list">
          <el-table :data="questionData" style="width: 100%" @selection-change="handleSelectionChange"
            :header-cell-style="{ background: '#F6F8FE' }">
            <el-table-column min-width="300" class="question-table-column">
              <template #default="{ row }">
                <div class="q-header">
                  <el-checkbox v-model="row.isChecked" class="q-checkbox"></el-checkbox>
                  <div class="q-text">
                    {{ row.id }}.{{ row.text }}
                  </div>
                </div>
                <div class="q-options">
                  <span v-for="opt in row.options" :key="opt.label" class="q-option">
                    <span class="q-opt-label">{{ opt.label }}.</span>
                    <span>{{ opt.text }}</span>
                  </span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="题型" width="100">
              <template #default="{ row }">
                <el-button size="small" round>{{ row.type }}</el-button>
              </template>
            </el-table-column>
            <el-table-column label="难度" width="100">
              <template #default="{ row }">
                <el-button size="small" round>{{ row.difficulty }}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- 分页 -->

      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <div class="pagination-wrapper">
          <el-config-provider :locale="zhCn">
            <el-pagination v-model:current-page="page" v-model:page-size="pageSize" :total="total"
              layout="total, sizes, prev, pager, next, jumper" @current-change="handlePageChange"
              @size-change="handlePageChange" background />
          </el-config-provider>
        </div>
        <div class="dialog-btn">
          <el-button plain class="btn-cancel" @click="handleClose">取消</el-button>
          <el-button type="primary" class="btn-confirm" @click="handleConfirm">
            确认
          </el-button>
        </div>
      </div>
    </template>
  </el-dialog>

</template>

<style lang="scss" scoped>
.add-question-dialog {
  :deep(.el-dialog__header) {
    padding: 20px 24px 0;
    margin-bottom: 0;

    .el-dialog__title {
      font-size: 18px;
      font-weight: 600;
      color: #1A1A1A;
    }
  }

  :deep(.el-dialog__body) {
    padding: 16px 24px 0;
    height: calc(896px - 120px);
  }

  :deep(.el-dialog__footer) {
    padding: 16px 24px 24px;
  }
}

.dialog-body {
  display: flex;
  gap: 16px;
  height: 100%;
}

/* ===== 左侧面板 ===== */
.left-sidebar {
  width: 341px;
  flex-shrink: 0;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .left-header {
    display: flex;
    height: 10%;
    align-items: center;
    justify-content: center;
  }

  // 教材目录
  .header-title {
    margin: 10px;
    margin-bottom: 0;
    padding: 2px;
    width: max-content;
    color: #075DFE;
    font-weight: 600;
    border-bottom: 1px solid #075DFE;
    line-height: 24px;


  }

  .line {
    height: 1px;
    width: 100%;
    background: #E6E6E6;
  }
}

.sidebar-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 16px 12px;
  border-bottom: 1px solid #E6E6E6;
}

.sidebar-title {
  font-size: 16px;
  font-weight: 600;
  color: #1A1A1A;
}

.sidebar-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 22px;
  padding: 0 6px;
  background: #075DFE;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  border-radius: 11px;
}

.sidebar-search {
  margin: 12px 16px 0;
  width: auto !important;
  height: 60%;
  font-size: 16px;
}

.sidebar-search :deep(.el-input__wrapper) {
  border-radius: 6px;
  box-shadow: none !important;
  border: 1px solid #D9D9D9;
}

.btn-search {
  display: flex;
  align-items: center;
  gap: 2px;
  margin: 8px 16px;
  padding: 2px 8px;
  background: #075DFE;
  border: none;
  border-radius: 6px;
  color: #FFFFFF;
  font-family: 'PingFang SC', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 1;
  cursor: pointer;
  transition: opacity 0.2s;
  width: fit-content;
  margin-top: 20px;

  &:hover {
    opacity: 0.85;
    background: #075DFE;
  }

  &:active {
    opacity: 0.7;
  }
}

.sidebar-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px 16px;
}

.sidebar-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  border-bottom: 1px solid #F0F0F0;
}

.sidebar-item-num {
  font-size: 13px;
  font-weight: 500;
  color: #075DFE;
  white-space: nowrap;
}

.sidebar-item-text {
  font-size: 13px;
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sidebar-empty {
  text-align: center;
  color: #999;
  font-size: 14px;
  padding: 40px 0;
}

.sidebar-footer {
  padding: 12px 16px;
  border-top: 1px solid #E6E6E6;
}

.footer-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #F6F8FE;
  border: 1px solid #1E77FA;
  border-radius: 12px;
  height: 59px;
}

.footer-card-info-clear {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 12px;
  background: #ffffff;
  border: 1px solid #1E77FA;
  border-radius: 12px;
  color: #075DFE;
  margin-top: 12px;
  height: 26px;
}

.footer-card-icon {
  flex-shrink: 0;

  .footer-icon {
    width: 24px;
    height: 24px;
    object-fit: cover;
  }
}

.footer-card-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.footer-card-title {
  font-size: 14px;
  font-weight: 600;
  color: #1A1A1A;
  line-height: 20px;
}

.footer-card-desc {
  font-size: 12px;
  font-weight: 600;
  color: #666;
  line-height: 17px;
}

/* ===== 右侧内容 ===== */
.right-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.filter-bar {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 8px 0 0px;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.filter-label {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  white-space: nowrap;
}

.filter-bar :deep(.el-input__wrapper) {
  border-radius: 6px;
  box-shadow: none !important;
  border: 1px solid #D9D9D9;
  height: 36px;
}

.filter-bar :deep(.el-select .el-input__wrapper) {
  height: 36px;
}

/* ===== 题目列表 ===== */
.question-list {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  width: 100%;
}

.question-list :deep(.el-table .cell) {
  white-space: normal;
  word-break: break-word;
}



/* 表格内题目文本与选项 */
.q-header {
  display: flex;
  gap: 8px;
}

.q-text {
  font-family: 'Songti SC', serif;
  font-size: 16px;
  font-weight: 700;
  color: #000;
  line-height: 32px;
  letter-spacing: 0.05em;
  word-break: break-word;

  :deep(.el-checkbox__inner) {
    border-radius: 50%;
  }
}

.q-options {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 100px;
  margin-top: 8px;
}

.q-option {
  font-family: 'Songti SC', serif;
  font-size: 16px;
  font-weight: 700;
  color: #000;
  line-height: 22px;
  letter-spacing: 0.05em;
}

.q-opt-label {
  margin-right: 2px;
}

/* ===== 分页 ===== */
.pagination-wrapper {
  transform: scale(1.2);
  transform-origin: left center;
}

.pagination-wrapper :deep(.el-pagination.is-background .btn-prev.is-active),
.pagination-wrapper :deep(.el-pagination.is-background .btn-next.is-active) {
  background: #0059ff;
  color: #fff;
}

/* ===== 底部按钮 ===== */
.dialog-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  width: 100%;
  height: 40px;
  margin-top: 80px;

  .dialog-btn {
    display: flex;
    align-items: center;
    gap: 12px;
  }
}

.btn-cancel {
  border: 1px solid #D6D7D9;
  color: #666;
  padding: 8px 24px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 5px;
  width: 80px;
  height: 40px;
}

.btn-confirm {
  background: #075DFE;
  border-color: #075DFE;
  border-radius: 8px;
  padding: 8px 24px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 5px;
  width: 80px;
  height: 40px;
}

/* ===== 左侧面板 - 圆形复选框 ===== */
/* 箭头移到左侧 */
.sidebar-list :deep(.el-collapse-item__header) {
  .el-collapse-item__arrow {
    order: -1;
    margin-right: 8px;
    font-size: 16px;
  }
}

.list-item {
  display: flex;
}

/* 单元复选框（圆形） */
.sidebar-list :deep(.el-checkbox.unit-checkbox) {
  .el-checkbox__input {
    .el-checkbox__inner {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      border: 2px solid #D9D9D9;
      background: #fff;
      transition: all 0.2s;

      &::after {
        content: '';
        width: 4px;
        height: 8px;
        border-color: #fff;
        border-width: 0 3px 3px 0;
        transform: rotate(45deg) scale(0.8);
        left: 5px;
        top: 1px;
      }
    }

    &.is-checked {
      .el-checkbox__inner {
        background: #075DFE;
        border-color: #075DFE;
      }
    }

    &.is-indeterminate {
      .el-checkbox__inner {
        background: #075DFE;
        border-color: #fff;


        &::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 8px;
          height: 2px;
          background: #ffffff;
        }

        &::after {
          display: none;
        }
      }
    }
  }
}

/* 课时复选框（圆形） */
.sidebar-list :deep(.el-checkbox.class-checkbox) {
  .el-checkbox__input {
    .el-checkbox__inner {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 2px solid #D9D9D9;
      background: #fff;
      transition: all 0.2s;

      &::after {
        content: '';
        width: 5px;
        height: 8px;
        border-color: #fff;
        border-width: 0 2px 2px 0;
        transform: rotate(45deg) scale(0.8);
        left: 4px;
        top: 0px;
      }
    }

    &.is-checked {
      .el-checkbox__inner {
        background: #075DFE;
        border-color: #075DFE;
      }
    }
  }
}
</style>

<style lang="scss">
.my-custom-dialog {
  width: 343px;
}

.my-custom-dialog .el-message-box__content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
}

.my-custom-dialog .el-message-box__btns {
  display: flex !important;
  justify-content: center !important;
  align-items: center;
  gap: 12px;
}

.my-custom-dialog .el-message-box__btns .el-button {
  margin-left: 0 !important;
}



.my-custom-dialog .el-message-box__title {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  color: #333333;
}
</style>
