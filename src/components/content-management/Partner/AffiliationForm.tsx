"use client";

import { Check, Pencil, Trash2, Upload, X } from "lucide-react";
import { useRef } from "react";

interface IPartner {
    _id: string;
    abbreviation: string;
    name: string;
    logo: string;
    order: number;
    _newLogo?: File | null;
}

type PartnerFormProps = {
    item: IPartner;
    isEditing: boolean;
    editDraft: Partial<IPartner>;
    logoPreview: string;
    isSaving:boolean;
    isDeleting:boolean;
    canDeleteAffiliation: boolean;
    onStartEdit: (item: IPartner) => void;
    onCancelEdit: () => void;
    onConfirmEdit: (id: string) => void;
    onDraftChange: (updater: (prev: Partial<IPartner>) => Partial<IPartner>) => void;
    onLogoChange: (file: File) => void;
    onDelete: (id: string) => void;
};

export default function PartnerForm({
    item,
    isEditing,
    editDraft,
    logoPreview,
    isSaving,
    isDeleting,
    canDeleteAffiliation,
    onStartEdit,
    onCancelEdit,
    onConfirmEdit,
    onDraftChange,
    onLogoChange,
    onDelete,
}: PartnerFormProps) {
    const localFileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onLogoChange(file);
        }
        e.target.value = ""; 
    };

    return (
        <div
            className={`flex items-start gap-3 p-3 rounded-xl border transition-colors ${
                isEditing
                    ? "border-primary-300 bg-primary-50/30"
                    : "border-neutral-200 bg-neutral-50/50"
            }`}
        >
            {/* ── Logo Container ── */}
            <div className="relative h-12 w-12 rounded-lg border border-neutral-200 bg-white flex items-center justify-center shrink-0 overflow-hidden group">
                {(isEditing ? logoPreview : item.logo) ? (
                    <img
                        src={isEditing ? logoPreview : item.logo}
                        alt={item.abbreviation}
                        className="h-full w-full object-contain p-1"
                    />
                ) : (
                    <span className="text-[10px] font-black text-neutral-400">
                        {item.abbreviation.slice(0, 2)}
                    </span>
                )}

                {/* Logo replace overlay (Only in Edit Mode) */}
                {isEditing && (
                    <>
                        <button
                            type="button"
                            onClick={() => localFileInputRef.current?.click()}
                            disabled={isSaving}
                            className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                        >
                            <Upload size={14} className="text-white" />
                        </button>
                        <input
                            ref={localFileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={isSaving}
                            onChange={handleFileChange}
                        />
                    </>
                )}
            </div>

            {/* ── Text Fields / Display Info ── */}
            <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                {isEditing ? (
                    <>
                        <input
                            type="text"
                            value={editDraft.abbreviation ?? ""}
                            onChange={(e) =>
                                onDraftChange((prev) => ({ ...prev, abbreviation: e.target.value }))
                            }
                            placeholder="Abbreviation"
                            disabled={isSaving}
                            className="input py-1.5 text-sm font-bold"
                        />
                        <input
                            type="text"
                            value={editDraft.name ?? ""}
                            onChange={(e) =>
                                onDraftChange((prev) => ({ ...prev, name: e.target.value }))
                            }
                            placeholder="Full name"
                            disabled={isSaving}
                            className="input py-1.5 text-xs"
                        />
                        <input
                            type="number"
                            value={editDraft.order ?? 0}
                            onChange={(e) =>
                                onDraftChange((prev) => ({ ...prev, order: Number(e.target.value) }))
                            }
                            placeholder="Order"
                            disabled={isSaving}
                            className="input py-1.5 text-xs w-24"
                            min={1}
                        />
                    </>
                ) : (
                    <>
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-bold text-neutral-800">
                                {item.abbreviation}
                            </span>
                            <span className="badge bg-neutral-100 text-neutral-500 normal-case font-semibold text-[10px]">
                                Order #{item.order}
                            </span>
                        </div>
                        <p className="text-xs text-neutral-500 truncate">{item.name}</p>
                    </>
                )}
            </div>

            {/* ── Action Buttons ── */}
            <div className="flex flex-col items-center gap-1.5 shrink-0">
                {isEditing ? (
                    <>
                        <button
                            type="button"
                            disabled={isSaving}
                            onClick={() => onConfirmEdit(item._id)}
                            className="h-8 w-8 rounded-lg border border-primary-200 bg-primary-50 flex items-center justify-center text-primary-700 hover:bg-primary-100 transition-colors"
                            title="Save changes"
                        >
                            <Check size={13} />
                        </button>
                        <button
                            type="button"
                            onClick={onCancelEdit}
                            disabled={isSaving}
                            className="h-8 w-8 rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-500 hover:text-red-500 hover:border-red-200 transition-colors"
                            title="Cancel"
                        >
                            <X size={13} />
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            type="button"
                            onClick={() => onStartEdit(item)}
                            className="h-8 w-8 rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-500 hover:text-primary-700 hover:border-primary-200 transition-colors"
                            title="Edit"
                        >
                            <Pencil size={13} />
                        </button>
                        <button
                            type="button"
                            disabled={!canDeleteAffiliation || isDeleting}
                            onClick={() => onDelete(item._id)}
                            className="h-8 w-8 rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-500 hover:text-red-500 hover:border-red-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Delete"
                        >
                            <Trash2 size={13} />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}