"use client";

import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { packageTypeSchema, type PackageTypeFormValues } from "@/src/lib/vallidators/package-type.validate";
import { createPackageType } from "@/src/lib/api/package-types";
import IconPicker from "../../ui/IconPicker";
import ColorPicker from "../../ui/ColorPicker";

type PackageTypeFormProps = {
    handleUpdate: () => void;
}

export default function PackageTypeForm({ handleUpdate }: PackageTypeFormProps) {
    const { register, handleSubmit, reset, formState: { errors, isValid }, watch, setValue } = useForm<PackageTypeFormValues>({
        resolver: zodResolver(packageTypeSchema),
        defaultValues: {
            name: "",
            icon: "",
            themeColor: "",
            description: "",
            hasDifficultyLevels: false,
            order: 1,
            isActive: true,
        },
        mode: "onChange",
    });

    const isActive = watch("isActive");

    const createMutation = useMutation({
        mutationFn: (data: PackageTypeFormValues) => createPackageType(data),
        onSuccess: () => {
            toast.success("Package type created successfully");
            reset({
                name: "",
                icon: "",
                themeColor: "",
                description: "",
                hasDifficultyLevels: false,
                order: 1,
                isActive: true,
            });
            handleUpdate();
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || "Failed to create package type";
            toast.error(message);
        },
    });

    const onSubmit = (data: PackageTypeFormValues) => {
        createMutation.mutate(data);
    };

    const toggleActive = () => {
        setValue("isActive", !isActive);
    };

    const toggleDifficulty = () => {
        setValue("hasDifficultyLevels", !watch("hasDifficultyLevels"));
    };

    const isPending = createMutation.isPending ;

    return (
        <div className="w-full h-full">
            <form onSubmit={handleSubmit(onSubmit)} className="card p-6 flex flex-col gap-5 sticky top-6">
                <div className="border-b border-neutral-100 pb-4">
                    <h4 className="card-title">Quick Add</h4>
                    <p className="text-xs text-neutral-400 font-medium mt-0.5">
                        Create a new package type
                    </p>
                </div>

                <div className="flex flex-col gap-4">
                    {/* Name */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-neutral-500 tracking-wide">Name</label>
                        <input
                            type="text"
                            placeholder="e.g. Cultural Tour"
                            className={`input ${errors.name ? "border-red-500" : ""}`}
                            disabled={isPending}
                            {...register("name", { required: "Name is required" })}
                        />
                        {errors.name && (
                            <p className="text-xs text-red-500">{errors.name.message}</p>
                        )}
                    </div>

                    <IconPicker
                        value={watch("icon")}
                        onChange={(value) => setValue("icon", value)}
                        error={errors.icon?.message}
                    />

                    <ColorPicker
                        value={watch("themeColor")}
                        onChange={(hex) => setValue("themeColor", hex, { shouldValidate: true })}
                        disabled={isPending}
                    />

                    {/* Description */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-neutral-500 tracking-wide">
                            Description
                        </label>
                        <textarea
                            rows={3}
                            placeholder="Short description of this package type..."
                            className={`input resize-none leading-relaxed ${errors.description ? "border-red-500" : ""}`}
                            disabled={isPending}
                            {...register("description")}
                        />
                        {errors.description && (
                            <p className="text-xs text-red-500">{errors.description.message}</p>
                        )}
                    </div>

                    {/* Order & Active Status & Difficulty */}
                    <div className="flex flex-row justify-between gap-4">
                        {/* Active Status Toggle */}
                        <div className="flex flex-row items-center gap-2 shrink-0">
                            <span className="text-xs font-bold text-neutral-500 tracking-wide text-center">
                                Active Status
                            </span>
                            <button
                                type="button"
                                onClick={toggleActive}
                                disabled={isPending}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer focus:outline-none ${
                                    isActive ? "bg-emerald-500" : "bg-neutral-200"
                                }`}
                                title={isActive ? "Deactivate" : "Activate"}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                                        isActive ? "translate-x-6" : "translate-x-1"
                                    }`}
                                />
                            </button>
                        </div>

                        {/* Difficulty Toggle */}
                        <div className="flex flex-row items-center gap-2 shrink-0">
                            <span className="text-xs font-bold text-neutral-500 tracking-wide text-center">
                                Difficulty
                            </span>
                            <button
                                type="button"
                                onClick={toggleDifficulty}
                                disabled={isPending}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer focus:outline-none ${
                                    watch("hasDifficultyLevels") ? "bg-primary-600" : "bg-neutral-200"
                                }`}
                                title={watch("hasDifficultyLevels") ? "Disable difficulty levels" : "Enable difficulty levels"}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                                        watch("hasDifficultyLevels") ? "translate-x-6" : "translate-x-1"
                                    }`}
                                />
                            </button>
                        </div>

                        {/* Order */}
                        <div className="flex flex-row items-center gap-2 w-20">
                            <label className="text-xs font-bold text-neutral-500 tracking-wide text-center">Order</label>
                            <input
                                type="number"
                                min={1}
                                disabled={isPending}
                                placeholder="1"
                                className={`input text-center ${errors.order ? "border-red-500" : ""}`}
                                {...register("order", { required: "Order is required", valueAsNumber: true })}
                            />
                            {errors.order && (
                                <p className="text-xs text-red-500 text-center">{errors.order.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={!isValid || isPending}
                        className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Plus size={14} />
                        {isPending ? "Creating..." : "Create Package Type"}
                    </button>
                </div>
            </form>
        </div>
    );
}