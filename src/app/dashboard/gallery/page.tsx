import PageHeader from "@/src/components/layout/PageHeader";
import NewGalleryButton from "@/src/components/gallery/NewGalleryButton";
import UpdateGalleryItemButton from "@/src/components/gallery/UpdateGalleryItemButton";
import type { GalleryItem } from "@/src/types/gallery";
import { ImageIcon, CalendarDays, ArrowUpDown } from "lucide-react";
import { getGallery } from "@/src/lib/api/gallery";


export default async function GalleryPage() {
    const response = await getGallery();
    const galleryItems = response.data;
    const isFull = response.isFull;

    return (
        <div className="w-full min-h-screen flex flex-col gap-6">

            {/* Page Header Row */}
            <div className="w-full flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <PageHeader
                    heading="Gallery Management"
                    subheading="Curate the visual journey of Kala Pathar"
                />
            </div>

            {/* Slot counter */}
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                <div className="flex items-center gap-2">
                    <ImageIcon size={16} className="text-primary-700" />
                    <h4 className="card-title">Live Gallery</h4>
                </div>
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                    {galleryItems.length} / 4 slots filled
                </span>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {galleryItems.map((item) => (
                    <div
                        key={item._id}
                        className="card p-0 flex flex-col overflow-hidden"
                    >
                        {/* Image */}
                        <div className="relative aspect-[4/3] w-full bg-neutral-100">
                            <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover"
                            />

                            {/* Badges */}
                            <div className="absolute top-3 left-3 flex gap-2">
                                <span className={`badge ${
                                    item.isActive
                                        ? "bg-status-success-bg text-status-success-text"
                                        : "bg-amber-50 text-amber-600"
                                }`}>
                                    {item.isActive ? "Active" : "Inactive"}
                                </span>
                                <span className="badge bg-neutral-900/60 text-white backdrop-blur-sm">
                                    Order: {item.order}
                                </span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-5 flex flex-col gap-2">
                            <span className="text-[11px] font-bold tracking-wider uppercase text-primary-700">
                                {item.subtitle}
                            </span>
                            <h3 className="text-base font-bold text-neutral-800 line-clamp-1">
                                {item.title}
                            </h3>
                            <p className="text-sm text-neutral-500 line-clamp-2">
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
                                <UpdateGalleryItemButton item={item as GalleryItem}/>
                            </div>

                        </div>
                    </div>
                ))}

                {/* Empty slot placeholder when not full */}
                {!isFull && (
                        <NewGalleryButton />
                )}
            </div>
        </div>
    );
}