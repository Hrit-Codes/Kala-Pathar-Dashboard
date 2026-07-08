"use client"

import { Plus } from "lucide-react";
import IconPicker from "../../ui/IconPicker";
import { useState } from "react";

export default function PackageTypeForm(){
    const [selectedIcon, setSelectedIcon] = useState<string>("");
    return(
        <div className="w-full h-full">
            <form className="card p-6 flex flex-col gap-5 sticky top-6">
                                    <div className="border-b border-neutral-100 pb-4">
                                        <h4 className="card-title">Quick Add</h4>
                                        <p className="text-xs text-neutral-400 font-medium mt-0.5">
                                            Create a new package type
                                        </p>
                                    </div>
            
                                    <div className="flex flex-col gap-4">
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-xs font-bold text-neutral-500 tracking-wide">Name</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. Cultural Tour"
                                                className="input"
                                            />
                                        </div>
            
                                        <IconPicker
                                            value={selectedIcon}
                                            onChange={setSelectedIcon}
                                        />
            
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-xs font-bold text-neutral-500 tracking-wide">
                                                Theme Color
                                            </label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="color"
                                                    defaultValue="#10B981"
                                                    className="h-10 w-12 rounded-lg border border-neutral-200 cursor-pointer p-1 bg-white"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="#10B981"
                                                    className="input flex-1"
                                                />
                                            </div>
                                        </div>
            
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-xs font-bold text-neutral-500 tracking-wide">
                                                Description
                                                <span className="text-neutral-300 font-normal ml-1">(optional)</span>
                                            </label>
                                            <textarea
                                                rows={3}
                                                placeholder="Short description of this package type..."
                                                className="input resize-none leading-relaxed"
                                            />
                                        </div>
            
                                        <div className="flex items-center justify-between py-2 border-t border-neutral-100">
                                            <div>
                                                <p className="text-xs font-bold text-neutral-700">Difficulty Levels</p>
                                                <p className="text-[11px] text-neutral-400">Show difficulty for packages</p>
                                            </div>
                                            <button
                                                type="button"
                                                className="relative inline-flex h-6 w-11 items-center rounded-full bg-neutral-200 transition-colors cursor-pointer"
                                            >
                                                <span className="inline-block h-4 w-4 transform rounded-full bg-white shadow-sm translate-x-1 transition-transform" />
                                            </button>
                                        </div>
            
                                        <button type="button" className="btn-primary w-full flex items-center justify-center gap-2">
                                            <Plus size={14} />
                                            Create Package Type
                                        </button>
                                    </div>
                                </form>
        </div>
    )
}