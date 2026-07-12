import type { IPagination } from "@/src/types/inquiry";
import { fetchOrNull } from "../utils/helper";
import { api } from "./api";

export interface IPackageThumbnail {
    url: string;
}

export interface IPopulatedPackageType {
    _id: string;
    name: string;
    slug: string;
    icon: string;
    themeColor: string;
}

export interface IPopulatedDestination {
    _id: string;
    name: string;
    slug: string;
}

export interface ISupportContact {
    name: string;
    phone: string;
}

export interface IItineraryDay {
    day: number;
    title: string;
    description: string;
}

export interface ITermsAndConditions {
    title: string;
    description: string;
    isRequired?: boolean;
}

export interface IFAQ {
    question: string;
    answer: string;
    order?: number;
}

export interface IFAQSection {
    title: string;
    description: string;
    faqs: IFAQ[];
}

export type ICURRENCIES = "USD" | "Rs" | "EUR" | "GBP" | "AUD" | "CAD";

export type IPriceLabel = "per person" | "per group" | "per vehicle" ;

export type IDIFFICULTIES = "Easy" | "Moderate" | "Hard" | "Extreme" | undefined;

export interface IPackage {
    _id: string;
    title: string;
    slug: string;
    badge?: string;
    overviewTitle?: string;
    description: string;
    thumbnail: string;
    gallery: string[];
    price: number;
    currency: ICURRENCIES;
    priceLabel: IPriceLabel;
    durationDays: number;
    maxAltitude?: string;
    difficulty?: IDIFFICULTIES;
    groupSize?: number;
    highlights: string[];
    inclusions: string[];
    exclusions: string[];
    itinerary?: IItineraryDay[],
    termsAndConditions: ITermsAndConditions[],
    supportContacts:ISupportContact[],
    faqSection: IFAQSection,
    packageType: IPopulatedPackageType | null;
    destination: IPopulatedDestination | null;
    isFeatured: boolean;
    isActive: boolean;
    views: number;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface IPackagesResponse {
    success: boolean;
    message: string;
    data: IPackage[];
    pagination: IPagination;
    featuredCount: number;
    featuredMin: number;
    featuredMax: number;
    slotsRemaining: number;
}

export interface IPackageResponse {
    success: boolean;
    message: string;
    data: IPackage; 
}

export const getPackages = async (params: {
    page?: number;
    limit?: number;
    search?: string;
    destination?: string;
    difficulty?: IDIFFICULTIES;
    isFeatured?: boolean;
    minPrice?: number;
    maxPrice?: number;
    minDays?: number;
    maxDays?: number;
    sortBy?: string;
    sortOrder?: string;
}): Promise<IPackagesResponse | null> => {
    return fetchOrNull(async () => {
        const { data } = await api.get("/package/getAllPackages", { params });
        return data;
    });
};

export const createPackage = async (formData:FormData): Promise<IPackagesResponse | null> => {
    console.log("Created Package Data:",formData);
    const { data } = await api.post("/package/create",formData,{
        headers:{
            "Content-Type":"multipart/form-data"
        }
    });
    return data;
};

export const deletePackage = async (id:string): Promise<IPackagesResponse | null> => {
    const { data } = await api.post(`/package/delete/${id}`)
    return data;
};

export const updatePackage = async (formData:FormData,id:string): Promise<IPackagesResponse | null> => {
    console.log("Update Package Data:",formData);
    const { data } = await api.put(`/package/update/${id}`,formData,{
        headers:{
            "Content-Type":"multipart/form-data"
        }
    });
    return data;
};

export const getPackageBySlug = async (slug:string): Promise<IPackageResponse | null> => {
    return fetchOrNull(async () => {
        const { data } = await api.get(`/package/slug/${slug}`);
        return data;
    });
};

export const getPackageById = async (id:string): Promise<IPackageResponse | null> => {
    return fetchOrNull(async () => {
        const { data } = await api.get(`/package/${id}`);
        return data;
    });
};
