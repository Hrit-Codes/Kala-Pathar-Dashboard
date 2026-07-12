"use client"
import PageHeader from "@/src/components/layout/PageHeader";
import Pagination from "@/src/components/ui/Pagination";
import { Search, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getPackages, type IDIFFICULTIES } from "@/src/lib/api/package";
import { useQuery } from "@tanstack/react-query";
import { getDestinations } from "@/src/lib/api/destinations";
import type { PackagesFilterValues } from "@/src/components/package/PackagesFilter";
import PackagesFilter from "@/src/components/package/PackagesFilter";
import { PageLoader } from "@/src/components/ui/PageLoader";

export default function PackagesTab() {
    const router=useRouter();
    const [page,setPage]=useState<number>(1);
    const [filters, setFilters]=useState<PackagesFilterValues>({
        search:"",
        destination:"",
        difficulty:"",
        isFeatured:"All Status",
        minPrice:undefined,
        maxPrice:undefined,
        minDays:undefined,
        maxDays:undefined
    })

    const {data:destinations, isLoading:destinationLoading,isError:destinationError}=useQuery({
        queryKey:["destination"],
        queryFn:()=>getDestinations(),
        staleTime:30*60*1000,
        refetchOnMount:false
    })

    const {data, isLoading, isError,refetch}=useQuery({
        queryKey:["packages",page,filters],
        queryFn:()=>getPackages({
            page,
            limit:10,
            search:filters.search || undefined,
            destination:filters.destination || undefined,
            // ✅ Fix: Cast to IDIFFICULTIES or undefined
            difficulty: filters.difficulty === "All Levels" || !filters.difficulty 
                ? undefined 
                : filters.difficulty as IDIFFICULTIES,
            isFeatured: filters.isFeatured === "All Status" 
                ? undefined 
                : filters.isFeatured === "Featured",
            minPrice:filters.minPrice,
            maxPrice:filters.maxPrice,
            minDays:filters.minDays,
            maxDays:filters.maxDays 
        }),
        staleTime:30*60*1000,
        refetchOnMount:false
    })

    const handleEdit=(packageSlug?:string)=>{
        router.push(`/dashboard/packages/edit/${packageSlug}`)
    }

    if(destinationLoading){
        return <PageLoader/>
    }

    return (
        <div className="w-full min-h-screen flex flex-col gap-6">
            <div className="w-full flex justify-between items-center">
                <PageHeader
                    heading="Expedition Packages"
                    subheading="Manage, edit, create high-altitude mountaineering experiences"
                />
                <button type="button" onClick={()=>router.push("/dashboard/packages/new")} className="btn-primary whitespace-nowrap">
                    Add Package
                </button>
            </div>

            <PackagesFilter
                destinations={destinations?.data || []}
                onChange={(f)=>{setFilters(f); setPage(1);}}
                totalResults={data?.pagination?.total}
            />

            {/* Table */}
            <div className="card overflow-hidden">
                <table className="w-full border-collapse text-left">
                    <thead>
                        <tr className="bg-neutral-50 border-b border-neutral-100 text-xs font-bold tracking-wider text-neutral-500 uppercase">
                            <th className="py-3 px-6">Package</th>
                            <th className="py-3 px-6">Destination</th>
                            <th className="py-3 px-6">Price (USD)</th>
                            <th className="py-3 px-6">Duration</th>
                            <th className="py-3 px-6">Status</th>
                            <th className="py-3 px-6">Featured</th>
                            <th className="py-3 px-6 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 text-sm">
                        {isLoading && (
                            <tr>
                                <td colSpan={7} className="py-8 text-center text-neutral-500">
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
                                        Loading packages...
                                    </div>
                                </td>
                            </tr>
                        )}

                        {!isLoading && data?.data.length === 0 && (
                            <tr>
                                <td colSpan={7} className="py-12 text-center text-neutral-500">
                                    <div className="flex flex-col items-center gap-2">
                                        <Search size={32} className="text-neutral-300" />
                                        <p className="font-medium">No packages found</p>
                                        <p className="text-xs">Try adjusting your filters</p>
                                    </div>
                                </td>
                            </tr>
                        )}

                        {!isLoading &&
                            data?.data.map((pkg) => (
                                <tr key={pkg._id} className="hover:bg-neutral-50/50 transition-colors group">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-lg bg-secondary-50 flex items-center justify-center font-bold text-xs shrink-0 border border-neutral-100">
                                                {pkg.thumbnail ? (
                                                    <Image src={pkg.thumbnail} alt={pkg.title} width={40} height={40} className="rounded-lg object-cover" />
                                                ) : (
                                                    <span className="text-neutral-400 font-bold text-xs">
                                                        {pkg.title}
                                                    </span>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-bold text-neutral-900 text-sm line-clamp-1">{pkg.title}</p>
                                                <p className="text-xs text-neutral-400">
                                                    {pkg.difficulty} · {pkg.groupSize} max
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-neutral-600 font-medium">{pkg.destination ? pkg.destination.name : "Not assigned"}</td>
                                    <td className="py-4 px-6">
                                        <div>
                                            <p className="font-bold text-neutral-900">${pkg.price.toLocaleString()}</p>
                                            <p className="text-[10px] text-neutral-400 uppercase">{pkg.priceLabel}</p>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-1">
                                            <span className="font-semibold text-neutral-900">{pkg.durationDays}</span>
                                            <span className="text-xs text-neutral-400">days</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={pkg.isActive ? "badge-success" : "badge"}>
                                            {pkg.isActive ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                            <span className={pkg.isFeatured?"badge-success":"badge"}>
                                                {pkg.isFeatured?"Featured":"Standard"}
                                            </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center justify-center gap-1">
                                            <button
                                            onClick={()=>handleEdit(pkg?._id)}
                                                className="p-2 rounded-lg hover:bg-neutral-100 transition-colors text-neutral-400 hover:text-blue-600"
                                                title="Edit package"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                className="p-2 rounded-lg hover:bg-neutral-100 transition-colors text-neutral-400 hover:text-red-600"
                                                title="Delete package"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                    <tfoot className="bg-neutral-50/40 border-t border-neutral-100">
                        <tr>
                            <td colSpan={7} className="px-6 py-4">
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
                                    {data?.pagination?.page && data?.pagination?.page > 1 && (
                                        <Pagination
                                            currentPage={page}
                                            totalPages={data?.pagination?.totalPages ?? 1}
                                            onPageChange={setPage}
                                        />
                                    )}
                                </div>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
}