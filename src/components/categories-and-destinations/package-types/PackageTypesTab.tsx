"use client";

import { delPackageType, type IPackageTypesResponse } from "@/src/lib/api/package-types";
import { Pencil, Plus, GripVertical, Mountain, Compass, Map, Camera, Coffee, Heart, Star, Globe, Sparkles } from "lucide-react";
import { useState } from "react";
import PackageTypeForm from "./PackageTypeForm";
import PackageCard from "./PackageCard";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

type IPackageTypesProps = {
    initialData: IPackageTypesResponse;
};

const iconMap: Record<string, React.ReactNode> = {
    mountain: <Mountain size={22} />,
    compass: <Compass size={22} />,
    map: <Map size={22} />,
    camera: <Camera size={22} />,
    coffee: <Coffee size={22} />,
    heart: <Heart size={22} />,
    star: <Star size={22} />,
    globe: <Globe size={22} />,
    sparkles: <Sparkles size={22} />,
};

const getIcon = (iconName: string, color?: string) => {
    const IconComponent = iconMap[iconName];
    if (IconComponent) {
        return <span style={{ color: color || "#10B981" }}>{IconComponent}</span>;
    }
    return (
        <span 
            className="text-lg font-bold uppercase"
            style={{ color: color || "#10B981" }}
        >
            {iconName?.charAt(0) || "P"}
        </span>
    );
};

export default function PackageTypesTab({ initialData }: IPackageTypesProps) {
    const router = useRouter();
    
    const types= initialData?.data || []

    const delMutation = useMutation({
        mutationFn: (id: string) => delPackageType(id),
        onSuccess: () => {
            toast.success("Successfully deleted!");
            router.refresh();
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || "Server error";
            toast.error(message);
        },
    });

    const handleDelete = (id: string) => {
        console.log("Deleting package type with ID:", id);
        delMutation.mutate(id);
    };

    const handleUpdate = () => {
        router.refresh();
    };

    return (
        <div className="w-full flex flex-col gap-6">
            <div className="grid grid-cols-1 lg:grid-cols-14 gap-6 items-start p-6">

                {/* ── Left: List ──────────────────────────────────────────── */}
                <div className="lg:col-span-8 flex flex-col gap-4">

                    {/* Header */}
                    <div className="flex items-center justify-between ">
                        <div className="flex items-center gap-3">
                            <h3 className="card-title">Existing Package Types</h3>
                            <span className="badge bg-neutral-100 text-neutral-500 normal-case font-bold text-[11px]">
                                {types.length} Items
                            </span>
                        </div>
                        <button
                            type="button"
                            className="btn-primary flex items-center gap-1.5"
                        >
                            <Plus size={14} />
                            Add Type
                        </button>
                    </div>

                    {/* List */}
                    <div className="flex flex-col gap-3">
                        {types.length === 0 ? (
                            <div className="card flex flex-col items-center justify-center py-16 gap-3">
                                <div className="h-12 w-12 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-400">
                                    <Plus size={22} />
                                </div>
                                <p className="text-sm font-semibold text-neutral-500">No package types yet</p>
                                <p className="text-xs text-neutral-400">Add your first package type to get started</p>
                            </div>
                        ) : (
                            types.map((type) => {
                                return (
                                    <PackageCard
                                        key={type._id}
                                        type={type}
                                        handleUpdate={handleUpdate}
                                        onDelete={handleDelete}
                                        isDeleting={delMutation.isPending}
                                    />
                                );
                            })
                        )}
                    </div>
                </div>

                {/* ── Right: Quick Add Form ───────────────────────────────── */}
                <div className="lg:col-span-6">
                    <PackageTypeForm handleUpdate={handleUpdate}/>
                </div>
            </div>
        </div>
    );
}