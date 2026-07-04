import type { IPartnerSection, IPartnerSectionResponse } from "@/src/types/partner";
import { api } from "./api";

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

export const getPartnerSection= async (): Promise<IPartnerSection> => {
    return fetchWithRetry(async () => {
        const { data } = await api.get("/partner/getSection");
        return data.data;
    });
};

export const updatePartnerSection = async (payload: {
    sectionTitle?: string;
    sectionTagline?: string;
    badges?: string[];
}) => {
    const { data } = await api.put("/partner/update", payload);
    return data;
};

export const addAffiliation = async (formData: FormData) => {
    const { data } = await api.post("/partner/affiliation/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
};

export const updateAffiliation = async (id: string, formData: FormData) => {
    const { data } = await api.put(`/partner/affiliation/update/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
};

export const deleteAffiliation = async (id: string) => {
    const { data } = await api.delete(`/partner/affiliation/delete/${id}`);
    return data;
};


