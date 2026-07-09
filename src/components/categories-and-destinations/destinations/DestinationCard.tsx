"use client";

import { Pencil, GripVertical, Trash2, Tag, Check, X } from "lucide-react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateDestination, type IDestination } from "@/src/lib/api/destinations";
import ConfirmDeleteModal from "../../ui/ConfirmDeletePopup";
import type { DestinationFormValues } from "@/src/lib/vallidators/destination-validate";

interface EditDraft {
    name: string;
    description: string;
    isActive: boolean;
}

interface DestinationCardProps {
    destination: IDestination;
    onDelete: (id: string) => void;
    handleUpdate: () => void;
    isDeleting: boolean;
}

export default function DestinationCard({ 
    destination, 
    onDelete, 
    handleUpdate,
    isDeleting 
}: DestinationCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteConfirm,setShowDeleteConfirm]=useState(false);
    const [editDraft, setEditDraft] = useState<EditDraft>({
        name: destination.name,
        description: destination.description || "",
        isActive: destination.isActive,
    });
    const [isDirty, setIsDirty] = useState(false);

    const updateMutation = useMutation({
        mutationFn: ({ id, body }: { id: string; body: DestinationFormValues }) =>
            updateDestination(id, body),
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

    const hasChanges = () => {
        return (
            editDraft.name !== destination.name ||
            editDraft.description !== (destination.description || "") ||
            editDraft.isActive !== destination.isActive
        );
    };

    const handleFieldChange = (field: keyof EditDraft, value: string | boolean) => {
        setEditDraft((prev) => ({ ...prev, [field]: value }));
        setIsDirty(true);
    };

    const handleStartEdit = () => {
        setIsEditing(true);
        setEditDraft({
            name: destination.name,
            description: destination.description || "",
            isActive: destination.isActive,
        });
        setIsDirty(false);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditDraft({
            name: destination.name,
            description: destination.description || "",
            isActive: destination.isActive,
        });
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
            id: destination._id,
            body: {
                name: editDraft.name,
                description: editDraft.description,
                isActive: editDraft.isActive,
            } as DestinationFormValues,
        });
    };

    const handleDelete = () => {
        setShowDeleteConfirm(true);
    };

    const handleConfirmDelete=()=>{
        onDelete(destination._id);
        setShowDeleteConfirm(false);
    }

    const isSaving = updateMutation.isPending;

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
                    <input
                        type="text"
                        value={editDraft.name}
                        onChange={(e) => handleFieldChange("name", e.target.value)}
                        placeholder="Destination name"
                        disabled={isSaving}
                        className={`input transition-all ${
                            isDirty && editDraft.name !== destination.name
                                ? "border-primary-400 bg-white"
                                : ""
                        }`}
                        autoFocus
                    />
                    <textarea
                        value={editDraft.description}
                        onChange={(e) => handleFieldChange("description", e.target.value)}
                        placeholder="Description"
                        disabled={isSaving}
                        rows={2}
                        className={`input leading-relaxed resize-none transition-all ${
                            isDirty && editDraft.description !== (destination.description || "")
                                ? "border-primary-400 bg-white"
                                : ""
                        }`}
                    />
                </div>

                <div className="flex items-center justify-between pt-1">
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
                !destination.isActive ? "opacity-50" : ""
            }`}
        >
            {/* Drag handle */}
            <div className="text-neutral-300 cursor-grab shrink-0">
                <GripVertical size={16} />
            </div>

            {/* Color indicator */}
            <div
                className={`w-1 h-12 rounded-full shrink-0 ${
                    destination.isActive ? "bg-emerald-500" : "bg-neutral-300"
                }`}
            />

            {/* Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-neutral-800">
                        {destination.name}
                    </span>
                    {!destination.isActive && (
                        <span className="badge bg-neutral-100 text-neutral-400 text-[10px] normal-case">
                            Inactive
                        </span>
                    )}
                </div>
                <p className="text-xs text-neutral-500 line-clamp-1 mt-0.5">
                    {destination.description || "No description available"}
                </p>
                {/* Package Types Tags */}
                {destination.packageTypes && destination.packageTypes.length > 0 && (
                    <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                        <Tag size={12} className="text-neutral-400" />
                        {destination.packageTypes.map((pkg, idx) => (
                            <span
                                key={idx}
                                className="text-[10px] font-semibold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full"
                            >
                                {pkg}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Active status indicator */}
            <div className="flex items-center gap-2 shrink-0">
                <span
                    className={`text-[10px] font-bold uppercase tracking-wider ${
                        destination.isActive ? "text-emerald-500" : "text-neutral-400"
                    }`}
                >
                    {destination.isActive ? "Active" : "Inactive"}
                </span>
                <div
                    className={`w-2 h-2 rounded-full ${
                        destination.isActive ? "bg-emerald-500" : "bg-neutral-300"
                    }`}
                />
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
                    onClick={handleDelete}
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
            itemLabel="destination"
            itemName={destination.name}
        />
        </>
    );
}