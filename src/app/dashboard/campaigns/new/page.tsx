"use client"
import { ArrowLeft, FileText, SquarePen,  X, Eye } from "lucide-react";
import { TiptapEditor } from "@/src/components/ui/TipTap"
import { useMutation} from "@tanstack/react-query";
import {  useRouter } from "next/navigation";
import { getEstimatedReadTime } from "@/src/lib/utils/helper";
import { buildCampaignEmail} from "@/src/lib/utils/emailTemplate";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import FileUploader, { AttachmentItem } from "@/src/components/ui/FileUploader";
import { createCampaign } from "@/src/lib/api/campaign";

interface CampaignFormValues{
    subject:string;
    body:string;
}


export default function NewCampaignPage() {
  const router=useRouter();

  const [showPreview, setShowPreview] = useState(false);
  const [attachments,setAttachments] = useState<AttachmentItem[]>([]);


  const {register, handleSubmit, watch, control, formState:{errors}}=useForm<CampaignFormValues>({
    defaultValues:{subject:"",body:""}
  });

  const subject=watch("subject");
  const body= watch("body");

  const emailPreviewHtml=buildCampaignEmail({
    email:"subscriber@example.com",
    subject:subject || "",
    body:body || "",
    unsubscribeUrl:"#",
    attachments:attachments.map((item)=>({
        fileName:item.file.name,
        localPath:"",
        mimeType:item.file.type
    }))
  });


  const readTime= getEstimatedReadTime(body);

  const createMutation=useMutation({
    mutationFn:(formData:FormData)=>createCampaign(formData),
    onSuccess:()=>{
      toast.success("Successfully created a new campaign");
      router.back()
    },
    onError:(error:any)=>{
      const message=error.response?.data?.message || "Server error";
      toast.error(message);
    }
  })

  const onSubmit=(values:CampaignFormValues)=>{
    if(attachments.length===0){
        toast.error("At least one attachment is required");
        return;
    }

    const formData= new FormData();
    formData.append("subject",values.subject);
    formData.append("body",values.body);

    attachments.forEach((item)=>formData.append("attachments",item.file));

    createMutation.mutate(formData);
  }
  return(
    <form onSubmit={handleSubmit(onSubmit)} className="w-full min-h-screen flex flex-col gap-6">

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6">
        <div className="flex flex-col gap-4">
          <button onClick={()=>router.back()} className="flex items-center gap-2 text-xs font-bold text-neutral-500 hover:text-neutral-800 transition-colors cursor-pointer group">
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Campaigns</span>
          </button>
          <h2 className="text-xl font-bold text-neutral-900 tracking-tight">Create a new campaign</h2>
        </div>

          <button type="submit" className="btn-primary whitespace-nowrap">
            Create a new campaign
          </button>
      </div>


      {/* Your Response Section Box */}
      <div className="card overflow-hidden flex flex-col">
        
        <div className="p-5 flex items-center gap-2.5 border-b border-neutral-100">
          <SquarePen size={18} className="text-primary-700" />
          <h4 className="card-title">Campaign Detail</h4>
        </div>

        <div className="px-6 py-3 bg-white flex items-center gap-5 border-b border-neutral-100">
          <button className="flex items-center gap-2 text-xs font-bold text-primary-700 hover:text-primary-800 transition-colors cursor-pointer">
            <FileText size={15} />
            <span>Use Template</span>
          </button>
          <button
            type="button"
            onClick={() => setShowPreview(true)}
            className="flex items-center gap-2 text-xs font-bold text-neutral-600 hover:text-neutral-800 transition-colors cursor-pointer ml-auto"
          >
            <Eye size={15} />
            <span>Preview Email</span>
          </button>
        </div>

        <div className="p-6 bg-white border-b border-neutral-100 flex flex-col gap-1.5">
          <label className="text-xs font-bold text-neutral-500 tracking-wide">Subject</label>
          <input
            type="text"
            placeholder="Your next adventure awaits..."
            disabled={createMutation.isPending}
            className={`input ${errors.subject ? "border-red-500" : ""}`}
            {...register("subject", { required: "Subject is required" })}
          />
          {errors.subject && (
            <p className="text-xs font-semibold text-red-500">{errors.subject.message}</p>
          )}
        </div>

        <div className="p-6 bg-white">
          <Controller
            name="body"
            control={control}
            rules={{
              validate: (value) =>
                (value && value !== "<p></p>") || "A campaign description is required",
            }}
            render={({ field }) => (
              <TiptapEditor
                placeholder="Campaign description ..."
                initialContent={field.value}
                onChange={field.onChange}
                error={!!errors.body}
              />
            )}
          />
          {errors.body && (
            <p className="text-xs font-semibold text-red-500 mt-2">
              {errors.body.message}
            </p>
          )}
        </div>

        <div className="p-6 bg-white">
            <FileUploader
            value={attachments}
            onChange={setAttachments}
            maxFiles={3}
            maxSizeMB={10}
            helperText="Add upto 3 files to send with this campaign"
            />
        </div>

        <div className="px-6 py-4 bg-neutral-50/50 border-t border-neutral-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <span className="text-xs font-bold text-neutral-500 tracking-wide">
            Estimated read time: <span className="text-neutral-700">{readTime}</span>
          </span>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button type="submit" className="btn-primary flex-1 sm:flex-initial px-6 whitespace-nowrap">
              Create a new campaign
            </button>
          </div>
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