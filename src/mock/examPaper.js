// 试卷页面图片（4面）
import page1 from '@/assets/picture/page/Page_1_docsmall.com.jpg'
import page2 from '@/assets/picture/page/Page_2_docsmall.com.jpg'
import page3 from '@/assets/picture/page/Page_3_docsmall.com.jpg'
import page4 from '@/assets/picture/page/Page_4_docsmall.com.jpg'

const pages = [page1, page2, page3, page4]

export const paperSides = pages.map((src) => {
  return `<div class="page-img-wrap"><img src="${src}" class="page-img" /></div>`
})

export const mockExamPaper = paperSides[0]

export default mockExamPaper
