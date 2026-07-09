import { api } from "./api";
import { fetchOrNull } from "../utils/helper";
import type { IPagination } from "@/src/types/inquiry";

export interface IPackageType {
    _id: string;
    name: string;
    slug: string;
    icon: string;
    themeColor: string;
    description: string;
    hasDifficultyLevels: boolean;
    order: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface IPackageTypesResponse {
    success: boolean;
    message: string;
    data: IPackageType[];
    pagination: IPagination
}



export const getPackageTypes = async (): Promise<IPackageTypesResponse | null> => {
    return fetchOrNull(async () => {
        const { data } = await api.get("/packageType/getPackageTypes?page=1&limit=4");
        return data;
    });
};

// export const updateAboutUs = async (formData: FormData): Promise<IAboutUsResponse> => {
//     const { data } = await api.put(`/aboutus/update/`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//     });
//     return data;
// };

// export const createAboutUs = async (formData: FormData): Promise<IAboutUsResponse> => {
//     const { data } = await api.post(`/aboutus/create`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//     });
//     return data;
// };