import axios from 'axios';
import useAuthStore from '@/stores/useAuthStore';

const axiosInstance = axios.create({
  baseURL: `https://icon-shoppers.onrender.com/api/`,
});

axiosInstance.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
