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