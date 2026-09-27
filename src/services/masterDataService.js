import axiosInstance from '../api/axiosInstance';

export const getDrainages = async () => {
  const response = await axiosInstance.get('/drainages');
  return response.data;
};

export const getAspects = async () => {
  const response = await axiosInstance.get('/aspects');
  return response.data;
};

export const getIndicators = async () => {
  const response = await axiosInstance.get('/indicators');
  return response.data;
};

export const getIndicatorOptions = async () => {
  const response = await axiosInstance.get('/indicator-options');
  return response.data;
};

export const getUsers = async () => {
  const response = await axiosInstance.get('/users');
  return response.data;
};
