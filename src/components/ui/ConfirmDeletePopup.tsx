"use client";

import { AlertTriangle, X } from "lucide-react";
import { useEffect } from "react";

interface ConfirmDeleteModalProps {
    open: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    isDeleting?: boolean;
    itemLabel?: string;
    itemName?: string;
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
}

export default function ConfirmDeleteModal({
    open,
    onConfirm,
    onCancel,
    isDeleting = false,
    itemLabel = "item",
    itemName,
    title,
    description,
    confirmText = "Delete",
    cancelText = "Cancel",
}: ConfirmDeleteModalProps) {
    useEffect(() => {
        if (!open) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && !isDeleting) onCancel();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [open, isDeleting, onCancel]);

    if (!open) return null;

    const resolvedTitle = title || `Delete this ${itemLabel}?`;
    const resolvedDescription =
        description ||
        (itemName
            ? `"${itemName}" will be permanently removed. This action cannot be undone.`
            : `This ${itemLabel} will be permanently removed. This action cannot be undone.`);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
            onClick={() => !isDeleting && onCancel()}
        >
            <div
                className="card w-full max-w-sm p-6 flex flex-col gap-5"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-start justify-between gap-3">
                    <div className="h-10 w-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                        <AlertTriangle size={18} className="text-red-500" />
                    </div>
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isDeleting}
                        className="text-neutral-300 hover:text-neutral-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <X size={16} />
                    </button>
                </div>

                <div className="flex flex-col gap-1.5">
                    <h4 className="text-base font-bold text-neutral-900">{resolvedTitle}</h4>
                    <p className="text-sm text-neutral-500 leading-relaxed">{resolvedDescription}</p>
                </div>

                <div className="flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isDeleting}
                        className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="px-5 py-2.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-all shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isDeleting ? "Deleting..." : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}