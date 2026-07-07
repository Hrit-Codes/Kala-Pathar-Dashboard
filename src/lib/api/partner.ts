import type { IPartnerSection } from "@/src/types/partner";
import { api } from "./api";
import { fetchOrNull } from "../utils/helper";

export const getPartnerSection = async (): Promise<IPartnerSection | null> => {
    return fetchOrNull(async () => {
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