// ===== 模拟试卷数据 =====
import Mock from 'mockjs'

// 选择题 10 题
const choiceQuestions = [
  {
    id: 'choice_1',
    type: 'choice',
    score: 5,
    text: '已知集合 A={x|x²-5x+6<0}, B={x∈Z| |x|<3}, 则 A∩B=',
    options: [
      { label: 'A', text: '{0,1,2}' },
      { label: 'B', text: '{1,2}' },
      { label: 'C', text: '{0,1}' },
      { label: 'D', text: '{-1,0,1}' },
    ],
    answer: 'B',
    difficulty: '简单',
  },
  {
    id: 'choice_2',
    type: 'choice',
    score: 5,
    text: '若复数 z 满足 (1+i)z = 2i，则 z 的虚部为',
    options: [
      { label: 'A', text: '1' },
      { label: 'B', text: 'i' },
      { label: 'C', text: '-1' },
      { label: 'D', text: '-i' },
    ],
    answer: 'A',
    difficulty: '简单',
  },
  {
    id: 'choice_3',
    type: 'choice',
    score: 5,
    text: '函数 f(x)=x³-3x 的单调递减区间为',
    options: [
      { label: 'A', text: '(-∞,-1)' },
      { label: 'B', text: '(-1,1)' },
      { label: 'C', text: '(1,+∞)' },
      { label: 'D', text: '(-∞,-1)∪(1,+∞)' },
    ],
    answer: 'B',
    difficulty: '中等',
  },
  {
    id: 'choice_4',
    type: 'choice',
    score: 5,
    text: '在 △ABC 中，a=√3, b=1, C=30°，则 c=',
    options: [
      { label: 'A', text: '1' },
      { label: 'B', text: '√2' },
      { label: 'C', text: '√3' },
      { label: 'D', text: '2' },
    ],
    answer: 'A',
    difficulty: '中等',
  },
  {
    id: 'choice_5',
    type: 'choice',
    score: 5,
    text: '已知数列 {aₙ} 满足 a₁=1, aₙ₊₁=2aₙ+1，则 a₅=',
    options: [
      { label: 'A', text: '15' },
      { label: 'B', text: '31' },
      { label: 'C', text: '63' },
      { label: 'D', text: '127' },
    ],
    answer: 'B',
    difficulty: '中等',
  },
  {
    id: 'choice_6',
    type: 'choice',
    score: 5,
    text: '若直线 2x-y+C=0 与圆 x²+y²=5 相切，则 C=',
    options: [
      { label: 'A', text: '±5' },
      { label: 'B', text: '±√5' },
      { label: 'C', text: '±3' },
      { label: 'D', text: '±2√5' },
    ],
    answer: 'A',
    difficulty: '中等',
  },
  {
    id: 'choice_7',
    type: 'choice',
    score: 5,
    text: '函数 f(x)=2sin(ωx+φ) 的图像向右平移 π/6 个单位后与自身重合，则 ω 的最小正值为',
    options: [
      { label: 'A', text: '3' },
      { label: 'B', text: '6' },
      { label: 'C', text: '12' },
      { label: 'D', text: '2' },
    ],
    answer: 'C',
    difficulty: '较难',
  },
  {
    id: 'choice_8',
    type: 'choice',
    score: 5,
    text: '椭圆 x²/16 + y²/9 = 1 上一点 P 到左焦点的距离为 3，则 P 到右焦点的距离为',
    options: [
      { label: 'A', text: '5' },
      { label: 'B', text: '8' },
      { label: 'C', text: '11' },
      { label: 'D', text: '13' },
    ],
    answer: 'A',
    difficulty: '中等',
  },
  {
    id: 'choice_9',
    type: 'choice',
    score: 5,
    text: '已知随机变量 X~N(1,σ²)，若 P(X≤0)=0.2，则 P(1≤X≤2)=',
    options: [
      { label: 'A', text: '0.3' },
      { label: 'B', text: '0.4' },
      { label: 'C', text: '0.6' },
      { label: 'D', text: '0.8' },
    ],
    answer: 'A',
    difficulty: '较难',
  },
  {
    id: 'choice_10',
    type: 'choice',
    score: 5,
    text: '在 (1+2x)⁶ 的展开式中，x³ 的系数为',
    options: [
      { label: 'A', text: '20' },
      { label: 'B', text: '40' },
      { label: 'C', text: '160' },
      { label: 'D', text: '240' },
    ],
    answer: 'C',
    difficulty: '中等',
  },
]

