<script setup>
import { getKnowledgeMastery } from '@/api/index.js'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Minus, Plus } from '@element-plus/icons-vue'
import ScorePie from '../../components/ScorePie.vue'
import StepLayout from '../../components/StepLayout.vue'

const router = useRouter()

const handleNext = () => {
  router.push('/auto-complete/done?from=custom')
}

// 题型
const itemList = ref([
  { title: '单选题', count: 0, difficulty: ['简单', '中等', '困难'], selectDifficulty: '简单' },
  { title: '多项题', count: 0, difficulty: ['简单', '中等', '困难'], selectDifficulty: '简单' },
  { title: '判断题', count: 0, difficulty: ['简单', '中等', '困难'], selectDifficulty: '简单' },
  { title: '填空题', count: 0, difficulty: ['简单', '中等', '困难'], selectDifficulty: '简单' },
  { title: '简答题', count: 0, difficulty: ['简单', '中等', '困难'], selectDifficulty: '简单' },
  { title: '解答题', count: 0, difficulty: ['简单', '中等', '困难'], selectDifficulty: '简单' },
])

// 年级
const selectedGrade = ref([
  { key: 'grade1', title: '一年级' },
  { key: 'grade2', title: '二年级' },
  { key: 'grade3', title: '三年级' },
  { key: 'grade4', title: '四年级' },
  { key: 'grade5', title: '五年级' },
  { key: 'grade6', title: '六年级' },
  { key: 'grade7', title: '七年级' },
  { key: 'grade8', title: '八年级' },
  { key: 'grade9', title: '九年级' },
])

// 右侧题型分布
const typeList = ref([
  { key: 'single', title: '单项选择题', count: '30题', score: '30分' },
  { key: 'multiple', title: '多项选择题', count: '30题', score: '30分' },
  { key: 'blank', title: '填空题', count: '30题', score: '30分' },
  { key: 'shortAnswer', title: '简答题', count: '30题', score: '30分' },
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
</script>

<template>
  <StepLayout :active-step="1" left-top-title="冲刺目标统计" left-bottom-title="" right-title="试卷出题内容概览" title="自定义组卷"
    second-title="自由配置题目类型、题量和难度，满足个性化需求" @prev="$router.back()" @next="handleNext">
    <template #leftTopBadge>
      <span class="header-vertical-bar"></span>
    </template>
    <template #leftTopBody>
      <div class="form-panel">
        <div class="panel-title-row">
          <span class="panel-bar"></span>
          <span class="panel-title">冲刺目标统计</span>
        </div>
        <div class="form-grid">
          <!-- 学段 -->
          <div class="form-field">
            <div class="field-label">
              <span class="label-dot"></span>
              <span>学段</span>
            </div>
            <el-select placeholder="请选择" size="large" class="field-select">
              <el-option label="小学" value="小学" />
              <el-option label="初中" value="初中" />
              <el-option label="高中" value="高中" />
            </el-select>
          </div>
          <!-- 年级 -->
          <div class="form-field">
            <div class="field-label">
              <span class="label-dot"></span>
              <span>年级</span>
            </div>
            <el-select v-model="selectedGrade" placeholder="请选择" size="large" class="field-select">
              <el-option v-for="item in selectedGrade" :key="item.key" :label="item.title" :value="item.key" />
            </el-select>
          </div>
          <!-- 学科 -->
          <div class="form-field">
            <div class="field-label">
              <span class="label-dot"></span>
              <span>学科</span>
            </div>
            <el-select placeholder="请选择" size="large" class="field-select">
              <el-option label="数学" value="数学" />
              <el-option label="语文" value="语文" />
              <el-option label="英语" value="英语" />
            </el-select>
          </div>
          <!-- 选择班级 -->
          <div class="form-field">
            <div class="field-label">
              <span class="label-dot"></span>
              <span>选择班级</span>
            </div>
            <el-select placeholder="请选择" size="large" class="field-select">
              <el-option label="一班" value="一班" />
              <el-option label="二班" value="二班" />
              <el-option label="三班" value="三班" />
            </el-select>
          </div>
          <!-- 教材 -->
          <div class="form-field">
            <div class="field-label">
              <span class="label-dot"></span>
              <span>教材</span>
            </div>
            <el-select placeholder="请选择" size="large" class="field-select">
              <el-option label="人教版" value="人教版" />
              <el-option label="北师大版" value="北师大版" />
              <el-option label="苏教版" value="苏教版" />
            </el-select>
          </div>
          <!-- 章节范围 -->
          <div class="form-field">
            <div class="field-label">
              <span class="label-dot"></span>
              <span>章节范围</span>
            </div>
            <el-select placeholder="请选择" size="large" class="field-select">
              <el-option label="第一章" value="第一章" />
              <el-option label="第二章" value="第二章" />
              <el-option label="第三章" value="第三章" />
            </el-select>
          </div>
          <!-- 试卷名称 -->
          <div class="form-field">
            <div class="field-label">
              <span class="label-dot"></span>
              <span>试卷名称</span>
            </div>
            <el-input placeholder="请输入" size="large" class="field-select" />
          </div>
          <!-- 试卷用途 -->
          <div class="form-field">
            <div class="field-label">
              <span class="label-dot"></span>
              <span>试卷用途</span>
            </div>
            <el-select placeholder="请选择" size="large" class="field-select">
              <el-option label="单元测试" value="单元测试" />
              <el-option label="期中考试" value="期中考试" />
              <el-option label="期末考试" value="期末考试" />
            </el-select>
          </div>
        </div>
      </div>
    </template>

    <template #leftBottomBody>
      <div class="bottom-panel">
        <div class="bottom-title-row">
          <span class="bottom-bar"></span>
          <span class="bottom-title">题型与题量设置</span>
        </div>
        <el-table :data="itemList" style="width: 100%" class="student-table">
          <el-table-column prop="title" label="题型" align="center">
            <template #default="{ row }">
              <span class="student-name">{{ row.title }}</span>
            </template>
          </el-table-column>
          <el-table-column label="题量设置" align="center">
            <template #default="{ row }">
              <div class="count-stepper">
                <el-input-number v-model="row.count" :min="0" :max="100" :step="1" />
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="weakPoints" label="难度分布" min-width="160" align="center">
            <template #default="{ row }">
              <el-radio-group v-model="row.selectDifficulty" class="difficulty-group">
                <el-radio-button :value="point" v-for="point in row.difficulty" :key="point" plain size="small">
                  {{ point }}
                </el-radio-button>
              </el-radio-group>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template #default="{ row }">
              <el-button text size="mini" type="primary">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </template>

    <template #rightBody>
      <div class="overview-section">
        <h4 class="overview-section-title">试卷总分</h4>
        <ScorePie :center-value="100" center-unit="总分数" :legends="[
          { color: '#03BC96', name: '容易', value: difficultyStats.easy, percent: '0%' },
          { color: '#1E77FA', name: '中等', value: difficultyStats.medium, percent: '0%' },
          { color: '#FD8F37', name: '困难', value: difficultyStats.hard, percent: '0%' },
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

.form-panel {
  border: 0;
  border-radius: 12px;
  padding: 16px;
  padding-top: 0;
  box-sizing: border-box;
}

:deep(.left-top-card) {
  height: auto !important;
}

:deep(.left-top-card .el-card__body) {
  height: auto !important;
}

:deep(.badge-wrapper) {
  width: auto !important;
  height: auto !important;
  border-radius: 0 !important;
  background: transparent !important;
  margin-left: 0 !important;
}

:deep(.left-top-card .el-card__header) {
  display: none !important;
}

:deep(.left-bottom-card .el-card__header) {
  display: none !important;
}

.header-vertical-bar {
  display: block;
  width: 3px;
  height: 24px;
  background: #075DFE;
  border-radius: 2px;
}

.panel-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;

  .panel-bar {
    width: 3px;
    height: 24px;
    background: #075DFE;
    border-radius: 2px;
    flex-shrink: 0;
  }

  .panel-title {
    font-size: 18px;
    font-weight: 600;
    color: #075DFE;
    line-height: 24px;
  }
}

.bottom-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
  overflow: hidden;
}

