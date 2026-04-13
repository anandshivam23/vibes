import axios from 'axios';

const api = axios.create({
  baseURL: 'https://vibes-backend-af8b.onrender.com/api/v1',
  withCredentials: true,
});

export default api;