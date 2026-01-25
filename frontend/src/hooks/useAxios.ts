import axios from 'axios';
import useAuthStore from '@/stores/useAuthStore';

const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_LARAVEL_API_URL}/api/`,
});

axiosInstance.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
