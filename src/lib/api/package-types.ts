import { api } from "./api";
import { fetchOrNull } from "../utils/helper";
import type { IPagination } from "@/src/types/inquiry";
import type { PackageTypeFormValues } from "../vallidators/package-type.validate";

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
        const { data } = await api.get("/packageType/getPackageTypes");
        return data;
    });
};

export const delPackageType = async (id:string): Promise<IPackageTypesResponse | null> => {
        const { data } = await api.delete(`/packageType/delete/${id}`);
        return data;
};

export const updatePackageType = async (id:string,body:PackageTypeFormValues): Promise<IPackageTypesResponse | null> => {
        const { data } = await api.put(`/packageType/updatePackageType/${id}`,body);
        return data;
};

export const createPackageType = async (body:PackageTypeFormValues): Promise<IPackageTypesResponse | null> => {
        const { data } = await api.post(`/packageType/create`,body);
        return data;
};