.bottom-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
  flex-shrink: 0;

  .bottom-bar {
    width: 3px;
    height: 24px;
    background: #075DFE;
    border-radius: 2px;
    flex-shrink: 0;
  }

  .bottom-title {
    font-size: 18px;
    font-weight: 600;
    color: #075DFE;
    line-height: 24px;
  }
}

.difficulty-group {
  display: flex;
  gap: 40px;
  justify-content: center;

  :deep(.el-radio-button) {
    .el-radio-button__inner {
      padding: 4px 12px;
      border-radius: 6px;
      font-size: 14px;
      color: #000;
      border: 1px solid #ccc;
      background: #fff;
      box-shadow: none;
    }

    &.is-active .el-radio-button__inner {
      background: #075DFE;
      color: #fff;
      border-color: #075DFE;
    }
  }
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  row-gap: 12px;
  column-gap: 12px;
}

.form-field {
  .field-label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    font-weight: 500;
    color: #333;
    margin-bottom: 8px;

    .label-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #075DFE;
      flex-shrink: 0;
    }
  }

  .field-input {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 36px;
    border: 1px solid #D9D9D9;
    border-radius: 6px;
    padding: 0 8px;
    box-sizing: border-box;
    cursor: pointer;

    .input-placeholder {
      font-size: 14px;
      font-weight: 400;
      color: #999;
    }

    .input-arrow {
      flex-shrink: 0;
    }
  }
}

.field-select {
  width: 240px;
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
  padding-left: 12px;
  color: #000000;
}

.student-table :deep(.el-table__body-wrapper .el-table__cell) {
  height: 46px;
  overflow: auto;
  padding-left: 12px;

}

.count-stepper {
  display: inline-flex;
  align-items: center;

  :deep(.el-input-number) {
    width: 132px;
    height: 26px;

    .el-input-number__decrease,
    .el-input-number__increase {
      width: 24px;
      height: 24px;
      top: 1px;
      border: none;
      background: transparent;
      font-size: 14px;
      color: #333;
      display: flex;
      align-items: center;
      justify-content: center;

      .el-icon {
        font-size: 14px;
      }
    }

    .el-input-number__decrease {
      left: 1px;
      border-right: 1px solid #B5B4B5;
    }

    .el-input-number__increase {
      right: 1px;
      border-left: 1px solid #B5B4B5;
    }

    .el-input {
      .el-input__wrapper {
        padding: 0 24px;
        box-shadow: none;
        border: 1px solid #B5B4B5;
        border-radius: 4px;
        height: 26px;
        background: #fff;

        .el-input__inner {
          text-align: center;
          font-size: 14px;
          color: #000;
          height: 26px;
        }
      }
    }

    &.is-disabled .el-input__wrapper {
      background: #f5f5f5;
    }
  }
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
