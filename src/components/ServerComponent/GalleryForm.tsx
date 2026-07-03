"use client"

import { RefreshCcw } from "lucide-react"
import ImageDropzone from "../ui/ImageDropZone"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import type { GalleryFormValues, GalleryItem } from "@/src/types/gallery"
import { gallerySchema } from "@/src/lib/vallidators/gallery.validate"
import { useMutation } from "@tanstack/react-query"
import { createGalleryItem, updateGalleryItem } from "@/src/lib/gallery"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface GalleryFormProps{
    setIsFormOpen:(state:boolean)=>void
    item?:GalleryItem
}

export default function GalleryForm({setIsFormOpen, item}:GalleryFormProps){
    const router=useRouter();

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<GalleryFormValues>({
        resolver: zodResolver(gallerySchema) as any,
        defaultValues: {
            title: "",
            subtitle: "",
            description: "",
            order: 0,
        } ,
    });

    const updateMutation=useMutation({
        mutationFn:({id,formData}:{id:string, formData:FormData})=>updateGalleryItem(id,formData),
        onSuccess:()=>{
            toast.success("Gallery item updated successfully"),
            setIsFormOpen(false),
            router.refresh();
        },
        onError:(error:any)=>{
            const message = error.response?.data?.message || "Failed to update company info";
            toast.error(message);
            
        }
    })

    const createMutation=useMutation({
        mutationFn:(formData:FormData)=>createGalleryItem(formData),
        onSuccess:()=>{
            toast.success("Gallery item added successfully"),
            setIsFormOpen(false);
            router.refresh();
        },
        onError:(error:any)=>{
            const message=error.response?.data?.message || "Faled to add gallery item";
            toast.error(message)
        }
    })

    const onSubmit=(values:GalleryFormValues)=>{
        const formData= new FormData();
        if(values.image){
            formData.append("image",values.image);
        }else if(!item){
            toast.success("Please select an image");
            return;
        }
        formData.append("title",values.title);
        formData.append("subtitle",values.subtitle);
        formData.append("description",values.description);

        if(values.order!==undefined)
            formData.append("order",String(values.order));

        if(item){
            updateMutation.mutate({id:item._id,formData})
        }else{
            createMutation.mutate(formData)
        }
    }

    const handleReset=()=>{
        reset();
    }

    useEffect(()=>{
        if(item){
            reset({
                title:item.title,
                subtitle:item.subtitle,
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
                            <h2 className="text-white">Add New Gallery Item</h2>
                            <p className="text-white">Editor Mode</p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="w-full p-6 flex flex-col gap-6">
                            <Controller name="image" control={control} render={({field})=>(
                                <div className="flex flex-col gap-1">
                                    <ImageDropzone value={field.value?? null}
                                    preview={item?.image}
                                    onChange={(file)=>field.onChange(file)}
                                    label="Gallery Image"
                                    />
                                    {errors.image && (
                                        <p className="text-xs text-red-500">{errors.image.message}</p>
                                    )}
                                </div>
                            )}
                            />
                            <div>
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
                            </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-neutral-500 tracking-wide">Subtitle</label>
                                    <input
                                        type="text"
                                        className="input"
                                        {...register("subtitle",{required:"Subtitle is required"})}
                                    />
                                    {errors.subtitle && <p className="text-xs text-red-500">{errors.subtitle.message}</p>}
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-neutral-500 tracking-wide">Company Description</label>
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
                                        {isPending?"Saving...":"Save Gallery Item"}
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