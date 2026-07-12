"use client"
import PageHeader from "@/src/components/layout/PageHeader";
import Pagination from "@/src/components/ui/Pagination";
import PageStatus from "@/src/components/ui/PageStatus";
import { getAllCampaigns } from "@/src/lib/api/campaign";
import { getCampaignStatusBadge, getCampaignStatusLabel } from "@/src/lib/utils/helper";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import type { ICampaign } from "@/src/types/campaign";

export default  function CampaignPage() {
    const [currentPage,setCurrentPage]=useState(1);
    const limit = 10;

    const {data:campaignData,isLoading, isError}=useQuery({
        queryKey:["campaigns",currentPage,limit],
        queryFn:()=>getAllCampaigns({page:currentPage,limit}),
        staleTime:5*60*1000,
        refetchOnMount:true
    })

    if(isError){
        return <PageStatus variant="error" page="Campaigns"/>
    }

    const rows: ICampaign[] = campaignData?.data || [];
    const pagination = campaignData?.pagination;
    const totalPages = pagination?.totalPages || 1;


    return (
        <div className="w-full min-h-screen flex flex-col gap-6">

            <div className="w-full flex justify-between items-center">
                <PageHeader
                    heading="Campaigns Management"
                    subheading="Review and manage your email campaigns"
                />
                <a href="/dashboard/campaigns/new" className="btn-primary whitespace-nowrap">
                    Create a new campaign
                </a>
            </div>

            <div className="card overflow-hidden">
                <table className="w-full border-collapse text-left">
                    <thead>
                        <tr className="bg-neutral-50 border-b border-neutral-100 text-xs font-bold tracking-wider text-neutral-500 uppercase">
                            <th className="py-3 px-6">Subject</th>
                            <th className="py-3 px-6">Status</th>
                            <th className="py-3 px-6">Recipients</th>
                            <th className="py-3 px-6">Sent</th>
                            <th className="py-3 px-6">Failed</th>
                            <th className="py-3 px-6">Date Sent</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 text-sm">
                        {!isLoading && rows.length === 0 && (
                            <tr>
                                <td colSpan={7} className="py-8 text-center text-neutral-500">
                                    No campaigns found.
                                </td>
                            </tr>
                        )}
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

                        {!isLoading && rows.map((row) => (
                            <tr key={row._id} className="hover:bg-neutral-50/50 transition-colors text-center">
                                <td className="py-4 px-6 text-start">
                                    <div>
                                        <p className="font-bold text-neutral-900 text-sm line-clamp-1">
                                            {row.subject}
                                        </p>
                                        <p className="text-xs text-neutral-400 line-clamp-1">
                                            {row.body}
                                        </p>
                                    </div>
                                </td>
                                <td className="py-4 px-6">
                                    <span className={getCampaignStatusBadge(row.status)}>
                                        {getCampaignStatusLabel(row.status)}
                                    </span>
                                </td>
                                <td className="py-4 px-6">
                                    <div>
                                        <p className="font-bold text-neutral-900">
                                            {row.totalRecipients}
                                        </p>
                                        <p className="text-[10px] text-neutral-400 uppercase">
                                            total
                                        </p>
                                    </div>
                                </td>
                                <td className="py-4 px-6">
                                    <div>
                                        <p className="font-bold text-emerald-600">
                                            {row.successCount}
                                        </p>
                                        <p className="text-[10px] text-neutral-400 uppercase">
                                            delivered
                                        </p>
                                    </div>
                                </td>
                                <td className="py-4 px-6">
                                    <div>
                                        <p className={`font-bold ${row.failureCount > 0 ? "text-red-600" : "text-neutral-400"}`}>
                                            {row.failureCount}
                                        </p>
                                        <p className="text-[10px] text-neutral-400 uppercase">
                                            failed
                                        </p>
                                    </div>
                                </td>
                                <td className="py-4 px-6 text-neutral-500 font-medium whitespace-nowrap">
                                    {row.startedAt 
                                        ? new Date(row.startedAt).toLocaleDateString()
                                        : "-"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot className="bg-neutral-50/40 border-t border-neutral-100">
                        <tr>
                            <td colSpan={7} className="px-6 py-4">
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
                                    <p className="text-sm font-medium text-neutral-600">
                                        Showing{" "}
                                        <span className="font-semibold text-neutral-900">
                                            {pagination ? (pagination.page - 1) * pagination.limit + (rows.length ? 1 : 0) : 0}
                                        </span>{" "}
                                        to{" "}
                                        <span className="font-semibold text-neutral-900">
                                            {pagination ? (pagination.page - 1) * pagination.limit + rows.length : 0}
                                        </span>{" "}
                                        of{" "}
                                        <span className="font-semibold text-neutral-900">
                                            {pagination?.total ?? 0}
                                        </span>{" "}
                                        campaigns
                                    </p>

                                    {totalPages > 1 && (
                                        <Pagination
                                            currentPage={currentPage}
                                            totalPages={totalPages}
                                            onPageChange={setCurrentPage}
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