import axiosInstance from '../api/axiosInstance';

export const getRegions = async () => {
  const response = await axiosInstance.get('/regions');
  return response.data;
};
