"use client";
import { PageLoader } from "@/src/components/ui/PageLoader";
import { getCompanyInfo, updateCompanyInfo, type ICompanyInfo } from "@/src/lib/api/company-info";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    Building2,
    MapPin,
    Mail,
    Phone,
    Briefcase,
    Plus,
    Share2,
    Pencil,
    X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { FaFacebook, FaInstagram, FaLinkedinIn, FaTwitter, FaYoutube } from "react-icons/fa";
import { toast } from "sonner";

interface CompanyInfoFormValues {
    companyName: string;
    description: string;
    officeAddress: string;
    officeTelephone: string;
    emails: { value: string }[];
    phones: { value: string }[];
    mapLatitude: string;
    mapLongitude: string;
    mapEmbedUrl: string;
    socialLinks: {
        facebook: string;
        instagram: string;
        linkedin: string;
        twitter: string;
        youtube: string;
    };
}

interface CompanyInfoFormProps {
    initialData?: ICompanyInfo | null;
}

export default function CompanyInfoForm({ initialData }: CompanyInfoFormProps) {
    const queryClient = useQueryClient();
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string>(initialData?.logo || "");
    const [isLogoDirty, setIsLogoDirty] = useState(false);

    const { data: companyInfo, isLoading } = useQuery({
        queryKey: ["company-info"],
        queryFn: getCompanyInfo
    });

    const { register, handleSubmit, reset, control, formState: { errors, isDirty } } = useForm<CompanyInfoFormValues>({
        defaultValues: {
            companyName: initialData?.companyName || "",
            description: initialData?.description || "",
            officeAddress: initialData?.officeAddress || "",
            officeTelephone: initialData?.officeTelephone || "",
            emails: initialData?.emails && initialData.emails.length > 0
                ? initialData.emails.map((e) => ({ value: e }))
                : [{ value: "" }],
            phones: initialData?.phones && initialData.phones.length > 0
                ? initialData.phones.map((p) => ({ value: p }))
                : [{ value: "" }],
            mapLatitude: initialData?.mapLatitude !== undefined ? String(initialData.mapLatitude) : "",
            mapLongitude: initialData?.mapLongitude !== undefined ? String(initialData.mapLongitude) : "",
            mapEmbedUrl: initialData?.mapEmbedUrl || "",
            socialLinks: {
                facebook: initialData?.socialLinks?.facebook || "",
                instagram: initialData?.socialLinks?.instagram || "",
                linkedin: initialData?.socialLinks?.linkedin || "",
                twitter: initialData?.socialLinks?.twitter || "",
                youtube: initialData?.socialLinks?.youtube || "",
            }
        }
    });

    // Automatically watch the live map Embed URL field from React Hook Form
    const liveMapEmbedUrl = useWatch({
        control,
        name: "mapEmbedUrl"
    });

    const { fields: emailFields, append: appendEmail, remove: removeEmail } = useFieldArray({
        control,
        name: "emails"
    });

    const { fields: phoneFields, append: appendPhone, remove: removePhone } = useFieldArray({
        control,
        name: "phones"
    });

    useEffect(() => {
        if (companyInfo) {
            reset({
                companyName: companyInfo.companyName,
                description: companyInfo.description ?? "",
                officeAddress: companyInfo.officeAddress,
                officeTelephone: companyInfo.officeTelephone,
                emails: companyInfo.emails.length > 0 
                    ? companyInfo.emails.map((e: string) => ({ value: e })) 
                    : [{ value: "" }],
                phones: companyInfo.phones.length > 0 
                    ? companyInfo.phones.map((p: string) => ({ value: p })) 
                    : [{ value: "" }],
                mapLatitude: companyInfo.mapLatitude !== undefined ? String(companyInfo.mapLatitude) : "",
                mapLongitude: companyInfo.mapLongitude !== undefined ? String(companyInfo.mapLongitude) : "",
                mapEmbedUrl: companyInfo.mapEmbedUrl ?? "",
                socialLinks: {
                    facebook: companyInfo.socialLinks?.facebook ?? "",
                    instagram: companyInfo.socialLinks?.instagram ?? "",
                    linkedin: companyInfo.socialLinks?.linkedin ?? "",
                    twitter: companyInfo.socialLinks?.twitter ?? "",
                    youtube: companyInfo.socialLinks?.youtube ?? "",
                },
            });
            setLogoPreview(companyInfo.logo || "");
            setLogoFile(null);
            setIsLogoDirty(false); 
        }
    }, [companyInfo, reset]);

    const updateMutation = useMutation({
        mutationFn: updateCompanyInfo,
        onSuccess: () => {
            toast.success("Company info updated successfully");
            setIsLogoDirty(false);
            queryClient.invalidateQueries({ queryKey: ["company-info"] });
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || "Failed to update company info";
            toast.error(message);
        }
    });

    const onSubmit = (values: CompanyInfoFormValues) => {
        const formData = new FormData();

        formData.append("companyName", values.companyName);
        formData.append("description", values.description);
        formData.append("officeAddress", values.officeAddress);
        formData.append("officeTelephone", values.officeTelephone);
        formData.append("mapLatitude", String(Number(values.mapLatitude) || 0));
        formData.append("mapLongitude", String(Number(values.mapLongitude) || 0));
        formData.append("mapEmbedUrl", values.mapEmbedUrl);
        const cleanedEmails = values.emails.map((e) => e.value).filter(Boolean);
        const cleanedPhones = values.phones.map((p) => p.value).filter(Boolean);
        formData.append("emails", JSON.stringify(cleanedEmails));
        formData.append("phones", JSON.stringify(cleanedPhones));
        formData.append("socialLinks", JSON.stringify(values.socialLinks));

        if (logoFile) {
            formData.append("logo", logoFile);
        }

        updateMutation.mutate(formData);
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setLogoFile(file);
        setLogoPreview(URL.createObjectURL(file));
        setIsLogoDirty(true);
    };

    if (isLoading) {
        return <PageLoader />;
    }

    const hasChanges = isDirty || isLogoDirty;

    return (
        <div className="w-full min-h-screen flex flex-col gap-6 bg-neutral-50/20">
            <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-6">
                
                {/* Header Actions Panel */}
                <div className="flex items-center justify-between w-full border-b border-neutral-100 pb-4">
                    <h2 className="text-xl font-bold text-neutral-800">Company Configuration</h2>
                    <div className="flex items-center gap-3">
                        <button
                            type="submit"
                            disabled={!hasChanges || updateMutation.isPending}
                            className="btn-primary whitespace-nowrap"
                        >
                            {updateMutation.isPending ? "Updating..." : "Update Information"}
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
                                <h4 className="card-title font-semibold">Basic Details</h4>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-6">
                                <div className="flex flex-col gap-2">
                                    <span className="text-xs font-bold text-neutral-500 tracking-wide">Brand Logo</span>
                                    <div className="relative h-28 w-28 rounded-2xl border border-neutral-200 bg-neutral-50/50 flex items-center justify-center p-3 overflow-hidden group">
                                        {logoPreview ? (
                                            <img src={logoPreview} alt="companyLogo" className="w-full h-full object-contain" />
                                        ) : (
                                            <div className="text-xs text-neutral-400">No Image</div>
                                        )}
                                        <label className="absolute h-8 w-8 rounded-full bg-white shadow-md border border-neutral-100 flex items-center justify-center text-primary-700 hover:scale-105 transition-transform cursor-pointer bottom-1 right-1">
                                            <Pencil size={14} />
                                            <input type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
                                        </label>
                                    </div>
                                </div>

                                <div className="flex-1 flex flex-col gap-4">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-bold text-neutral-500 tracking-wide">Company Name</label>
                                        <input
                                            type="text"
                                            {...register("companyName", { required: "Company name is required" })}
                                            disabled={updateMutation.isPending}
                                            className="input"
                                        />
                                        {errors.companyName && <p className="text-xs text-red-500">{errors.companyName.message}</p>}
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-bold text-neutral-500 tracking-wide">Company Description</label>
                                        <textarea
                                            rows={5}
                                            {...register("description")}
                                            disabled={updateMutation.isPending}
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
                                <h4 className="card-title font-semibold">Contact Information</h4>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-3">
                                    <h5 className="text-[11px] font-bold tracking-wider uppercase text-primary-800">Email Addresses</h5>
                                    {emailFields.map((field, index) => (
                                        <div key={field.id} className="relative flex items-center gap-2">
                                            <Mail size={15} className="absolute left-4 text-neutral-400" />
                                            <input
                                                type="email"
                                                {...register(`emails.${index}.value` as const)}
                                                disabled={updateMutation.isPending}
                                                className="input pl-11 flex-1"
                                            />
                                            {emailFields.length > 1 && (
                                                <button type="button" onClick={() => removeEmail(index)} disabled={updateMutation.isPending} className="text-neutral-400 hover:text-red-500 transition-colors">
                                                    <X size={16} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    {emailFields.length < 3 && (
                                        <button
                                            type="button"
                                            onClick={() => appendEmail({ value: "" })}
                                            disabled={updateMutation.isPending}
                                            className="flex items-center gap-2 text-xs font-bold text-neutral-400 hover:text-neutral-600 transition-colors cursor-pointer w-fit mt-1"
                                        >
                                            <Plus size={14} />
                                            <span>Add alternative email...</span>
                                        </button>
                                    )}
                                </div>

                                <div className="flex flex-col gap-3">
                                    <h5 className="text-[11px] font-bold tracking-wider uppercase text-primary-800">Phone & Office</h5>
                                    {phoneFields.map((field, index) => (
                                        <div key={field.id} className="relative flex items-center gap-2">
                                            <Phone size={15} className="absolute left-4 text-neutral-400" />
                                            <input
                                                type="text"
                                                {...register(`phones.${index}.value` as const)}
                                                disabled={updateMutation.isPending}
                                                className="input pl-11 flex-1"
                                            />
                                            {phoneFields.length > 1 && (
                                                <button type="button" onClick={() => removePhone(index)} disabled={updateMutation.isPending} className="text-neutral-400 hover:text-red-500 transition-colors">
                                                    <X size={16} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    {phoneFields.length < 2 && (
                                        <button
                                            type="button"
                                            onClick={() => appendPhone({ value: "" })}
                                            disabled={updateMutation.isPending}
                                            className="flex items-center gap-2 text-xs font-bold text-neutral-400 hover:text-neutral-600 transition-colors cursor-pointer w-fit mt-1"
                                        >
                                            <Plus size={14} />
                                            <span>Add phone...</span>
                                        </button>
                                    )}

                                    <div className="relative flex items-center">
                                        <Briefcase size={15} className="absolute left-4 text-neutral-400" />
                                        <input
                                            type="text"
                                            {...register("officeTelephone")}
                                            disabled={updateMutation.isPending}
                                            placeholder="Office Telephone"
                                            className="input pl-11 w-full"
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
                                <h4 className="card-title font-semibold">Global HQ Location</h4>
                            </div>

                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-neutral-500 tracking-wide">Office Address</label>
                                    <input
                                        type="text"
                                        {...register("officeAddress", { required: "Office address is required" })}
                                        disabled={updateMutation.isPending}
                                        className="input"
                                    />
                                    {errors.officeAddress && <p className="text-xs text-red-500">{errors.officeAddress.message}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-bold text-neutral-500 tracking-wide">Latitude</label>
                                        <input
                                            type="text"
                                            {...register("mapLatitude")}
                                            disabled={updateMutation.isPending}
                                            className="input"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-bold text-neutral-500 tracking-wide">Longitude</label>
                                        <input
                                            type="text"
                                            {...register("mapLongitude")}
                                            disabled={updateMutation.isPending}
                                            className="input"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-neutral-500 tracking-wide">Map Embed URL</label>
                                    <input
                                        type="text"
                                        {...register("mapEmbedUrl")}
                                        disabled={updateMutation.isPending}
                                        className="input"
                                    />
                                </div>

                                {/* FIXED: Now accurately tracks values and reactive input shifts */}
                                <div className="relative w-full h-48 rounded-xl border border-neutral-200 overflow-hidden mt-1 group bg-neutral-100">
                                    {liveMapEmbedUrl ? (
                                        <iframe
                                            src={liveMapEmbedUrl}
                                            width="100%"
                                            height="100%"
                                            style={{ border: 0 }}
                                            allowFullScreen
                                            loading="lazy"
                                            referrerPolicy="no-referrer-when-downgrade"
                                            className="rounded-xl"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-neutral-400 gap-2">
                                            <MapPin size={24} />
                                            <span className="text-xs">No iframe content configured</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* CARD 4: Social Presence */}
                        <div className="w-full card p-6 flex flex-col gap-5">
                            <div className="flex items-center gap-2.5 border-b border-neutral-100 pb-4">
                                <Share2 size={20} className="text-primary-700" />
                                <h4 className="card-title font-semibold">Social Presence</h4>
                            </div>

                            <div className="flex flex-col gap-3.5">
                                {[
                                    { key: "facebook", icon: <FaFacebook size={16} />, className: "bg-blue-50 text-blue-600 border-blue-100" },
                                    { key: "instagram", icon: <FaInstagram size={16} />, className: "bg-pink-50 text-pink-600 border-pink-100" },
                                    { key: "linkedin", icon: <FaLinkedinIn size={16} />, className: "bg-indigo-50 text-indigo-600 border-indigo-100" },
                                    { key: "twitter", icon: <FaTwitter size={16} />, className: "bg-neutral-50 text-neutral-800 border-neutral-200" },
                                    { key: "youtube", icon: <FaYoutube size={16} />, className: "bg-red-50 text-red-600 border-red-100" },
                                ].map(({ key, icon, className }) => (
                                    <div key={key} className="w-full flex items-center gap-3">
                                        <div className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 border ${className}`}>
                                            {icon}
                                        </div>
                                        <input
                                            type="text"
                                            {...register(`socialLinks.${key as keyof CompanyInfoFormValues["socialLinks"]}`)}
                                            disabled={updateMutation.isPending}
                                            className="w-full input py-2 px-2"
                                            placeholder={`${key}.com/yourpage`}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}