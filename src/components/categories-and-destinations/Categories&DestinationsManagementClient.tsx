"use client";

import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { CATEGORIES_AND_DESTINATIONS_TAB } from "@/src/lib/constants";
import type { IPackageTypesResponse } from "@/src/lib/api/categories";
import PackageTypesTab from "./package-types/PackageTypesTab";


type ContentTab = "Package_Types" | "Destinations";

type CategoriesAndDestinationsManagementClientProps = {
    initialPackageTypes: IPackageTypesResponse,
}

export default function CategoriesAndDestinationsManagementClient({ 
    initialPackageTypes 
}: CategoriesAndDestinationsManagementClientProps) {
    const [activeTab, setActiveTab] = useState<ContentTab>("Package_Types");
    const [sliderStyle, setSliderStyle] = useState({ left: 0, width: 0 });
    const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const activeIndex = CATEGORIES_AND_DESTINATIONS_TAB.findIndex(
            tab => tab.value === activeTab
        );
        const element = tabRefs.current[activeIndex];
        
        if (element) {
            setSliderStyle({
                left: element.offsetLeft,
                width: element.offsetWidth,
            });
        }
    }, [activeTab]);

    useEffect(() => {
        const updateSlider = () => {
            const activeIndex = CATEGORIES_AND_DESTINATIONS_TAB.findIndex(
                tab => tab.value === activeTab
            );
            const element = tabRefs.current[activeIndex];
            
            if (element) {
                setSliderStyle({
                    left: element.offsetLeft,
                    width: element.offsetWidth,
                });
            }
        };

        window.addEventListener('resize', updateSlider);
        return () => window.removeEventListener('resize', updateSlider);
    }, [activeTab]);

    const handleTabChange = (tabValue: ContentTab) => {
        setActiveTab(tabValue);
    };

    return (
        <div className="w-full min-h-screen flex flex-col gap-6">
            {/* Tabs */}
            <div ref={containerRef} className="card flex items-center justify-between p-2 w-fit">
                <div className="flex items-center relative gap-1">
                    {/* Slider indicator */}
                    <div
                        className="absolute h-[calc(100%-4px)] top-0.5 rounded-xl bg-primary-600 transition-all duration-300 ease-out pointer-events-none"
                        style={{
                            left: sliderStyle.left,
                            width: sliderStyle.width,
                        }}
                    />

                    {CATEGORIES_AND_DESTINATIONS_TAB.map((tab, idx) => {
                        const isActive = activeTab === tab.value;
                        return (
                            <button
                                key={tab.id}
                                ref={(el) => {
                                    tabRefs.current[idx] = el;
                                }}
                                onClick={() => handleTabChange(tab.value as ContentTab)}
                                className={`relative z-10 px-6 py-2.5 rounded-xl text-sm font-bold tracking-wide transition-colors duration-300 cursor-pointer whitespace-nowrap ${
                                    isActive ? "text-white" : "text-neutral-600 hover:text-neutral-900"
                                }`}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Render tabs */}
            <div className="card">
                {activeTab === "Package_Types" && <PackageTypesTab initialData={initialPackageTypes} />}
                {activeTab === "Destinations" && (
                    <div className="p-6">
                        <h3>Destinations</h3>
                        <p className="text-neutral-500">Coming soon...</p>
                    </div>
                )}
            </div>
        </div>
    );
}