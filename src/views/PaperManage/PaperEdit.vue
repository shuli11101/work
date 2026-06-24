<script setup>
import { ref, onMounted, computed, reactive } from 'vue'
import { getPaperPreview } from '@/api/index'
import { EditPen } from '@element-plus/icons-vue'

const paperName = ref('2026年普通高等学校招生全国统一考试')
const subtitle = ref('')
const notes = ref('')

// 按题型分组（直接引用 paperData.sections，左右共用同一份数据）
const typeLabels = {
  choice: '单选题',
  'multi-choice': '多选题',
  fill: '填空题',
  shortAnswer: '简答题',
}

const activeTypeGroups = ref([])

// 每组问题
const groupedQuestions = ref([])

// 获取试卷
const paperData = ref(null)
const getPaper = async () => {
  const res = await getPaperPreview('paper_001')
  paperData.value = res.data
  paperName.value = res.data.name
  groupedQuestions.value = (res.data.sections || []).map(section => reactive({
    type: section.type,
    label: typeLabels[section.type] || section.title,
    questions: section.questions,
    visibleNum: false, // 隐藏题号
    visibleScore: true, // 隐藏分值 默认勾选
  }))
  console.log('paperData', paperData.value)
}
onMounted(() => {
  getPaper()
})

// 各题型分数
// 选择题
const selectScore = computed(() => {
  let total = 0
  groupedQuestions.value.forEach((cur) => {
    if (cur.type === 'choice') {
      total += cur.questions.reduce((acc, cur) => {
        acc += cur.score
        return acc
      }, 0)
    }
  })
  return total
})

// 填空题
const fillScore = computed(() => {
  let total = 0
  groupedQuestions.value.forEach((cur) => {
    if (cur.type === 'fill') {
      total += cur.questions.reduce((acc, cur) => {
        acc += cur.score
        return acc
      }, 0)
    }
  })
  return total
})

// 简答题
const shortAnswerScore = computed(() => {
  let total = 0
  groupedQuestions.value.forEach((cur) => {
    if (cur.type === 'shortAnswer') {
      total += cur.questions.reduce((acc, cur) => {
        acc += cur.score
        return acc
      }, 0)
    }
  })
  return total
})

const handleBack = () => {
  history.back()
}

const handleConfirm = () => {
  console.log('确认')
}

const handleChangeQuestion = (qId) => {
  console.log('换题', qId)
}

const handleDeleteQuestion = (qId) => {
  console.log('删除', qId)
}

// 左右联动高亮
const activeQuestionId = ref(null)
const handleQuestionClick = (qId) => {
  activeQuestionId.value = qId
}
</script>

