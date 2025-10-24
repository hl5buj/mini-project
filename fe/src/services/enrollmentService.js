import api from './api';

export const enrollmentService = {
  // 수강 신청 목록 조회
  getEnrollments: async (params = {}) => {
    const response = await api.get('/api/enrollments/', { params });
    return response.data;
  },

  // 수강 신청 상세 조회
  getEnrollment: async (id) => {
    const response = await api.get(`/api/enrollments/${id}/`);
    return response.data;
  },

  // 수강 신청
  enrollCourse: async (courseId) => {
    const response = await api.post('/api/enrollments/', {
      course: courseId,
    });
    return response.data;
  },

  // 수강 취소
  unenrollCourse: async (enrollmentId) => {
    const response = await api.delete(`/api/enrollments/${enrollmentId}/`);
    return response.data;
  },

  // 특정 강의의 수강 상태 확인
  checkEnrollmentStatus: async (courseId) => {
    try {
      const response = await api.get('/api/enrollments/', {
        params: { course: courseId },
      });

      // 해당 강의의 수강 신청이 있으면 첫 번째 항목 반환
      const enrollments = response.data.results || [];
      return enrollments.length > 0 ? enrollments[0] : null;
    } catch (error) {
      console.error('Failed to check enrollment status:', error);
      return null;
    }
  },
};
