import { apiClient } from './apiClient';

export interface Content {
    id: string;
    subject: string;
    grade: string;
    difficulty: string;
    type: string;
    title: string;
    createdAt: string;
    content: string;
}

interface ContentsResponse {
    materials: Content[];
}

interface ContentResponse {
    material: Content;
}

export const getContantById = async (id:string) => {
    const { data } = await apiClient.get<ContentResponse>(`materials/${id}`);

    return data?.material;
};

export const getContants = async () => {
    const { data } = await apiClient.get<ContentsResponse>('materials');

    return data?.materials;
}

export type CreateContentPayload = {
  type: string;
  title: string;
  grade: string;
  content: {
    subject: string;
    difficulty: string;
    prompt: string;
    fileName: string | null;
  };
};

export const createContent = async (payload: CreateContentPayload) => {
  const { data } = await apiClient.post('/materials', payload);
  return data;
};