"use client";

import { useRef, useState, useCallback } from "react";
import { Camera, X } from "lucide-react";

export interface GalleryImageItem {
    id: string;
    file?: File;   // present for newly-added, not-yet-uploaded images
    url?: string;  // present for already-persisted images
}

interface GalleryUploaderProps {
    value: GalleryImageItem[];
    onChange: (items: GalleryImageItem[]) => void;
    maxImages?: number;
    accept?: string;
    maxSizeMB?: number;
    label?: string;
    helperText?: string;
}

function getPreviewUrl(item: GalleryImageItem): string {
    return item.file ? URL.createObjectURL(item.file) : item.url || "";
}

export default function GalleryUploader({
    value,
    onChange,
    maxImages = 10,
    accept = "image/jpeg,image/png,image/webp",
    maxSizeMB = 5,
    label = "Gallery Photos",
    helperText,
}: GalleryUploaderProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const remainingSlots = maxImages - value.length;
    const canAddMore = remainingSlots > 0;

    const validate = (file: File): string | null => {
        const allowedTypes = accept.split(",").map((t) => t.trim());
        if (!allowedTypes.includes(file.type)) {
            return `Only ${allowedTypes.map((t) => t.split("/")[1].toUpperCase()).join(", ")} files are allowed`;
        }
        if (file.size > maxSizeMB * 1024 * 1024) {
            return `Each file must be under ${maxSizeMB}MB`;
        }
        return null;
    };

    const addFiles = useCallback(
        (fileList: FileList | File[]) => {
            const files = Array.from(fileList);
            if (files.length === 0) return;

            if (!canAddMore) {
                setError(`Maximum of ${maxImages} images allowed`);
                return;
            }

            const accepted: GalleryImageItem[] = [];
            let firstError: string | null = null;

            for (const file of files) {
                if (accepted.length >= remainingSlots) break;
                const validationError = validate(file);
                if (validationError && !firstError) {
                    firstError = validationError;
                    continue;
                }
                if (!validationError) {
                    accepted.push({
                        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                        file,
                    });
                }
            }

            if (files.length > remainingSlots) {
                firstError = `Only ${remainingSlots} more image${remainingSlots === 1 ? "" : "s"} can be added (max ${maxImages})`;
            }

            setError(firstError);
            if (accepted.length > 0) {
                onChange([...value, ...accepted]);
            }
        },
        [value, onChange, canAddMore, remainingSlots, maxImages, accept, maxSizeMB]
    );

    const handleDrop = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            setIsDragging(false);
            if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
        },
        [addFiles]
    );

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (canAddMore) setIsDragging(true);
    };

    const handleDragLeave = () => setIsDragging(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length) addFiles(e.target.files);
        e.target.value = "";
    };

    const handleRemove = (id: string) => {
        onChange(value.filter((item) => item.id !== id));
        setError(null);
    };

    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-neutral-500 tracking-wide">{label}</label>

            <div className="grid grid-cols-3 gap-2">
                {/* Add tile */}
                {canAddMore && (
                    <div
                        onClick={() => inputRef.current?.click()}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        className={`aspect-square rounded-xl border-2 border-dashed flex items-center justify-center cursor-pointer transition-all
                            ${isDragging
                                ? "border-primary-500 bg-primary-50/50 scale-[1.02]"
                                : "border-neutral-200 bg-neutral-50/50 hover:border-neutral-300 hover:bg-neutral-100/50"
                            }
                        `}
                    >
                        <Camera
                            size={22}
                            className={isDragging ? "text-primary-500" : "text-neutral-400"}
                        />
                    </div>
                )}

                {/* Image thumbnails */}
                {value.map((item) => (
                    <div
                        key={item.id}
                        className="relative aspect-square rounded-xl overflow-hidden border border-neutral-200 group"
                    >
                        <img
                            src={getPreviewUrl(item)}
                            alt="Gallery item"
                            className="w-full h-full object-cover"
                        />
                        <button
                            type="button"
                            onClick={() => handleRemove(item.id)}
                            className="absolute top-1.5 right-1.5 h-6 w-6 rounded-full bg-black/60 hover:bg-red-500 text-white flex items-center justify-center transition-colors cursor-pointer"
                        >
                            <X size={13} />
                        </button>
                    </div>
                ))}
            </div>

            <input
                ref={inputRef}
                type="file"
                accept={accept}
                multiple
                className="hidden"
                onChange={handleInputChange}
            />

            {error && (
                <p className="text-xs text-red-500 font-medium flex items-center gap-1">
                    <X size={12} />
                    {error}
                </p>
            )}

            <p className="flex items-center gap-1.5 text-xs text-neutral-400 font-medium mt-0.5">
                {helperText || `Select up to ${maxImages} high-resolution images.`}
            </p>
        </div>
    );
}