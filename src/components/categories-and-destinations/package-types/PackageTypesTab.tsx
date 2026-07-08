"use client";

import type { IPackageTypesResponse } from "@/src/lib/api/categories";
import {packageTypes } from "@/src/lib/constants";
import { Pencil, Plus, GripVertical, Mountain, Compass, Map, Camera, Coffee, Heart, Star, Globe, Sparkles } from "lucide-react";
import { useState } from "react";
import PackageTypeForm from "./PackageTypeForm";

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
    // Fallback: show first letter if icon not found
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
    const [types, setTypes] = useState(packageTypes);

    const handleToggleDifficulty = (id: string) => {
        setTypes((prev) =>
            prev.map((t) =>
                t._id === id ? { ...t, hasDifficultyLevels: !t.hasDifficultyLevels } : t
            )
        );
    };

    return (
        <div className="w-full flex flex-col gap-6">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start p-6">

                {/* ── Left: List ──────────────────────────────────────────── */}
                <div className="xl:col-span-8 flex flex-col gap-4">

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
                                const hex = type.themeColor?.replace("#", "");
                                const bgColor = `#${hex}18`;
                                const iconColor = type.themeColor;

                                return (
                                    <div
                                        key={type._id}
                                        className={`card p-4 flex items-center gap-4 transition-all ${
                                            !type.isActive ? "opacity-50" : ""
                                        }`}
                                    >
                                        {/* Drag handle */}
                                        <div className="text-neutral-300 cursor-grab shrink-0">
                                            <GripVertical size={16} />
                                        </div>

                                        {/* Icon box */}
                                        <div
                                            className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0"
                                            style={{ backgroundColor: bgColor }}
                                        >
                                            {getIcon(type.icon, iconColor)}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="text-sm font-bold text-neutral-800">
                                                    {type.name}
                                                </span>
                                                {!type.isActive && (
                                                    <span className="badge bg-neutral-100 text-neutral-400 text-[10px] normal-case">
                                                        Inactive
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                <span
                                                    className="h-2.5 w-2.5 rounded-full shrink-0"
                                                    style={{ backgroundColor: type.themeColor }}
                                                />
                                                <span className="text-[11px] font-bold text-neutral-400 tracking-wide uppercase">
                                                    {type.themeColor}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Difficulty toggle */}
                                        <div className="flex flex-col items-center gap-1 shrink-0">
                                            <span className="text-[9px] font-black tracking-widest uppercase text-neutral-400">
                                                Difficulty Levels
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => handleToggleDifficulty(type._id)}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer focus:outline-none ${
                                                    type.hasDifficultyLevels
                                                        ? "bg-primary-600"
                                                        : "bg-neutral-200"
                                                }`}
                                                title={
                                                    type.hasDifficultyLevels
                                                        ? "Disable difficulty levels"
                                                        : "Enable difficulty levels"
                                                }
                                            >
                                                <span
                                                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                                                        type.hasDifficultyLevels
                                                            ? "translate-x-6"
                                                            : "translate-x-1"
                                                    }`}
                                                />
                                            </button>
                                        </div>

                                        {/* Edit */}
                                        <button
                                            type="button"
                                            className="h-8 w-8 rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-400 hover:text-primary-700 hover:border-primary-200 transition-colors shrink-0"
                                            title="Edit"
                                        >
                                            <Pencil size={13} />
                                        </button>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* ── Right: Quick Add Form ───────────────────────────────── */}
                <div className="xl:col-span-4">
                    <PackageTypeForm/>
                </div>
            </div>
        </div>
    );
}