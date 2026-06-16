import Mock from 'mockjs'

const weakPointPool = [
  { name: '三角函数', backgroundColor: '#FEEAE9', color: '#EE0000' },
  { name: '立体几何', backgroundColor: '#FFF0E0', color: '#FF8800' },
  { name: '数列', backgroundColor: '#FFF8E0', color: '#EEBB00' },
  { name: '概率统计', backgroundColor: '#FFF0F0', color: '#EE7777' },
  { name: '解析几何', backgroundColor: '#FFF0E0', color: '#FF6600' },
  { name: '函数与导数', backgroundColor: '#FFF3E6', color: '#FF9933' },
  { name: '平面向量', backgroundColor: '#FFF0EB', color: '#EE7755' },
  { name: '不等式', backgroundColor: '#E8F0FD', color: '#075DFE' },
  { name: '复数', backgroundColor: '#E6F7F3', color: '#00BB88' },
  { name: '排列组合', backgroundColor: '#FEEAED', color: '#EE3355' },
]

Mock.mock('/api/student/list', 'get', {
  code: 200,
  'list|20': [
    {
      checked: false,
      name: '@cname',
      'mastery|49-95': 1,
      'weakPoints': function () {
        const shuffled = [...weakPointPool].sort(() => Math.random() - 0.5)
        return shuffled.slice(0, 3)
      },
      difficulty: function () {
        if (this.mastery <= 50) return '薄弱'
        if (this.mastery <= 60) return '一般'
        return '良好'
      },
    },
  ],
})

// 知识点掌握度（用于计算简单/中等/困难）
Mock.mock('/api/knowledge/mastery', 'get', {
  code: 200,
  list: weakPointPool.map(({ name }) => ({
    name,
    'mastery|30-95': 1, // 掌握度越低，难度越高
  })),
})
