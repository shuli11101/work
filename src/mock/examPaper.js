// 模拟试卷 - 4页内容（A3纸，每张2面，共2张）
// 用彩色占位方块模拟图片位置

const commonStyle = `
<style>
  .page {
    font-family: 'SimSun', '宋体', serif;
    padding: 32px 40px;
    color: #1A1A1A;
    min-height: 100%;
    box-sizing: border-box;
    background: #fff;
  }
  .page-title {
    text-align: center;
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 24px;
    padding-bottom: 12px;
    border-bottom: 2px solid #333;
  }
  .question-section { margin-bottom: 32px; }
  .section-title {
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 16px;
    padding-left: 12px;
    border-left: 4px solid #075DFE;
    line-height: 24px;
  }
  .question-item { margin-bottom: 24px; page-break-inside: avoid; }
  .question-num { font-weight: 700; color: #075DFE; margin-right: 4px; }
  .question-text { line-height: 1.8; font-size: 15px; }
  .page-footer { text-align: center; font-size: 12px; color: #999; margin-top: 40px; border-top: 1px solid #eee; padding-top: 12px; }

  /* 选项布局 */
  .options-row { display: flex; gap: 24px; margin-top: 8px; padding-left: 24px; flex-wrap: wrap; }
  .options-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 6px 24px; margin-top: 8px; padding-left: 24px; }
  .options-stack { margin-top: 8px; padding-left: 24px; }
  .option { line-height: 1.8; font-size: 15px; white-space: nowrap; }
  .choice-with-img { display: flex; align-items: flex-start; gap: 16px; margin-top: 8px; }
  .choice-with-img .options-row,
  .choice-with-img .options-grid-2 { flex: 1; margin-top: 0; }

  /* 图片 */
  .img-small { width: 140px; min-width: 140px; height: 90px; border-radius: 6px; background-size: cover; background-position: center; border: 1px solid #e0e0e0; }
  .img-small-inline { display: inline-block; width: 80px; height: 80px; border-radius: 6px; vertical-align: middle; margin: 0 8px; background-size: cover; background-position: center; border: 1px solid #e0e0e0; }
  .img-medium { width: 100%; height: 160px; border-radius: 8px; margin: 12px 0; background-size: cover; background-position: center; border: 1px solid #e0e0e0; }
  .img-large { width: 100%; height: 240px; border-radius: 8px; margin: 12px 0; background-size: cover; background-position: center; border: 1px solid #e0e0e0; }
  .img-caption { text-align: center; font-size: 12px; color: #999; margin-top: 4px; }
  .answer-area { margin-top: 12px; border: 1px dashed #d9d9d9; border-radius: 6px; min-height: 80px; padding: 12px; color: #ccc; font-size: 13px; }
  .fill-blank { display: inline-block; width: 80px; border-bottom: 1px solid #333; margin: 0 4px; }
  .page-num { display: block; text-align: center; font-size: 14px; color: #666; margin-top: 10px; }
</style>
`

// 第1面 - 选择题 1-3题
const side1 = commonStyle + `
<div class="page">
  <h1 class="page-title">2025-2026学年第一学期期中质量检测·数学试卷</h1>

  <div class="question-section">
    <div class="section-title">一、选择题（本大题共5小题，每小题3分，共15分）</div>

    <div class="question-item">
      <div class="question-text">
        <span class="question-num">1.</span>
        下列函数中，是一次函数的是（ ）
      </div>
      <div class="options-row">
        <div class="option">A. y = 2x² + 1</div>
        <div class="option">B. y = 3/x</div>
        <div class="option">C. y = 3x - 5</div>
        <div class="option">D. y = √(x+2)</div>
      </div>
    </div>

    <div class="question-item">
      <div class="question-text">
        <span class="question-num">2.</span>
        如图，在△ABC中，∠C = 90°，AB = 13，BC = 5，则AC的长为（ ）
      </div>
      <div class="choice-with-img">
        <div class="options-row">
          <div class="option">A. 10</div>
          <div class="option">B. 12</div>
          <div class="option">C. 14</div>
          <div class="option">D. 15</div>
        </div>
        <div class="img-small" style="background-color: #E8F0FE; display:flex; align-items:center; justify-content:center;">
          <span style="color:#4A7CFE; font-size:14px;">△ABC</span>
        </div>
      </div>
    </div>

    <div class="question-item">
      <div class="question-text">
        <span class="question-num">3.</span>
        已知一组数据：3, 5, 7, 9, 11，则这组数据的方差为（ ）
      </div>
      <div class="options-row">
        <div class="option">A. 6</div>
        <div class="option">B. 8</div>
        <div class="option">C. 10</div>
        <div class="option">D. 12</div>
      </div>
    </div>
  </div>

  <div class="page-num">第1面</div>
</div>
`

