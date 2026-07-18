import { serverGet } from "../server-api";
import { ICURRENCIES, IDIFFICULTIES } from "./package";

export interface IDashboardAnalyticsResponse {
    success: boolean;
    message: string;
    data: DashboardAnalyticsData;
}

export interface DashboardAnalyticsData {
    inquiries: InquiryStats;
    views: ViewStats;
    subscribers: SubscriberStats;
    packages: PackageStats;
    generatedAt: string;
}

export interface InquiryStats {
    thisMonth: number;
    lastMonth: number;
    total: number;
    pending: number;
    percentageChange: number;
    trend: "up" | "down";
}

export interface ViewStats {
    thisMonth: number;
    lastMonth: number;
    total: number;
    percentageChange: number;
    trend: "up" | "down";
}

export interface SubscriberStats {
    thisMonth: number;
    lastMonth: number;
    total: number;
    active: number;
    percentageChange: number;
    trend: "up" | "down";
}

export interface PackageStats {
    total: number;
    active: number;
    inactive: number;
}

export const getAnalytics=async():Promise<IDashboardAnalyticsResponse|null>=>{
    return serverGet("/analytics/dashboard");
}

export interface ITopPackagesResponse{
    success:boolean,
    message:string,
    data:TopPackage[],
}

export interface TopPackage{
    _id:string;
    title:string;
    slug:string;
    thumbnail:string;
    price:number;
    currency:ICURRENCIES,
    durationDays:number,
    difficulty?:IDIFFICULTIES,
    packageType:PackageTypeSummary,
    destination:DestinationSummary,
    isFeatured:boolean
}

export interface PackageTypeSummary {
    _id: string;
    name: string;
    slug: string;
    icon: string;
    themeColor: string;
    description: string;
}

export interface DestinationSummary {
    _id: string;
    name: string;
    slug: string;
    description: string;
}

export const getTopPackages=async():Promise<ITopPackagesResponse| null> =>{
    return serverGet("/package/top");
}