import { api } from "./api";
import type { IAboutUsResponse } from "@/src/types/about-us";
import { fetchOrNull } from "../utils/helper";

export const getAboutUs = async (): Promise<IAboutUsResponse | null> => {
    return fetchOrNull(async () => {
        const { data } = await api.get("/aboutUs/getInfo");
        return data;
    });
};

export const updateAboutUs = async (formData: FormData): Promise<IAboutUsResponse> => {
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