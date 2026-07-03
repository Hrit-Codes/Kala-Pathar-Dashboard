"use client";

import { useState } from "react";
import type { IWhyChooseUsItem } from "@/src/types/why-choose-us";

interface UpdateWhyChooseUsButtonProps {
    item: IWhyChooseUsItem;
}

export default function UpdateWhyChooseUsItemButton({ item }: UpdateWhyChooseUsButtonProps) {
    const [isFormOpen, setIsFormOpen] = useState(false);

    return (
        <>
            <button onClick={() => setIsFormOpen(true)} className="btn-secondary">
                <span>Update</span>
            </button>

        </>
    );
}