import axiosInstance from '../api/axiosInstance';

export const getDrainages = async () => {
  const response = await axiosInstance.get('/drainages');
  return response.data;
};

export const createDrainage = async (data) => {
  const response = await axiosInstance.post('/drainages', data);
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

export const getReports = async (status = '') => {
  const url = status ? `/drainage-reports?status=${status}` : '/drainage-reports';
  const response = await axiosInstance.get(url);
  return response.data;
};
