import axios from 'axios'
import Cookies from 'js-cookie';

const axiosLocalInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_LOCAL_BASE_URL
})

axiosLocalInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosLocalInstance
