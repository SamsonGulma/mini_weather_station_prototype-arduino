import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // This will be proxied to Flask
  timeout: 5000
});

export const fetchData = async () => {
  try {
    const response = await api.get('/data');
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const fetchHistory = async (limit = 100) => {
  try {
    const response = await api.get(`/history?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};