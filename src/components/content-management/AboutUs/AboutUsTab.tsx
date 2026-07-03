"use client"

import type { IAboutUs } from "@/src/types/about-us";
import { Building2, Pencil } from "lucide-react";
import { useState } from "react";

export default function AboutUsTab({initialData}:{initialData:IAboutUs}){
    const [heroPreview, setHeroPreview] = useState<string>(initialData.heroImage || "");
    const [heroFile, setHeroFile] = useState<File | null>(null);
    const [isHeroDirty, setIsHeroDirty] = useState(false);

    const [CEOPreview, setCEOPreview] = useState<string>(initialData.ceoQuote.ceoPhoto || "");
    const [CEOFile, setCEOFile] = useState<File | null>(null);
    const [isCEODirty, setIsCEODirty] = useState(false);

    const handleHeroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setHeroFile(file);
        setHeroPreview(URL.createObjectURL(file));
        setIsHeroDirty(true);
    };
    
    const handleCEOChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setCEOFile(file);
        setCEOPreview(URL.createObjectURL(file));
        setIsCEODirty(true);
    };

    return(
        <div className="w-full min-h-screen flex flex-col gap-6">

            <div className="flex flex-col gap-6">
                {/* CARD 1: Basic Details */}
                        <div className="card p-6 flex flex-col gap-5">
                            <div className="flex items-center gap-2.5 border-b border-neutral-100 pb-4">
                                <Building2 size={20} className="text-primary-700" />
                                <h4 className="card-title font-semibold">Basic Details</h4>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-6">
                                <div className="flex flex-col gap-2">
                                    <span className="text-xs font-bold text-neutral-500 tracking-wide">Brand Logo</span>
                                    <div className="relative h-28 w-28 rounded-2xl border border-neutral-200 bg-neutral-50/50 flex items-center justify-center p-3 overflow-hidden group">
                                        {heroPreview ? (
                                            <img src={heroPreview} alt="companyLogo" className="w-full h-full object-contain" />
                                        ) : (
                                            <div className="text-xs text-neutral-400">No Image</div>
                                        )}
                                        <label className="absolute h-8 w-8 rounded-full bg-white shadow-md border border-neutral-100 flex items-center justify-center text-primary-700 hover:scale-105 transition-transform cursor-pointer bottom-1 right-1">
                                            <Pencil size={14} />
                                            <input type="file" accept="image/*" className="hidden" onChange={handleHeroChange} />
                                        </label>
                                    </div>
                                </div>

                                <div className="flex-1 flex flex-col gap-4">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-bold text-neutral-500 tracking-wide">Narrative Heading</label>
                                        <input
                                            type="text"
                                            className="input"
                                        />
                                        {/* {errors.companyName && <p className="text-xs text-red-500">{errors.companyName.message}</p>} */}
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-bold text-neutral-500 tracking-wide">Tagline</label>
                                        <input
                                            type="text"
                                            className="input"
                                        />
                                        {/* {errors.companyName && <p className="text-xs text-red-500">{errors.companyName.message}</p>} */}
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-bold text-neutral-500 tracking-wide">Main Description</label>
                                        <textarea
                                            rows={5}
                                            className="input leading-relaxed resize-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card p-6 flex flex-col gap-5">
                            <div className="flex items-center gap-2.5 border-b border-neutral-100 pb-4">
                                <Building2 size={20} className="text-primary-700" />
                                <h4 className="card-title font-semibold">Impact Metrics</h4>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                                <h2>Hello</h2>

                            </div>
                        </div>

                        <div className="card p-6 flex flex-col gap-5">
                            <div className="flex items-center gap-2.5 border-b border-neutral-100 pb-4">
                                <Building2 size={20} className="text-primary-700" />
                                <h4 className="card-title font-semibold">CEO Leadership</h4>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-6">
                                <div className="flex flex-col gap-2">
                                    <span className="text-xs font-bold text-neutral-500 tracking-wide">CEO Photo</span>
                                    <div className="relative h-28 w-28 rounded-2xl border border-neutral-200 bg-neutral-50/50 flex items-center justify-center p-3 overflow-hidden group">
                                        {CEOPreview ? (
                                            <img src={CEOPreview} alt="companyLogo" className="w-full h-full object-contain" />
                                        ) : (
                                            <div className="text-xs text-neutral-400">No Image</div>
                                        )}
                                        <label className="absolute h-8 w-8 rounded-full bg-white shadow-md border border-neutral-100 flex items-center justify-center text-primary-700 hover:scale-105 transition-transform cursor-pointer bottom-1 right-1">
                                            <Pencil size={14} />
                                            <input type="file" accept="image/*" className="hidden" onChange={handleCEOChange} />
                                        </label>
                                    </div>
                                </div>

                                <div className="flex-1 flex flex-col gap-4">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-bold text-neutral-500 tracking-wide">Full Name</label>
                                        <input
                                            type="text"
                                            className="input"
                                        />
                                        {/* {errors.companyName && <p className="text-xs text-red-500">{errors.companyName.message}</p>} */}
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-bold text-neutral-500 tracking-wide">Title/Position</label>
                                        <input
                                            type="text"
                                            className="input"
                                        />
                                        {/* {errors.companyName && <p className="text-xs text-red-500">{errors.companyName.message}</p>} */}
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-bold text-neutral-500 tracking-wide">CEO Quote</label>
                                        <textarea
                                            rows={5}
                                            className="input leading-relaxed resize-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
            </div>

        </div>
    )
}