import { apiClient } from './apiClient';

export interface SignInPayload  {
  fullName: string;
  email: string;
  phoneNumber: string;
  id: string;
  password: string;
  role: 'students' | 'teachers';
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const signInRequest = async ({role, ...payload}: SignInPayload) => {
  const { data } = await apiClient.post(role, payload);

  return data;
};


export const loginRequest = async (payload: LoginPayload) => {
  const { data } = await apiClient.post('/auth/login', payload);

  return data;
};