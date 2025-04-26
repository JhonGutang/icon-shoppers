import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_LARAVEL_API_URL}/api/`,
});

export default axiosInstance;
