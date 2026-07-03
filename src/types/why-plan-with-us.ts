export interface IWhyPlanWithUsItem {
    _id: string;
    title: string;
    description: string;
    icon: string;
    order: number;
    isActive: boolean;
    createdAt: string; 
    updatedAt: string; 
}

export interface WhyPlanWithUsFormValues {
    title: string;
    description: string;
    icon: string;
    order?: number;
    isActive?: boolean;
}