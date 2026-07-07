import type { IGetInquiriesParams, IInquiry, IInquiryResponse } from "@/src/types/inquiry";
import { api } from "./api";

export const getInquiries = async (params:IGetInquiriesParams): Promise<IInquiryResponse> => {
    const { data } = await api.get("/inquiry/getAll",{params});
    return data;
};

export const getInquiryById=async(id:string):Promise<IInquiry>=>{
    const { data }=await api.get(`/inquiry/getById/${id}`);
    return data.data;
}

export const replyToInquiry=async(message:string,id:string)=>{
    const { data }=await api.post(`/inquiry/reply/${id}`,message);
    return data;
}

// export const updateCompanyInfo = async (formData: FormData): Promise<ICompanyInfo> => {
//     const { data } = await api.patch("/companyinfo/update", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//     });
//     return data.data;
// };