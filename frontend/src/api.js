import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

API.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    config.headers.Authorization = `Bearer ${JSON.parse(userInfo).token}`;
  }
  return config;
});

export default API;
