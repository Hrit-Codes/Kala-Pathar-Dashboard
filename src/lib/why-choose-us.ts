import type { IWhyChooseUsItem } from "../types/why-choose-us";
import { api } from "./api";

export interface IWhyChooseUsResponse {
    success: boolean;
    message: string;
    data: IWhyChooseUsItem[];
}

// Add utility for retry logic with exponential backoff
async function fetchWithRetry<T>(
    fn: () => Promise<T>,
    retries = 3,
    delay = 1000,
    backoff = 2
): Promise<T> {
    try {
        return await fn();
    } catch (error) {
        // Don't retry on 429 (Too Many Requests) or 4xx client errors (except 429)
        if ((error as any)?.response?.status === 429) {
            throw error;
        }
        if (retries === 0) {
            throw error;
        }
        // Wait with exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay));
        return fetchWithRetry(fn, retries - 1, delay * backoff, backoff);
    }
}

export const getWhyChooseUs = async (): Promise<IWhyChooseUsResponse> => {
    return fetchWithRetry(async () => {
        const { data } = await api.get("/whyChooseUs/getAll");
        return data;
    });
};

export const updateWhyChooseUs = async (id: string, formData: FormData): Promise<IWhyChooseUsResponse> => {
    const { data } = await api.put(`/whyChooseUs/update/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return data; // Return the full response, not just data.data
};
