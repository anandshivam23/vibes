import axios from 'axios';

const api = axios.create({
  baseURL: 'https://vibes-backend-af8b.onrender.com/api/v1',
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // Prevent infinite loops using _retry flag
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (originalRequest.url.includes('/users/refresh-token')) {
        return Promise.reject(error);
      }
      originalRequest._retry = true;
      try {
        await api.post('/users/refresh-token');
        return api(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;