import type { IPagination } from "./inquiry";

export type CampaignStatus = "pending" | "processing" | "completed" | "failed";

export interface ICampaignAttachment {
    fileName: string;
    localPath: string;
    mimeType: string;
}

export interface ICampaignSentBy {
    _id: string;
    email: string;
}

export interface IPopulatedCampaign extends Omit<ICampaign, 'sentBy'> {
    sentBy: ICampaignSentBy;
}

export interface ICampaign {
    _id: string;
    subject: string;
    body: string;
    sentBy: ICampaignSentBy | string; 
    status: CampaignStatus;
    attachments: ICampaignAttachment[];
    totalRecipients: number;
    successCount: number;
    failureCount: number;
    startedAt: string;
    completedAt?: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface IGetCampaignsResponse {
    success: boolean;
    message: string;
    data: IPopulatedCampaign[];
    pagination: IPagination;
}