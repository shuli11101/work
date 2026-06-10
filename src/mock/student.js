import Mock from 'mockjs'

const weakPointPool = [
  '三角函数', '立体几何', '数列', '概率统计', '解析几何',
  '函数与导数', '平面向量', '不等式', '复数', '排列组合',
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
    },
  ],
})

// 知识点掌握度（用于计算简单/中等/困难）
Mock.mock('/api/knowledge/mastery', 'get', {
  code: 200,
  list: weakPointPool.map((name) => ({
    name,
    'mastery|30-95': 1, // 掌握度越低，难度越高
  })),
})