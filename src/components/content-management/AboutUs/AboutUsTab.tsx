"use client"

import { createAboutUs, updateAboutUs } from "@/src/lib/api/about-us";
import type { IAboutUs } from "@/src/types/about-us";
import { useMutation } from "@tanstack/react-query";
import { Building2, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface CompanyInfoFormValues {
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

export default function AboutUsTab({initialData}:{initialData:IAboutUs}){
    const router=useRouter();
    const [heroPreview, setHeroPreview] = useState<string>(initialData.heroImage || "");
    const [heroFile, setHeroFile] = useState<File | null>(null);
    const [isHeroDirty, setIsHeroDirty] = useState(false);

    const [CEOPreview, setCEOPreview] = useState<string>(initialData.ceoQuote.ceoPhoto || "");
    const [CEOFile, setCEOFile] = useState<File | null>(null);
    const [isCEODirty, setIsCEODirty] = useState(false);

    
    const { register, handleSubmit, formState: { errors, isDirty } } = useForm<CompanyInfoFormValues>({
            defaultValues: {
                heading: initialData?.heading || "",
                tagline: initialData?.tagline || "",
                description: initialData?.description || "",
                // heroImage: initialData?.heroImage || "",
                ceoQuote:{
                    quoteText:initialData?.ceoQuote.quoteText,
                    ceoName:initialData?.ceoQuote.ceoName,
                    ceoTitle:initialData?.ceoQuote.ceoTitle,
                    // ceoPhoto:initialData?.ceoQuote.ceoPhoto
                },
                stats: initialData?.stats || [
                    { label: "Happy Travellers", value: "" },
                    { label: "Years of Experience", value: "" },
                    { label: "Expert Local Guides", value: "" },
                    { label: "Curated Packages", value: "" }
                ]
            }
        });

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

    const createMutation= useMutation({
        mutationFn:(formData:FormData)=> createAboutUs(formData),
        onSuccess: () => {
            toast.success("About us added successfully");
            setIsHeroDirty(false);
            setIsCEODirty(false);
            router.refresh();
            },
        onError: (error: any) => {
            const message = error.response?.data?.message || "Failed to add about us info";
            toast.error(message);
            }
    });

    const updateMutation= useMutation({
        mutationFn:(formData:FormData)=> updateAboutUs(formData),
        onSuccess: () => {
            toast.success("About us updated successfully");
            setIsHeroDirty(false);
            setIsCEODirty(false);
            router.refresh();
            },
        onError: (error: any) => {
            const message = error.response?.data?.message || "Failed to update about us info";
            toast.error(message);
            }
    });

    const onSubmit=(data:CompanyInfoFormValues)=>{
        const formData= new FormData();

        formData.append("heading", data.heading);
        formData.append("tagline", data.tagline);
        formData.append("description", data.description);

        formData.append("ceoQuote[quoteText]",data.ceoQuote.quoteText);
        formData.append("ceoQuote[ceoName]",data.ceoQuote.ceoName);
        formData.append("ceoQuote[ceoTitle]",data.ceoQuote.ceoTitle);

        data.stats.forEach((stat, idx) => {
            formData.append(`stats[${idx}][label]`, stat.label);
            formData.append(`stats[${idx}][value]`, stat.value);
        });

        if(heroFile){
            formData.append("heroImage",heroFile)
        }
        if(CEOFile){
            formData.append("ceoPhoto",CEOFile);
        }

        if(initialData){
            updateAboutUs(formData);
        }else{
            createAboutUs(formData);
        }

    }

    const isPending= updateMutation.isPending || createMutation.isPending;
    const hasChanges=isDirty || isCEODirty || isHeroDirty

    return(
        <div className="w-full min-h-screen flex flex-col gap-6">

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
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
                                            disabled={isPending}
                                            {...register("heading",{required:"Heading is required"})}
                                        />
                                        {errors.heading && <p className="text-xs text-red-500">{errors.heading.message}</p>}
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-bold text-neutral-500 tracking-wide">Tagline</label>
                                        <input
                                            type="text"
                                            className="input"
                                            disabled={isPending}
                                            {...register("tagline",{required:"Tagline is required"})}
                                        />
                                        {errors.tagline && <p className="text-xs text-red-500">{errors.tagline.message}</p>}
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-bold text-neutral-500 tracking-wide">Main Description</label>
                                        <textarea
                                            rows={5}
                                            className="input leading-relaxed resize-none"
                                            disabled={isPending}
                                            {...register("description",{required:"Description is required"})}
                                        />
                                        {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card p-6 flex flex-col gap-5">
                            <div className="flex items-center gap-2.5 border-b border-neutral-100 pb-4">
                                <Building2 size={20} className="text-primary-700" />
                                <h4 className="card-title font-semibold">Impact Metrics</h4>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                                {initialData.stats.map((stat,index)=>(
                                    <div key={index} className="flex flex-col gap-2 p-4 card">
                                        <input
                                            type="text"
                                            className="input bg-white font-semibold text-neutral-800"
                                            placeholder="e.g. Happy Travelers"
                                            disabled={isPending}
                                            {...register(`stats.${index}.label` as const, { required: "Metric Label required" })}
                                        />
                                        <input
                                            type="text"
                                            className="input bg-white font-semibold text-neutral-800"
                                            placeholder="e.g. 2,000+"
                                            disabled={isPending}
                                            {...register(`stats.${index}.value` as const, { required: "Metric value required" })}
                                        />
                                    </div>
                                ))}

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
                                            disabled={isPending}
                                            {...register("ceoQuote.ceoName",{required:"Ceo name is required"})}
                                        />
                                        {errors.ceoQuote?.ceoName && <p className="text-xs text-red-500">{errors.ceoQuote.ceoName.message}</p>}
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-bold text-neutral-500 tracking-wide">Title/Position</label>
                                        <input
                                            type="text"
                                            className="input"
                                            disabled={isPending}
                                            {...register("ceoQuote.ceoTitle",{required:"Ceo title is required"})}
                                        />
                                        {errors.ceoQuote?.ceoTitle && <p className="text-xs text-red-500">{errors.ceoQuote.ceoTitle.message}</p>}
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-bold text-neutral-500 tracking-wide">CEO Quote</label>
                                        <textarea
                                            rows={5}
                                            className="input leading-relaxed resize-none"
                                            disabled={isPending}
                                            {...register("ceoQuote.quoteText",{required:"Ceo quote is required"})}
                                        />
                                        {errors.ceoQuote?.quoteText && <p className="text-red-500 text-xs">{errors.ceoQuote.quoteText.message}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    <div className="flex justify-end items-center gap-3">
                        <button
                            type="submit"
                            disabled={!hasChanges || isPending}
                            className="btn-primary whitespace-nowrap"
                        >
                            {isPending? "Saving..." : initialData? "Update Information":"Add Information"}
                        </button>
                    </div>
            </form>

        </div>
    )
}