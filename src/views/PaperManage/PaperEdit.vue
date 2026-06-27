<script setup>
import { ref, onMounted, computed, reactive, nextTick } from 'vue'
import { getPaperPreview } from '@/api/index'
import { ElMessage } from 'element-plus'
import { EditPen, FullScreen } from '@element-plus/icons-vue'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

import AddDialog from './components/AddDialog.vue'



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

// 换题
const changeQuestionVisible = ref(false)
const changeQuestionId = ref(null)
const selectedQuestion = ref(null)

const replaceQuestions = ref([
  { id: 'r1', type: 'choice', score: 5, text: '甲、乙两车在同一直道上从同一地点同时出发，它们运动的位移x随时间/变化的关系如图所示，已知甲车由静止开始做匀加速直线运动，乙车做匀速直线运动，图线在5s末时相交，则下列说法不正确的是', options: [{ label: 'A', text: '{a|a>-2}' }, { label: 'B', text: '{a|a>-2}' }, { label: 'C', text: '{a|a>-2}' }, { label: 'D', text: '{a|a>-2}' }], padding: '0', marginBottom: 0 },
  { id: 'r2', type: 'choice', score: 5, text: '甲、乙两车在同一直道上从同一地点同时出发，它们运动的位移x随时间/变化的关系如图所示，已知甲车由静止开始做匀加速直线运动，乙车做匀速直线运动，图线在5s末时相交，则下列说法不正确的是', options: [{ label: 'A', text: '{a|a>-2}' }, { label: 'B', text: '{a|a>-2}' }, { label: 'C', text: '{a|a>-2}' }, { label: 'D', text: '{a|a>-2}' }], padding: '0', marginBottom: 0 },
  { id: 'r3', type: 'choice', score: 5, text: '甲、乙两车在同一直道上从同一地点同时出发，它们运动的位移x随时间/变化的关系如图所示，已知甲车由静止开始做匀加速直线运动，乙车做匀速直线运动，图线在5s末时相交，则下列说法不正确的是', options: [{ label: 'A', text: '{a|a>-2}' }, { label: 'B', text: '{a|a>-2}' }, { label: 'C', text: '{a|a>-2}' }, { label: 'D', text: '{a|a>-2}' }], padding: '0', marginBottom: 0 },
  { id: 'r4', type: 'choice', score: 5, text: '甲、乙两车在同一直道上从同一地点同时出发，它们运动的位移x随时间/变化的关系如图所示，已知甲车由静止开始做匀加速直线运动，乙车做匀速直线运动，图线在5s末时相交，则下列说法不正确的是', options: [{ label: 'A', text: '{a|a>-2}' }, { label: 'B', text: '{a|a>-2}' }, { label: 'C', text: '{a|a>-2}' }, { label: 'D', text: '{a|a>-2}' }], padding: '0', marginBottom: 0 },
])
const handleChangeQuestion = (qId) => {
  changeQuestionVisible.value = true
  console.log('换题', qId)
  changeQuestionId.value = qId
}

// 确认换题
const submitChangeQuestion = () => {
  if (!selectedQuestion.value) {
    ElMessage.error('请选择题目')
    return
  }
  // 从 groupedQuestions 中删除题目
  groupedQuestions.value.forEach((cur) => {
    console.log('换题', cur)
    console.log('要换的', selectedQuestion.value)
    const question = cur.questions.find(item => item.id === changeQuestionId.value)
    if (question) {
      cur.questions.splice(cur.questions.indexOf(question), 1, selectedQuestion.value)
      return
    }
  })

  changeQuestionVisible.value = false
  ElMessage.success('换题成功')
  console.log('确认换题', selectedQuestion.value)
}

//  换题分页
const cqCurrentPage = ref(1)
const cqTotal = computed(() => {
  return replaceQuestions.value.length
})

// 删除题目
const deleteVisible = ref(false)
const deleteQuestionIndex = ref(0)
const handleDeleteQuestion = (q) => {
  deleteVisible.value = true
  console.log('删除', q)
  deleteQuestionIndex.value = q.id

}

// 确认删除题目
const deleteQuestion = () => {
  // 从 groupedQuestions 中删除题目
  groupedQuestions.value.forEach((cur) => {
    const question = cur.questions.find(item => item.id === deleteQuestionIndex.value)
    if (question) {
      cur.questions.splice(cur.questions.indexOf(question), 1)
      return
    }
  })

  deleteVisible.value = false
  ElMessage.success('删除成功')
}

// 左右联动高亮
const activeQuestionId = ref(null)
const handleQuestionClick = (qId) => {
  activeQuestionId.value = qId
}

// 编辑分组名称
const groupNameEditVisible = ref(false)
const groupName = ref('')
const selectGroup = ref(null)
const handleEditGroupName = (group) => {
  groupName.value = ''
  groupNameEditVisible.value = true
  selectGroup.value = group
  console.log('修改分组名称', group.label)
}

// 确认修改分组名称
const changeGroupName = () => {
  if (!groupName.value) {
    ElMessage.error('请输入题型名称')
    return
  }
  groupNameEditVisible.value = false
  ElMessage.success('修改分组名称成功')
  // 更新分组名称
  groupedQuestions.value.forEach((cur) => {
    if (cur.type === selectGroup.value.type) {
      cur.label = groupName.value
    }
  })
  console.log('确认修改分组名称', groupName.value)
}

// 添加题目
const addVisible = ref(false)

// 全屏预览
const previewVisible = ref(false)
const previewCurrentPage = ref(0)
const previewPages = ref([])
const previewMeasuring = ref(false)
const measureRef = ref(null)

