import { api } from "./api";

export interface IInquiry {
    _id: string;
    fullname: string;
    email: string;
    phone: string;
    subject: string;
    description: string;
    isReplied: boolean;
    createdAt: string;
    updatedAt: string;
    repliedAt: string;
    replyMessage: string;
}

export interface IInquiryTabCount{
    all:number,
    pending:number,
    replied:number
}

export interface IInquiryResponse{
    success:boolean,
    message:string,
    data:IInquiry[],
    pagination:{
        total:number,
        page:number,
        limit:number,
        totalPage:number,
        hasNextPage:boolean,
        hasPrevPage:boolean
    }
    tabCounts:IInquiryTabCount

}

export interface IGetInquiriesParams{
    status?:string;
    page?:number;
    limit?:number
}

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