// 填空题 10 题
const fillQuestions = [
  {
    id: 'fill_1',
    type: 'fill',
    score: 5,
    text: '函数 f(x)=√(x-1) + 1/(x-3) 的定义域为 ______',
    answer: '[1,3)∪(3,+∞)',
    difficulty: '简单',
  },
  {
    id: 'fill_2',
    type: 'fill',
    score: 5,
    text: '已知 tanα=2，则 sin2α = ______',
    answer: '4/5',
    difficulty: '简单',
  },
  {
    id: 'fill_3',
    type: 'fill',
    score: 5,
    text: '向量 a=(1,2), b=(3,-1)，则 a·b = ______',
    answer: '1',
    difficulty: '简单',
  },
  {
    id: 'fill_4',
    type: 'fill',
    score: 5,
    text: '从 0,1,2,3,4 中任取 3 个数字组成无重复数字的三位数，共有 ______ 个',
    answer: '48',
    difficulty: '中等',
  },
  {
    id: 'fill_5',
    type: 'fill',
    score: 5,
    text: 'log₂3 · log₃4 · log₄5 · log₅6 · log₆7 · log₇8 = ______',
    answer: '3',
    difficulty: '中等',
  },
  {
    id: 'fill_6',
    type: 'fill',
    score: 5,
    text: '等差数列 {aₙ} 中，a₃+a₇=10，则 S₉ = ______',
    answer: '45',
    difficulty: '中等',
  },
  {
    id: 'fill_7',
    type: 'fill',
    score: 5,
    text: '双曲线 x²/4 - y²/5 = 1 的渐近线方程为 ______',
    answer: 'y=±(√5/2)x',
    difficulty: '中等',
  },
  {
    id: 'fill_8',
    type: 'fill',
    score: 5,
    text: '若 x>0，则 x + 4/x 的最小值为 ______',
    answer: '4',
    difficulty: '简单',
  },
  {
    id: 'fill_9',
    type: 'fill',
    score: 5,
    text: '曲线 y=x³-2x 在点 (1,-1) 处的切线方程为 ______',
    answer: 'y=x-2',
    difficulty: '较难',
  },
  {
    id: 'fill_10',
    type: 'fill',
    score: 5,
    text: '在复平面内，复数 (2-i)/(1+i) 对应的点位于第 ______ 象限',
    answer: '四',
    difficulty: '中等',
  },
]

// 简答题 5 题
const shortAnswerQuestions = [
  {
    id: 'sa_1',
    type: 'shortAnswer',
    score: 12,
    text: '已知函数 f(x)=x³-3ax²+3x。\n(1) 若 a=1，求 f(x) 的极值；\n(2) 若 f(x) 在 R 上单调递增，求 a 的取值范围。',
    answer: '(1) 极大值 f(1-√2/3)=...，极小值 f(1+√2/3)=... (2) -1≤a≤1',
    difficulty: '中等',
  },
  {
    id: 'sa_2',
    type: 'shortAnswer',
    score: 12,
    text: '在 △ABC 中，a,b,c 分别为角 A,B,C 的对边，且满足 2a·cosB = 2c - b。\n(1) 求角 A 的大小；\n(2) 若 a=2，求 △ABC 面积的最大值。',
    answer: '(1) A=60° (2) S_max=√3',
    difficulty: '中等',
  },
  {
    id: 'sa_3',
    type: 'shortAnswer',
    score: 12,
    text: '已知数列 {aₙ} 的前 n 项和为 Sₙ，且 Sₙ=2aₙ-2。\n(1) 求数列 {aₙ} 的通项公式；\n(2) 设 bₙ=log₂aₙ，求数列 {1/(bₙbₙ₊₁)} 的前 n 项和 Tₙ。',
    answer: '(1) aₙ=2ⁿ (2) Tₙ=n/(n+1)',
    difficulty: '较难',
  },
  {
    id: 'sa_4',
    type: 'shortAnswer',
    score: 12,
    text: '如图，四棱锥 P-ABCD 的底面 ABCD 为矩形，PA⊥平面 ABCD，PA=AD=2，AB=4。\n(1) 求证：平面 PCD⊥平面 PAD；\n(2) 求直线 PC 与平面 PAB 所成角的正弦值。',
    answer: '(1) 略 (2) sinθ=2√5/5',
    difficulty: '较难',
  },
  {
    id: 'sa_5',
    type: 'shortAnswer',
    score: 12,
    text: '已知椭圆 C: x²/a² + y²/b² = 1(a>b>0) 的离心率为 √3/2，且过点 (1, √3/2)。\n(1) 求椭圆 C 的方程；\n(2) 过右焦点 F 的直线 l 交椭圆于 A,B 两点，O 为坐标原点，若 ∠AOB=90°，求直线 l 的方程。',
    answer: '(1) x²/4 + y²/1 = 1 (2) x=√3 或 y=±(√6/6)(x-√3)',
    difficulty: '较难',
  },
]

