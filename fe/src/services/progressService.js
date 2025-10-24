import api from './api';

export const progressService = {
  // 진행 상황 목록 조회
  getProgress: async (params = {}) => {
    const response = await api.get('/api/progress/', { params });
    return response.data;
  },

  // 특정 레슨의 진행 상황 조회
  getLectureProgress: async (lectureId) => {
    try {
      const response = await api.get('/api/progress/', {
        params: { lecture: lectureId },
      });

      const progressList = response.data.results || [];
      return progressList.length > 0 ? progressList[0] : null;
    } catch (error) {
      console.error('Failed to get lecture progress:', error);
      return null;
    }
  },

  // 진행 상황 생성
  createProgress: async (progressData) => {
    const response = await api.post('/api/progress/', progressData);
    return response.data;
  },

  // 진행 상황 업데이트
  updateProgress: async (id, progressData) => {
    const response = await api.patch(`/api/progress/${id}/`, progressData);
    return response.data;
  },

  // 진행 상황 생성 또는 업데이트
  saveProgress: async (lectureId, progressData) => {
    try {
      // Check if progress already exists
      const existingProgress = await progressService.getLectureProgress(lectureId);

      if (existingProgress) {
        // Update existing progress
        return await progressService.updateProgress(existingProgress.id, progressData);
      } else {
        // Create new progress
        return await progressService.createProgress({
          lecture: lectureId,
          ...progressData,
        });
      }
    } catch (error) {
      console.error('Failed to save progress:', error);
      throw error;
    }
  },

  // 레슨 완료 표시
  markAsCompleted: async (lectureId) => {
    return await progressService.saveProgress(lectureId, {
      completed: true,
      progress_percentage: 100,
    });
  },

  // 비디오 진행률 저장 (디바운스 권장)
  updateVideoProgress: async (lectureId, progressPercentage) => {
    return await progressService.saveProgress(lectureId, {
      completed: progressPercentage >= 90, // 90% 이상 시청 시 완료로 처리
      progress_percentage: Math.min(100, Math.round(progressPercentage)),
    });
  },

  // 강의의 전체 진행 상황 조회
  getCourseProgress: async (courseId) => {
    try {
      const response = await api.get('/api/progress/', {
        params: { lecture__course: courseId },
      });

      return response.data.results || [];
    } catch (error) {
      console.error('Failed to get course progress:', error);
      return [];
    }
  },

  // 강의 진행률 계산
  calculateCourseProgress: (progressList, totalLectures) => {
    if (totalLectures === 0) return 0;

    const completedCount = progressList.filter((p) => p.completed).length;
    return Math.round((completedCount / totalLectures) * 100);
  },
};