<template>
  <div class="paper-edit">
    <!-- 顶部操作栏 -->
    <div class="edit-topbar">
      <span class="topbar-title">试卷编辑</span>
      <div class="topbar-actions">
        <button class="btn btn-outline" @click="handleBack">返回</button>
        <button class="btn btn-primary" @click="handleConfirm">确认</button>
      </div>
    </div>

    <div class="edit-body">
      <!-- 左侧编辑区 -->
      <div class="edit-main">
        <!-- 试卷基本信息 -->
        <div class="edit-card">


          <!-- 标题分隔线 -->
          <div class="divider-line">
            <span class="divider-accent"></span>
            <span class="divider-bar"></span>
          </div>
          <div class="section-label">试卷编辑</div>

          <!-- 试卷名称 -->
          <div class="field-group">
            <label class="field-label">试卷名称</label>
            <input v-model="paperName" class="field-input" placeholder="2026年普通高等学校招生全国统一考试" />
          </div>

          <!-- 副标题 -->
          <div class="field-group">
            <label class="field-label">副标题</label>
            <input v-model="subtitle" class="field-input field-input-placeholder" placeholder="可给试卷添加副标题" />
          </div>

          <!-- 注意事项 -->
          <div class="field-group">
            <label class="field-label">注意事项</label>
            <textarea v-model="notes" class="field-textarea" placeholder="请输入注意事项"></textarea>
          </div>

          <!-- 工具栏 -->
          <span class="topbar-title">题目排版</span>
          <div class="toolbar-row">
            <span class="toolbar-label">拖动排序</span>
            <div class="toolbar-right">
              <span class="tag tag-gray">按题型自动分组</span>
              <span class="tag tag-blue">添加题目</span>
            </div>
          </div>

          <!-- 题目卡片 - 按题型分组 -->
          <el-collapse v-model="activeTypeGroups" class="q-collapse">
            <el-collapse-item v-for="(group, idx) in groupedQuestions" :key="group.type" :name="group.type">
              <template #title>
                <span style="display:flex;align-items:center;width:100%">
                  <span>
                    <span v-if="idx === 0">一</span>
                    <span v-if="idx === 1">二</span>
                    <span v-if="idx === 2">三</span>
                    、{{ group.label }}
                    <el-icon style="margin-left:6px; margin-right: 50px;vertical-align:-2px">
                      <EditPen />
                    </el-icon>
                    <span style="font-size: 14px" v-if="group.type === 'choice'">本题型共{{ selectScore ||
                      0 }}分</span>
                    <span style="font-size: 14px;" v-else-if="group.type === 'fill'">本题型共{{ fillScore || 0 }}分</span>
                    <span style="font-size: 14px;" v-else>本题型共{{ shortAnswerScore || 0 }}分</span>
                  </span>
                  <span style="margin-left:auto" @click.stop>
                    <el-checkbox v-model="group.visibleNum">隐藏题号</el-checkbox>
                    <el-checkbox v-model="group.visibleScore">隐藏分值</el-checkbox>
                  </span>
                </span>
              </template>
              <div class="question-card" v-for="(q, qIdx) in group.questions" :key="q.id"
                :class="{ active: activeQuestionId === q.id }" @click="handleQuestionClick(q.id)">
                <!-- 题目工具栏 -->
                <div class="q-toolbar">
                  <svg class="drag-handle" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <rect x="5.5" y="3" width="4" height="18" rx="1" fill="#CCCCCC" />
                    <rect x="14.5" y="3" width="4" height="18" rx="1" fill="#CCCCCC" />
                  </svg>
                  <span class="q-num-label">第{{ qIdx + 1 }}题</span>

                  <span class="q-label">分数</span>
                  <div class="q-input-sm">
                    <input v-model="q.score" type="number" class="q-inner-input-sm" />
                  </div>

                  <span class="q-label">离下一题间距</span>
                  <div class="q-input-sm q-input-wide">
                    <input v-model="q.marginBottom" class="q-inner-input-sm" />
                  </div>

                  <span class="q-label">题左右宽度</span>
                  <div class="width-group">
                    <button class="width-btn" :class="{ active: (q.padding || '100') === '25' }"
                      @click="q.padding = '25'">25</button>
                    <button class="width-btn" :class="{ active: (q.padding || '100') === '33' }"
                      @click="q.padding = '33'">33</button>
                    <button class="width-btn" :class="{ active: (q.padding || '100') === '50' }"
                      @click="q.padding = '50'">50</button>
                    <button class="width-btn" :class="{ active: (q.padding || '100') === '66' }"
                      @click="q.padding = '66'">66</button>
                    <button class="width-btn" :class="{ active: (q.padding || '100') === '75' }"
                      @click="q.padding = '75'">75</button>
                    <button class="width-btn" :class="{ active: (q.padding || '100') === '100' }"
                      @click="q.padding = '100'">100</button>
                  </div>

                  <div class="btn" style="display: flex; align-items: center; gap: 8px;">
                    <button class="btn-toolbar btn-toolbar-delete" @click="handleDeleteQuestion(q.id)">删除</button>
                    <button class="btn-toolbar btn-toolbar-replace" @click="handleChangeQuestion(q.id)">换题</button>
                  </div>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>

      <!-- 右侧预览区 -->
      <div class="edit-divider"></div>
      <div class="edit-sidebar">
        <div class="preview-card">
          <div class="preview-header">试卷预览</div>
          <div class="preview-body" v-if="paperData">
            <div class="paper-preview-content">
              <!-- 试卷标题 -->
              <div class="pp-title">{{ paperData.name }}</div>
              <!-- 顶部答题人信息 + 贴条码区 -->
              <div class="edit-card-header">
                <div class="student-info">
                  <div class="info-row">
                    <span class="info-label">姓名</span>
                    <span class="info-underline"></span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">班级</span>
                    <span class="info-underline"></span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">学号</span>
                    <span class="info-underline"></span>
                  </div>
                </div>
                <div class="barcode-right">
                  <div class="barcode-grid">
                    <div class="barcode-col-labels">
                      <svg class="barcode-star" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path
                          d="M8 0L10.472 5.528L16 6.944L12 11.416L12.944 17L8 14.472L3.056 17L4 11.416L0 6.944L5.528 5.528L8 0Z"
                          fill="#1A1A1A" />
                      </svg>
                      <span class="barcode-label-text">短<br />学<br />号</span>
                    </div>
                    <div class="barcode-rows">
                      <div class="barcode-row">
                        <span v-for="n in 10" :key="n - 1" class="barcode-cell">[{{ n - 1 }}]</span>
                      </div>
                      <div class="barcode-row">
                        <span v-for="n in 10" :key="n - 1" class="barcode-cell">[{{ n - 1 }}]</span>
                      </div>
                      <div class="barcode-row">
                        <span v-for="n in 10" :key="n - 1" class="barcode-cell">[{{ n - 1 }}]</span>
                      </div>
                      <div class="barcode-row">
                        <span v-for="n in 10" :key="n - 1" class="barcode-cell">[{{ n - 1 }}]</span>
                      </div>
                    </div>
                  </div>
                  <div class="barcode-area">
                    <span>贴条码区域</span>
                  </div>
                </div>
              </div>
              <!-- 注意事项 -->
              <div class="pp-section-notice">
                <span>
                  <span style="font-size: large;">注意事项：</span>
                  <p>1.答卷前，考生务必将自己的姓名、准考证号、座位号填写在答题卡和试卷指定位置上。</p>
                  <p>2. 作答选择题时，选出每小题答案后，用 2B 铅笔把答题卡上对应题目的答案标号涂黑；如需改动，用橡皮擦干净后，再选涂其他答案标号。写在试卷上的答案无效。</p>
                  <p>3. 作答非选择题时，必须使用黑色字迹的签字笔或钢笔在答题卡各题目的答题区域内书写，超出答题区域书写的答案无效；不得使用铅笔、红色笔或涂改液（修正带）修改。</p>
                  <p>4. 保持答题卡整洁，不得折叠、污损，严禁在答题卡上作任何标记。</p>
                  <p>5. 考试结束后，将本试卷和答题卡一并交回。</p>
                  <p>6.注意事项补充（视考试而定）：
                    允许使用直尺、圆规、三角板，但不得使用计算器（除非特别注明）。
                    本卷可能包含附加题，附加题得分计入总分（或不计入，请留意说明）。</p>
                </span>
              </div>

              <!-- 各题型区块 -->
              <div v-for="(group, sIdx) in groupedQuestions" :key="sIdx" class="pp-section">
                <div class="pp-section-title">{{ group.label }}</div>
                <div v-for="(q, qIdx) in group.questions" :key="q.id" class="pp-question"
                  :class="{ active: activeQuestionId === q.id }" @click="handleQuestionClick(q.id)">
                  <!-- 选择题 -->
                  <template v-if="q.type === 'choice'">
                    <div class="pp-q-text" :style="{ 'padding-left': q.padding + 'px' || 0 + 'px' }">
                      <span v-if="!group.visibleNum">{{ qIdx + 1 }}.</span>
                      <span v-if="!group.visibleScore">({{ q.score }}分)</span>
                      {{ q.text }}
                    </div>
                    <div class="pp-options"
                      :style="{ 'margin-bottom': q.marginBottom + 'px' || 0, 'padding-left': q.padding + 'px' || 100 + 'px' }">
                      <span v-for="opt in q.options" :key="opt.label" class="pp-option">
                        <span class="pp-opt-label">{{ opt.label }}.</span>
                        <span>{{ opt.text }}</span>
                      </span>
                    </div>
                  </template>

                  <!-- 填空题 -->
                  <template v-else-if="q.type === 'fill'">
                    <div class="pp-q-text" :style="{ 'margin-bottom': q.marginBottom + 'px' || 0 }">
                      <span v-if="!group.visibleNum">{{ qIdx + 1 }}.</span>
                      <span v-if="!group.visibleScore">({{ q.score }}分)</span>
                      {{
                        q.text
                      }}
                    </div>
                  </template>

                  <!-- 简答题 -->
                  <template v-else-if="q.type === 'shortAnswer'">
                    <div class="pp-q-text" :style="{ 'margin-bottom': q.marginBottom + 'px' || 0 }">
                      <span v-if="!group.visibleNum">{{ qIdx + 1 }}.</span>

                      <span v-if="!group.visibleScore">({{ q.score }}分)</span>
                      {{ q.text }}
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>
          <div class="preview-body" v-else>
            <div class="preview-loading">加载中...</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.paper-edit {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #ffffff;
}

