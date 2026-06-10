import request from "@/utils/request";

// 获取学生列表
export const getStudentList = () => {
  return request.get('/api/student/list')
}

// 获取知识点掌握度
export const getKnowledgeMastery = () => {
  return request.get('/api/knowledge/mastery')
}