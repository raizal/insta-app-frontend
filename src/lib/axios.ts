import axios from 'axios';

const baseUrl = import.meta.env.VITE_BASE_URL;

const API_URL = `${baseUrl}`;

const axiosInstance = axios.create({
  baseURL: API_URL,
});


// Add a response interceptor to handle auth errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Only redirect to login if not already on login page and unauthorized
    if (error.response && error.response.status === 401 && !window.location.pathname.includes('/login')) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance; 