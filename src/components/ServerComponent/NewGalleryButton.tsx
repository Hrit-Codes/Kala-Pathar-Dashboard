"use client"
import { Plus } from "lucide-react";
import { useState } from "react";
import GalleryForm from "./GalleryForm";

export default function NewGalleryButton(){
    const [isFormOpen,setIsFormOpen]=useState(false);
    return(
        <>
            <div className="card p-0 flex justify-center items-center min-h-[300px] border-2 border-dashed border-neutral-200 hover:border-primary-500 hover:cursor-pointer transition-colors cursor-pointer group">
                <button onClick={()=>setIsFormOpen(true)} className="w-full h-full p-8 flex flex-col items-center justify-center gap-3 text-neutral-400 group-hover:text-primary-600 transition-colors hover:cursor-pointer">
                    <div className="w-16 h-16 rounded-full bg-neutral-100 group-hover:bg-emerald-50 flex items-center justify-center transition-colors">
                        <Plus size={28} className="group-hover:scale-110 transition-transform" />
                    </div>
                    <span className="text-sm font-medium">Add New Gallery Item</span>
                    <span className="text-xs">Click to upload</span>
                </button>
            </div>

        {isFormOpen && (
            <GalleryForm setIsFormOpen={setIsFormOpen}/>
        )}

        </>
    )
}