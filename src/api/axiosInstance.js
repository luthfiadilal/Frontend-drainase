import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api', // Adjust if backend port differs
});

export default axiosInstance;