const previewBlocks = computed(() => {
  const blocks = [{ type: 'header' }]
  const secs = paperData.value?.sections || []
  secs.forEach((section, sIdx) => {
    const label = typeLabels[section.type] || section.title || ''
    blocks.push({ type: 'section', label, sIdx })
      ; (section.questions || []).forEach((q, qIdx) => {
        blocks.push({ type: 'question', question: q, qIdx, sIdx, isFirst: qIdx === 0 })
      })
  })
  return blocks
})

const previewTotalPages = computed(() => previewPages.value.length)

const handlePreview = async () => {
  console.log('handlePreview called', paperData.value?.sections?.length)
  previewVisible.value = true
  previewCurrentPage.value = 0

  // Show all content on page 1 immediately
  const allIdx = previewBlocks.value.map((_, i) => i)
  previewPages.value = [{ left: allIdx, right: [] }]

  // Wait for render
  await new Promise(resolve => setTimeout(resolve, 200))

  const dialog = document.querySelector('.exam-overview-dialog')
  if (!dialog) {
    console.log('no dialog')
    return
  }
  const sideWidth = Math.floor((dialog.clientWidth - 2) / 2)
  // Each side is A3 portrait: width × 420/297, slightly reduced for screen fit
  const SIDE_HEIGHT = Math.round(sideWidth * 420 / 297 * 0.85)
  const pageHeight = SIDE_HEIGHT // no padding
  console.log('dialogW', dialog.clientWidth, 'sideW', sideWidth, 'sideH', SIDE_HEIGHT, 'pageH', pageHeight)

  // Set fixed height via CSS variable (applies to ALL eo-page elements)
  dialog.style.setProperty('--eo-page-height', pageHeight + 'px')

  // Measure using the rendered left side directly
  await nextTick()
  const sideEl = document.querySelector('.exam-overview .eo-side')
  if (!sideEl) {
    console.log('no side el')
    return
  }

  // Get all direct child blocks in the left side (header, section titles, questions)
  const childEls = sideEl.querySelectorAll('.eo-header-block, .eo-section-title, .eo-question')
  const hArr = []
  childEls.forEach(el => {
    let h = el.offsetHeight || 0
    // .eo-question has margin-bottom:16px which is NOT in offsetHeight
    if (el.classList.contains('eo-question')) h += 16
    hArr.push(h)
  })
  console.log('child count', childEls.length, 'hArr', hArr)
  console.log('total content H', hArr.reduce((a, b) => a + b, 0))

  // Split (header is always index 0, at the top)
  const sides = []
  let cur = []
  let h = hArr[0] || 300 // header block height (includes .eo-header-block)
  let bi = 1 // start from block after header

  for (let i = 1; i < previewBlocks.value.length; i++) {
    const block = previewBlocks.value[i]
    if (block.type === 'section') {
      const bh = hArr[bi] || 50
      bi++
      if (h + bh > SIDE_HEIGHT && h > 0) {
        console.log('SPLIT at block', i, 'h', h, 'bh', bh, 'SIDE_HEIGHT', SIDE_HEIGHT)
        sides.push(cur)
        cur = []
        h = 0
      }
      cur.push(i)
      h += bh
    } else if (block.type === 'question') {
      const bh = hArr[bi] || 50
      bi++
      if (h + bh > SIDE_HEIGHT && h > 0) {
        console.log('SPLIT at q block', i, 'h', h, 'bh', bh, 'SIDE_HEIGHT', SIDE_HEIGHT)
        sides.push(cur)
        cur = []
        h = 0
      }
      cur.push(i)
      h += bh
    } else {
      cur.push(i)
    }
  }
  if (cur.length) sides.push(cur)
  if (!sides.length) sides.push([])

  // Force exactly 4 sides (2 pages), pad empty ones
  while (sides.length < 4) sides.push([])
  const finalSides = sides.slice(0, 4)

  const pages = [
    { left: [0, ...finalSides[0]], right: finalSides[1] || [] },
    { left: finalSides[2] || [], right: finalSides[3] || [] },
  ]

  console.log('pages', pages, 'sideH', SIDE_HEIGHT, 'sidesCount', sides.length)
  previewPages.value = pages
}

const prevPage = () => {
  if (previewCurrentPage.value > 0) previewCurrentPage.value--
}
const nextPage = () => {
  if (previewCurrentPage.value < previewTotalPages.value - 1) previewCurrentPage.value++
}

// 拖拽排序
const dragState = ref({ fromGroupIdx: null, fromQIdx: null, dragType: null }) // dragType: 'group' | 'question'
const onDragStart = (e, group, qIdx, groupIdx) => {
  dragState.value = { fromGroupIdx: groupIdx, fromQIdx: qIdx, dragType: 'question' }
  e.dataTransfer.effectAllowed = 'move'
}
const onDragOver = (e, group, qIdx, groupIdx) => {
  e.currentTarget.style.outline = '2px dashed #075DFE'
  e.currentTarget.style.outlineOffset = '-2px'
  e.currentTarget.style.borderRadius = '8px'
}
const onDragLeave = (e) => {
  e.currentTarget.style.outline = ''
  e.currentTarget.style.outlineOffset = ''
  e.currentTarget.style.borderRadius = ''
}
const onDrop = (e, toGroup, toQIdx, toGroupIdx) => {
  e.currentTarget.style.outline = ''
  e.currentTarget.style.outlineOffset = ''
  e.currentTarget.style.borderRadius = ''

  const { fromGroupIdx, fromQIdx, dragType } = dragState.value
  if (fromGroupIdx === null || fromQIdx === null) return
  if (dragType === 'question') {
    if (fromGroupIdx === toGroupIdx && fromQIdx === toQIdx) return
    const question = groupedQuestions.value[fromGroupIdx].questions.splice(fromQIdx, 1)[0]
    groupedQuestions.value[toGroupIdx].questions.splice(toQIdx, 0, question)
  }
}

