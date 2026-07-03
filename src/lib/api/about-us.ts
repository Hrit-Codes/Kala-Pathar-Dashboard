import { api } from "./api";
import type { IAboutUsResponse } from "@/src/types/about-us";

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

export const getAboutUs= async (): Promise<IAboutUsResponse> => {
    return fetchWithRetry(async () => {
        const { data } = await api.get("/aboutUs/getInfo");
        return data;
    });
};

export const updateAboutUs = async ( formData: FormData): Promise<IAboutUsResponse> => {
    const { data } = await api.put(`/aboutus/update/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return data; 
};

export const createAboutUs = async (formData: FormData): Promise<IAboutUsResponse> => {
    const { data } = await api.post(`/aboutus/create`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return data; 
};
