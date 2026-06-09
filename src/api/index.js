import request from "@/utils/request";

// 获取学生列表
export const getStudentList = () => {
  return request.get('/api/student/list')
}