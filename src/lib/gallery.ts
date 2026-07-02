import { api } from "./api";

export interface IGallery {
    _id: string;
    subtitle: string;
    title: string;
    description: string;
    image: string;
    order: number;
    isActive: boolean;
    createdAt: string; 
    updatedAt: string; 
}

export interface IGalleryResponse {
    success: boolean;
    message: string;
    data: IGallery[];
    total: number;
    isFull: boolean;
}

export const getGallery = async (): Promise<IGalleryResponse> => {
    const { data } = await api.get("/gallery/getAll");
    return data;
};

export const updateCompanyInfo = async (formData: FormData): Promise<IGalleryResponse> => {
    const { data } = await api.patch("/companyinfo/update", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return data.data;
};