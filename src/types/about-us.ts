export interface IStats {
    label: string;
    value: string;
}

export interface ICeoQuote {
    quoteText: string;
    ceoName: string;
    ceoTitle: string;
    ceoPhoto: string;
}

export interface IAboutUs {
    _id: string;
    heading: string;
    tagline: string;
    description: string;
    heroImage: string;
    heroImageLocalUrl: string;
    ceoQuote: ICeoQuote;
    stats: IStats[];
    createdAt: string;
    updatedAt: string;
}

export interface IAboutUsResponse {
    success: boolean;
    message: string;
    data: IAboutUs;
}

export interface AboutUsFormValues {
    heading: string;
    tagline: string;
    description: string;
    ceoQuote: {
        quoteText: string;
        ceoName: string;
        ceoTitle: string;
    };
    stats: {
        label: string;
        value: string;
    }[];
}