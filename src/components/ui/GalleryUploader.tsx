"use client";
import { useState, useRef, useEffect } from "react";
import { Plus, X, Trash2, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

export interface GalleryImageItem {
    id: string;
    url?: string;
    file?: File | null;
    isExisting?: boolean;
    name?: string;
}

interface GalleryUploaderProps {
    label: string;
    value: GalleryImageItem[];
    onChange: (images: GalleryImageItem[]) => void;
    maxImages?: number;
    className?: string;
}

export default function GalleryUploader({
    label,
    value,
    onChange,
    maxImages = 10,
    className = "",
}: GalleryUploaderProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleFileSelect = (files: FileList | null) => {
        if (!files) return;

        const newFiles = Array.from(files);
        const remainingSlots = maxImages - value.length;

        if (newFiles.length > remainingSlots) {
            alert(`You can only upload ${remainingSlots} more images`);
            return;
        }

        const newImages: GalleryImageItem[] = newFiles.map((file) => ({
            id: `new-${Date.now()}-${Math.random()}`,
            file,
            name: file.name,
            isExisting: false,
        }));

        onChange([...value, ...newImages]);
    };

    const removeImage = (id: string) => {
        onChange(value.filter((img) => img.id !== id));
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        handleFileSelect(e.dataTransfer.files);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    return (
        <div className={`flex flex-col gap-3 ${className}`}>
            <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-neutral-500 tracking-wide">
                    {label}
                </label>
                <span className="text-xs text-neutral-400">
                    {value.length} / {maxImages}
                </span>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-3 gap-3">
                {value.map((image) => (
                    <div
                        key={image.id}
                        className="relative aspect-square rounded-lg border border-neutral-200 overflow-hidden group bg-neutral-50"
                    >
                        {image.isExisting && image.url ? (
                            // ✅ Show existing image from URL
                            <img
                                src={image.url}
                                alt={image.name || "Gallery image"}
                                className="w-full h-full object-cover"
                            />
                        ) : image.file ? (
                            // ✅ Show new image from file
                            <img
                                src={URL.createObjectURL(image.file)}
                                alt={image.name || "Gallery image"}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-300">
                                <ImageIcon size={24} />
                            </div>
                        )}
                        <button
                            type="button"
                            onClick={() => removeImage(image.id)}
                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        >
                            <Trash2 size={12} />
                        </button>
                        {image.isExisting && (
                            <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-blue-500 text-white text-[8px] rounded">
                                Existing
                            </span>
                        )}
                    </div>
                ))}

                {/* Upload Button */}
                {value.length < maxImages && (
                    <div
                        className={`aspect-square rounded-lg border-2 border-dashed border-neutral-300 flex flex-col items-center justify-center cursor-pointer hover:border-primary-400 hover:bg-primary-50/50 transition-colors ${
                            isDragging ? "border-primary-500 bg-primary-50" : ""
                        }`}
                        onClick={() => fileInputRef.current?.click()}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                    >
                        <Plus size={24} className="text-neutral-400" />
                        <span className="text-xs text-neutral-400 mt-1">Add Image</span>
                    </div>
                )}
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                    handleFileSelect(e.target.files);
                    e.target.value = "";
                }}
            />

            {value.length === 0 && (
                <p className="text-xs text-neutral-400 text-center">
                    No images added yet. Click the + button to upload.
                </p>
            )}
        </div>
    );
}