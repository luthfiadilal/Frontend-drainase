import axiosInstance from '../api/axiosInstance';

// Drainages
export const getDrainages = async () => {
  const response = await axiosInstance.get('/drainages');
  return response.data;
};

export const createDrainage = async (data) => {
  const response = await axiosInstance.post('/drainages', data);
  return response.data;
};

export const updateDrainage = async (id, data) => {
  const response = await axiosInstance.put(`/drainages/${id}`, data);
  return response.data;
};

export const deleteDrainage = async (id) => {
  const response = await axiosInstance.delete(`/drainages/${id}`);
  return response.data;
};

// Aspects
export const getAspects = async () => {
  const response = await axiosInstance.get('/aspects');
  return response.data;
};

export const createAspect = async (data) => {
  const response = await axiosInstance.post('/aspects', data);
  return response.data;
};

export const updateAspect = async (id, data) => {
  const response = await axiosInstance.put(`/aspects/${id}`, data);
  return response.data;
};

export const deleteAspect = async (id) => {
  const response = await axiosInstance.delete(`/aspects/${id}`);
  return response.data;
};

// Indicators
export const getIndicators = async () => {
  const response = await axiosInstance.get('/indicators');
  return response.data;
};

export const createIndicator = async (data) => {
  const response = await axiosInstance.post('/indicators', data);
  return response.data;
};

export const updateIndicator = async (id, data) => {
  const response = await axiosInstance.put(`/indicators/${id}`, data);
  return response.data;
};

export const deleteIndicator = async (id) => {
  const response = await axiosInstance.delete(`/indicators/${id}`);
  return response.data;
};

// Indicator Options
export const getIndicatorOptions = async () => {
  const response = await axiosInstance.get('/indicator-options');
  return response.data;
};

export const createIndicatorOption = async (data) => {
  const response = await axiosInstance.post('/indicator-options', data);
  return response.data;
};

export const updateIndicatorOption = async (id, data) => {
  const response = await axiosInstance.put(`/indicator-options/${id}`, data);
  return response.data;
};

export const deleteIndicatorOption = async (id) => {
  const response = await axiosInstance.delete(`/indicator-options/${id}`);
  return response.data;
};

// Users
export const getUsers = async () => {
  const response = await axiosInstance.get('/users');
  return response.data;
};

export const createUser = async (data) => {
  const response = await axiosInstance.post('/users', data);
  return response.data;
};

export const updateUser = async (id, data) => {
  const response = await axiosInstance.put(`/users/${id}`, data);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await axiosInstance.delete(`/users/${id}`);
  return response.data;
};

// Reports
export const getReports = async (status = '') => {
  const url = status ? `/drainage-reports?status=${status}` : '/drainage-reports';
  const response = await axiosInstance.get(url);
  return response.data;
};
