import axios from 'axios';

// ✅ Use deployed backend URL
const instance = axios.create({
  baseURL: 'https://smartchef-zj41.onrender.com', // 🌐 Live backend
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// 🔐 Attach JWT token for protected routes
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;