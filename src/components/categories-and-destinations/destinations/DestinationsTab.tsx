"use client";

import { delDestination, type IDestinationsResponse } from "@/src/lib/api/destinations";
import { Plus } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import DestinationCard from "./DestinationCard";
import DestinationForm from "./DestinationForm";

type IDestinationProps = {
    initialData: IDestinationsResponse;
};

export default function DestinationsTab({ initialData }: IDestinationProps) {
    const router = useRouter();
    const destinations = initialData?.data || [];

    const delMutation = useMutation({
        mutationFn: (id: string) => delDestination(id),
        onSuccess: () => {
            toast.success("Successfully deleted!");
            router.refresh();
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || "Server error";
            toast.error(message);
        },
    });

    const handleDelete = (id: string) => {
        delMutation.mutate(id);
    };

    const handleUpdate = () => {
        router.refresh();
    };

    return (
        <div className="w-full flex flex-col gap-6">
            <div className="grid grid-cols-1 xl:grid-cols-14 gap-6 items-start p-6">

                {/* ── Left: List ──────────────────────────────────────────── */}
                <div className="xl:col-span-8 flex flex-col gap-4">

                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <h3 className="card-title">Managed Destinations</h3>
                            <span className="badge bg-neutral-100 text-neutral-500 normal-case font-bold text-[11px]">
                                {destinations.length} Items
                            </span>
                        </div>
                        <button
                            type="button"
                            className="btn-primary flex items-center gap-1.5"
                        >
                            <Plus size={14} />
                            Add Destination
                        </button>
                    </div>

                    {/* List */}
                    <div className="flex flex-col gap-3">
                        {destinations.length === 0 ? (
                            <div className="card flex flex-col items-center justify-center py-16 gap-3">
                                <div className="h-12 w-12 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-400">
                                    <Plus size={22} />
                                </div>
                                <p className="text-sm font-semibold text-neutral-500">No destinations yet</p>
                                <p className="text-xs text-neutral-400">Add your first destination to get started</p>
                            </div>
                        ) : (
                            destinations.map((dest) => (
                                <DestinationCard
                                    key={dest._id}
                                    destination={dest}
                                    onDelete={handleDelete}
                                    handleUpdate={handleUpdate}
                                    isDeleting={delMutation.isPending}
                                />
                            ))
                        )}
                    </div>
                </div>

                {/* ── Right: Quick Add Form ───────────────────────────────── */}
                <div className="xl:col-span-6">
                    <DestinationForm handleUpdate={handleUpdate}/>
                </div>
            </div>
        </div>
    );
}