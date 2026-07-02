"use client"

import { ArrowLeft, FileText, Paperclip, SquarePen, Inbox } from "lucide-react";
import { TiptapEditor } from "@/src/components/forms/TipTap"

export default function InquiryIdPage() {
  return (
    <div className="w-full min-h-screen flex flex-col gap-6">

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="flex flex-col gap-1">
          <button className="flex items-center gap-2 text-xs font-bold text-neutral-500 hover:text-neutral-800 transition-colors cursor-pointer group">
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Inquiries</span>
          </button>
          <h2 className="text-xl font-bold text-neutral-900 tracking-tight">Reply to Inquiry</h2>
        </div>

        <div className="flex items-center gap-3">
          <button className="btn-secondary whitespace-nowrap">
            Mark as Resolved
          </button>
          <button className="btn-primary whitespace-nowrap">
            Send Reply
          </button>
        </div>
      </div>

      {/* Original Inquiry Details Card */}
      <div className="card overflow-hidden flex flex-col">
        <div className="p-5 flex items-center justify-between border-b border-neutral-100 bg-neutral-50/40">
          <div className="flex items-center gap-2.5">
            <Inbox size={18} className="text-neutral-500" />
            <h4 className="card-title">Original Inquiry Details</h4>
          </div>
          <span className="badge-pending">
            Pending Reply
          </span>
        </div>

        <div className="p-6 flex flex-col gap-6">
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
            <div className="flex flex-col gap-1.5">
              <h5 className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Full Name</h5>
              <span className="text-sm font-semibold text-neutral-800">Benjamin Thorne</span>
            </div>

            <div className="flex flex-col gap-1.5">
              <h5 className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Email Address</h5>
              <span className="text-sm font-semibold text-neutral-800">b.thorne@expedition.travel.co.uk</span>
            </div>

            <div className="flex flex-col gap-1.5">
              <h5 className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Phone Number</h5>
              <span className="text-sm font-semibold text-neutral-800">+44 20 7946 0123</span>
            </div>

            <div className="flex flex-col gap-1.5">
              <h5 className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Subject</h5>
              <span className="text-sm font-semibold text-neutral-800">Private Expedition Base Camp Expedition Inquiry</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-2 border-t border-neutral-100">
            <h5 className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Description</h5>
            <p className="bg-neutral-50 border border-neutral-200/50 p-4 rounded-xl text-sm text-neutral-700 leading-relaxed font-medium">
              "Hello, I am interested in organizing a private expedition to Everest Base Camp for a group of 6 experienced hikers in mid-September. We are looking for a high-end experience including premium lodge stays and oxygen support for the higher altitudes. Could you provide a detailed itinerary and a cost estimate for a 14-day trip? We have previously completed the Annapurna Circuit and are looking for something more challenging but with Elite-level support."
            </p>
          </div>
        </div>
      </div>

      {/* Your Response Section Box */}
      <div className="card overflow-hidden flex flex-col">
        
        <div className="p-5 flex items-center gap-2.5 border-b border-neutral-100">
          <SquarePen size={18} className="text-primary-700" />
          <h4 className="card-title">Your Response</h4>
        </div>

        <div className="px-6 py-3 bg-white flex items-center gap-5 border-b border-neutral-100">
          <button className="flex items-center gap-2 text-xs font-bold text-primary-700 hover:text-primary-800 transition-colors cursor-pointer">
            <FileText size={15} />
            <span>Use Template</span>
          </button>
          <button className="flex items-center gap-2 text-xs font-bold text-neutral-600 hover:text-neutral-800 transition-colors cursor-pointer">
            <Paperclip size={15} />
            <span>Attach Documents</span>
          </button>
        </div>

        <div className="p-6 bg-white">
          <TiptapEditor 
            onChange={(html) => {
              console.log(html);
            }}
            initialContent={`
              <p>Dear Mr. Thorne,</p>
              <p>Thank you for contacting Himalayan Elite. It is a pleasure to hear from experienced hikers such as your group.</p>
              <p>Regarding your inquiry for a private Everest Base Camp Expedition in mid-September, we would be delighted to arrange a premium 14-day itinerary tailored specifically to your group's requirements.</p>
              <p>Our 'Elite Circuit' service includes:</p>
              <ul>
                <li>Private helicopter transfers between Kathmandu and Lukla.</li>
                <li>Luxury lodge accommodations where available.</li>
                <li>Personal Sherpa guides with extensive high-altitude experience.</li>
                <li>Full medical support including O2 systems.</li>
              </ul>
            `}
          />
        </div>

        <div className="px-6 py-4 bg-neutral-50/50 border-t border-neutral-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <span className="text-xs font-bold text-neutral-500 tracking-wide">
            Estimated read time: <span className="text-neutral-700">45 seconds</span>
          </span>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button className="btn-secondary flex-1 sm:flex-initial whitespace-nowrap">
              Save Draft
            </button>
            <button className="btn-primary flex-1 sm:flex-initial px-6 whitespace-nowrap">
              Send Reply
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}