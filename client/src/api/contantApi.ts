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