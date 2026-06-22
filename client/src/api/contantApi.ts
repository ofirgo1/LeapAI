import { apiClient } from './apiClient';

export const getContantById = async (id:string) => {
  const { data } = await apiClient.get(`materials/${id}`);

  return data;
};