"use client"

import { ArrowLeft, FileText, SquarePen, Inbox, X, Eye } from "lucide-react";
import { TiptapEditor } from "@/src/components/forms/TipTap"
import { getInquiryById, replyToInquiry } from "@/src/lib/api/inquiries";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PageLoader } from "@/src/components/ui/PageLoader";
import { useParams, useRouter } from "next/navigation";
import { getEstimatedReadTime } from "@/src/lib/utils/helper";
import { buildInquiryReplyPreview } from "@/src/lib/utils/emailTemplate";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import PageStatus from "@/src/components/ui/PageStatus";

interface ReplyFormValues {
  message: string;
}

export default function InquiryIdPage() {
  const params=useParams();
  const id =params?.id as string;
  const router=useRouter();
  const queryClient= useQueryClient();

  const [showPreview, setShowPreview] = useState(false);

  const { data: inquiryData, isLoading, isError } = useQuery({
    queryKey: ["inquiry",id],
    queryFn: () =>getInquiryById(id as string),
    enabled:!!id,
    placeholderData: keepPreviousData, 
  });

  const { handleSubmit, watch, reset, control, formState:{errors}}=useForm<ReplyFormValues>({
    defaultValues:{message:""}
  });

  const replyMessage=watch("message")

  useEffect(() => {
    if (inquiryData?.isReplied && inquiryData.replyMessage) {
      reset({ message: inquiryData.replyMessage });
    }
  }, [inquiryData, reset]);

  const emailPreviewHtml = buildInquiryReplyPreview(
    inquiryData?.fullname || "",
    inquiryData?.subject || "",
    replyMessage
  );

  const readTime= getEstimatedReadTime(replyMessage);

  const replyMutation=useMutation({
    mutationFn:(message:string)=>replyToInquiry(id, message),
    onSuccess:()=>{
      toast.success("Successfully replied to inquiry");
      queryClient.invalidateQueries({queryKey:["inquiry",id]});
      queryClient.invalidateQueries({queryKey:["inquiries"]})
      router.back()
    },
    onError:(error:any)=>{
      const message=error.response?.data?.message || "Server error";
      toast.error(message);
    }
  })

  const onSubmit=(values:ReplyFormValues)=>{
    replyMutation.mutate(values.message);
  }

  if(isLoading){
    return <PageLoader/>
  }

  if(isError){
    return <PageStatus variant="not-found" page="This inquiry"/>
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full min-h-screen flex flex-col gap-6">

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6">
        <div className="flex flex-col gap-4">
          <button onClick={()=>router.back()} className="flex items-center gap-2 text-xs font-bold text-neutral-500 hover:text-neutral-800 transition-colors cursor-pointer group">
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Inquiries</span>
          </button>
          <h2 className="text-xl font-bold text-neutral-900 tracking-tight">Reply to Inquiry</h2>
        </div>

        {!inquiryData?.isReplied&& (
          <button type="submit" disabled={replyMutation.isPending} className="btn-primary whitespace-nowrap">
            {replyMutation.isPending? "Sending...":"Send Reply"}
          </button>
        )}
      </div>

      {/* Original Inquiry Details Card */}
      <div className="card overflow-hidden flex flex-col">
        <div className="p-5 flex items-center justify-between border-b border-neutral-100 bg-neutral-50/40">
          <div className="flex items-center gap-2.5">
            <Inbox size={18} className="text-neutral-500" />
            <h4 className="card-title">Original Inquiry Details</h4>
          </div>
          <span className={inquiryData?.isReplied?"badge-success":"badge-pending"}>
            {inquiryData?.isReplied?"Replied":"Pending"}
          </span>
        </div>

        <div className="p-6 flex flex-col gap-6">
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
            <div className="flex flex-col gap-1.5">
              <h5 className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Full Name</h5>
              <span className="text-sm font-semibold text-neutral-800">{inquiryData?.fullname}</span>
            </div>

            <div className="flex flex-col gap-1.5">
              <h5 className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Email Address</h5>
              <span className="text-sm font-semibold text-neutral-800">{inquiryData?.email}</span>
            </div>

            <div className="flex flex-col gap-1.5">
              <h5 className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Phone Number</h5>
              <span className="text-sm font-semibold text-neutral-800">{inquiryData?.phone}</span>
            </div>

            <div className="flex flex-col gap-1.5">
              <h5 className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Subject</h5>
              <span className="text-sm font-semibold text-neutral-800">{inquiryData?.subject}</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-2 border-t border-neutral-100">
            <h5 className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Description</h5>
            <p className="bg-neutral-50 border border-neutral-200/50 p-4 rounded-xl text-sm text-neutral-700 leading-relaxed font-medium">
              "{inquiryData?.description}"
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
          <button
            onClick={() => setShowPreview(true)}
            className="flex items-center gap-2 text-xs font-bold text-neutral-600 hover:text-neutral-800 transition-colors cursor-pointer ml-auto"
          >
            <Eye size={15} />
            <span>Preview Email</span>
          </button>
        </div>

        <div className="p-6 bg-white">
          <Controller
            name="message"
            control={control}
            rules={{
              validate: (value) =>
                (value && value !== "<p></p>") || "A reply message is required",
            }}
            render={({ field }) => (
              <TiptapEditor
                initialContent={field.value}
                onChange={field.onChange}
                error={!!errors.message}
              />
            )}
          />
          {errors.message && (
            <p className="text-xs font-semibold text-red-500 mt-2">
              {errors.message.message}
            </p>
          )}
        </div>

        <div className="px-6 py-4 bg-neutral-50/50 border-t border-neutral-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <span className="text-xs font-bold text-neutral-500 tracking-wide">
            Estimated read time: <span className="text-neutral-700">{readTime}</span>
          </span>
          
          {!inquiryData?.isReplied && (
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button type="submit" disabled={replyMutation.isPending} className="btn-primary flex-1 sm:flex-initial px-6 whitespace-nowrap">
              {replyMutation.isPending?"Sending...":"Send reply"}
            </button>
          </div>
          )}
        </div>

      </div>

      {/* Email Preview Modal */}
      {showPreview && (
        <div
          className="fixed inset-0 z-50 flex justify-center items-center bg-black/80 backdrop-blur-sm"
          onClick={() => setShowPreview(false)}
        >
          <div
            className="card w-full max-w-2xl h-[600px] flex flex-col"  
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 flex-shrink-0">
              <h4 className="font-bold text-neutral-900 text-sm">Email Preview</h4>
              <button
                onClick={() => setShowPreview(false)}
                className="text-neutral-400 hover:text-neutral-700 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="flex-1 min-h-0">  
              <iframe
                srcDoc={emailPreviewHtml}
                title="Email preview"
                className="w-full h-full border-0"  
                sandbox="allow-scripts"
              />
            </div>
          </div>
        </div>
      )}

    </form>
  );
}