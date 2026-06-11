<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  centerValue: { type: Number, default: 0 },
  centerUnit: { type: String, default: '总分数' },
  legends: { type: Array, default: () => [] },
})

const chartRef = ref(null)
let chartInstance = null

function initChart() {
  if (!chartRef.value) return

  if (chartInstance) {
    chartInstance.dispose()
  }

  chartInstance = echarts.init(chartRef.value)
  chartInstance.setOption({
    tooltip: { trigger: 'item' },
    series: [
      {
        type: 'pie',
        radius: ['65%', '85%'],
        avoidLabelOverlap: false,
        label: {
          show: true,
          position: 'center',
          formatter: `{a|${props.centerValue}}\n{b|${props.centerUnit}}`,
          rich: {
            a: { fontSize: 40, fontWeight: 600, lineHeight: 56, color: '#000000' },
            b: { fontSize: 18, fontWeight: 400, lineHeight: 25, color: '#5A6382' }
          }
        },
        emphasis: { scale: false },
        data: props.legends.map(item => ({
          value: item.value,
          name: item.name,
          itemStyle: { color: item.color }
        })),
      },
    ],
  })
  chartInstance.resize()
}

watch(() => [props.centerValue, props.legends], () => {
  nextTick(initChart)
}, { deep: true })

function handleResize() {
  chartInstance?.resize()
}

onMounted(() => {
  nextTick(initChart)
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  chartInstance?.dispose()
})
</script>

<template>
  <div class="score-area">
    <div ref="chartRef" class="score-chart"></div>
    <div class="chart-legend">
      <div class="legend-item" v-for="item in legends" :key="item.name">
        <span class="dot" :style="{ backgroundColor: item.color }"></span>
        <div class="legend-type">
          <span :style="{ color: item.color }">{{ item.name }}</span>
          <span class="legend-num">{{ item.value }}分 ({{ item.percent || '0%' }})</span>
        </div>
      </div>
    </div>
  </div>
</template>


<style lang="scss" scoped>
.score-area {
  display: flex;
  align-items: center;
  gap: 12px;

  .score-chart {
    width: 217px;
    height: 217px;
    flex-shrink: 0;
  }

  .chart-legend {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 48px;
    padding-left: 70px;

    .legend-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      font-weight: 600;

      .dot {
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
      }

      .legend-type {
        display: flex;
        width: 100%;
        align-items: center;
        gap: 50px;
        justify-content: space-between;
        width: 200px;

        .legend-num {
          display: flex;
          justify-content: center;
          font-size: 16px;
          font-weight: 600;
        }
      }
    }
  }
}
</style>
