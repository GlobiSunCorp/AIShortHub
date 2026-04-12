import { apiClient } from '../apiClient';

export const authService = {
  login(payload) {
    return apiClient.post('/auth/login', payload);
  },
  signup(payload) {
    return apiClient.post('/auth/signup', payload);
  },
  forgotPassword(payload) {
    return apiClient.post('/auth/forgot-password', payload);
  },
};
