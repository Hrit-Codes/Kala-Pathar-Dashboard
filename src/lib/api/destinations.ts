import { api } from "./api";
import { fetchOrNull } from "../utils/helper";
import type { IPagination } from "@/src/types/inquiry";
import type { DestinationFormValues } from "../vallidators/destination-validate";

export interface IDestination {
    _id: string;
    name: string;
    slug: string;
    description: string;
    packageTypes: string[]; 
    order: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
}


export interface IDestinationsResponse {
    success: boolean;
    message: string;
    data: IDestination[];
    pagination: IPagination
}



export const getDestinations = async (): Promise<IDestinationsResponse | null> => {
    return fetchOrNull(async () => {
        const { data } = await api.get("/destination/getDestinations");
        return data;
    });
};

export const delDestination = async (id:string): Promise<IDestinationsResponse | null> => {
        const { data } = await api.delete(`/destination/delete/${id}`);
        return data;
};

export const updateDestination = async (id:string,body:DestinationFormValues): Promise<IDestinationsResponse | null> => {
        const { data } = await api.put(`/destination/updateDestination/${id}`,body);
        return data;
};

export const createDestination = async (body:DestinationFormValues): Promise<IDestinationsResponse | null> => {
        const { data } = await api.post(`/destination/create`,body);
        return data;
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