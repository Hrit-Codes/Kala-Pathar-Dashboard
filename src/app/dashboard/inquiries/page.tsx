"use client";

import { useState, useRef, useEffect } from "react";
import PageHeader from "@/src/components/layout/PageHeader";
import { INQUIRY_FILTER_TABS, RECENT_INQUIRIES } from "@/src/lib/constants";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function InquiryPage() {
    const router=useRouter();
  const [activeTab, setActiveTab] = useState("All");
  
  const [sliderStyle, setSliderStyle] = useState({ left: 0, width: 0 });
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const activeIndex = INQUIRY_FILTER_TABS.findIndex(tab => tab.value === activeTab);
    const element = tabRefs.current[activeIndex];
    
    if (element) {
      setSliderStyle({
        left: element.offsetLeft,
        width: element.offsetWidth,
      });
    }
  }, [activeTab]);

  return (
    <div className="w-full min-h-screen flex flex-col gap-6">
      
      <PageHeader 
        heading="Inquiries Management" 
        subheading="Review and respond to expedition inquiries and client requests"
      />

      {/* Interactive Slidable Tab Bar Control */}
      <div className="card flex items-center justify-between p-2 w-fit">
        
        <div className="flex items-center relative gap-1">
          
          <div
            className="absolute h-[calc(100%-4px)] top-0.5 rounded-xl bg-primary-600 transition-all duration-300 ease-out pointer-events-none"
            style={{ 
              left: sliderStyle.left, 
              width: sliderStyle.width 
            }}
          />

          {INQUIRY_FILTER_TABS.map((tab, idx) => {
            const isActive = activeTab === tab.value;
            return (
              <button
                key={tab.id}
                ref={(el) => { tabRefs.current[idx] = el; }}
                onClick={() => setActiveTab(tab.value)}
                className={`relative z-10 px-6 py-2.5 rounded-xl text-sm font-bold tracking-wide transition-colors duration-300 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "text-white"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                {tab.label} <span className={`text-xs ml-1 ${isActive ? "text-primary-100" : "text-neutral-400"}`}>({tab.count})</span>
              </button>
            );
          })}
        </div>

      </div>

      <div className="card overflow-hidden bg-red">

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
                {RECENT_INQUIRIES.map((row) => (
                    <tr key={row.id} className="hover:bg-neutral-50/50 transition-colors">
                        <td className="py-4 px-6 flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-secondary-50 flex items-center justify-center font-bold text-xs shrink-0">
                                {row.initials}
                            </div>
                            <span className="font-bold text-neutral-900 whitespace-nowrap">{row.name}</span>
                        </td>
                        <td className="py-4 px-6 text-description max-w-[220px] font-medium">
                            {row.email}
                        </td>
                        <td className="py-4 px-6 text-description max-w-[220px] font-medium">
                            {row.subject}
                        </td>
                        <td className="py-4 px-6 text-center">
                            <span className={row.status === "PENDING" ? "badge-pending" : "badge-success"}>
                                {row.status}
                            </span>
                        </td>
                        <td className="py-4 px-6 text-neutral-500 font-medium whitespace-nowrap">
                            {row.date}
                        </td>

                        <td className="flex items-center justify-center p-2">
                            <button onClick={()=>router.push(`inquiries/haha`)} className="p-2 text-center font-semibold border border-neutral-200 hover:border-neutral-300 rounded-xl cursor-pointer">
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
                        Showing <span className="font-semibold text-neutral-900">1</span> to{" "}
                        <span className="font-semibold text-neutral-900">5</span> of{" "}
                        <span className="font-semibold text-neutral-900">248</span> inquiries
                        </p>

                        <div className="flex items-center gap-1.5">
                        <button className="h-9 w-9 flex items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-colors cursor-pointer">
                            <ArrowLeft size={15} />
                        </button>

                        <button className="h-9 w-9 flex items-center justify-center rounded-lg bg-primary-700 text-sm font-bold text-white transition-all shadow-sm cursor-pointer">
                            1
                        </button>

                        <button className="h-9 w-9 flex items-center justify-center rounded-lg border border-neutral-200 bg-white text-sm font-semibold text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-colors cursor-pointer">
                            2
                        </button>

                        <button className="h-9 w-9 flex items-center justify-center rounded-lg border border-neutral-200 bg-white text-sm font-semibold text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-colors cursor-pointer">
                            3
                        </button>

                        <span className="px-2 text-sm font-medium text-neutral-400 select-none">
                            ...
                        </span>

                        <button className="h-9 w-9 flex items-center justify-center rounded-lg border border-neutral-200 bg-white text-sm font-semibold text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-colors cursor-pointer">
                            50
                        </button>

                        <button className="h-9 w-9 flex items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-colors cursor-pointer">
                            <ArrowRight size={15} />
                        </button>
                        </div>

                    </div>
                    </td>
                </tr>
                </tfoot>
        </table>

      </div>

    </div>
  );
}