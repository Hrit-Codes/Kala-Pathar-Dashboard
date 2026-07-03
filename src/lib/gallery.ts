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

export interface IGalleryCreateResponse {
    success: boolean;
    message: string;
    data: IGallery;
    slotsRemaining:number;
}

export const getGallery = async (): Promise<IGalleryResponse> => {
    const { data } = await api.get("/gallery/getAll");
    return data;
};

export const updateGalleryItem = async (id:string,formData: FormData): Promise<IGalleryResponse> => {
    const { data } = await api.put(`/gallery/update/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return data.data;
};

export const createGalleryItem=async(formData:FormData):Promise<IGalleryCreateResponse>=>{
    const {data}= await api.post("/gallery/create",formData,{
        headers:{"Content-Type":"multipart/form-data"}
    });
    return data;
}