"use client";

import { useRef, useState, useCallback } from "react";
import { ImageIcon, X, Upload } from "lucide-react";

interface ImageDropzoneProps {
    value?: File | null;
    preview?: string;
    onChange: (file: File | null) => void;
    accept?: string;
    maxSizeMB?: number;
    label?: string;
}

export default function ImageDropzone({
    value,
    preview,
    onChange,
    accept = "image/jpeg,image/png,image/webp",
    maxSizeMB = 5,
    label = "Image",
}: ImageDropzoneProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const validate = (file: File): string | null => {
        const allowedTypes = accept.split(",").map((t) => t.trim());
        if (!allowedTypes.includes(file.type)) {
            return `Only ${allowedTypes.map((t) => t.split("/")[1].toUpperCase()).join(", ")} files are allowed`;
        }
        if (file.size > maxSizeMB * 1024 * 1024) {
            return `File size must be under ${maxSizeMB}MB`;
        }
        return null;
    };

    const handleFile = useCallback(
        (file: File | undefined) => {
            if (!file) return;
            const validationError = validate(file);
            if (validationError) {
                setError(validationError);
                return;
            }
            setError(null);
            onChange(file);
        },
        [onChange, accept, maxSizeMB]
    );

    const handleDrop = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            setIsDragging(false);
            const file = e.dataTransfer.files?.[0];
            handleFile(file);
        },
        [handleFile]
    );

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => setIsDragging(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleFile(e.target.files?.[0]);
        e.target.value = "";
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange(null);
        setError(null);
    };

    const currentPreview = value ? URL.createObjectURL(value) : preview;

    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-neutral-500 tracking-wide">{label}</label>

            <div
                onClick={() => !currentPreview && inputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`relative w-full rounded-xl border-2 border-dashed transition-all
                    ${isDragging
                        ? "border-primary-500 bg-primary-50/50 scale-[1.01]"
                        : "border-neutral-200 bg-neutral-50/50 hover:border-neutral-300 hover:bg-neutral-100/50"
                    }
                    ${currentPreview ? "cursor-default" : "cursor-pointer"}
                `}
            >
                {currentPreview ? (
                    // Preview state
                    <div className="relative w-full aspect-[4/3] overflow-hidden rounded-xl">
                        <img
                            src={currentPreview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                        />
                        {/* Overlay actions */}
                        <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-all flex items-center justify-center gap-3 group">
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
                                className="opacity-0 group-hover:opacity-100 hover:cursor-pointer transition-opacity flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg text-xs font-bold text-neutral-800 shadow-md"
                            >
                                <Upload size={13} />
                                Replace
                            </button>
                            <button
                                type="button"
                                onClick={handleClear}
                                className="opacity-0 group-hover:opacity-100 hover:cursor-pointer transition-opacity flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg text-xs font-bold text-red-500 shadow-md"
                            >
                                <X size={13} />
                                Remove
                            </button>
                        </div>
                    </div>
                ) : (
                    // Empty state
                    <div className="w-full aspect-[4/3] flex flex-col items-center justify-center gap-3 p-6">
                        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-colors
                            ${isDragging ? "bg-primary-100 text-primary-600" : "bg-neutral-100 text-neutral-400"}
                        `}>
                            <ImageIcon size={22} />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-semibold text-neutral-600">
                                {isDragging ? "Drop to upload" : "Drop image here"}
                            </p>
                            <p className="text-xs text-neutral-400 mt-0.5">
                                or{" "}
                                <span
                                    onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
                                    className="text-primary-600 font-bold underline underline-offset-2 cursor-pointer hover:text-primary-700"
                                >
                                    browse files
                                </span>
                            </p>
                            <p className="text-[11px] text-neutral-300 mt-2 tracking-wide uppercase font-bold">
                                JPEG · PNG · WEBP · max {maxSizeMB}MB
                            </p>
                            <p className="text-[11px] text-neutral-300 mt-0.5 font-medium">
                                Recommended: WebP · 1920 × 1080px
                            </p>
                        </div>
                    </div>
                )}

                <input
                    ref={inputRef}
                    type="file"
                    accept={accept}
                    className="hidden"
                    onChange={handleInputChange}
                />
            </div>

            {error && (
                <p className="text-xs text-red-500 font-medium flex items-center gap-1">
                    <X size={12} />
                    {error}
                </p>
            )}

            {value && (
                <p className="text-[11px] text-neutral-400 font-medium truncate">
                    {value.name} · {(value.size / 1024 / 1024).toFixed(2)}MB
                </p>
            )}
        </div>
    );
}