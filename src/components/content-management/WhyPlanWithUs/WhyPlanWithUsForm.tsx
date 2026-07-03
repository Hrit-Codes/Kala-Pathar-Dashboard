"use client"

import { RefreshCcw } from "lucide-react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import type { IWhyPlanWithUsItem, WhyPlanWithUsFormValues } from "@/src/types/why-plan-with-us"
import { whyPlanWithUsSchema } from "@/src/lib/vallidators/why-plan-with-us"
import IconPicker from "../../ui/IconPicker"
import { createWhyPlanWithUs, updateWhyPlanWithUs } from "@/src/lib/api/why-plan-with-us"

interface WhyChooseUsFormProps{
    setIsFormOpen:(state:boolean)=>void
    item?:IWhyPlanWithUsItem
}

export default function WhyPlanWithUsForm({setIsFormOpen, item}:WhyChooseUsFormProps){
    const router=useRouter();

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm<WhyPlanWithUsFormValues>({
        resolver: zodResolver(whyPlanWithUsSchema) as any,
        defaultValues: {
            title: "",
            description: "",
            icon:"",
            order: 1,
        } ,
    });

    const updateMutation=useMutation({
        mutationFn:({id,data}:{id:string, data:WhyPlanWithUsFormValues})=>updateWhyPlanWithUs(id,data),
        onSuccess:()=>{
            toast.success("Why plan with us item updated successfully"),
            setIsFormOpen(false),
            router.refresh();
        },
        onError:(error:any)=>{
            const message = error.response?.data?.message || "Failed to update why plan with us info";
            toast.error(message);
            
        }
    })

    const createMutation=useMutation({
        mutationFn:(data:WhyPlanWithUsFormValues)=>createWhyPlanWithUs(data),
        onSuccess:()=>{
            toast.success("Why plan with us item added successfully"),
            setIsFormOpen(false);
            router.refresh();
        },
        onError:(error:any)=>{
            const message=error.response?.data?.message || "Faled to add why plan with us item";
            toast.error(message)
        }
    })

    const onSubmit = (values: WhyPlanWithUsFormValues) => {
        if (item) {
            updateMutation.mutate({ id: item._id, data: values });
        } else {
            createMutation.mutate(values);
        }
    };

    const handleReset=()=>{
        reset({
            title:"",
            description:"",
            order:1
        });
    }

    useEffect(()=>{
        if(item){
            reset({
                title:item.title,
                icon:item.icon,
                description:item.description,
                order:item.order,
            })
        }
    },[item,reset])

    const isPending = updateMutation.isPending || createMutation.isPending;

    return(
                <div onClick={()=>setIsFormOpen(false)} className="fixed inset-0 z-50 flex justify-center items-center bg-black/80 backdrop-blur-sm">
                    <div onClick={(e)=>e.stopPropagation()} className="card w-full max-w-xl max-h-[90vh] overflow-y-auto">
                        <div className="bg-primary-700 p-4 text-center text-white">
                            <h2 className="text-white">{item?"Update Why Choose Us Item":"Add Why Choose Us Item"}</h2>
                            <p className="text-white">Editor Mode</p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="w-full p-6 flex flex-col gap-6">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-neutral-500 tracking-wide">Title</label>
                                    <input
                                        type="text"
                                        className="input"
                                        disabled={isPending}
                                        {...register("title",{required:"Title is required"})}
                                        placeholder="e.g. Everest Base Camp at Dawn"
                                    />
                                    {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <Controller
                                        name="icon"
                                        control={control}
                                        render={({ field }) => (
                                            <IconPicker
                                                value={field.value}
                                                onChange={field.onChange}
                                                error={errors.icon?.message}
                                            />
                                        )}
                                    />
                                    {errors.icon && <p className="text-xs text-red-500">{errors.icon.message}</p>}
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-neutral-500 tracking-wide">Order</label>
                                    <input
                                        type="number"
                                        min={1}
                                        {...register("order",{required:"Order is required"})}
                                        disabled={isPending}
                                        placeholder="1"
                                        className="input"
                                    />
                                    {errors.order && <p className="text-xs text-red-500">{errors.order.message}</p>}
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-neutral-500 tracking-wide">Description</label>
                                    <textarea
                                        rows={5}
                                        className="input leading-relaxed resize-none"
                                        {...register("description",{required:"Description is required"})}
                                    />
                                    {errors.description && <p className="text-red-500">{errors.description.message}</p>}
                                </div>

                                <div className="w-full flex justify-between">
                                    <button
                                        type="submit"
                                        disabled={isPending}
                                        className="btn-primary whitespace-nowrap w-5/6"
                                    >   
                                        {isPending?"Saving...":"Save Why Choose Us Item"}
                                    </button>

                                    <button type="button" onClick={handleReset} disabled={isPending} title="Reset form" className="w-fit btn-secondary whitespace-nowrap flex items-center justify-center ">
                                        <RefreshCcw/>
                                    </button>
                                </div>
                            
                        </form>
                    </div>
                </div>
    )
}