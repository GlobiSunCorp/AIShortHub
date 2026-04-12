const API_BASE = '/api';

export const apiClient = {
  async get(path) {
    return Promise.resolve({ source: `${API_BASE}${path}`, data: null, mocked: true });
  },
  async post(path, payload) {
    return Promise.resolve({ source: `${API_BASE}${path}`, payload, mocked: true });
  },
};
