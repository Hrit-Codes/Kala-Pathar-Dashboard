"use client";

import { useState, useRef, useEffect } from "react";
import PageHeader from "@/src/components/layout/PageHeader";
import { INQUIRY_FILTER_TABS } from "@/src/lib/constants";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import PageStatus from "@/src/components/ui/PageStatus";
import Pagination from "@/src/components/ui/Pagination";
import type { IInquiry, IInquiryTabCount } from "@/src/types/inquiry";
import { getInquiries } from "@/src/lib/api/inquiries";

export default function InquiryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialPage = Number(searchParams.get("page") || 1);
  const initialTab = searchParams.get("status") || "All";

  const [activeTab, setActiveTab] = useState(initialTab);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const limit = 10;

  const [sliderStyle, setSliderStyle] = useState({ left: 0, top:0, width: 0, height:0 });
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const { data: inquiryData, isLoading, isError } = useQuery({
    queryKey: ["inquiries", activeTab, currentPage, limit],
    queryFn: () =>
      getInquiries({
        status: activeTab === "All" ? undefined : activeTab,
        page: currentPage,
        limit,
      }),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    const params = new URLSearchParams();
    if (currentPage > 1) params.set("page", String(currentPage));
    if (activeTab !== "All") params.set("status", activeTab);

    const queryString = params.toString();
    const url = queryString ? `/dashboard/inquiries?${queryString}` : `/dashboard/inquiries`;
    router.replace(url, { scroll: false });
  }, [currentPage, activeTab, router]);

  useEffect(() => {
    const updateSlider=()=>{
      const activeIndex = INQUIRY_FILTER_TABS.findIndex((tab) => tab.value === activeTab);
      const element = tabRefs.current[activeIndex];

      if (element) {
        setSliderStyle({
          left: element.offsetLeft,
          top: element.offsetTop,
          width: element.offsetWidth,
          height:element.offsetHeight,
        });
      }
    }

    updateSlider();
    window.addEventListener("resize",updateSlider);
    return(()=>window.removeEventListener("resize",updateSlider))
  }, [activeTab]);

  const totalPages = inquiryData?.pagination?.totalPages || 1;

  const handleTabChange = (tabValue: string) => {
    setActiveTab(tabValue);
    setCurrentPage(1);
  };

  const getInitials = (fullname: string) => {
    return fullname
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0]?.toUpperCase())
      .join("");
  };

  const rows: IInquiry[] = inquiryData?.data || [];
  const pagination = inquiryData?.pagination;

  if (isError) {
    return <PageStatus variant="error" page="This page" />;
  }

  return (
    <div className="w-full min-h-screen flex flex-col gap-6">
      <PageHeader
        heading="Inquiries Management"
        subheading="Review and respond to expedition inquiries and client requests"
      />

      <div className="card flex items-center justify-between p-2 w-fit mx-auto md:mx-0">
        <div className="flex flex-col md:flex-row items-center relative gap-1 mx-auto">
          <div
            className="absolute h-[calc(100%-4px)] top-0.5 rounded-xl bg-primary-600 transition-all duration-300 ease-out pointer-events-none"
            style={{
              left: sliderStyle.left,
              top:sliderStyle.top,
              width: sliderStyle.width,
              height: sliderStyle.height
            }}
          />

          {INQUIRY_FILTER_TABS.map((tab, idx) => {
            const isActive = activeTab === tab.value;
            const liveCount = inquiryData?.tabCounts?.[tab.id as keyof IInquiryTabCount];
            return (
              <button
                key={tab.id}
                ref={(el) => {
                  tabRefs.current[idx] = el;
                }}
                onClick={() => handleTabChange(tab.value)}
                className={`relative z-10 px-6 py-2.5 rounded-xl text-sm font-bold tracking-wide transition-colors duration-300 cursor-pointer whitespace-nowrap ${
                  isActive ? "text-white" : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                {tab.label}
                <span className={`text-xs ml-1 ${isActive ? "text-primary-100" : "text-neutral-400"}`}>
                  ({liveCount})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-neutral-50 border-b border-neutral-100 text-xs font-bold tracking-wider text-neutral-500 uppercase">
              <th className="py-3 px-6">Full Name</th>
              <th className="py-3 px-6">Contact Email</th>
              <th className="py-3 px-6">Subject</th>
              <th className="py-3 px-6">Status</th>
              <th className="py-3 px-6">Date Received</th>
              <th className="py-3 px-6">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 text-sm">
            {isLoading && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-neutral-500">
                  Loading inquiries...
                </td>
              </tr>
            )}

            {!isLoading && rows.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-neutral-500">
                  No inquiries found.
                </td>
              </tr>
            )}

            {!isLoading &&
              rows.map((row) => (
                <tr key={row._id} className="hover:bg-neutral-50/50 transition-colors">
                  <td className="py-4 px-6 flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-secondary-50 flex items-center justify-center font-bold text-xs shrink-0">
                      {getInitials(row.fullname)}
                    </div>
                    <span className="font-bold text-neutral-900 whitespace-nowrap">{row.fullname}</span>
                  </td>
                  <td className="py-4 px-6 text-description max-w-[220px] font-medium">{row.email}</td>
                  <td className="py-4 px-6 text-description max-w-[220px] font-medium">{row.subject}</td>
                  <td className="py-4 px-6 text-center">
                    <span className={row.isReplied ? "badge-success" : "badge-pending"}>
                      {row.isReplied ? "REPLIED" : "PENDING"}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-neutral-500 font-medium whitespace-nowrap">
                    {new Date(row.createdAt).toLocaleDateString()}
                  </td>
                  <td className="flex items-center justify-center p-2">
                    <button
                      onClick={() => router.push(`inquiries/${row._id}`)}
                      className="p-2 text-center font-semibold border border-neutral-200 hover:border-neutral-300 rounded-xl cursor-pointer"
                    >
                      View & Reply
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
          <tfoot className="bg-neutral-50/40 border-t border-neutral-100">
            <tr>
              <td colSpan={6} className="px-6 py-4">
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
                    of <span className="font-semibold text-neutral-900">{pagination?.total ?? 0}</span> inquiries
                  </p>

                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}