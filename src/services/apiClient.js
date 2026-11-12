import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api.open-meteo.com/v1',
  timeout: 8000
});

export default apiClient;