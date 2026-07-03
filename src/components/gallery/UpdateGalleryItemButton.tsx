"use client";

import { useState } from "react";
import GalleryForm from "./GalleryForm";
import type { GalleryItem } from "@/src/types/gallery";

interface UpdateGalleryItemButtonProps {
    item: GalleryItem;
}

export default function UpdateGalleryItemButton({ item }: UpdateGalleryItemButtonProps) {
    const [isFormOpen, setIsFormOpen] = useState(false);

    return (
        <>
            <button onClick={() => setIsFormOpen(true)} className="btn-secondary">
                <span>Update</span>
            </button>

            {isFormOpen && (
                <GalleryForm setIsFormOpen={setIsFormOpen} item={item} />
            )}
        </>
    );
}