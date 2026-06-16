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
        <div class="legend-left">
          <span class="dot" :style="{ backgroundColor: item.color }"></span>
          <span class="legend-name" :style="{ color: item.color }">{{ item.name }}</span>
        </div>
        <div class="legend-stats">
          <span class="legend-value">{{ item.value }}分</span>
          <span class="legend-percent">({{ item.percent || '0%' }})</span>
        </div>
      </div>
    </div>
  </div>
</template>


<style lang="scss" scoped>
.score-area {
  display: flex;
  align-items: center;
  gap: 40px;

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
    row-gap: 40px;


    .legend-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 22px;
      font-size: 16px;
      font-weight: 600;
      font-family: 'PingFang SC', sans-serif;
      margin-right: 59px;

      .legend-left {
        display: flex;
        align-items: center;
        gap: 12px;
        flex-shrink: 0;

        .dot {
          display: inline-block;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .legend-name {
          flex-shrink: 0;
        }
      }

      .legend-stats {
        display: flex;
        align-items: center;
        gap: 0;

        .legend-value {
          color: #1A1A1A;
        }

        .legend-percent {
          color: #666666;
          margin-left: 4px;
        }
      }
    }
  }
}
</style>
