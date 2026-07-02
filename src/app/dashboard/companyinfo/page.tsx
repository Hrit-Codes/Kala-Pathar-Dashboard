"use client";
import PageHeader from "@/src/components/layout/PageHeader";
import { 
  Building2, 
  MapPin, 
  Mail, 
  Phone, 
  Smartphone, 
  Briefcase, 
  Plus, 
  ExternalLink, 
  Share2, 
  Pencil,
} from "lucide-react";
import { FaFacebook, FaInstagram, FaLinkedinIn, FaTwitter, FaYoutube } from "react-icons/fa";

export default function CompanyInfoPage() {
  return (
    <div className="w-full min-h-screen flex flex-col gap-6 bg-neutral-50/20">

      {/* Top Action & Navigation Row */}
      <div className="w-full flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <PageHeader 
          heading="Company Profile" 
          subheading="Manage public-facing information and global contact details" 
        />

        <div className="flex items-center gap-3">
          <button className="btn-secondary whitespace-nowrap">
            Discard
          </button>
          <button className="btn-primary whitespace-nowrap">
            Update Information
          </button>
        </div>
      </div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ================= LEFT COLUMN (7 Cols) ================= */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* CARD 1: Basic Details */}
          <div className="card p-6 flex flex-col gap-5">
            <div className="flex items-center gap-2.5 border-b border-neutral-100 pb-4">
              <Building2 size={20} className="text-primary-700" />
              <h4 className="card-title">Basic Details</h4>
            </div>

            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-neutral-500 tracking-wide">Brand Logo</span>
                <div className="relative h-28 w-28 rounded-2xl border border-neutral-200 bg-neutral-50/50 flex items-center justify-center p-3 overflow-hidden group">
                  <img 
                    src="/logo-placeholder.png" 
                    alt="Himalayan Elite Logo" 
                    className="w-full h-full object-contain opacity-80"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/5 flex items-center justify-center pointer-events-none" />
                  <button className="absolute h-8 w-8 rounded-full bg-white shadow-md border border-neutral-100 flex items-center justify-center text-primary-700 hover:scale-105 transition-transform cursor-pointer">
                    <Pencil size={14} />
                  </button>
                </div>
              </div>

              <div className="flex-1 flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-neutral-500 tracking-wide">Company Name</label>
                  <input 
                    type="text" 
                    defaultValue="Himalayan Elite Expeditions Ltd."
                    className="input"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-neutral-500 tracking-wide">Company Description</label>
                  <textarea 
                    rows={4}
                    defaultValue="Premier mountaineering and adventure trekking service specializing in bespoke Himalayan journeys. We provide elite logistics, certified guides, and luxury basecamp experiences for climbers across the globe."
                    className="input leading-relaxed resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* CARD 2: Contact Information */}
          <div className="card p-6 flex flex-col gap-5">
            <div className="flex items-center gap-2.5 border-b border-neutral-100 pb-4">
              <Mail size={20} className="text-primary-700" />
              <h4 className="card-title">Contact Information</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="flex flex-col gap-3">
                <h5 className="text-[11px] font-bold tracking-wider uppercase text-primary-800">Email Addresses</h5>
                
                <div className="relative flex items-center">
                  <Mail size={15} className="absolute left-4 text-neutral-400" />
                  <input 
                    type="email" 
                    defaultValue="info@himalayanelite.com"
                    className="input pl-11"
                  />
                </div>

                <div className="relative flex items-center">
                  <Mail size={15} className="absolute left-4 text-neutral-400" />
                  <input 
                    type="email" 
                    defaultValue="support@himalayanelite.com"
                    className="input pl-11"
                  />
                </div>

                <button className="flex items-center gap-2 text-xs font-bold text-neutral-400 hover:text-neutral-600 transition-colors cursor-pointer w-fit mt-1">
                  <Plus size={14} />
                  <span>Add alternative email...</span>
                </button>
              </div>

              <div className="flex flex-col gap-3">
                <h5 className="text-[11px] font-bold tracking-wider uppercase text-primary-800">Phone & Office</h5>
                
                <div className="relative flex items-center">
                  <Phone size={15} className="absolute left-4 text-neutral-400" />
                  <input 
                    type="text" 
                    defaultValue="+977 1-4567890"
                    className="input pl-11"
                  />
                </div>

                <div className="relative flex items-center">
                  <Smartphone size={15} className="absolute left-4 text-neutral-400" />
                  <input 
                    type="text" 
                    defaultValue="+977 980-0000000"
                    className="input pl-11"
                  />
                </div>

                <div className="relative flex items-center">
                  <Briefcase size={15} className="absolute left-4 text-neutral-400" />
                  <input 
                    type="text" 
                    defaultValue="+1 (555) 123-4567"
                    className="input pl-11"
                  />
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* ================= RIGHT COLUMN (5 Cols) ================= */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* CARD 3: Global HQ Location */}
          <div className="card p-6 flex flex-col gap-5">
            <div className="flex items-center gap-2.5 border-b border-neutral-100 pb-4">
              <MapPin size={20} className="text-primary-700" />
              <h4 className="card-title">Global HQ Location</h4>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-neutral-500 tracking-wide">Office Address</label>
                <input 
                  type="text" 
                  defaultValue="Thamel Marg 12, Kathmandu 44600, Nepal"
                  className="input"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-neutral-500 tracking-wide">Latitude</label>
                  <input 
                    type="text" 
                    defaultValue="27.7172"
                    className="input"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-neutral-500 tracking-wide">Longitude</label>
                  <input 
                    type="text" 
                    defaultValue="85.3240"
                    className="input"
                  />
                </div>
              </div>

              <div className="relative w-full h-48 rounded-xl border border-neutral-200 overflow-hidden mt-1 group">
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: "url('/map-screenshot.png')" }} 
                />
                <div className="absolute inset-0 bg-neutral-100 flex flex-col items-center justify-center p-4 text-center">
                  <div className="px-3 py-1.5 bg-white shadow-md rounded-lg text-xs font-bold text-neutral-800 flex items-center gap-1.5 border border-neutral-100 z-10">
                    <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                    Kathmandu Office
                  </div>
                </div>

                <button className="absolute bottom-3 right-3 h-9 w-9 bg-white border border-neutral-200 shadow-sm rounded-xl flex items-center justify-center text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer">
                  <ExternalLink size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* CARD 4: Social Presence */}
          <div className="card p-6 flex flex-col gap-5">
            <div className="flex items-center gap-2.5 border-b border-neutral-100 pb-4">
              <Share2 size={20} className="text-primary-700" />
              <h4 className="card-title">Social Presence</h4>
            </div>

            <div className="flex flex-col gap-3.5">
              
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                  <FaFacebook size={16} fill="currentColor" className="stroke-none" />
                </div>
                <input 
                  type="text" 
                  defaultValue="facebook.com/himalayanelite"
                  className="input py-2"
                />
              </div>

              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center shrink-0 border border-pink-100">
                  <FaInstagram size={16} />
                </div>
                <input 
                  type="text" 
                  defaultValue="instagram.com/himalayan_elite"
                  className="input py-2"
                />
              </div>

              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100">
                  <FaLinkedinIn size={16} fill="currentColor" className="stroke-none" />
                </div>
                <input 
                  type="text" 
                  defaultValue="linkedin.com/company/himalayan-expeditions"
                  className="input py-2"
                />
              </div>

              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-neutral-50 text-neutral-800 flex items-center justify-center shrink-0 border border-neutral-200">
                  <FaTwitter size={16} fill="currentColor" className="stroke-none" />
                </div>
                <input 
                  type="text" 
                  defaultValue="twitter.com/himalayanelite"
                  className="input py-2"
                />
              </div>

              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100">
                  <FaYoutube size={16} />
                </div>
                <input 
                  type="text" 
                  defaultValue="youtube.com/c/HimalayanEliteExp"
                  className="input py-2"
                />
              </div>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
}