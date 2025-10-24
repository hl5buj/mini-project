import api from './api';

export const commentService = {
  // 댓글 목록 조회
  getComments: async (params = {}) => {
    const response = await api.get('/api/comments/', { params });
    return response.data;
  },

  // 댓글 상세 조회
  getComment: async (id) => {
    const response = await api.get(`/api/comments/${id}/`);
    return response.data;
  },

  // 댓글 작성
  createComment: async (commentData) => {
    const response = await api.post('/api/comments/', commentData);
    return response.data;
  },

  // 댓글 수정
  updateComment: async (id, commentData) => {
    const response = await api.patch(`/api/comments/${id}/`, commentData);
    return response.data;
  },

  // 댓글 삭제
  deleteComment: async (id) => {
    const response = await api.delete(`/api/comments/${id}/`);
    return response.data;
  },
};