// 第2面 - 选择题 4-5题 + 填空题 6-8题
const side2 = commonStyle + `
<div class="page">

  <div class="question-section">
    <div class="section-title">一、选择题（续）</div>

    <div class="question-item">
      <div class="question-text">
        <span class="question-num">4.</span>
        如图所示为二次函数 y = ax² + bx + c 的图象，则该函数的解析式为（ ）
      </div>
      <div style="text-align:center;">
        <div class="img-medium" style="background: linear-gradient(135deg, #E8F0FE 0%, #D0E2FF 100%); display:flex; align-items:center; justify-content:center;">
          <span style="color:#4A7CFE; font-size:16px;">抛物线 y = ax² + bx + c</span>
        </div>
        <div class="img-caption">第4题图</div>
      </div>
      <div class="options-stack">
        <div class="option">A. y = x² − 2x − 3</div>
        <div class="option">B. y = x² + 2x − 3</div>
        <div class="option">C. y = −x² + 2x + 3</div>
        <div class="option">D. y = −x² − 2x + 3</div>
      </div>
    </div>

    <div class="question-item">
      <div class="question-text">
        <span class="question-num">5.</span>
        如图，⊙O的半径为5，弦AB = 8，则圆心O到弦AB的距离为（ ）
        <span class="img-small-inline" style="background-color: #FFF3E0; display:inline-flex; align-items:center; justify-content:center; vertical-align:middle;">
          <span style="color:#FD8F37; font-size:12px;">⊙O</span>
        </span>
      </div>
      <div class="options-row">
        <div class="option">A. 3</div>
        <div class="option">B. 4</div>
        <div class="option">C. 5</div>
        <div class="option">D. 6</div>
      </div>
    </div>
  </div>

  <div class="question-section">
    <div class="section-title">二、填空题（本大题共3小题，每小题3分，共9分）</div>

    <div class="question-item">
      <div class="question-text">
        <span class="question-num">6.</span>
        计算：√16 + (−2)² = <span class="fill-blank"></span>
      </div>
    </div>

    <div class="question-item">
      <div class="question-text">
        <span class="question-num">7.</span>
        在平面直角坐标系中，点A(3, −2)关于x轴对称的点的坐标为（ <span class="fill-blank" style="width:40px;"></span> ， <span class="fill-blank" style="width:40px;"></span> ）
      </div>
    </div>

    <div class="question-item">
      <div class="question-text">
        <span class="question-num">8.</span>
        如图所示的几何体是由一个圆柱和一个圆锥组合而成的，则该几何体的侧面积为 <span class="fill-blank"></span>（结果保留π）
      </div>
      <div style="text-align:center;">
        <div class="img-medium" style="background: linear-gradient(180deg, #F3E5F5 0%, #E1BEE7 100%); display:flex; align-items:center; justify-content:center;">
          <span style="color:#7B1FA2; font-size:16px;">圆柱+圆锥组合体</span>
        </div>
        <div class="img-caption">第8题图</div>
      </div>
    </div>
  </div>

  <div class="page-num">第2面</div>
</div>
`

// 第3面 - 解答题 9-10题
const side3 = commonStyle + `
<div class="page">
  <div class="question-section">
    <div class="section-title">三、解答题（本大题共5小题，共52分）</div>

    <div class="question-item">
      <div class="question-text">
        <span class="question-num">9.</span>
        （10分）某校组织学生到某基地参加社会实践活动，下图是基地的平面示意图。请解答下列问题：
      </div>
      <div style="text-align:center;">
        <div class="img-large" style="background: linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 50%, #A5D6A7 100%); display:flex; flex-direction:column; align-items:center; justify-content:center;">
          <span style="color:#2E7D32; font-size:20px; font-weight:700;">基地平面示意图</span>
          <div style="display:flex; gap:40px; margin-top:12px;">
            <div style="text-align:center;"><div style="width:40px;height:40px;background:#4CAF50;border-radius:8px;"></div><span style="font-size:12px;color:#333;">教学楼</span></div>
            <div style="text-align:center;"><div style="width:40px;height:40px;background:#FF9800;border-radius:8px;"></div><span style="font-size:12px;color:#333;">食堂</span></div>
            <div style="text-align:center;"><div style="width:40px;height:40px;background:#2196F3;border-radius:8px;"></div><span style="font-size:12px;color:#333;">宿舍楼</span></div>
            <div style="text-align:center;"><div style="width:40px;height:40px;background:#9C27B0;border-radius:8px;"></div><span style="font-size:12px;color:#333;">体育馆</span></div>
          </div>
        </div>
        <div class="img-caption">基地平面示意图</div>
      </div>
      <div class="question-text" style="margin-top:8px;">
        （1）教学楼的坐标为（2, 3），请在图中标出食堂、宿舍楼、体育馆的位置；<br>
        （2）求教学楼到宿舍楼的直线距离。
      </div>
      <div class="answer-area">请在此处作答...</div>
    </div>

    <div class="question-item">
      <div class="question-text">
        <span class="question-num">10.</span>
        （10分）如图，在平面直角坐标系中，一次函数 y = kx + b 的图象经过点A(−1, 0)和点B(2, 3)。
      </div>
      <div style="text-align:center;">
        <div class="img-medium" style="background: linear-gradient(135deg, #FFF8E1 0%, #FFECB3 100%); display:flex; align-items:center; justify-content:center;">
          <span style="color:#F57F17; font-size:16px;">一次函数 y = kx + b 图象</span>
        </div>
        <div class="img-caption">第10题图</div>
      </div>
      <div class="question-text" style="margin-top:8px;">
        （1）求该一次函数的表达式；<br>
        （2）求该一次函数与两坐标轴围成的三角形的面积。
      </div>
      <div class="answer-area">请在此处作答...</div>
    </div>
  </div>

  <div class="page-num">第3面</div>
</div>
`

