import axios from 'axios'
import Cookies from 'js-cookie';

let triggerEndpoints: string[] = []

export const setTriggerEndpoints = (endpoints: string[]) => {
  triggerEndpoints = endpoints
}


const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL
})

axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.log(error)
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    const url = response.config.url || ''
    if (triggerEndpoints.some(endpoint => url.includes(endpoint))) {
      console.log('🚀 Dispatching event for:', url)
      globalThis.dispatchEvent(new Event('api:triggerRefreshProfile'))
    }

    return response
  },
  (error) => Promise.reject(error)
)

export default axiosInstance
