import request from "@/utils/request";

// 获取学生列表
export const getStudentList = () => {
  return request.get('/api/student/list')
}

// 获取知识点掌握度
export const getKnowledgeMastery = () => {
  return request.get('/api/knowledge/mastery')
}

// 获取试卷预览
export const getPaperPreview = (paperId) => {
  return request.get(`/api/paper/detail/${paperId}`)
}

// 换题
export const changeQuestion = (qId) => {
  return request.post(`/api/paper/replace-question`, qId)
}

// 保存试卷
export const savePaper = (paper) => {
  return request.post('/api/paper/save', paper)
}
