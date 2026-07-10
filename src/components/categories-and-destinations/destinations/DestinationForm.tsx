"use client";

import { createDestination } from "@/src/lib/api/destinations";
import { destinationSchema, type DestinationFormValues } from "@/src/lib/vallidators/destination-validate";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type DestinationFormProps ={
    handleUpdate: () => void;
}

export default function DestinationForm({ handleUpdate }: DestinationFormProps) {

    const { register, handleSubmit, reset, formState:{errors, isValid}, watch, setValue}=useForm<DestinationFormValues>({
        resolver:zodResolver(destinationSchema),
        defaultValues:{
            name:"",
            description:"",
            order:1,
            isActive:true
        },
        mode:"onChange"
    })

    const isActive=watch("isActive")

    const createMutation=useMutation({
        mutationFn:(data:DestinationFormValues)=> createDestination(data),
        onSuccess:()=>{
            toast.success("Destination created successfully"),
            reset({
                name:"",
                description:"",
                order:1,
                isActive:true
            })
            handleUpdate();
        },
        onError:(error:any)=>{
            const message = error.response?.data?.message || "Failed to create destination";
            toast.error(message);
        }
    })

    const onSubmit=(data:DestinationFormValues)=>{
        createMutation.mutate(data);
    }

    const toggleActive=()=>{
        setValue("isActive",!isActive);
    }


    return (
        <div className="w-full h-full">
            <form onSubmit={handleSubmit(onSubmit)} className="card p-6 flex flex-col gap-5 sticky top-6">
                <div className="border-b border-neutral-100 pb-4">
                    <h4 className="card-title">Quick Add</h4>
                    <p className="text-xs text-neutral-400 font-medium mt-0.5">
                        Create a new destination
                    </p>
                </div>

                <div className="flex flex-col gap-4">
                    {/* Name */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-neutral-500 tracking-wide">Name</label>
                        <input
                            type="text"
                            placeholder="e.g. Everest Region"
                            {...register("name",{required:"Name is required"})}
                            className="input"
                            disabled={createMutation.isPending}
                        />
                        {errors.name && (
                            <p className="text-xs text-red-500">{errors.name.message}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-neutral-500 tracking-wide">
                            Description
                        </label>
                        <textarea
                            rows={3}
                            placeholder="Short description of this destination..."
                            {...register("description",{required:"Description is required"})}
                            className="input resize-none leading-relaxed"
                            disabled={createMutation.isPending}
                        />
                        {errors.description && (
                            <p className="text-xs text-red-500">{errors.description.message}</p>
                        )}
                    </div>

                    {/* Order & Active Status */}
                    <div className="flex flex-row justify-between gap-4">
                        {/* Active Status Toggle */}
                        <div className="flex flex-row items-center gap-2 shrink-0">
                            <span className="text-xs font-bold text-neutral-500 tracking-wide text-center">
                                Active Status
                            </span>
                            <button
                                type="button"
                                onClick={toggleActive}
                                disabled={createMutation.isPending}
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

                        {/* Order */}
                        <div className="flex flex-row items-center gap-2 w-20">
                            <label className="text-xs font-bold text-neutral-500 tracking-wide text-center">Order</label>
                            <input
                                type="number"
                                min={1}
                                disabled={createMutation.isPending}
                                {...register("order",{required:"Order is required", valueAsNumber:true})}
                                placeholder="1"
                                className="input text-center"
                            />
                            {errors.order && (
                                <p className="text-xs text-red-500 text-center">{errors.order.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button 
                        type="submit" 
                        disabled={createMutation.isPending || !isValid }
                        className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Plus size={14} />
                        {createMutation.isPending ? "Creating..." : "Create Destination"}
                    </button>
                </div>
            </form>
        </div>
    );
}