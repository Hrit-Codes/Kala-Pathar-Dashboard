"use client"

import { RefreshCcw } from "lucide-react"
import ImageDropzone from "../ui/ImageDropZone"
import { useState } from "react"

interface GalleryFormProps{
    setIsFormOpen:(state:boolean)=>void
}

export default function GalleryForm({setIsFormOpen}:GalleryFormProps){
    const [imageFile, setImageFile]=useState<File | null>(null);
    return(
                <div onClick={()=>setIsFormOpen(false)} className="fixed inset-0 z-50 flex justify-center items-center bg-black/80 backdrop-blur-sm">
                    <div onClick={(e)=>e.stopPropagation()} className="card w-full max-w-xl max-h-[90vh] overflow-y-auto">
                        <div className="bg-primary-700 p-4 text-center text-white">
                            <h2 className="text-white">Add New Gallery Item</h2>
                            <p className="text-white">Editor Mode</p>
                        </div>

                        <form className="w-full p-6 flex flex-col gap-6">
                            <div className="w-full  mx-auto">
                                <ImageDropzone value={imageFile} onChange={setImageFile}/>
                            </div>
                            <div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-neutral-500 tracking-wide">Title</label>
                                    <input
                                        type="text"
                                        className="input"
                                    />
                                </div>
                            </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-neutral-500 tracking-wide">Subtitle</label>
                                    <input
                                        type="text"
                                        className="input"
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-neutral-500 tracking-wide">Company Description</label>
                                    <textarea
                                        rows={5}
                                        className="input leading-relaxed resize-none"
                                    />
                                </div>

                                <div className="w-full flex justify-between">
                                    <button
                                        type="submit"
                                        className="btn-primary whitespace-nowrap w-5/6"
                                    >
                                        Save Gallery Item
                                    </button>

                                    <button className="w-fit btn-secondary whitespace-nowrap flex items-center justify-center ">
                                        <RefreshCcw/>
                                    </button>
                                </div>
                            
                        </form>
                    </div>
                </div>
    )
}