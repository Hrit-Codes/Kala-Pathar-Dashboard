import { api } from "./api";
import type { IGetCampaignsResponse } from "@/src/types/campaign";

export const getAllCampaigns = async ({page=1,limit=10}:{page?:number; limit?:number;}): Promise<IGetCampaignsResponse> => {
    const { data } = await api.get("/campaign",{params:{page,limit}});
    return data;
};

export const createCampaign = async (formData:FormData): Promise<IGetCampaignsResponse> => {
    const { data } = await api.post("/campaign/send",formData,{
        headers:{"Content-Type":"multipart/form-data"}
    });
    return data;
};



