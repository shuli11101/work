<script setup>
import { ref, computed } from 'vue'

defineProps({
  visible: { type: Boolean, default: false },
})

const emit = defineEmits(['close'])

const chapterList = ref([
  { name: '第一章 勾股定理', checked: false },
  { name: '第二章 勾股定理', checked: false },
  { name: '第三章 勾股定理', checked: false },
  { name: '第四章 勾股定理', checked: false },
  { name: '第五章 勾股定理', checked: false },
])

const selectedCount = computed(() => chapterList.value.filter(c => c.checked).length)

const toggleChapter = (item) => {
  item.checked = !item.checked
  selectedCount.value = chapterList.value.filter(c => c.checked).length
}

const handleClose = () => {
  // console.log(chapterList.value)
  emit('close', chapterList.value)
}
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="visible" class="dialog-overlay" @click.self="handleClose">
        <div class="dialog-box">
          <!-- 标题 -->
          <div class="dialog-title">选择章节范围</div>
          <!-- 当前教材 -->
          <div class="dialog-textbook">当前教材:xxxxxxxxx人教版·八年级上册</div>

          <!-- 章节列表区域 -->
          <div class="chapter-area">
            <div class="chapter-header">章节目录</div>
            <div class="chapter-divider"></div>

            <div class="chapter-list">
              <div v-for="(item, index) in chapterList" :key="index" class="chapter-item" @click="toggleChapter(item)">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect v-if="!item.checked" x="0.5" y="0.5" width="15" height="15" rx="3.5" stroke="#D9D9D9"
                    fill="#fff" />
                  <rect v-else x="0.5" y="0.5" width="15" height="15" rx="3.5" fill="#0F66F1" stroke="#0F66F1" />
                  <path v-if="item.checked" d="M3.67 8.01L6.34 10.68L12.34 4.68" stroke="#fff" stroke-width="1.5"
                    stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <span class="chapter-name">{{ item.name }}</span>
              </div>
            </div>
          </div>

          <!-- 底部 -->
          <div class="dialog-footer">
            <span class="footer-count">
              已选 <em>{{ selectedCount }}</em> 个章节
            </span>
            <button class="confirm-btn" @click="handleClose">确认</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
.dialog-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.dialog-box {
  width: 381px;
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  box-sizing: border-box;
  position: relative;
}

.dialog-title {
  font-size: 18px;
  font-weight: 600;
  color: #000;
  line-height: 25px;
  margin-bottom: 8px;
}

.dialog-textbook {
  font-size: 14px;
  font-weight: 600;
  color: #666;
  line-height: 20px;
  margin-bottom: 12px;
}

.chapter-area {
  border: 1px solid #D9D9D9;
  border-radius: 9px;
  padding: 12px;
  min-height: 373px;
  box-sizing: border-box;
}

.chapter-header {
  font-size: 14px;
  font-weight: 600;
  color: #000;
  line-height: 20px;
  margin-bottom: 8px;
}

.chapter-divider {
  height: 1px;
  background: #D9D9D9;
  margin-bottom: 12px;
}

.chapter-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.chapter-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 0;
  cursor: pointer;
  user-select: none;
}

.chapter-name {
  font-size: 14px;
  font-weight: 600;
  color: #000;
  line-height: 20px;
}

.dialog-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
}

.footer-count {
  font-size: 14px;
  font-weight: 600;
  color: #000;
  line-height: 25px;

  em {
    font-style: normal;
    font-size: 18px;
    color: #075DFE;
  }
}

.confirm-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  width: 69px;
  background: #075DFE;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  line-height: 1;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
