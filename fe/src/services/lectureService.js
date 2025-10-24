import api from './api';

export const lectureService = {
  // 레슨 목록 조회
  getLectures: async (params = {}) => {
    const response = await api.get('/api/lectures/', { params });
    return response.data;
  },

  // 레슨 상세 조회
  getLecture: async (id) => {
    const response = await api.get(`/api/lectures/${id}/`);
    return response.data;
  },

  // 레슨 생성
  createLecture: async (lectureData) => {
    const response = await api.post('/api/lectures/', lectureData);
    return response.data;
  },

  // 레슨 수정
  updateLecture: async (id, lectureData) => {
    const response = await api.patch(`/api/lectures/${id}/`, lectureData);
    return response.data;
  },

  // 레슨 삭제
  deleteLecture: async (id) => {
    const response = await api.delete(`/api/lectures/${id}/`);
    return response.data;
  },
};