// 组合成完整试卷
export const mockPaper = {
  id: 'paper_001',
  name: '2026年普通高等学校招生全国统一考试模拟卷',
  subject: '数学',
  totalScore: 150,
  duration: 120,
  sections: [
    {
      title: '一、选择题（本题共10小题，每小题5分，共50分。在每小题给出的四个选项中，只有一项是符合题目要求的）',
      type: 'choice',
      questions: choiceQuestions,
    },
    {
      title: '二、填空题（本题共10小题，每小题5分，共50分）',
      type: 'fill',
      questions: fillQuestions,
    },
    {
      title: '三、简答题（本题共5小题，每小题12分，共60分。解答应写出文字说明、证明过程或演算步骤）',
      type: 'shortAnswer',
      questions: shortAnswerQuestions,
    },
  ],
}

// ===== Mock 拦截 =====
Mock.mock(/\/api\/paper\/detail\/.+/, 'get', {
  code: 200,
  data: mockPaper,
  message: 'success',
})

Mock.mock(/\/api\/paper\/replace-question/, 'post', {
  code: 200,
  data: {
    id: 'choice_11',
    type: 'choice',
    score: 5,
    text: '若函数 f(x)=x²+ax+b 在 [0,2] 上最小值为 0，最大值为 4，则 a+b=',
    options: [
      { label: 'A', text: '-2' },
      { label: 'B', text: '0' },
      { label: 'C', text: '2' },
      { label: 'D', text: '4' },
    ],
    difficulty: '中等',
    answer: 'B',
  },
  message: '换题成功',
})

Mock.mock('/api/paper/save', 'post', {
  code: 200,
  data: { id: 'paper_001' },
  message: '保存成功',
})

// ===== 接口约定 =====
/**
 * 获取试卷详情
 * GET  /api/paper/detail/:id
 * Response:
 * {
 *   code: 200,
 *   data: {
 *     id: string,
 *     name: string,
 *     subject: string,
 *     totalScore: number,
 *     duration: number,
 *     sections: [
 *       {
 *         title: string,
 *         type: 'choice' | 'fill' | 'shortAnswer',
 *         questions: [
 *           {
 *             id: string,
 *             type: 'choice' | 'fill' | 'shortAnswer',
 *             score: number,
 *             text: string,
 *             options?: [{ label: string, text: string }],  // 仅选择题有
 *             difficulty: string,
 *             answer?: string,   // 教师端可见
 *           }
 *         ]
 *       }
 *     ]
 *   },
 *   message: 'success'
 * }
 *
 * 换题
 * POST /api/paper/replace-question
 * Body: { paperId: string, questionId: string, difficulty?: string }
 * Response: { code: 200, data: { question: {...} }, message: 'success' }
 *
 * 保存试卷
 * POST /api/paper/save
 * Body: { id: string, name: string, subtitle?: string, notes?: string, questions: [...] }
 * Response: { code: 200, data: { id: string }, message: '保存成功' }
 */
