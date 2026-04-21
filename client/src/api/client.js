import axios from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000'
});

client.interceptors.request.use((config) => {
  const storedAuth = localStorage.getItem('fitness-tracker-auth');

  if (storedAuth) {
    const parsedAuth = JSON.parse(storedAuth);
    if (parsedAuth?.token) {
      config.headers.Authorization = `Bearer ${parsedAuth.token}`;
    }
  }

  return config;
});

export default client;