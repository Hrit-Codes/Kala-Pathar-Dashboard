import { api } from "./api";

export interface ISocialLinks {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
    youtube?: string;
    tiktok?: string;
}

export interface ICompanyInfo {
    _id: string;
    companyName: string;
    officeAddress: string;
    officeTelephone: string;
    emails: string[];
    phones: string[];
    description: string;
    logo: string;
    socialLinks?: ISocialLinks;
    mapLatitude: number;
    mapLongitude: number;
    mapEmbedUrl?: string;
}

export const getCompanyInfo = async (): Promise<ICompanyInfo> => {
    const { data } = await api.get("/companyinfo/getInfo");
    return data.data;
};

export const updateCompanyInfo = async (formData: FormData): Promise<ICompanyInfo> => {
    const { data } = await api.patch("/companyinfo/update", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return data.data;
};