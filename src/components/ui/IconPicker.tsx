// src/components/ui/IconPicker.tsx
"use client";

import * as LucideIcons from "lucide-react";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { WHY_CHOOSE_US_ICONS } from "@/src/lib/constants";

interface IconPickerProps {
    value: string;
    onChange: (value: string) => void;
    error?: string;
}

export default function IconPicker({ value, onChange, error }: IconPickerProps) {
    const [isOpen, setIsOpen] = useState(false);

    const SelectedIcon = value
        ? (LucideIcons as any)[value.charAt(0).toUpperCase() + value.slice(1)]
        : null;

    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-neutral-500 tracking-wide">Icon</label>

            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen((prev) => !prev)}
                    className="input flex items-center justify-between w-full"
                >
                    <div className="flex items-center gap-2">
                        {SelectedIcon && <SelectedIcon size={16} className="text-primary-600" />}
                        <span className={value ? "text-neutral-800" : "text-neutral-400"}>
                            {value || "Select an icon..."}
                        </span>
                    </div>
                    <ChevronDown size={15} className="text-neutral-400" />
                </button>

                {isOpen && (
                    <div className="absolute z-20 top-full mt-1 w-full bg-white border border-neutral-200 rounded-xl shadow-lg p-2 grid grid-cols-5 gap-1 max-h-48 overflow-y-auto">
                        {WHY_CHOOSE_US_ICONS.map((icon) => {
                            const Icon = (LucideIcons as any)[icon.component];
                            const isSelected = value === icon.value;
                            return (
                                <button
                                    key={icon.value}
                                    type="button"
                                    title={icon.label}
                                    onClick={() => {
                                        onChange(icon.value);
                                        setIsOpen(false);
                                    }}
                                    className={`flex flex-col items-center justify-center gap-1 p-2 rounded-lg transition-colors cursor-pointer ${
                                        isSelected
                                            ? "bg-primary-50 text-primary-600 border border-primary-200"
                                            : "hover:bg-neutral-50 text-neutral-600"
                                    }`}
                                >
                                    {Icon && <Icon size={18} />}
                                    <span className="text-[9px] font-medium truncate w-full text-center">
                                        {icon.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}