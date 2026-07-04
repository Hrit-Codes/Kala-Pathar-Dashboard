export interface IAffiliationItem {
    _id: string;
    abbreviation: string;
    name: string;
    logo: string;
    order: number;
}

export interface IPartnerSection {
    _id: string;
    sectionTitle: string;
    sectionTagline: string;
    affiliations: IAffiliationItem[];
    badges: string[];
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface IPartnerSectionResponse {
    success: boolean;
    message: string;
    data: IPartnerSection;
}