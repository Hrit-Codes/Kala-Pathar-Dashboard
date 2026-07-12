"use client";

import { Camera, Coffee, Compass, Globe, GripVertical, Heart, Map, Mountain, Pencil, Sparkles, Star, Check, X, Trash2 } from "lucide-react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import IconPicker from "../../ui/IconPicker";
import ColorPicker from "../../ui/ColorPicker";
import ConfirmDeleteModal from "../../ui/ConfirmDeletePopup";
import { updatePackageType, type IPackageType } from "@/src/lib/api/package-types";
import type { PackageTypeFormValues } from "@/src/lib/vallidators/package-type.validate";

interface PackageCardProps {
    type: IPackageType;
    onDelete: (id: string) => void;
    handleUpdate: () => void;
    isDeleting: boolean;
}

interface EditDraft {
    name: string;
    icon: string;
    themeColor: string;
    description: string;
    hasDifficultyLevels: boolean;
    order: number;
    isActive: boolean;
}

export default function PackageCard({
    type,
    onDelete,
    handleUpdate,
    isDeleting,
}: PackageCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [editDraft, setEditDraft] = useState<EditDraft>({
        name: type.name,
        icon: type.icon,
        themeColor: type.themeColor,
        description: type.description || "",
        hasDifficultyLevels: type.hasDifficultyLevels,
        order: type.order ?? 0,
        isActive: type.isActive,
    });

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

    const bgColor = `#${type.themeColor?.replace("#", "")}18`;
    const iconColor = type.themeColor;

    const updateMutation = useMutation({
        mutationFn: ({ id, body }: { id: string; body: PackageTypeFormValues }) =>
            updatePackageType(id, body),
        onSuccess: () => {
            toast.success("Successfully updated!");
            setIsEditing(false);
            setIsDirty(false);
            handleUpdate();
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || "Server error";
            toast.error(message);
        },
    });

    const isSaving = updateMutation.isPending;

    const hasChanges = () => {
        return (
            editDraft.name !== type.name ||
            editDraft.icon !== type.icon ||
            editDraft.themeColor !== type.themeColor ||
            editDraft.description !== (type.description || "") ||
            editDraft.hasDifficultyLevels !== type.hasDifficultyLevels ||
            editDraft.order !== (type.order ?? 0) ||
            editDraft.isActive !== type.isActive
        );
    };

    const handleFieldChange = (field: keyof EditDraft, value: string | boolean | number) => {
        setEditDraft((prev) => ({ ...prev, [field]: value }));
        setIsDirty(true);
    };

    const handleStartEdit = () => {
        setIsEditing(true);
        setEditDraft({
            name: type.name,
            icon: type.icon,
            themeColor: type.themeColor,
            description: type.description || "",
            hasDifficultyLevels: type.hasDifficultyLevels,
            order: type.order ?? 0,
            isActive: type.isActive,
        });
        setIsDirty(false);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setIsDirty(false);
    };

    const handleConfirmEdit = () => {
        if (!hasChanges()) {
            toast.info("No changes to save");
            setIsEditing(false);
            setIsDirty(false);
            return;
        }

        updateMutation.mutate({
            id: type._id,
            body: {
                name: editDraft.name,
                icon: editDraft.icon,
                themeColor: editDraft.themeColor,
                description: editDraft.description,
                hasDifficultyLevels: editDraft.hasDifficultyLevels,
                order: editDraft.order,
                isActive: editDraft.isActive,
            },
        });
    };

    const handleDeleteClick = () => {
        setShowDeleteConfirm(true);
    };

    const handleConfirmDelete = () => {
        onDelete(type._id);
        console.log("Id:",type._id);
        setShowDeleteConfirm(false);
    };

    if (isEditing) {
        return (
            <div
                className={`card p-4 flex flex-col gap-3 transition-all ${
                    isDirty
                        ? "border-primary-400 bg-primary-50/30 ring-1 ring-primary-400/20"
                        : "border-primary-200 bg-primary-50/20"
                }`}
            >
                <div className="flex flex-col gap-2">
                    {/* Name */}
                    <input
                        type="text"
                        value={editDraft.name}
                        onChange={(e) => handleFieldChange("name", e.target.value)}
                        placeholder="Package name"
                        disabled={isSaving}
                        className={`input transition-all ${
                            isDirty && editDraft.name !== type.name
                                ? "border-primary-400 bg-white"
                                : ""
                        }`}
                        autoFocus
                    />

                    {/* Icon & Theme Color */}
                    <div className="flex items-center justify-between gap-2">
                        <div className="w-1/2">
                            <IconPicker
                                value={editDraft.icon}
                                onChange={(icon) => handleFieldChange("icon", icon)}
                            />
                        </div>

                        <div className="w-1/2">
                            <ColorPicker
                                value={editDraft.themeColor}
                                onChange={(hex) => handleFieldChange("themeColor", hex)}
                                disabled={isSaving}
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <textarea
                        value={editDraft.description}
                        onChange={(e) => handleFieldChange("description", e.target.value)}
                        placeholder="Description"
                        disabled={isSaving}
                        rows={2}
                        className={`input leading-relaxed resize-none transition-all ${
                            isDirty && editDraft.description !== (type.description || "")
                                ? "border-primary-400 bg-white"
                                : ""
                        }`}
                    />

                    {/* Order */}
                    <div className="flex items-center gap-3">
                        <label className="text-xs font-bold text-neutral-500 tracking-wide shrink-0">
                            Order
                        </label>
                        <input
                            type="number"
                            min={0}
                            value={editDraft.order}
                            onChange={(e) => handleFieldChange("order", parseInt(e.target.value) || 0)}
                            disabled={isSaving}
                            className={`input w-24 transition-all ${
                                isDirty && editDraft.order !== (type.order ?? 0)
                                    ? "border-primary-400 bg-white"
                                    : ""
                            }`}
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between pt-1 flex-wrap gap-3">
                    <div className="flex items-center gap-5 flex-wrap">
                        {/* Difficulty Toggle */}
                        <div className="flex items-center gap-2.5">
                            <span className="text-xs font-bold text-neutral-600">
                                Difficulty Levels
                            </span>
                            <button
                                type="button"
                                disabled={isSaving}
                                onClick={() => handleFieldChange("hasDifficultyLevels", !editDraft.hasDifficultyLevels)}
                                className={`relative w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
                                    editDraft.hasDifficultyLevels ? "bg-primary-600" : "bg-neutral-300"
                                }`}
                            >
                                <span
                                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                                        editDraft.hasDifficultyLevels ? "translate-x-5" : ""
                                    }`}
                                />
                            </button>
                        </div>

                        {/* Active Status Toggle */}
                        <div className="flex items-center gap-2.5">
                            <span className="text-xs font-bold text-neutral-600">
                                Active Status
                            </span>
                            <button
                                type="button"
                                disabled={isSaving}
                                onClick={() => handleFieldChange("isActive", !editDraft.isActive)}
                                className={`relative w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
                                    editDraft.isActive ? "bg-emerald-500" : "bg-neutral-300"
                                }`}
                            >
                                <span
                                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                                        editDraft.isActive ? "translate-x-5" : ""
                                    }`}
                                />
                            </button>
                        </div>

                        {isDirty && (
                            <span className="text-[10px] font-medium text-amber-600">
                                Unsaved changes
                            </span>
                        )}
                    </div>

                    {/* Save / Cancel */}
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={handleCancelEdit}
                            disabled={isSaving}
                            className="h-8 w-8 rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-400 hover:text-neutral-700 hover:border-neutral-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Cancel"
                        >
                            <X size={14} />
                        </button>
                        <button
                            type="button"
                            onClick={handleConfirmEdit}
                            disabled={isSaving || !editDraft.name.trim() || !isDirty}
                            className={`h-8 w-8 rounded-lg flex items-center justify-center text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                                isDirty && editDraft.name.trim()
                                    ? "bg-primary-700 hover:bg-primary-800"
                                    : "bg-neutral-300"
                            }`}
                            title={isDirty ? "Save changes" : "No changes to save"}
                        >
                            <Check size={14} />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div
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
                    {type.description && (
                        <p className="text-xs text-neutral-500 line-clamp-1 mt-0.5">
                            {type.description}
                        </p>
                    )}
                </div>

                {/* Difficulty toggle */}
                <div className="flex flex-col items-center gap-1 shrink-0">
                    <span className="text-[9px] font-black tracking-widest uppercase text-neutral-400">
                        Difficulty Levels
                    </span>
                    <div
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            type.hasDifficultyLevels ? "bg-primary-600" : "bg-neutral-200"
                        }`}
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                                type.hasDifficultyLevels ? "translate-x-6" : "translate-x-1"
                            }`}
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                    <button
                        type="button"
                        onClick={handleStartEdit}
                        className="h-8 w-8 rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-400 hover:text-primary-700 hover:border-primary-200 transition-colors"
                        title="Edit"
                    >
                        <Pencil size={13} />
                    </button>
                    <button
                        type="button"
                        onClick={handleDeleteClick}
                        disabled={isDeleting}
                        className="h-8 w-8 rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-400 hover:text-red-600 hover:border-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Delete"
                    >
                        <Trash2 size={13} />
                    </button>
                </div>
            </div>

            <ConfirmDeleteModal
                open={showDeleteConfirm}
                onConfirm={handleConfirmDelete}
                onCancel={() => setShowDeleteConfirm(false)}
                isDeleting={isDeleting}
                itemLabel="package type"
                itemName={type.name}
            />
        </>
    );
}