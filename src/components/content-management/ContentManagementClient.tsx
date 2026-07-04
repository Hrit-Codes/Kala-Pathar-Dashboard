"use client";

import { useState, useEffect, useRef } from "react";
import PageHeader from "@/src/components/layout/PageHeader";
import { CONTENT_FILTER_TABS } from "@/src/lib/constants";
import AboutUsTab from "./AboutUs/AboutUsTab";
import type { IAboutUs } from "@/src/types/about-us";
import WhyPlanWithUsTab from "./WhyPlanWithUs/WhyPlanWithUsTab";
import type { IWhyPlanWithUsItem } from "@/src/types/why-plan-with-us";
import AffiliationsTab from "./Affiliations/AffiliationsTab";

type ContentTab = "About_Us" | "Why_Plan_With_Us" | "Affiliations";

type ContentManagementClientProps={
    initialWhyPlanWithUs:IWhyPlanWithUsItem[],
    initialAboutUs:IAboutUs
}

export default function ContentManagementClient({initialWhyPlanWithUs, initialAboutUs}:ContentManagementClientProps) {
    const [activeTab, setActiveTab] = useState<ContentTab>("Why_Plan_With_Us");
    const [sliderStyle, setSliderStyle] = useState({ left: 0, width: 0 });
    const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

    useEffect(() => {
        const activeIndex = CONTENT_FILTER_TABS.findIndex(tab => tab.value === activeTab);
        const element = tabRefs.current[activeIndex];
        
        if (element) {
            setSliderStyle({
                left: element.offsetLeft,
                width: element.offsetWidth,
            });
        }
    }, [activeTab]);

    return (
        <div className="w-full min-h-screen flex flex-col gap-6">
            <PageHeader 
                heading="Manage the content visible on the page"
                subheading="Manage public-facing information"
            />

            {/* Tabs */}
            <div className="card flex items-center justify-between p-2 w-fit">
                <div className="flex items-center relative gap-1">
                    <div
                        className="absolute h-[calc(100%-4px)] top-0.5 rounded-xl bg-primary-600 transition-all duration-300 ease-out pointer-events-none"
                        style={{ 
                            left: sliderStyle.left, 
                            width: sliderStyle.width 
                        }}
                    />
                    
                    {CONTENT_FILTER_TABS.map((tab, idx) => {
                        const isActive = activeTab === tab.value;
                        return (
                            <button
                                key={tab.id}
                                ref={(el) => { tabRefs.current[idx] = el; }}
                                onClick={() => setActiveTab(tab.value as ContentTab)}
                                className={`relative z-10 px-6 py-2.5 rounded-xl text-sm font-bold tracking-wide transition-colors duration-300 cursor-pointer whitespace-nowrap ${
                                    isActive
                                        ? "text-white"
                                        : "text-neutral-600 hover:text-neutral-900"
                                }`}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Render tabs */}
            {activeTab === "Why_Plan_With_Us" && <WhyPlanWithUsTab items={initialWhyPlanWithUs } />}
            {activeTab === "About_Us" && <AboutUsTab initialData={initialAboutUs } />}
            {activeTab === "Affiliations" && <AffiliationsTab />}
        </div>
    );
}