// 第4面 - 解答题 11-13题
const side4 = commonStyle + `
<div class="page">
  <div class="question-section">

    <div class="question-item">
      <div class="question-text">
        <span class="question-num">11.</span>
        （10分）已知关于x的一元二次方程 x² − 4x + m = 0 有两个不相等的实数根。
      </div>
      <div class="question-text" style="margin-top:4px;">
        （1）求m的取值范围；<br>
        （2）若该方程的一个根为1，求另一个根及m的值。
      </div>
      <div class="answer-area">请在此处作答...</div>
    </div>

    <div class="question-item">
      <div class="question-text">
        <span class="question-num">12.</span>
        （10分）某市为改善市民出行条件，计划修建一条地铁线路。下图是规划中的部分路线示意图。
      </div>
      <div style="text-align:center;">
        <div class="img-large" style="background: linear-gradient(180deg, #E3F2FD 0%, #BBDEFB 50%, #90CAF9 100%); display:flex; flex-direction:column; align-items:center; justify-content:center;">
          <span style="color:#1565C0; font-size:18px; font-weight:700;">地铁线路规划图</span>
          <div style="display:flex; align-items:center; gap:16px; margin-top:16px;">
            <div style="width:48px;height:48px;background:#1565C0;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;">A</div>
            <div style="width:60px;height:4px;background:#1565C0;border-radius:2px;"></div>
            <div style="width:48px;height:48px;background:#1565C0;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;">B</div>
            <div style="width:60px;height:4px;background:#1565C0;border-radius:2px;"></div>
            <div style="width:48px;height:48px;background:#1565C0;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;">C</div>
            <div style="width:60px;height:4px;background:#1565C0;border-radius:2px;"></div>
            <div style="width:48px;height:48px;background:#1565C0;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;">D</div>
          </div>
        </div>
        <div class="img-caption">地铁线路规划示意图</div>
      </div>
      <div class="question-text" style="margin-top:8px;">
        （1）若AB:BC = 3:4，BC:CD = 2:3，AB = 1.2km，求CD的长度；<br>
        （2）若该段地铁总造价为5.2亿元，每公里造价为0.8亿元，求该段地铁的总长度。
      </div>
      <div class="answer-area">请在此处作答...</div>
    </div>

    <div class="question-item">
      <div class="question-text">
        <span class="question-num">13.</span>
        （12分）综合与实践<br>
        在"生活中的数学"实践活动中，某小组对学校的旗杆高度进行了测量。
      </div>
      <div style="text-align:center;">
        <div class="img-medium" style="background: linear-gradient(135deg, #FCE4EC 0%, #F8BBD0 100%); display:flex; align-items:center; justify-content:center;">
          <span style="color:#C2185B; font-size:16px;">旗杆测量示意图</span>
        </div>
      </div>
      <div class="question-text" style="margin-top:8px;">
        （1）请你根据以上数据，求出旗杆的高度；<br>
        （2）若将测量方法改为"镜子反射"，请说明如何利用平面镜测量旗杆的高度；<br>
        （3）请对你的方案给出数学解释。
      </div>
      <div class="answer-area">请在此处作答...</div>
    </div>
  </div>

  <div class="page-num">第4面</div>
</div>
`

// 导出4面数组
export const paperSides = [side1, side2, side3, side4]

// 向后兼容
export const mockExamPaper = side1

export default mockExamPaper
