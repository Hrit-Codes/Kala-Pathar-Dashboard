"use client";

import { useRef, useState, useCallback } from "react";
import { FileText, FileImage, File as FileIcon, Upload, X } from "lucide-react";

export interface AttachmentItem {
    id: string;
    file: File;
}

interface FileUploaderProps {
    value: AttachmentItem[];
    onChange: (items: AttachmentItem[]) => void;
    maxFiles?: number;
    maxSizeMB?: number;
    accept?: string;
    label?: string;
    helperText?: string;
}

const DEFAULT_ACCEPT =
    "image/jpeg,image/png,image/webp,application/pdf,application/msword";

const ACCEPT_LABELS: Record<string, string> = {
    "image/jpeg": "JPEG",
    "image/png": "PNG",
    "image/webp": "WEBP",
    "application/pdf": "PDF",
    "application/msword": "DOC",
};

function getFileIcon(mimeType: string) {
    if (mimeType.startsWith("image/")) return <FileImage size={18} />;
    if (mimeType === "application/pdf") return <FileText size={18} />;
    return <FileIcon size={18} />;
}

function formatFileSize(bytes: number): string {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export default function FileUploader({
    value,
    onChange,
    maxFiles = 3,
    maxSizeMB = 10,
    accept = DEFAULT_ACCEPT,
    label = "Attachments",
    helperText,
}: FileUploaderProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const allowedTypes = accept.split(",").map((t) => t.trim());
    const remainingSlots = maxFiles - value.length;
    const canAddMore = remainingSlots > 0;

    const acceptedLabels = allowedTypes
        .map((t) => ACCEPT_LABELS[t] || t.split("/")[1]?.toUpperCase())
        .join(" · ");

    const validate = (file: File): string | null => {
        if (!allowedTypes.includes(file.type)) {
            return `"${file.name}" is not an allowed file type`;
        }
        if (file.size > maxSizeMB * 1024 * 1024) {
            return `"${file.name}" exceeds the ${maxSizeMB}MB limit`;
        }
        return null;
    };

    const addFiles = useCallback(
        (fileList: FileList | File[]) => {
            const files = Array.from(fileList);
            if (files.length === 0) return;

            if (!canAddMore) {
                setError(`Maximum of ${maxFiles} attachments allowed`);
                return;
            }

            const accepted: AttachmentItem[] = [];
            let firstError: string | null = null;

            for (const file of files) {
                if (accepted.length >= remainingSlots) {
                    firstError = `Only ${remainingSlots} more file${remainingSlots === 1 ? "" : "s"} can be added (max ${maxFiles})`;
                    break;
                }
                const validationError = validate(file);
                if (validationError) {
                    firstError = firstError || validationError;
                    continue;
                }
                accepted.push({
                    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                    file,
                });
            }

            setError(firstError);
            if (accepted.length > 0) {
                onChange([...value, ...accepted]);
            }
        },
        [value, onChange, canAddMore, remainingSlots, maxFiles, allowedTypes, maxSizeMB]
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

            {value.length > 0 && (
                <div className="flex flex-col gap-2 mb-1">
                    {value.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50/50"
                        >
                            <div className="h-8 w-8 rounded-lg bg-white border border-neutral-200 flex items-center justify-center text-neutral-500 shrink-0">
                                {getFileIcon(item.file.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-neutral-700 truncate">
                                    {item.file.name}
                                </p>
                                <p className="text-[11px] text-neutral-400 font-medium">
                                    {formatFileSize(item.file.size)}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => handleRemove(item.id)}
                                className="h-7 w-7 rounded-lg flex items-center justify-center text-neutral-400 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
                                title="Remove"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {canAddMore && (
                <div
                    onClick={() => inputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={`rounded-xl border-2 border-dashed p-5 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all
                        ${isDragging
                            ? "border-primary-500 bg-primary-50/50 scale-[1.01]"
                            : "border-neutral-200 bg-neutral-50/50 hover:border-neutral-300 hover:bg-neutral-100/50"
                        }
                    `}
                >
                    <div className={`h-9 w-9 rounded-xl flex items-center justify-center transition-colors ${
                        isDragging ? "bg-primary-100 text-primary-600" : "bg-neutral-100 text-neutral-400"
                    }`}>
                        <Upload size={18} />
                    </div>
                    <p className="text-xs font-semibold text-neutral-600">
                        {isDragging ? "Drop to attach" : "Drop files here or browse"}
                    </p>
                    <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wide">
                        {acceptedLabels} · max {maxSizeMB}MB each · {remainingSlots} of {maxFiles} remaining
                    </p>
                </div>
            )}

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

            {helperText && !error && value.length<maxFiles && (
                <p className="text-xs text-neutral-400 font-medium">{helperText}</p>
            )}
        </div>
    );
}