
import type { IWhyPlanWithUsItem, WhyPlanWithUsFormValues } from "@/src/types/why-plan-with-us";
import { api } from "./api";

export interface IWhyChooseUsResponse {
    success: boolean;
    message: string;
    data: IWhyPlanWithUsItem[];
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

export const getWhyPlanWithUs = async (): Promise<IWhyChooseUsResponse> => {
    return fetchWithRetry(async () => {
        const { data } = await api.get("/whyChooseUs/getAll");
        return data;
    });
};

export const updateWhyPlanWithUs = async (id: string, data: WhyPlanWithUsFormValues) => {
    const { data: res } = await api.put(`/whychooseus/update/${id}`, data);
    return res;
};

export const createWhyPlanWithUs = async (data: WhyPlanWithUsFormValues) => {
    const { data: res } = await api.post("/whychooseus/create", data);
    return res;
};
