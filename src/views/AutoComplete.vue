<script setup>
import { Target, Layers, BookOpen, Trophy, Puzzle } from '@icon-park/vue-next'

// 功能卡片数据
const features = [
  { title: '靶向补弱', description: '基于学情数据，针对薄弱知识点智能组卷，精准提升', icon: Target, iconFill: '#4e9dff', backgroundColor: '#f3f7fd' },
  { title: '分层作业', description: '根据学生水平分层出题，因材施教，提高效率', icon: Layers, iconFill: '#00e1ca', backgroundColor: '#f2fdf9' },
  { title: '单元复习', description: '聚焦单元知识点覆盖，巩固学习成果，提升效率', icon: BookOpen, iconFill: 'url(#orangeGrad)', backgroundColor: '#fef8f3' },
  { title: '单元冲刺', description: '模拟真是考试环境，提升应试能力，冲刺高分', icon: Trophy, iconFill: 'url(#purpleGrad)', backgroundColor: '#f9f6ff' },
  { title: '自定义组合', description: '自由配置题目策略，满足个性化需求', icon: Puzzle, iconFill: 'url(#blueGrad)', backgroundColor: '#f5f9ff' },
]

</script>

<template>
  <svg width="0" height="0" style="position: absolute; visibility: hidden;">
    <defs>
      <linearGradient id="orangeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#fdc151" />
        <stop offset="100%" stop-color="#ffb03f" />
      </linearGradient>
      <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#c8b3ff" />
        <stop offset="100%" stop-color="#ae9cff" />
      </linearGradient>
      <linearGradient id="blueGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#3B82F6" />
        <stop offset="100%" stop-color="#93C5FD" />
      </linearGradient>
    </defs>
  </svg>
  <div class="home">
    <div class="header-content">
      <h2 class="title">AI智能组卷</h2>
      <p class="subtitle">基于人工智能技术</p>
    </div>
    <el-main class="home-main">
      <div class="card-layout">
        <div class="left-cards">
          <el-card class="card card-top-left" shadow="hover">
            <div class="feature-list">
              <div v-for="item in features" :key="item.title" class="feature-item"
                :style="{ backgroundColor: item.backgroundColor }">
                <el-icon :size="48" class="feature-icon">
                  <component :is="item.icon" theme="outline" :fill="item.iconFill" />
                </el-icon>
                <div class="feature-info">
                  <h3 class="feature-title">{{ item.title }}</h3>
                  <p class="feature-description">{{ item.description }}</p>
                </div>
                <div class="select-circle"></div>
              </div>
            </div>
          </el-card>
          <el-card class="card card-bottom-left" shadow="hover">
            左下
          </el-card>
        </div>
        <!-- 右侧 -->
        <el-card class="card card-right" shadow="hover">
          右侧
        </el-card>
      </div>
    </el-main>
  </div>
</template>

<style scoped lang="scss">
.home {
  padding: 20px;
  padding-top: 0;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.header-content {
  text-align: flex-start;
  margin-bottom: 20px;
}

.title {
  margin: 0 0 8px 0;
  font-size: 24px;
  color: #303133;
}

.subtitle {
  margin: 0;
  font-size: 14px;
  color: #909399;
}

.home-main {
  flex: 1;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  padding: 20px;
  --el-main-padding: 0px;
}

:deep(.el-main) {
  padding: 0 !important;
}

.card-layout {
  height: 100%;
  display: flex;
  gap: 16px;
}

.left-cards {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
}

.card {
  border-radius: 8px;
}

.card-top-left {
  flex: 0 0 auto;
}

.card-bottom-left {
  flex: 1;
}

.card-right {
  width: 280px;
  flex-shrink: 0;
}

.feature-list {
  display: flex;
  gap: 16px;
}

.feature-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 15px;
  border-radius: 8px;
  transition: background-color 0.2s;
  cursor: pointer;
  flex: 1;

  &:hover {
    background-color: #f5f7fa;
  }
}

.feature-icon {
  flex-shrink: 0;
  margin-top: 2px;
}

.select-circle {
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid #dcdfe6;
  background: #fff;
  transition: all 0.2s;
}

.feature-info {
  flex: 1;
  min-width: 0;
  text-align: center;

  .feature-title {
    margin: 0 0 14px 0;
    font-size: 20px;
    color: #303133;
  }

  .feature-description {
    font-size: 12px;
    line-height: 1.5;
  }
}
</style>
