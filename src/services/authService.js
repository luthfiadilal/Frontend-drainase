import axiosInstance from '../api/axiosInstance';

export const login = async (credentials) => {
  const response = await axiosInstance.post('/users/login', credentials);
  return response.data;
};

export const register = async (userData) => {
  const response = await axiosInstance.post('/users', userData);
  return response.data;
};
