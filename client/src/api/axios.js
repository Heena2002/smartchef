import axios from 'axios';

// Create Axios instance
const instance = axios.create({
  baseURL: 'http://localhost:4002', // Backend URL
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Automatically attach token to every request
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // ✅ Get token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // ✅ Attach token
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;