// 题型组拖拽排序
const onGroupDragStart = (e, groupIdx) => {
  dragState.value = { fromGroupIdx: groupIdx, fromQIdx: null, dragType: 'group' }
  e.dataTransfer.effectAllowed = 'move'
}
const onGroupDragOver = (e, groupIdx) => {
  e.currentTarget.style.outline = '2px dashed #075DFE'
  e.currentTarget.style.outlineOffset = '-2px'
  e.currentTarget.style.borderRadius = '8px'
}
const onGroupDragLeave = (e) => {
  e.currentTarget.style.outline = ''
  e.currentTarget.style.outlineOffset = ''
  e.currentTarget.style.borderRadius = ''
}
const onGroupDrop = (e, toGroupIdx) => {
  e.currentTarget.style.outline = ''
  e.currentTarget.style.outlineOffset = ''
  e.currentTarget.style.borderRadius = ''

  const { fromGroupIdx, dragType } = dragState.value
  if (dragType !== 'group' || fromGroupIdx === null || fromGroupIdx === toGroupIdx) return
  const item = groupedQuestions.value.splice(fromGroupIdx, 1)[0]
  groupedQuestions.value.splice(toGroupIdx, 0, item)
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

          <!-- 左侧 - 下面-->
          <span class="topbar-title">题目排版</span>
          <div class="toolbar-row">
            <span class="toolbar-label">拖动排序</span>
            <div class="toolbar-right">
              <span class="tag tag-gray">按题型自动分组</span>
              <span class="tag tag-blue" @click="addVisible = true">添加题目</span>
            </div>
          </div>

          <!-- 左侧 - 下面 - 按题型分组 -->
          <el-collapse v-model="activeTypeGroups" class="q-collapse">
            <el-collapse-item v-for="(group, idx) in groupedQuestions" :key="group.type" :name="group.type"
              @dragover.prevent="onGroupDragOver($event, idx)" @drop.prevent="onGroupDrop($event, idx)"
              @dragleave="onGroupDragLeave">
              <template #title>
                <span :class="['q-title-wrap', 'q-title-wrap-' + idx]" draggable="true"
                  @dragstart="onGroupDragStart($event, idx)" @dragover.prevent="onGroupDragOver($event, idx)"
                  @drop.prevent="onGroupDrop($event, idx)" @dragleave="onGroupDragLeave">
                  <svg class="drag-handle" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <rect x="0" y="3" width="4" height="4" rx="1" fill="#CCCCCC" />
                    <rect x="10" y="3" width="4" height="4" rx="1" fill="#CCCCCC" />
                    <rect x="0" y="9" width="4" height="4" rx="1" fill="#CCCCCC" />
                    <rect x="10" y="9" width="4" height="4" rx="1" fill="#CCCCCC" />
                    <rect x="0" y="15" width="4" height="4" rx="1" fill="#CCCCCC" />
                    <rect x="10" y="15" width="4" height="4" rx="1" fill="#CCCCCC" />
                  </svg>
                  <span>
                    <span v-if="idx === 0">一</span>
                    <span v-if="idx === 1">二</span>
                    <span v-if="idx === 2">三</span>
                    、{{ group.label }}
                    <el-icon @click.stop="handleEditGroupName(group)"
                      style="margin-left:6px; margin-right: 50px;vertical-align:-2px">
                      <EditPen />
                    </el-icon>
                    <span style="font-size: 14px;" v-if="group.type === 'choice'">本题型共{{ selectScore
                      || 0 }}分</span>
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
                :class="{ active: activeQuestionId === q.id }" @click="handleQuestionClick(q.id)" draggable="true"
                @dragstart="onDragStart($event, group, qIdx, idx)"
                @dragover.prevent="onDragOver($event, group, qIdx, idx)"
                @drop.prevent="onDrop($event, group, qIdx, idx)" @dragleave="onDragLeave">
                <!-- 每个题目的详细部分 -->
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
                    <button class="btn-toolbar btn-toolbar-delete" @click="handleDeleteQuestion(q)">删除</button>
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
          <div class="preview-body" v-if="paperData" @click="handlePreview">
            <div class="paper-preview-content">
              <!-- 绝密：启用前 -->
              <div class="pp-secret">
                <div>绝密★启用前</div>
                <img src="@/assets/picture/2d-code.png" alt="">
              </div>
              <!-- 试卷标题 -->
              <div class="pp-title">
                {{ paperData.name }}
                <div style="font-size: 28px; letter-spacing: 30px;">数学</div>
              </div>
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
          <div class="preview-footer" @click.stop="handlePreview">
            <el-icon style="margin-right:4px">
              <FullScreen />
            </el-icon>
            全屏预览
          </div>
        </div>
      </div>
    </div>

    <!-- 题型分组名称修改 -->
    <el-dialog title="题型名称修改" v-model="groupNameEditVisible" width="343px" :show-close="false"
      class="group-name-dialog">
      <el-input v-model="groupName" placeholder="请输入题型名称" />
      <template #footer>
        <span class="dialog-footer">
          <button class="btn-dialog btn-cancel" @click="groupNameEditVisible = false">取消</button>
          <button class="btn-dialog btn-confirm" @click="changeGroupName">确认</button>
        </span>
      </template>
    </el-dialog>

    <!-- 删除题目 -->
    <el-dialog v-model="deleteVisible" width="343px" :show-close="false" class="group-name-dialog">
      <template #header>
        <span style="display:flex;align-items:center;gap:8px;justify-content:center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="12" fill="#FD8103" />
            <rect x="10.5" y="5" width="3" height="10" rx="1.5" fill="#fff" />
            <circle cx="12" cy="18" r="1.5" fill="#fff" />
          </svg>
          <span>删除题目</span>
        </span>
      </template>
      <span style="color: #000000;"><span style="font-weight: 600;">确定删除第{{ deleteQuestionIndex.slice(-1)
      }}题</span>。删除后，该试卷的题量以及分数会减少。</span>
      <template #footer>
        <span class="dialog-footer">
          <button class="btn-dialog btn-cancel" @click="deleteVisible = false">取消</button>
          <button class="btn-dialog btn-confirm" @click="deleteQuestion">确认</button>
        </span>
      </template>
    </el-dialog>

    <!-- 换题 -->
    <el-dialog v-model="changeQuestionVisible" width="876px" class="change-question-dialog">
      <template #header>
        <div class="cq-header">
          <div class="cq-header-left">
            <span class="cq-title">替换题目</span>
            <span class="cq-subtitle">第1题 | 单选题</span>
          </div>
        </div>
      </template>
      <div class="cq-label-row">
        <span class="cq-label">可替换题目</span>
        <span class="cq-label-underline"></span>
      </div>
      <div class="cq-label-alert">
        <div>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" fill="#EE0000" />
            <path d="M8 4.5V9" stroke="white" stroke-width="1.5" stroke-linecap="round" />
            <circle cx="8" cy="11" r="0.8" fill="white" />
          </svg>
        </div>
        <div style="padding-bottom: 8px;">默认当前题条件一致的题目</div>
      </div>
      <div class="cq-list">
        <div class="cq-item" @click="selectedQuestion = q" :class="{ 'active': q === selectedQuestion }"
          v-for="(q, n) in replaceQuestions" :key="n">
          <el-radio v-model="selectedQuestion" :value="q" />
          <div class="cq-item-content">
            <div class="cq-item-header">
              <span class="cq-item-num">{{ n + 1 }}.</span>
              <span class="cq-item-text">{{ q.text }}</span>
            </div>
            <div class="cq-item-options">
              <span class="cq-option" v-for="opt in q.options" :key="opt.label">{{ opt.label }}. {{ opt.text }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="cq-pagination">
        <!-- 中文 -->
        <el-config-provider :locale="zhCn">
          <el-pagination v-model:current-page="cqCurrentPage" :page-size="[10, 20, 30, 40]" :total="cqTotal"
            layout="total,sizes, prev, pager, next, jumper" style="width: 100%; display: flex; justify-content: center;"
            background />
        </el-config-provider>
      </div>
      <template #footer>
        <span class="cq-footer-btns">
          <button class="cq-btn cq-btn-cancel" @click="changeQuestionVisible = false">取消</button>
          <button class="cq-btn cq-btn-confirm" @click="submitChangeQuestion">确认</button>
        </span>
      </template>
    </el-dialog>

    <!-- 添加题目 -->
    <AddDialog v-model:visible="addVisible" />

    <!-- 全屏预览 -->
    <el-dialog :model-value="previewVisible" @close="previewVisible = false" width="100vw" top="0"
      class="exam-overview-dialog">
      <!-- Page navigation -->
      <div class="eo-pages-nav" v-if="previewTotalPages > 1">
        <button class="eo-nav-btn" :disabled="previewCurrentPage === 0" @click="prevPage">← 上一页</button>
        <span class="eo-nav-info">第 {{ previewCurrentPage + 1 }} / {{ previewTotalPages }} 页</span>
        <button class="eo-nav-btn" :disabled="previewCurrentPage === previewTotalPages - 1" @click="nextPage">下一页
          →</button>
      </div>

      <!-- Loading state -->
      <div v-if="previewMeasuring" class="eo-loading">
        <span>加载中...</span>
      </div>

      <!-- Page display -->
      <template v-for="(page, pIdx) in previewPages" :key="pIdx">
        <div v-show="pIdx === previewCurrentPage && !previewMeasuring" class="exam-overview">
          <div class="eo-page">
            <div class="eo-side">
              <!-- Left side blocks -->
              <template v-for="(bi, bIdx) in page.left" :key="'l-' + bi">
                <template v-if="previewBlocks[bi]?.type === 'header'">
                  <div class="eo-header-block">
                    <div class="eo-secret">
                      <div>绝密★启用前</div>
                      <img src="@/assets/picture/2d-code.png" alt="">
                    </div>
                    <div class="eo-title">
                      {{ paperName }}
                      <div style="font-size: 28px; letter-spacing: 30px;">数学</div>
                    </div>
                    <div class="eo-header">
                      <div class="eo-student-info">
                        <div class="eo-info-row">
                          <span class="eo-info-label">姓名</span>
                          <span class="eo-info-underline"></span>
                        </div>
                        <div class="eo-info-row">
                          <span class="eo-info-label">班级</span>
                          <span class="eo-info-underline"></span>
                        </div>
                        <div class="eo-info-row">
                          <span class="eo-info-label">学号</span>
                          <span class="eo-info-underline"></span>
                        </div>
                      </div>
                      <div class="eo-barcode-right">
                        <div class="eo-barcode-grid">
                          <div class="eo-barcode-col">
                            <svg class="eo-barcode-star" width="16" height="16" viewBox="0 0 16 16" fill="none">
                              <path
                                d="M8 0L10.472 5.528L16 6.944L12 11.416L12.944 17L8 14.472L3.056 17L4 11.416L0 6.944L5.528 5.528L8 0Z"
                                fill="#1A1A1A" />
                            </svg>
                            <span class="eo-barcode-label">短<br />学<br />号</span>
                          </div>
                          <div class="eo-barcode-rows">
                            <div class="eo-barcode-row">
                              <span v-for="n in 10" :key="n - 1" class="eo-barcode-cell">[{{ n - 1 }}]</span>
                            </div>
                            <div class="eo-barcode-row">
                              <span v-for="n in 10" :key="n - 1" class="eo-barcode-cell">[{{ n - 1 }}]</span>
                            </div>
                            <div class="eo-barcode-row">
                              <span v-for="n in 10" :key="n - 1" class="eo-barcode-cell">[{{ n - 1 }}]</span>
                            </div>
                            <div class="eo-barcode-row">
                              <span v-for="n in 10" :key="n - 1" class="eo-barcode-cell">[{{ n - 1 }}]</span>
                            </div>
                          </div>
                        </div>
                        <div class="eo-barcode-area">贴条码区域</div>
                      </div>
                    </div>
                    <div class="eo-notice">
                      <span>注意事项：</span>
                      <p>1.答卷前，考生务必将自己的姓名、准考证号、座位号填写在答题卡和试卷指定位置上。</p>
                      <p>2. 作答选择题时，选出每小题答案后，用 2B 铅笔把答题卡上对应题目的答案标号涂黑；如需改动，用橡皮擦干净后，再选涂其他答案标号。写在试卷上的答案无效。</p>
                      <p>3. 作答非选择题时，必须使用黑色字迹的签字笔或钢笔在答题卡各题目的答题区域内书写，超出答题区域书写的答案无效；不得使用铅笔、红色笔或涂改液（修正带）修改。</p>
                      <p>4. 保持答题卡整洁，不得折叠、污损，严禁在答题卡上作任何标记。</p>
                      <p>5. 考试结束后，将本试卷和答题卡一并交回。</p>
                      <p>6.注意事项补充（视考试而定）：允许使用直尺、圆规、三角板，但不得使用计算器（除非特别注明）。本卷可能包含附加题，附加题得分计入总分（或不计入，请留意说明）。</p>
                    </div>
                  </div>
                </template>
                <div v-else-if="previewBlocks[bi]?.type === 'section'" class="eo-section-title">{{
                  previewBlocks[bi]?.label }}</div>
                <div v-else-if="previewBlocks[bi]?.type === 'question'" class="eo-question">
                  <div v-if="previewBlocks[bi]?.question?.type === 'choice'" class="eo-q-text">
                    <span>{{ previewBlocks[bi].qIdx + 1 }}.</span>
                    <span>({{ previewBlocks[bi]?.question?.score }}分)</span>
                    {{ previewBlocks[bi]?.question?.text }}
                  </div>
                  <div v-if="previewBlocks[bi]?.question?.type === 'choice' && previewBlocks[bi]?.question?.options"
                    class="eo-options">
                    <span v-for="opt in previewBlocks[bi]?.question?.options" :key="opt.label" class="eo-option">
                      <span class="eo-opt-label">{{ opt.label }}.</span>
                      <span>{{ opt.text }}</span>
                    </span>
                  </div>
                  <div v-else-if="previewBlocks[bi]?.question?.type === 'fill'" class="eo-q-text">
                    <span>{{ previewBlocks[bi].qIdx + 1 }}.</span>
                    <span>({{ previewBlocks[bi]?.question?.score }}分)</span>
                    {{ previewBlocks[bi]?.question?.text }}
                  </div>
                  <div v-else-if="previewBlocks[bi]?.question?.type === 'shortAnswer'" class="eo-q-text">
                    <span>{{ previewBlocks[bi].qIdx + 1 }}.</span>
                    <span>({{ previewBlocks[bi]?.question?.score }}分)</span>
                    {{ previewBlocks[bi]?.question?.text }}
                  </div>
                </div>
              </template>
            </div>

            <div class="eo-divider"></div>

            <div class="eo-side">
              <!-- Right side blocks -->
              <template v-for="(bi, bIdx) in page.right" :key="'r-' + bi">
                <div v-if="previewBlocks[bi]?.type === 'section'" class="eo-section-title">{{ previewBlocks[bi]?.label
                  }}</div>
                <div v-else-if="previewBlocks[bi]?.type === 'question'" class="eo-question">
                  <div v-if="previewBlocks[bi]?.question?.type === 'choice'" class="eo-q-text">
                    <span>{{ previewBlocks[bi].qIdx + 1 }}.</span>
                    <span>({{ previewBlocks[bi]?.question?.score }}分)</span>
                    {{ previewBlocks[bi]?.question?.text }}
                  </div>
                  <div v-if="previewBlocks[bi]?.question?.type === 'choice' && previewBlocks[bi]?.question?.options"
                    class="eo-options">
                    <span v-for="opt in previewBlocks[bi]?.question?.options" :key="opt.label" class="eo-option">
                      <span class="eo-opt-label">{{ opt.label }}.</span>
                      <span>{{ opt.text }}</span>
                    </span>
                  </div>
                  <div v-else-if="previewBlocks[bi]?.question?.type === 'fill'" class="eo-q-text">
                    <span>{{ previewBlocks[bi].qIdx + 1 }}.</span>
                    <span>({{ previewBlocks[bi]?.question?.score }}分)</span>
                    {{ previewBlocks[bi]?.question?.text }}
                  </div>
                  <div v-else-if="previewBlocks[bi]?.question?.type === 'shortAnswer'" class="eo-q-text">
                    <span>{{ previewBlocks[bi].qIdx + 1 }}.</span>
                    <span>({{ previewBlocks[bi]?.question?.score }}分)</span>
                    {{ previewBlocks[bi]?.question?.text }}
                  </div>
                </div>
              </template>
              <div v-if="!page.right || page.right.length === 0" class="eo-side-empty"></div>
            </div>
          </div>
        </div>
      </template>

      <!-- Hidden measurement area -->
      <div ref="measureRef" class="eo-measure">
        <template v-for="(block, bi) in previewBlocks" :key="'m-' + bi">
          <div class="eo-measure-block">
            <template v-if="block.type === 'header'">
              <div class="eo-secret">
                <div>绝密★启用前</div>
                <img src="@/assets/picture/2d-code.png" alt="">
              </div>
              <div class="eo-title">
                {{ paperName }}
                <div style="font-size: 28px; letter-spacing: 30px;">数学</div>
              </div>
              <div class="eo-header">
                <div class="eo-student-info">
                  <div class="eo-info-row">
                    <span class="eo-info-label">姓名</span>
                    <span class="eo-info-underline"></span>
                  </div>
                  <div class="eo-info-row">
                    <span class="eo-info-label">班级</span>
                    <span class="eo-info-underline"></span>
                  </div>
                  <div class="eo-info-row">
                    <span class="eo-info-label">学号</span>
                    <span class="eo-info-underline"></span>
                  </div>
                </div>
                <div class="eo-barcode-right">
                  <div class="eo-barcode-grid">
                    <div class="eo-barcode-col">
                      <svg class="eo-barcode-star" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path
                          d="M8 0L10.472 5.528L16 6.944L12 11.416L12.944 17L8 14.472L3.056 17L4 11.416L0 6.944L5.528 5.528L8 0Z"
                          fill="#1A1A1A" />
                      </svg>
                      <span class="eo-barcode-label">短<br />学<br />号</span>
                    </div>
                    <div class="eo-barcode-rows">
                      <div class="eo-barcode-row">
                        <span v-for="n in 10" :key="n - 1" class="eo-barcode-cell">[{{ n - 1 }}]</span>
                      </div>
                      <div class="eo-barcode-row">
                        <span v-for="n in 10" :key="n - 1" class="eo-barcode-cell">[{{ n - 1 }}]</span>
                      </div>
                      <div class="eo-barcode-row">
                        <span v-for="n in 10" :key="n - 1" class="eo-barcode-cell">[{{ n - 1 }}]</span>
                      </div>
                      <div class="eo-barcode-row">
                        <span v-for="n in 10" :key="n - 1" class="eo-barcode-cell">[{{ n - 1 }}]</span>
                      </div>
                    </div>
                  </div>
                  <div class="eo-barcode-area">贴条码区域</div>
                </div>
              </div>
              <div class="eo-notice">
                <span>注意事项：</span>
                <p>1.答卷前，考生务必将自己的姓名、准考证号、座位号填写在答题卡和试卷指定位置上。</p>
                <p>2. 作答选择题时，选出每小题答案后，用 2B 铅笔把答题卡上对应题目的答案标号涂黑；如需改动，用橡皮擦干净后，再选涂其他答案标号。写在试卷上的答案无效。</p>
                <p>3. 作答非选择题时，必须使用黑色字迹的签字笔或钢笔在答题卡各题目的答题区域内书写，超出答题区域书写的答案无效；不得使用铅笔、红色笔或涂改液（修正带）修改。</p>
                <p>4. 保持答题卡整洁，不得折叠、污损，严禁在答题卡上作任何标记。</p>
                <p>5. 考试结束后，将本试卷和答题卡一并交回。</p>
                <p>6.注意事项补充（视考试而定）：允许使用直尺、圆规、三角板，但不得使用计算器（除非特别注明）。本卷可能包含附加题，附加题得分计入总分（或不计入，请留意说明）。</p>
              </div>
            </template>
            <div v-else-if="block.type === 'section'" class="eo-section-title">{{ block.label }}</div>
            <div v-else-if="block.type === 'question'" class="eo-question">
              <div v-if="block.question?.type === 'choice'" class="eo-q-text">
                <span>{{ block.qIdx + 1 }}.</span>
                <span>({{ block.question?.score }}分)</span>
                {{ block.question?.text }}
              </div>
              <div v-if="block.question?.type === 'choice' && block.question?.options" class="eo-options">
                <span v-for="opt in block.question?.options" :key="opt.label" class="eo-option">
                  <span class="eo-opt-label">{{ opt.label }}.</span>
                  <span>{{ opt.text }}</span>
                </span>
              </div>
              <div v-else-if="block.question?.type === 'fill'" class="eo-q-text">
                <span>{{ block.qIdx + 1 }}.</span>
                <span>({{ block.question?.score }}分)</span>
                {{ block.question?.text }}
              </div>
              <div v-else-if="block.question?.type === 'shortAnswer'" class="eo-q-text">
                <span>{{ block.qIdx + 1 }}.</span>
                <span>({{ block.question?.score }}分)</span>
                {{ block.question?.text }}
              </div>
            </div>
          </div>
        </template>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.question-card[draggable="true"] {
  cursor: grab;
  user-select: none;
}

.question-card[draggable="true"]:active {
  cursor: grabbing;
}

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
  align-items: stretch;
  margin-bottom: 24px;
  gap: 24px;
}

.barcode-right {
  display: flex;
  gap: 16px;
  flex-shrink: 0;
}

.student-info {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 140px;
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
  column-gap: 3px;

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
  margin-right: 0;
  margin-left: 0;
}

/* 拖拽手柄在折叠箭头左边 */
.q-collapse :deep(.el-collapse-item__header) {
  position: relative;
  padding-left: 28px;
}

.q-collapse .q-title-wrap {
  display: flex;
  align-items: center;
  width: 100%;
  cursor: grab;
  user-select: none;
}

.q-collapse .q-title-wrap:active {
  cursor: grabbing;
}

.q-collapse .q-title-wrap .drag-handle {
  position: absolute;
  left: 4px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
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

.preview-footer {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 16px;
  border-top: 1px solid #eee;
  cursor: pointer;
  color: #075DFE;
  font-size: 14px;
  font-weight: 600;
  transition: background 0.2s;
}

.preview-footer:hover {
  background: #f5f7fa;
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

  .pp-secret {
    display: flex;
    flex-direction: column;
    width: 88px;
    height: 88px;
  }
}

.pp-title {
  text-align: center;
  font-family: 'Songti SC', serif;
  font-size: 24px;
  font-weight: 700;
  line-height: 40px;
  color: #1A1A1A;
  letter-spacing: 0.05em;
  margin-bottom: 16px;
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

<style lang="scss">
/* 题型分组名称修改弹窗 - 非 scoped 因 el-dialog teleport */
.group-name-dialog {
  --el-dialog-margin-top: 0;
  top: 50vh;
  border-radius: 12px;

  .el-dialog__header {
    text-align: center;
    padding: 24px 0 0;
    font-size: 18px;
    font-weight: 600;
    color: #000;
  }


  .el-dialog__body {
    padding: 28px 10px 0;


    .el-input__wrapper {
      border-radius: 6px;
      border: 1px solid #D9D9D9;
      box-shadow: none;
      padding: 0 12px;
      height: 36px;

      .el-input__inner {
        font-size: 14px;
        color: #000;


        &::placeholder {
          color: #999;
        }
      }
    }
  }

  .el-dialog__footer {
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    height: 80px;

    .dialog-footer {
      display: inline-flex;
      gap: 32px;

      .btn-dialog {
        width: 95px;
        padding: 4px 16px;
        border-radius: 4px;
        font-size: 16px;
        font-weight: 400;
        border: none;
        cursor: pointer;
        line-height: 32px;
      }

      .btn-cancel {
        background: #D9D9D9;
        color: #000;
      }

      .btn-confirm {
        background: #075DFE;
        line-height: 20px;
        border: none;
      }

      .btn-cancel-outline {
        background: #fff;
        color: #666;
        border: 1px solid #999;
      }

      .btn-confirm-delete {
        background: #0F66F1;
        color: #fff;
      }
    }
  }
}

/* 换题弹窗 */
.change-question-dialog {
  --el-dialog-margin-top: 0;
  top: 15vh;
  height: 820px;

  .el-dialog {
    border-radius: 12px;
  }

  .el-dialog__header {
    padding: 16px 16px 0;
    margin-bottom: 10px;
  }

  .cq-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .cq-header-left {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .cq-title {
    font-size: 16px;
    font-weight: 600;
    color: #000;
  }

  .cq-subtitle {
    font-size: 12px;
    color: #666;
  }

  .cq-close {
    width: 24px;
    height: 24px;
    border: none;
    background: none;
    cursor: pointer;
    padding: 0;
  }

  .el-dialog__body {
    padding: 0 16px 16px;
  }

  .cq-label-alert {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #EE0000;
    font-size: 14px;
    margin-top: 12px;

  }

  .cq-label-row {
    display: flex;
    flex-direction: column;
    margin-bottom: 12px;
  }

  .cq-label {
    font-size: 14px;
    font-weight: 600;
    color: #075DFE;
    margin-bottom: 4px;
  }

  .cq-label-underline {
    height: 2px;
    width: 70px;
    background: #075DFE;
  }

  .cq-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    overflow-y: auto;
  }

  .cq-item {
    display: flex;
    gap: 0;
    align-items: flex-start;
    margin: 2px;
    border-radius: 8px;
    padding: 12px;
    background: #fff;
    min-height: 100px;

    .el-radio {
      margin-right: 10px;

      .el-radio__label {
        display: none;
      }
    }

    &:hover {
      cursor: pointer;
    }

    &.active {
      background: #F3F8FE;
      box-shadow: 0 0 4px 0px #075DFE;
    }
  }

  .cq-radio {
    position: relative;
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    margin-top: 4px;
    cursor: pointer;

    input {
      position: absolute;
      opacity: 0;

      &:checked+.cq-radio-inner {
        border-color: #0F66F1;
        background: #0F66F1;

        &::after {
          content: '';
          position: absolute;
          top: 4px;
          left: 4px;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #fff;
        }
      }
    }
  }

  .cq-radio-inner {
    display: block;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 1px solid #D9D9D9;
    position: relative;
  }

  .cq-item-content {
    flex: 1;
    min-width: 0;
  }

  .cq-item-header {
    display: flex;
    gap: 4px;
    margin-bottom: 8px;
  }

  .cq-item-num {
    font-size: 16px;
    font-weight: 700;
    color: #000;
    flex-shrink: 0;
    font-family: 'Songti SC', serif;
  }

  .cq-item-text {
    font-size: 16px;
    font-weight: 700;
    color: #000;
    line-height: 22px;
    font-family: 'Songti SC', serif;
    letter-spacing: 5%;
    line-height: 24px;
  }

  .cq-item-options {
    display: flex;
    flex-wrap: wrap;
    gap: 8px 24px;
  }

  .cq-option {
    font-size: 16px;
    font-weight: 700;
    color: #000;
    font-family: 'Songti SC', serif;
  }

  .cq-pagination {
    display: flex;
    justify-content: center;
    margin-top: 12px;
    min-height: 40px;
  }

  .el-dialog__footer {
    padding: 0 16px 16px;
  }

  .cq-footer-btns {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }

  .cq-btn {
    width: 95px;
    padding: 4px 16px;
    border-radius: 4px;
    font-size: 16px;
    font-weight: 400;
    cursor: pointer;
    line-height: 32px;
    text-align: center;
  }

  .cq-btn-cancel {
    background: #D9D9D9;
    color: #000;
    border: none;
  }

  .cq-btn-confirm {
    background: #075DFE;
    color: #fff;
    border: none;
  }
}


.page-wrapper {
  display: flex;
  justify-content: center;
  /* 让试卷居中，或者你可以调整位置 */
  padding: 20px;
}

.exam-paper {
  position: relative;
  /* 关键：成为 SVG 的定位参考 */
  width: 210mm;
  /* 或者你需要的宽度，比如 A4 大小 */
  min-height: 297mm;
  background: white;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  /* 如果试卷在右侧，可以用 margin-left: auto; 或 flex 控制 */
}

/* SVG 覆盖整个试卷容器 */
.markers {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  /* 让鼠标可以穿透点击试卷内容 */
  z-index: 1;
}

/* 四个角的定位点 */
.corner {
  position: absolute;
  /* 或者直接用 rect 的 x/y 属性 */
}

/* 用 rect 的 x/y 属性定位，或者用 CSS 的 top/left */
.markers .tl {
  x: 5mm;
  y: 5mm;
}

.markers .tr {
  x: calc(100% - 11mm);
  y: 5mm;
}

.markers .bl {
  x: 5mm;
  y: calc(100% - 11mm);
}

.markers .br {
  x: calc(100% - 11mm);
  y: calc(100% - 11mm);
}

/* 试卷内容 */
.content {
  padding: 20mm;
  position: relative;
  z-index: 2;
  /* 确保内容在 SVG 上层 */
}
</style>

<style lang="scss">
.cq-pagination .el-pagination.is-background .el-pager li.is-active {
  background: #075DFE !important;
  color: #fff !important;
}
</style>

<style>
.exam-overview-dialog .el-dialog {
  max-width: 100vw;
  margin: 0 auto;
}

.exam-overview-dialog .el-dialog__header {
  display: none;
}

.exam-overview-dialog .el-dialog__body {
  padding: 0;
}

.exam-overview {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
}

.eo-paper {
  padding: 24px;
  font-family: 'FangSong_GB2312', 'FangSong', serif;
  color: #1A1A1A;
  line-height: 1.8;
}

.eo-empty {
  padding: 40px;
  text-align: center;
  color: #999;
  font-family: monospace;
  font-size: 14px;
}

.eo-secret {
  display: flex;
  flex-direction: column;
  width: 88px;
  height: 88px;
}

.eo-title {
  text-align: center;
  font-family: 'Songti SC', serif;
  font-size: 24px;
  font-weight: 700;
  line-height: 40px;
  color: #1A1A1A;
  letter-spacing: 0.05em;
  margin-bottom: 16px;
}

.eo-header {
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  margin-bottom: 24px;
  gap: 24px;
}

.eo-student-info {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.eo-info-row {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 140px;
}

.eo-info-label {
  width: 28px;
  font-family: 'FangSong_GB2312', 'FangSong', serif;
  font-size: 14px;
  line-height: 22px;
  color: #1A1A1A;
  flex-shrink: 0;
}

.eo-info-underline {
  flex: 1;
  height: 0;
  border-bottom: 1px solid #1A1A1A;
}

.eo-barcode-right {
  display: flex;
  gap: 16px;
  flex-shrink: 0;
}

.eo-barcode-grid {
  width: 306px;
  height: 123px;
  border: 1px solid #1A1A1A;
  border-radius: 4px;
  overflow: hidden;
  flex-shrink: 0;
  display: flex;
}

.eo-barcode-col {
  width: 42px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  border-right: 1px solid #1A1A1A;
  flex-shrink: 0;
}

.eo-barcode-star {
  flex-shrink: 0;
}

.eo-barcode-label {
  font-family: 'KaiTi_GB2312', 'KaiTi', serif;
  font-size: 12px;
  line-height: 18px;
  color: #1A1A1A;
  text-align: center;
}

.eo-barcode-rows {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.eo-barcode-row {
  flex: 1;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #1A1A1A;
  padding-left: 10px;
  column-gap: 3px;
}

.eo-barcode-row:last-child {
  border-bottom: none;
}

.eo-barcode-cell {
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

.eo-barcode-area {
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

.eo-notice {
  width: 100%;
  font-family: 'PingFang SC', sans-serif;
  font-weight: 600;
  line-height: 32px;
}

.eo-notice span {
  font-size: large;
}

.eo-notice p {
  margin: 0;
}

.eo-section-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
  line-height: 24px;
}

.eo-question {
  margin-bottom: 16px;
  font-weight: 700;
  letter-spacing: 0.05em;
}

.eo-q-text {
  font-family: 'Songti SC', 'SimSun', serif;
  font-size: 15px;
  line-height: 28px;
  color: #1A1A1A;
  margin-bottom: 8px;
}

.eo-options {
  display: flex;
  flex-wrap: wrap;
  gap: 32px 60px;
  font-family: 'Songti SC', 'SimSun', serif;
  font-size: 14px;
  line-height: 26px;
  color: #1A1A1A;
}

.eo-option {
  display: flex;
  gap: 4px;
}

.eo-opt-label {
  font-weight: 600;
}

/* ===== Page navigation ===== */

.eo-pages-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 12px 24px;
  border-bottom: 1px solid #eee;
}

.eo-nav-btn {
  padding: 6px 16px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  font-size: 14px;
  color: #333;
  transition: all 0.2s;
}

.eo-nav-btn:hover:not(:disabled) {
  border-color: #075DFE;
  color: #075DFE;
}

.eo-nav-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.eo-nav-info {
  font-size: 14px;
  color: #666;
  font-weight: 600;
}

.eo-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  font-size: 16px;
  color: #999;
}

/* ===== Page layout ===== */
.eo-page {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  gap: 0;
  min-height: 0;
  height: var(--eo-page-height);
  overflow: hidden;
}

.eo-side {
  flex: 1;
  width: 50%;
  overflow: hidden;
  box-sizing: border-box;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.12);
  border-radius: 4px;
}

.eo-divider {
  width: 2px;
  background: #D9D9D9;
  flex-shrink: 0;
  margin: 0 12px;
}

.eo-side-empty {
  min-height: 100px;
}

.eo-measure {
  visibility: hidden;
  position: fixed;
  top: -9999px;
  left: -9999px;
}
</style>
