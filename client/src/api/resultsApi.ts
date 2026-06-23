import { apiClient } from './apiClient';

export interface ResultPayload {
      outputId: string;
      studentEmail?: string;
      studentName: string;
      score: number;
      answers?: unknown[];
}

export const setResults = async (payload : ResultPayload) => {
    const { data } = await apiClient.post('/results', payload);
    return data;
}

export const getResultsOfQuiz = async (outputId: string) => {
    const { data } = await apiClient.get(`/results/${outputId}`);
    return data;
}
