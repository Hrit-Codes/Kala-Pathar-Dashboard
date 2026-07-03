export interface GalleryItem {
    _id: string;
    image: string;
    title: string;
    subtitle: string;
    description: string;
    order: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface GalleryFormValues {
    image: File;
    title: string;
    subtitle: string;
    description: string;
    order?: number;
}