/* ===== 顶部操作栏 ===== */
.edit-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
  flex-shrink: 0;
}

.topbar-title {
  font-size: 18px;
  font-weight: 600;
  color: #1A1A1A;
}

.topbar-actions {
  display: flex;
  gap: 12px;
}

.btn {
  height: 36px;
  padding: 0 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  line-height: 36px;
}

.btn-outline {
  background: #fff;
  color: #075DFE;
  border: 2px solid #075DFE;
}

.btn-primary {
  background: #075DFE;
  color: #fff;
}

/* ===== 主体 ===== */
.edit-body {
  flex: 1;
  display: flex;
  gap: 0;
  padding: 24px 0;
  min-height: 0;
  overflow: auto;
}

.edit-main {
  flex: 1;
  min-width: 0;
  min-height: 0;
  padding: 0 24px;
  background: #fff;
  overflow-y: auto;
}

.edit-divider {
  width: 1px;
  background: #E6E6E6;
  flex-shrink: 0;
}

.edit-sidebar {
  width: 50%;
  flex-shrink: 0;
  padding: 0 24px;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

/* ===== 编辑卡片 ===== */
.edit-card {
  background: #fff;
}

.edit-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.barcode-right {
  display: flex;
  gap: 16px;
  flex-shrink: 0;
}

.student-info {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 154px;
}

.info-label {
  width: 28px;
  font-family: 'FangSong_GB2312', 'FangSong', serif;
  font-size: 14px;
  line-height: 22px;
  color: #1A1A1A;
  flex-shrink: 0;
}

.info-underline {
  flex: 1;
  height: 0;
  border-bottom: 1px solid #1A1A1A;
}

.barcode-area {
  width: 306px;
  height: 122px;
  border: 1px dashed #1A1A1A;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  letter-spacing: 1.1em;
  color: #1A1A1A;
  flex-shrink: 0;
}

.barcode-grid {
  width: 306px;
  height: 123px;
  border: 1px solid #1A1A1A;
  border-radius: 4px;
  overflow: hidden;
  flex-shrink: 0;
  display: flex;
}

.barcode-col-labels {
  width: 42px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  border-right: 1px solid #1A1A1A;
  flex-shrink: 0;
}

.barcode-star {
  flex-shrink: 0;
}

.barcode-label-text {
  font-family: 'KaiTi_GB2312', 'KaiTi', serif;
  font-size: 12px;
  line-height: 18px;
  color: #1A1A1A;
  text-align: center;
}

.barcode-rows {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.barcode-row {
  flex: 1;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #1A1A1A;
  padding-left: 10px;
  column-gap: 10px;

  &:last-child {
    border-bottom: none;
  }
}

.barcode-cell {
  width: 22px;
  height: 18px;
  font-family: 'FZLanTingHeiPro_GB18030', sans-serif;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.5em;
  color: #1A1A1A;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-card {
  background: #fff;
}

.divider-line {
  display: flex;
  align-items: center;
  gap: 0;
  margin-bottom: 12px;
}

.divider-accent {
  width: 54px;
  height: 2px;
  background: #075DFE;
  flex-shrink: 0;
}

.divider-bar {
  flex: 1;
  height: 1px;
  background: #E6E6E6;
}

.section-label {
  font-size: 14px;
  font-weight: 600;
  color: #075DFE;
  margin-bottom: 24px;
}

/* ===== 表单字段 ===== */
.field-group {
  margin-bottom: 16px;
}

.field-label {
  display: block;
  font-family: 'FangSong_GB2312', 'FangSong', serif;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: #1A1A1A;
  margin-bottom: 8px;
  line-height: 32px;
}

.field-input {
  width: 100%;
  height: 36px;
  border: 1px solid #D9D9D9;
  border-radius: 6px;
  padding: 0 12px;
  font-size: 14px;
  color: #999;
  outline: none;
  box-sizing: border-box;

  &:focus {
    border-color: #075DFE;
  }
}

.field-input-placeholder {
  color: #999;
}

.field-textarea {
  width: 100%;
  height: 120px;
  border: 1px solid #D9D9D9;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 14px;
  color: #999;
  outline: none;
  resize: none;
  box-sizing: border-box;

  &:focus {
    border-color: #075DFE;
  }
}

/* ===== 工具栏 ===== */
.toolbar-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #F3F8FE;
  border-radius: 6px;
  padding: 12px 16px;
  margin-bottom: 16px;
}

.toolbar-label {
  font-size: 12px;
  color: #1A1A1A;
  white-space: nowrap;
}

.toolbar-right {
  display: flex;
  gap: 8px;
}

.tag {
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
}

.tag-gray {
  background: #E6E6E6;
  color: #666;
}

.tag-blue {
  background: #075DFE;
  color: #fff;
}

/* ===== 题目标签 ===== */
.question-tabs {
  display: flex;
  gap: 4px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.q-tab {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 18px;
  padding: 0 2px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.5em;
  color: #1A1A1A;
  cursor: pointer;
  border-bottom: 1px solid transparent;

  &:hover {
    color: #075DFE;
  }

  &.active {
    color: #075DFE;
    border-bottom-color: #075DFE;
  }
}

/* ===== 题目卡片 ===== */
.question-card {
  border: 1px solid #D9D9D9;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 12px;
}

/* ===== 题目工具栏 ===== */
.q-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  height: 32px;
  padding: 0 8px;
  background: #fff;
  box-shadow: 0 0 4px rgba(7, 93, 254, 1);
  border-radius: 8px;
  flex-wrap: nowrap;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
}

.drag-handle {
  flex-shrink: 0;
  cursor: grab;
}

.q-num-label {
  font-size: 12px;
  color: #1A1A1A;
  font-weight: 400;
  flex-shrink: 0;
}

.q-label {
  font-size: 12px;
  color: #1A1A1A;
  font-weight: 400;
  flex-shrink: 0;
}

.q-input-sm {
  width: 48px;
  height: 20px;
  border: 1px solid #CCCCCC;
  border-radius: 4px;
  overflow: hidden;
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

.q-input-wide {
  width: 56px;
}

.q-inner-input-sm {
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  padding: 0 4px;
  font-size: 10px;
  color: #1A1A1A;
  box-sizing: border-box;
}

.width-group {
  display: flex;
  gap: 2px;
  flex-shrink: 0;
}

.width-btn {
  width: 20px;
  height: 20px;
  border: none;
  border-radius: 4px;
  background: #E6E6E6;
  font-size: 10px;
  color: #1A1A1A;
  cursor: pointer;
  padding: 0;
  line-height: 20px;
  text-align: center;

  &.active {
    background: #fff;
    border: 1px solid #075DFE;
    color: #075DFE;
  }
}

.btn-toolbar {
  height: 20px;
  padding: 2px 8px;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 400;
  cursor: pointer;
  line-height: 16px;
  text-align: center;
  flex-shrink: 0;
  white-space: nowrap;
  display: flex;
  align-items: center;
}

.btn-toolbar-delete {
  background: #D9D9D9;
  color: #1A1A1A;
}

.btn-toolbar-replace {
  background: #FD8103;
  color: #fff;
}

/* 按题型分组折叠面板 */
.q-collapse {
  border: none;
}

.q-collapse :deep(.el-collapse-item__header) {
  font-size: 14px;
  font-weight: 600;
  color: #075DFE;
  padding-left: 0;
  height: 36px;
  line-height: 36px;
  border-bottom: 1px solid #E6E6E6;
  background: #ffffff;
  padding: 0 12px;
  border-radius: 6px 6px 0 0;
  margin-top: 16px;
}

.q-collapse :deep(.el-collapse-item__arrow) {
  color: #1A1A1A;
}

.q-collapse :deep(.el-collapse-item__title) {
  font-size: 18px;
  font-weight: 600;
  color: #1A1A1A;
}

.q-collapse :deep(.el-collapse-item__arrow) {
  order: -1;
  margin-right: 8px;
  margin-left: 0;
}

.q-collapse :deep(.el-collapse-item__wrap) {
  border: none;
}

.q-collapse :deep(.el-collapse-item__content) {
  padding: 0;
}

.question-card {
  border: 1px solid #D9D9D9;
  border-radius: 0;
  border-top: none;
}

.question-card:first-child {
  border-top: 1px solid #D9D9D9;
  border-radius: 0;
}

.question-card.active {
  border-color: #075DFE;
  box-shadow: 0 0 0 1px #075DFE;
  position: relative;
  z-index: 1;
}

.q-number {
  font-size: 12px;
  color: #1A1A1A;
  white-space: nowrap;
  font-weight: 400;
}

.q-tool-label {
  font-size: 12px;
  color: #1A1A1A;
  white-space: nowrap;
}

/* ===== 题目内容 ===== */
.q-content-wrap {
  box-shadow: 0 0 4px rgba(7, 93, 254, 1);
  border-radius: 0 0 8px 8px;
  overflow: hidden;
}

.q-content {
  padding: 16px 24px;
  background: #fff;
}

.q-text {
  font-family: 'Songti SC', 'SimSun', serif;
  font-size: 16px;
  font-weight: 700;
  line-height: 32px;
  letter-spacing: 0.05em;
  color: #1A1A1A;
  margin: 0 0 16px 0;
}

.q-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.q-options-row {
  display: flex;
  gap: 80px;
}

.q-option {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Songti SC', 'SimSun', serif;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: #1A1A1A;
}

.option-letter {
  flex-shrink: 0;
}

/* ===== 右侧预览 ===== */
.preview-card {
  background: #fff;
  overflow: hidden;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.preview-header {
  padding: 12px 16px;
  font-size: 16px;
  font-weight: 600;
  color: #1A1A1A;
  border-bottom: 1px solid #eee;
}

.preview-body {
  padding: 24px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  overflow: auto;
  flex: 1;
  min-height: 0;
}

.preview-loading {
  color: #999;
  font-size: 14px;
  padding: 40px 0;
}

/* ===== 试卷预览文字内容 ===== */
.paper-preview-content {
  width: 100%;
  font-family: 'FangSong_GB2312', 'FangSong', serif;
  color: #1A1A1A;
  line-height: 1.8;
}

.pp-title {
  text-align: center;
  font-family: 'SimHei', 'Heiti SC', 'Microsoft YaHei', sans-serif;
  font-size: 20px;
  font-weight: 700;
  line-height: 32px;
  letter-spacing: 0.05em;
  margin-bottom: 24px;
}

.pp-section-notice {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;

  span {
    font-family: 'PingFang SC', sans-serif;
    font-weight: 600;
    line-height: 32px;

    p {
      margin: 0;
    }
  }
}

.pp-section {
  margin-bottom: 20px;
}

.pp-section-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
  line-height: 24px;

  &:hover {
    box-shadow: 0 0 4px #075DFE;
    cursor: pointer;
  }
}

.pp-question {
  margin-bottom: 16px;
  font-weight: 700;
  letter-spacing: 5%;
  padding: 15px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 6px;
}

.pp-question.active {
  background: #F3F8FE;
  box-shadow: 0 0 0 2px rgba(7, 93, 254, 0.3);
}

.pp-q-text {
  font-family: 'Songti SC', 'SimSun', serif;
  font-size: 15px;
  line-height: 28px;
  white-space: pre-line;
  margin-bottom: 6px;
}

.pp-options {
  display: flex;
  flex-wrap: wrap;
  gap: 32px 60px;
  padding-left: 8px;
}

.pp-option {
  font-family: 'Songti SC', 'SimSun', serif;
  font-size: 14px;
  line-height: 26px;
}

.pp-opt-label {
  font-weight: 700;
  margin-right: 4px;
}
</style>
