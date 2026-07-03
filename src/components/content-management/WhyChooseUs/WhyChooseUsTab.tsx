import { getWhyChooseUs } from "@/src/lib/why-choose-us";
import { ArrowUpDown, CalendarDays, ImageIcon } from "lucide-react";
import type { IWhyChooseUsItem } from "@/src/types/why-choose-us";
import UpdateWhyChooseUsItemButton from "./UpdateWhyChooseUsItemButton";

export default  function WhyChooseUsTab({items}:{items:IWhyChooseUsItem[]}){
    const isFull=items.length===3;
    return(
        <div className="w-full min-h-screen flex flex-col gap-6">
            {/* Slot counter */}
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                <div className="flex items-center gap-2">
                    <ImageIcon size={16} className="text-primary-700" />
                    <h4 className="card-title">Why Choose Us Items Gallery</h4>
                </div>
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                    {items.length} / 3 slots filled
                </span>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => (
                    <div
                        key={item._id}
                        className="card p-0 flex flex-col overflow-hidden"
                    >
                        {/* Content */}
                        <div className="p-5 flex flex-col gap-2">
                            <span className="text-[11px] font-bold tracking-wider uppercase text-primary-700">
                                {item.title}
                            </span>
                            <p className="text-sm text-neutral-500 ">
                                {item.description}
                            </p>

                            {/* Footer Meta */}
                            <div className="flex justify-between items-center pt-3 border-t border-neutral-100 mt-1">
                                <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                                    <CalendarDays size={12} />
                                    <span>Created {new Date(item.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                                    <ArrowUpDown size={12} />
                                    <span>Updated {new Date(item.updatedAt).toLocaleDateString()}</span>
                                </div>
                                <UpdateWhyChooseUsItemButton item={item as IWhyChooseUsItem}/>
                            </div>

                        </div>
                    </div>
                ))}

                {/* Empty slot placeholder when not full */}
                {/* {!isFull && (
                        <NewGalleryButton />
                )} */}
            </div>
        </div>
    )
}