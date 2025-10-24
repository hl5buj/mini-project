import api from './api';

export const courseService = {
  // 강의 목록 조회
  getCourses: async (params = {}) => {
    const response = await api.get('/api/courses/', { params });
    return response.data;
  },

  // 강의 상세 조회
  getCourse: async (id) => {
    const response = await api.get(`/api/courses/${id}/`);
    return response.data;
  },

  // 강의 생성
  createCourse: async (courseData) => {
    const response = await api.post('/api/courses/', courseData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // 강의 수정
  updateCourse: async (id, courseData) => {
    const response = await api.patch(`/api/courses/${id}/`, courseData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // 강의 삭제
  deleteCourse: async (id) => {
    const response = await api.delete(`/api/courses/${id}/`);
    return response.data;
  },
};
