<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  pages: { type: Array, default: () => [] },
  visible: { type: Boolean, default: false },
})

const emit = defineEmits(['update:visible'])

const currentSheet = ref(0)

const visible = computed(() => props.visible)

const sheets = [
  { side: '1', pages: [0, 1] },
  { side: '2', pages: [2, 3] },
]

function open() {
  currentSheet.value = 0
  // visible is controlled by parent via prop
}

function close() {
  emit('update:visible', false)
}

defineExpose({ open })
</script>

<template>
  <el-dialog :model-value="visible" @close="close" width="1796px" height="1270px" destroy-on-close
    class="exam-overview-dialog">
    <div class="exam-overview">
      <div class="sheet-tabs">
        <button v-for="(sheet, index) in sheets" :key="index" class="sheet-tab"
          :class="{ active: currentSheet === index, inactive: currentSheet !== index }" @click="currentSheet = index">
          {{ sheet.side }}
        </button>
      </div>
      <div class="sheet-view">
        <div class="sheet-page left-page">
          <img :src="pages[sheets[currentSheet].pages[0]]" class="sheet-img" />
        </div>
        <div class="sheet-divider"></div>
        <div class="sheet-page right-page">
          <img :src="pages[sheets[currentSheet].pages[1]]" class="sheet-img" />
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<style lang="scss" scoped>
.exam-overview-dialog {
  :deep(.el-dialog__header) {
    display: none;
  }

  :deep(.el-dialog__body) {
    padding: 0;
  }
}

.exam-overview {
  background: #ffffff;
  border-radius: 8px;
  overflow: hidden;
}

.sheet-tabs {
  display: flex;
  flex-direction: column;
  justify-self: center;
  gap: 32px;
  padding: 0 0 12px;
  background: #fff;
  position: absolute;
  top: 88px;
  right: 8px;
  z-index: 10;

  .sheet-tab {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: 1px solid #D9D9D9;
    background: #fff;
    font-size: 24px;
    font-weight: 600;
    color: #666;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;


    &.active {
      background: #075DFE;
      color: #fff;
    }

    &.inactive {
      background-color: #D9D9D9;
      color: white;
    }
  }
}


.sheet-view {
  display: flex;
  align-items: flex-start;
}

.sheet-page {
  flex: 1;
  max-width: 50%;
  overflow: hidden;
  overflow: hidden;

  .sheet-img {
    width: 100%;
    height: auto;
    display: block;
  }
}

.sheet-divider {
  width: 2px;
  background: #D9D9D9;
  align-self: stretch;
}
</style>
