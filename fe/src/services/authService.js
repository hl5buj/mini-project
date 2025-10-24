import api from './api';

export const authService = {
  // 로그인
  login: async (username, password) => {
    const response = await api.post('/api/auth/login/', {
      username,
      password,
    });
    return response.data;
  },

  // 회원가입
  register: async (userData) => {
    const response = await api.post('/api/auth/register/', userData);
    return response.data;
  },

  // 프로필 조회
  getProfile: async () => {
    const response = await api.get('/api/auth/profile/');
    return response.data;
  },

  // 프로필 수정
  updateProfile: async (profileData) => {
    const response = await api.patch('/api/auth/profile/', profileData);
    return response.data;
  },

  // 비밀번호 변경
  changePassword: async (passwordData) => {
    const response = await api.post('/api/auth/password/change/', passwordData);
    return response.data;
  },

  // 토큰 갱신
  refreshToken: async (refreshToken) => {
    const response = await api.post('/api/auth/token/refresh/', {
      refresh: refreshToken,
    });
    return response.data;
  },
};
