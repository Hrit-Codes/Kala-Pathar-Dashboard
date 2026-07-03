"use client";

import { useState } from "react";
import WhyPlanWithUsForm from "./WhyPlanWithUsForm";
import type { IWhyPlanWithUsItem } from "@/src/types/why-plan-with-us";

interface UpdateWhyChooseUsButtonProps {
    item: IWhyPlanWithUsItem;
}

export default function UpdateWhyPlanWithUsItemButton({ item }: UpdateWhyChooseUsButtonProps) {
    const [isFormOpen, setIsFormOpen] = useState(false);

    return (
        <>
            <button onClick={() => setIsFormOpen(true)} className="btn-secondary">
                <span>Update</span>
            </button>

            {isFormOpen && (
                <WhyPlanWithUsForm setIsFormOpen={setIsFormOpen} item={item} />
            )}
        </>
    );
}