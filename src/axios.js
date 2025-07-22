import axios from 'axios';
import authStore from '@/auth';
import config from '@/config.js'; // Import the config file

const instance = axios.create({
  baseURL: config.apiBaseUrl, // Use the apiBaseUrl from the config file
  timeout: 10000, // Add timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // withCredentials: true, // Keep disabled for now to avoid CORS issues
});

// Add response interceptor for better error handling
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Temporarily disabled authentication interceptor
// instance.interceptors.request.use(
//   (config) => {
//     const token = authStore.state.userData.token; // Assuming the token is stored in the userData object
//     if (token) {
//       config.headers['Authorization'] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

export default instance;