"use client";
import { PageLoader } from "@/src/components/ui/PageLoader";
import {
    ArrowLeft,
    Building2,
    CheckCircle,
    ChevronDown,
    DollarSign,
    Mail,
    MinusCircle,
    Plus,
    ShieldMinus,
    Star,
    StarOff,
    XCircle,
    Calendar,
    FileText,
    HelpCircle,
    Trash2,
} from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import GalleryUploader, { type GalleryImageItem } from "@/src/components/ui/GalleryUploader";
import ImageDropzone from "@/src/components/ui/ImageDropZone";
import { useRouter } from "next/navigation";
import { getDestinations, type IDestination } from "@/src/lib/api/destinations";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getPackageTypes } from "@/src/lib/api/package-types";
import { createPackage, updatePackage, type IPackage, type IPriceLabel} from "@/src/lib/api/package";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { packageSchema, type PackageFormValues } from "@/src/lib/vallidators/package.validate";

const DIFFICULTIES = ["Easy", "Moderate", "Hard", "Extreme"];
const CURRENCIES = [
    "USD", "Rs", "EUR", "GBP", "AUD", "CAD"
] as const;


export const PRICE_LABELS: IPriceLabel[] = [
    "per person",
    "per group",
    "per vehicle",
];

interface SupportContact {
    id: string;
    name: string;
    phone: string;
}

interface ItineraryDay {
    id: string;
    day: number;
    title: string;
    description: string;
}

interface TermsAndConditionsItem {
    id: string;
    title: string;
    description: string;
    isRequired: boolean;
}

interface FAQItem {
    id: string;
    question: string;
    answer: string;
}

interface IPackageType {
    _id: string;
    name: string;
    slug: string;
    icon: string;
    themeColor: string;
    description: string;
    hasDifficultyLevels: boolean;
    order: number;
    isActive: boolean;
}

const MIN_SUPPORT_CONTACTS = 2;
const MIN_TERMS = 2;
const MIN_FAQS = 2;
const MIN_HIGHLIGHTS = 2;
const MIN_INCLUSIONS = 2;
const MIN_EXCLUSIONS = 2;

const genId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

type PackageFormProps = {
    mode: "create" | "edit";
    initialData?: IPackage; 
    packageId?: string;
    onSuccess?: () => void;
}

export default function PackageForm({ mode, initialData, packageId, onSuccess }: PackageFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState<string>("");
    const [galleryImages, setGalleryImages] = useState<GalleryImageItem[]>([]);
    const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured ?? true);
    const [isActive, setIsActive] = useState(initialData?.isActive ?? true);
    const [hasDifficultyLevels, setHasDifficultyLevels] = useState<boolean>(false);
    const [selectedPackageTypeId, setSelectedPackageTypeId] = useState<string>("");
    const [isExistingThumbnail, setIsExistingThumbnail]=useState(false);

    // Currency and Price Label state
    const [currency, setCurrency] = useState<(typeof CURRENCIES)[number]>(initialData?.currency ?? "USD");
    const [priceLabel, setPriceLabel] = useState<IPriceLabel>(initialData?.priceLabel ?? "per person");

    // String arrays (simple state)
    const [highlights, setHighlights] = useState<string[]>(initialData?.highlights ?? []);
    const [newHighlight, setNewHighlight] = useState<string>(""); 

    const [inclusions, setInclusions] = useState<string[]>(initialData?.inclusions ?? []);
    const [newInclusion, setNewInclusion] = useState("");

    const [exclusions, setExclusions] = useState<string[]>(initialData?.exclusions ?? []);
    const [newExclusion, setNewExclusion] = useState("");

    // Support Contacts
    const [supportContacts, setSupportContacts] = useState<SupportContact[]>(
        initialData?.supportContacts?.map((c: any) => ({ ...c, id: genId() })) ??
        [
            { id: genId(), name: "", phone: "" },
            { id: genId(), name: "", phone: "" },
        ]
    );

    // Itinerary
    const [itinerary, setItinerary] = useState<ItineraryDay[]>(
        initialData?.itinerary?.map((c: any) => ({ ...c, id: genId() })) ??
        [
            { id: genId(), day: 1, title: "", description: "" },
        ]
    );

    // Terms & Conditions
    const [termsAndConditions, setTermsAndConditions] = useState<TermsAndConditionsItem[]>(
        initialData?.termsAndConditions?.map((c: any) => ({ ...c, id: genId() })) ??
        [
            { id: genId(), title: "", description: "", isRequired: true },
            { id: genId(), title: "", description: "", isRequired: true },
        ]
    );

    // FAQ Section
    const [faqTitle, setFaqTitle] = useState(initialData?.faqSection?.title ?? "FAQs");
    const [faqDescription, setFaqDescription] = useState(
        initialData?.faqSection?.description ?? "Everything you need to know about this tour before you book"
    );
    const [faqs, setFaqs] = useState<FAQItem[]>(
        initialData?.faqSection?.faqs?.map((f: any) => ({ ...f, id: genId() })) ??
        [
            { id: genId(), question: "", answer: "" },
            { id: genId(), question: "", answer: "" },
        ]
    );

    const { register, handleSubmit, setValue, watch, formState: { errors, dirtyFields } } = useForm({
        resolver: zodResolver(packageSchema),
        defaultValues: {
            title: initialData?.title ?? "",
            badge: initialData?.badge ?? "",
            overviewTitle: initialData?.overviewTitle ?? "",
            description: initialData?.description ?? "",
            price: initialData?.price ?? "",
            currency: initialData?.currency ?? "USD",
            priceLabel: initialData?.priceLabel ?? "per person",
            durationDays: initialData?.durationDays ?? "", 
            maxAltitude: initialData?.maxAltitude ?? "", 
            difficulty: initialData?.difficulty ?? undefined,
            groupSize: initialData?.groupSize ?? "",
            packageType: initialData?.packageType?._id ?? "",
            destination: initialData?.destination?._id ?? "",
            isFeatured: initialData?.isFeatured ?? true,
            isActive: initialData?.isActive ?? true,
            supportContacts: initialData?.supportContacts ?? [],
            termsAndConditions: initialData?.termsAndConditions ?? [],
            itinerary: initialData?.itinerary ?? [],
            faqSection: initialData?.faqSection ?? {
                title: "FAQs",
                description: "Everything you need to know about this package before you book",
                faqs: []
            }
        }
    });

    const watchIsActive = watch("isActive");
    const watchIsFeatured= watch("isFeatured");
    const watchPackageType = watch("packageType");

    const initialSnapshotRef=useRef({
        currency:initialData?.currency??"USD",
        priceLabel:initialData?.priceLabel ?? "per person",
        isFeatured: initialData?.isFeatured ?? true,
        isActive: initialData?.isActive ?? true,
        highlights: initialData?.highlights ?? [],
        inclusions: initialData?.inclusions ?? [],
        exclusions: initialData?.exclusions ?? [],
        itinerary: initialData?.itinerary?.map(({ day, title, description }: any) => ({ day, title, description })) ?? [],
        supportContacts: initialData?.supportContacts?.map(({ name, phone }: any) => ({ name, phone })) ?? [],
        termsAndConditions: initialData?.termsAndConditions?.map(({ title, description, isRequired }: any) => ({ title, description, isRequired })) ?? [],
        faqSection:{
            title:initialData?.faqSection?.title?? "FAQs",
            description:initialData?.faqSection?.description?? "Everything you need to know about this package before you book",
            faqs:initialData?.faqSection?.faqs?.map(({question,answer}:any)=>({question,answer})) ?? []
        }
    })

    const { data: destinations, isLoading: destinationLoading } = useQuery({
        queryKey: ["destination"],
        queryFn: () => getDestinations(),
        staleTime: 30 * 60 * 1000,
        refetchOnMount: false
    });

    const { data: packageTypes, isLoading: packageTypesLoading } = useQuery({
        queryKey: ["packageTypes"],
        queryFn: () => getPackageTypes(),
        staleTime: 30 * 60 * 1000,
        refetchOnMount: false
    });

    // Update hasDifficultyLevels when package type changes
    useEffect(() => {
        if (packageTypes?.data && watchPackageType) {
            const selected = packageTypes.data.find(
                (pkg: IPackageType) => pkg._id === watchPackageType
            );
            setHasDifficultyLevels(selected?.hasDifficultyLevels || false);
            
            if (!selected?.hasDifficultyLevels) {
                setValue("difficulty", undefined);
            }
        }
    }, [watchPackageType, packageTypes, setValue]);

    function useSkipFirstEffect(effect:()=>void,deps:React.DependencyList){
        const hasMounted= useRef(false);
        useEffect(()=>{
            if(hasMounted.current){
                effect();
            }else{
                hasMounted.current=true;
            }
        },deps);
    }

    // Sync string arrays with react-hook-form
    useSkipFirstEffect(() => {
        setValue("highlights", highlights, { shouldDirty: true });
    }, [highlights]);

    useSkipFirstEffect(() => {
        setValue("inclusions", inclusions, { shouldDirty: true });
    }, [inclusions]);

    useSkipFirstEffect(() => {
        setValue("exclusions", exclusions, { shouldDirty: true });
    }, [exclusions]);

    useSkipFirstEffect(() => {
        const contactsWithoutId = supportContacts.map(({ id, ...rest }) => rest);
        setValue("supportContacts", contactsWithoutId, { shouldDirty: true });
    }, [supportContacts]);

    useSkipFirstEffect(() => {
        const termsWithoutId = termsAndConditions.map(({ id, ...rest }) => rest);
        setValue("termsAndConditions", termsWithoutId, { shouldDirty: true });
    }, [termsAndConditions]);

    useSkipFirstEffect(() => {
        const itineraryWithoutId = itinerary.map(({ id, ...rest }) => rest);
        setValue("itinerary", itineraryWithoutId, { shouldDirty: true });
    }, [itinerary]);

    useSkipFirstEffect(() => {
        const faqsWithoutId = faqs.map(({ id, ...rest }) => rest);
        setValue("faqSection.faqs", faqsWithoutId, { shouldDirty: true });
    }, [faqs]);

    useSkipFirstEffect(() => {
        setValue("faqSection.title", faqTitle, { shouldDirty: true });
    }, [faqTitle]);

    useSkipFirstEffect(() => {
        setValue("faqSection.description", faqDescription, { shouldDirty: true });
    }, [faqDescription]);

    useSkipFirstEffect(() => {
        setValue("currency", currency, { shouldDirty: true });
    }, [currency]);

    useSkipFirstEffect(() => {
        setValue("priceLabel", priceLabel, { shouldDirty: true });
    }, [priceLabel]);

    useEffect(() => {
        if (thumbnailFile) {
            setValue("thumbnail", thumbnailFile, { shouldDirty: true });
        }
    }, [thumbnailFile, setValue]);

    useEffect(()=>{
        if(mode==="edit" && initialData?.thumbnail){
            setThumbnailPreviewUrl(initialData.thumbnail);
            setIsExistingThumbnail(true);
        }
    },[mode,initialData]);


    // Add this useEffect to pre-populate gallery images in edit mode
    useEffect(() => {
        if (mode === "edit" && initialData?.gallery && initialData.gallery.length > 0) {
            const existingGalleryImages: GalleryImageItem[] = initialData.gallery.map((url: string) => ({
                id: `existing-${Date.now()}-${Math.random()}`,
                url: url,
                file: null,
                isExisting: true,
                name: `Image ${initialData.gallery.indexOf(url) + 1}`
            }));
            setGalleryImages(existingGalleryImages);
        }
    }, [mode, initialData]);

    // Also handle the case when gallery is empty
    useEffect(() => {
        if (mode === "edit" && (!initialData?.gallery || initialData.gallery.length === 0)) {
            setGalleryImages([]);
        }
    }, [mode, initialData]);

    // Create mutation
    const createMutation = useMutation({
        mutationFn: (formData: FormData) => createPackage(formData),
        onSuccess: () => {
            toast.success("Package created successfully");
            if (onSuccess) {
                onSuccess();
            } else {
                router.push("/dashboard/packages");
            }
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || "Failed to create package";
            toast.error(message);
        },
    });

    // Update mutation
    const updateMutation = useMutation({
        mutationFn: (formData: FormData) => updatePackage(formData, initialData?._id as string),
        onSuccess: () => {
            toast.success("Package updated successfully");
            if (onSuccess) {
                console.log("On success hit");
                onSuccess();
            } else {
                router.push("/dashboard/packages");
            }
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || "Failed to update package";
            toast.error(message);
        },
    });

    // Highlight Handlers
    const addHighlight = () => {
        const trimmed = newHighlight.trim();
        if (!trimmed) return;
        setHighlights([...highlights, trimmed]);
        setNewHighlight("");
    };

    const removeHighlight = (index: number) => {
        setHighlights(highlights.filter((_, i) => i !== index));
    };

    // Inclusion Handlers
    const addInclusion = () => {
        const trimmed = newInclusion.trim();
        if (!trimmed) return;
        setInclusions([...inclusions, trimmed]);
        setNewInclusion("");
    };
    const removeInclusion = (index: number) => {
        setInclusions(inclusions.filter((_, i) => i !== index));
    };

    // Exclusion Handlers
    const addExclusion = () => {
        const trimmed = newExclusion.trim();
        if (!trimmed) return;
        setExclusions([...exclusions, trimmed]);
        setNewExclusion("");
    };
    const removeExclusion = (index: number) => {
        setExclusions(exclusions.filter((_, i) => i !== index));
    };

    // Support Contact Handlers
    const addSupportContact = () => {
        setSupportContacts([...supportContacts, { id: genId(), name: "", phone: "" }]);
    };
    const updateSupportContact = (id: string, field: "name" | "phone", value: string) => {
        setSupportContacts((prev) =>
            prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
        );
    };
    const removeSupportContact = (id: string) => {
        if (supportContacts.length <= MIN_SUPPORT_CONTACTS) return;
        setSupportContacts((prev) => prev.filter((c) => c.id !== id));
    };

    // Itinerary Handlers
    const addItineraryDay = () => {
        const nextDay = itinerary.length > 0 ? Math.max(...itinerary.map((d) => d.day)) + 1 : 1;
        setItinerary([...itinerary, { id: genId(), day: nextDay, title: "", description: "" }]);
    };
    const updateItineraryDay = (id: string, field: "title" | "description", value: string) => {
        setItinerary((prev) =>
            prev.map((d) => (d.id === id ? { ...d, [field]: value } : d))
        );
    };
    const removeItineraryDay = (id: string) => {
        setItinerary((prev) => prev.filter((d) => d.id !== id));
    };

    // Terms & Conditions Handlers
    const addTerm = () => {
        setTermsAndConditions([
            ...termsAndConditions,
            { id: genId(), title: "", description: "", isRequired: true },
        ]);
    };
    const updateTerm = (id: string, field: "title" | "description", value: string) => {
        setTermsAndConditions((prev) =>
            prev.map((t) => (t.id === id ? { ...t, [field]: value } : t))
        );
    };
    const toggleTermRequired = (id: string) => {
        setTermsAndConditions((prev) =>
            prev.map((t) => (t.id === id ? { ...t, isRequired: !t.isRequired } : t))
        );
    };
    const removeTerm = (id: string) => {
        if (termsAndConditions.length <= MIN_TERMS) return;
        setTermsAndConditions((prev) => prev.filter((t) => t.id !== id));
    };

    // FAQ Handlers
    const addFaq = () => {
        setFaqs([...faqs, { id: genId(), question: "", answer: "" }]);
    };
    const updateFaq = (id: string, field: "question" | "answer", value: string) => {
        setFaqs((prev) => prev.map((f) => (f.id === id ? { ...f, [field]: value } : f)));
    };
    const removeFaq = (id: string) => {
        if (faqs.length <= MIN_FAQS) return;
        setFaqs((prev) => prev.filter((f) => f.id !== id));
    };

    const onSubmit = (values: PackageFormValues) => {

        console.log("dirtyFields:",JSON.stringify(dirtyFields,null,2));

        if (hasDifficultyLevels && !values.difficulty) {
            toast.error("Please select a difficulty level for this package type");
            return;
        }
        
        const formData = new FormData();

        if(mode ==="create"){
            formData.append("title",values.title);
            formData.append("description",values.description);
            formData.append("price",String(values.price));
            formData.append("currency",values.currency);
            formData.append("durationDays",String(values.durationDays));
            formData.append("packageType",values.packageType);
            formData.append("destination",values.destination);
            formData.append("isFeatured",String(values.isFeatured));
            formData.append("isActive",String(values.isActive));
            formData.append("highlights",JSON.stringify(values.highlights));
            formData.append("inclusions",JSON.stringify(values.inclusions));
            formData.append("exclusions",JSON.stringify(values.exclusions));
            formData.append("supportContacts",JSON.stringify(values.supportContacts));
            formData.append("termsAndConditions",JSON.stringify(values.termsAndConditions));
            if(values.thumbnail) formData.append("thumbnail",values.thumbnail);
            values.gallery?.forEach((file)=>formData.append("gallery",file));

            if(values.badge) formData.append("badge",values.badge);
            if(values.overviewTitle) formData.append("overviewTitle",values.overviewTitle);
            if(values.maxAltitude) formData.append("maxAltitude",values.maxAltitude);
            if(values.difficulty) formData.append("difficulty",values.difficulty);
            if(values.groupSize) formData.append("groupSize",String(values.groupSize));
            if(values.itinerary?.length) formData.append("itinerary",JSON.stringify(values.itinerary));
            if(values.faqSection) formData.append("faqSection",JSON.stringify(values.faqSection));

            createMutation.mutate(formData);
            return;
        }

        const dirty= dirtyFields as Record<string,any>;
        let hasChanges=false;

        const isDirty=(key: keyof PackageFormValues):boolean=>{
            const field = (dirtyFields as any)[key];
            if(!field) return false;
            if (typeof field==="boolean") return field;
            if (Array.isArray(field)) return field.some((item:any)=>
                item && Object.values(item).some((v)=>v===true)
            );

            if(typeof field ==="object") return Object.values(field).some((v)=>v===true);
            return false;
        }

        const appendIfDirty=(
            key: keyof PackageFormValues,
            value:any,
            transform?:(v:any)=>string
        )=>{
            if(!isDirty(key)) return;
            hasChanges=true;
            formData.append(key,transform? transform (value): String(value) );
        }

        const appendJsonIfDirty=(key: keyof PackageFormValues,value:any)=>{
            if(!isDirty(key)) return;
            hasChanges=true;
            formData.append(key, JSON.stringify(value));
        }

        appendIfDirty("title",values.title);
        appendIfDirty("badge",values.badge);
        appendIfDirty("overviewTitle",values.overviewTitle??"");
        appendIfDirty("description",values.description);
        appendIfDirty("price",values.price,String);
        appendIfDirty("currency",values.currency);
        appendIfDirty("priceLabel",values.priceLabel);
        appendIfDirty("durationDays",values.durationDays);
        appendIfDirty("maxAltitude",String(values.maxAltitude));
        appendIfDirty("difficulty",values.difficulty);
        appendIfDirty("groupSize",values.groupSize,String);
        appendIfDirty("packageType",values.packageType);
        appendIfDirty("destination",values.destination);
        appendIfDirty("isFeatured",values.isFeatured,String);
        appendIfDirty("isActive",values.isActive,String);

        // Array / Object fields

        appendJsonIfDirty("highlights",values.highlights);
        appendJsonIfDirty("inclusions",values.inclusions);
        appendJsonIfDirty("exclusions",values.exclusions);
        appendJsonIfDirty("itinerary",values.itinerary);
        appendJsonIfDirty("supportContacts",values.supportContacts);
        appendJsonIfDirty("termsAndConditions",values.termsAndConditions);
        appendJsonIfDirty("faqSection",values.faqSection);

        if(values.thumbnail instanceof File){
            formData.append("thumbnail",values.thumbnail);
            hasChanges=true
        }
        if(values.gallery?.length){
            values.gallery.forEach((file)=> formData.append("gallery",file));
            hasChanges=true;
        }

        if(!hasChanges){
            toast.info("No changes to save");
            return;
        }

        updateMutation.mutate(formData);
    };

    console.log("Form errors:", errors);
    console.log("Form values:", watch());

    if (isLoading || destinationLoading || packageTypesLoading) {
        return <PageLoader />;
    }

    return (
        <div className="w-full min-h-screen flex flex-col gap-6 bg-neutral-50/20 pb-24">
            <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-6">

                {/* Header Actions Panel */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6">
                    <div className="flex flex-col gap-4">
                        <button
                            type="button"
                            onClick={() => router.push("/dashboard/packages")}
                            className="flex items-center gap-2 text-xs font-bold text-neutral-500 hover:text-neutral-800 transition-colors cursor-pointer group w-fit"
                        >
                            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
                            <span>Back to Packages</span>
                        </button>
                        <h2 className="text-xl font-bold text-neutral-900 tracking-tight">
                            {mode === "create" ? "Create New Expedition Package" : "Edit Expedition Package"}
                        </h2>
                    </div>

                    <button type="submit" className="btn-primary whitespace-nowrap">
                        {mode === "create" 
                            ? (createMutation.isPending ? "Publishing..." : "Publish Package")
                            : (updateMutation.isPending ? "Updating..." : "Update Package")
                        }
                    </button>
                </div>

                <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* ================= LEFT COLUMN (8 Cols) ================= */}
                    <div className="lg:col-span-8 flex flex-col gap-6">
                        {/* CARD: Basic Information */}
                        <div className="card p-6 flex flex-col gap-5">
                            <div className="flex items-center gap-2.5 border-b border-neutral-100 pb-4">
                                <Building2 size={20} className="text-primary-700" />
                                <h4 className="card-title font-semibold">Basic Information</h4>
                            </div>

                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-neutral-500 tracking-wide">Package Title</label>
                                    <input
                                        type="text"
                                        placeholder="Everest Base Camp Luxury Trek"
                                        className="input"
                                        {...register("title")}
                                    />
                                    {errors.title && <p className="text-red-500 text-xs">{errors.title.message as string}</p>}
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-neutral-500 tracking-wide">Badge Text</label>
                                    <input
                                        type="text"
                                        placeholder="Best Seller"
                                        className="input"
                                        {...register("badge")}
                                    />
                                    {errors.badge && <p className="text-red-500 text-xs">{errors.badge.message as string}</p>}
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-neutral-500 tracking-wide">Overview Title</label>
                                    <input
                                        type="text"
                                        placeholder="The Journey of a Lifetime"
                                        className="input"
                                        {...register("overviewTitle")}
                                    />
                                    {errors.overviewTitle && <p className="text-red-500 text-xs">{errors.overviewTitle.message as string}</p>}
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-neutral-500 tracking-wide">Description</label>
                                    <textarea
                                        rows={5}
                                        placeholder="Describe your package..."
                                        className="input leading-relaxed resize-none"
                                        {...register("description")}
                                    />
                                    {errors.description && <p className="text-red-500 text-xs">{errors.description.message as string}</p>}
                                </div>
                            </div>
                        </div>

                        {/* CARD: Media Visuals */}
                        <div className="card p-6 flex flex-col gap-5">
                            <div className="flex items-center gap-2.5 border-b border-neutral-100 pb-4">
                                <Mail size={20} className="text-primary-700" />
                                <h4 className="card-title font-semibold">Media Visuals</h4>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <ImageDropzone
                                    label="Main Thumbnail"
                                    value={thumbnailFile}
                                    preview={thumbnailPreviewUrl}
                                    onChange={setThumbnailFile}
                                    maxSizeMB={5}
                                />

                                <GalleryUploader
                                    label="Gallery Photos"
                                    value={galleryImages}
                                    onChange={setGalleryImages}
                                    maxImages={10}
                                />
                            </div>
                        </div>

                        {/* HIGHLIGHTS */}
                        <div className="card p-6 flex flex-col gap-5 text-sm">
                            <div className="flex items-center gap-2.5 border-b border-neutral-100 pb-4">
                                <Star size={18} className="text-primary-700" />
                                <h4 className="card-title font-semibold">Highlights</h4>
                                <span className={`badge normal-case font-bold text-[10px] border ${
                                    highlights.length < MIN_HIGHLIGHTS
                                        ? "bg-amber-50 text-amber-700 border-amber-100"
                                        : "bg-primary-50 text-primary-700 border-primary-100"
                                }`}>
                                    {highlights.length} items
                                </span>
                            </div>

                            {highlights.length < MIN_HIGHLIGHTS && (
                                <p className="text-[11px] font-bold text-amber-600 uppercase tracking-wide -mt-2">
                                    At least {MIN_HIGHLIGHTS} highlights are required
                                </p>
                            )}

                            <div className="flex flex-wrap gap-2">
                                {highlights.map((item, index) => (
                                    <span
                                        key={index}
                                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary-50 border border-primary-100 text-xs font-semibold text-primary-700"
                                    >
                                        {item}
                                        <button
                                            type="button"
                                            onClick={() => removeHighlight(index)}
                                            className="text-primary-400 hover:text-red-500 transition-colors"
                                        >
                                            <MinusCircle size={14} />
                                        </button>
                                    </span>
                                ))}
                                {highlights.length === 0 && (
                                    <span className="text-xs text-neutral-400 font-medium">
                                        No highlights added yet
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={newHighlight}
                                    onChange={(e) => setNewHighlight(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            addHighlight();
                                        }
                                    }}
                                    placeholder="Add highlight..."
                                    className="input flex-1 text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={addHighlight}
                                    disabled={!newHighlight.trim()}
                                    className="btn-quick-action disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Plus size={14} />
                                    Add
                                </button>
                            </div>
                        </div>

                        {/* INCLUSIONS */}
                        <div className="card p-6 flex flex-col gap-5 text-sm">
                            <div className="flex items-center gap-2.5 border-b border-neutral-100 pb-4">
                                <CheckCircle size={18} className="text-primary-700" />
                                <h4 className="card-title font-semibold">Inclusions</h4>
                                <span className={`badge normal-case font-bold text-[10px] border ${
                                    inclusions.length < MIN_INCLUSIONS
                                        ? "bg-amber-50 text-amber-700 border-amber-100"
                                        : "bg-primary-50 text-primary-700 border-primary-100"
                                }`}>
                                    {inclusions.length} items
                                </span>
                            </div>

                            {inclusions.length < MIN_INCLUSIONS && (
                                <p className="text-[11px] font-bold text-amber-600 uppercase tracking-wide -mt-2">
                                    At least {MIN_INCLUSIONS} inclusions are required
                                </p>
                            )}

                            <div className="flex flex-wrap gap-2">
                                {inclusions.map((item, index) => (
                                    <span
                                        key={index}
                                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-100 text-xs font-semibold text-emerald-700"
                                    >
                                        {item}
                                        <button
                                            type="button"
                                            onClick={() => removeInclusion(index)}
                                            className="text-emerald-400 hover:text-red-500 transition-colors"
                                        >
                                            <MinusCircle size={14} />
                                        </button>
                                    </span>
                                ))}
                                {inclusions.length === 0 && (
                                    <span className="text-xs text-neutral-400 font-medium">
                                        No inclusions added yet
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={newInclusion}
                                    onChange={(e) => setNewInclusion(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            addInclusion();
                                        }
                                    }}
                                    placeholder="Add inclusion..."
                                    className="input flex-1 text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={addInclusion}
                                    disabled={!newInclusion.trim()}
                                    className="btn-quick-action disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Plus size={14} />
                                    Add
                                </button>
                            </div>
                        </div>

                        {/* EXCLUSIONS */}
                        <div className="card p-6 flex flex-col gap-5 text-sm">
                            <div className="flex items-center gap-2.5 border-b border-neutral-100 pb-4">
                                <XCircle size={18} className="text-primary-700" />
                                <h4 className="card-title font-semibold">Exclusions</h4>
                                <span className={`badge normal-case font-bold text-[10px] border ${
                                    exclusions.length < MIN_EXCLUSIONS && exclusions.length > 0
                                        ? "bg-amber-50 text-amber-700 border-amber-100"
                                        : "bg-primary-50 text-primary-700 border-primary-100"
                                }`}>
                                    {exclusions.length} items
                                </span>
                            </div>

                            {exclusions.length > 0 && exclusions.length < MIN_EXCLUSIONS && (
                                <p className="text-[11px] font-bold text-amber-600 uppercase tracking-wide -mt-2">
                                    If listing exclusions, at least {MIN_EXCLUSIONS} are required
                                </p>
                            )}

                            <div className="flex flex-wrap gap-2">
                                {exclusions.map((item, index) => (
                                    <span
                                        key={index}
                                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 border border-red-100 text-xs font-semibold text-red-700"
                                    >
                                        {item}
                                        <button
                                            type="button"
                                            onClick={() => removeExclusion(index)}
                                            className="text-red-400 hover:text-red-600 transition-colors"
                                        >
                                            <MinusCircle size={14} />
                                        </button>
                                    </span>
                                ))}
                                {exclusions.length === 0 && (
                                    <span className="text-xs text-neutral-400 font-medium">
                                        No exclusions added yet
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={newExclusion}
                                    onChange={(e) => setNewExclusion(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            addExclusion();
                                        }
                                    }}
                                    placeholder="Add exclusion..."
                                    className="input flex-1 text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={addExclusion}
                                    disabled={!newExclusion.trim()}
                                    className="btn-quick-action disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Plus size={14} />
                                    Add
                                </button>
                            </div>
                        </div>

                        {/* ITINERARY */}
                        <div className="card p-6 flex flex-col gap-5 text-sm">
                            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                                <div className="flex items-center gap-2.5">
                                    <Calendar size={18} className="text-primary-700" />
                                    <h4 className="card-title font-semibold">Itinerary</h4>
                                    <span className="badge bg-primary-50 text-primary-700 border border-primary-100 normal-case font-bold text-[10px]">
                                        {itinerary.length} day{itinerary.length === 1 ? "" : "s"}
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={addItineraryDay}
                                    className="btn-quick-action"
                                >
                                    <Plus size={14} />
                                    Add Day
                                </button>
                            </div>

                            <div className="flex flex-col gap-3">
                                {itinerary.map((day) => (
                                    <div key={day.id} className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/40 flex flex-col gap-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-primary-700 uppercase tracking-wide">
                                                Day {day.day}
                                            </span>
                                            {itinerary.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeItineraryDay(day.id)}
                                                    className="text-neutral-400 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            )}
                                        </div>
                                        <input
                                            type="text"
                                            value={day.title}
                                            onChange={(e) => updateItineraryDay(day.id, "title", e.target.value)}
                                            placeholder="e.g. Fly to Lukla, Trek to Phakding"
                                            className="input bg-white"
                                        />
                                        <textarea
                                            rows={3}
                                            value={day.description}
                                            onChange={(e) => updateItineraryDay(day.id, "description", e.target.value)}
                                            placeholder="Describe this day's activities..."
                                            className="input bg-white leading-relaxed resize-none"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* FAQ SECTION */}
                        <div className="card p-6 flex flex-col gap-5 text-sm">
                            <div className="flex items-center gap-2.5 border-b border-neutral-100 pb-4">
                                <HelpCircle size={18} className="text-primary-700" />
                                <h4 className="card-title font-semibold">FAQ Section</h4>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-neutral-500 tracking-wide">Section Title</label>
                                    <input
                                        type="text"
                                        value={faqTitle}
                                        onChange={(e) => setFaqTitle(e.target.value)}
                                        className="input"
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-neutral-500 tracking-wide">Section Description</label>
                                    <input
                                        type="text"
                                        value={faqDescription}
                                        onChange={(e) => setFaqDescription(e.target.value)}
                                        className="input"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
                                <span className={`badge normal-case font-bold text-[10px] border ${
                                    faqs.length < MIN_FAQS
                                        ? "bg-amber-50 text-amber-700 border-amber-100"
                                        : "bg-primary-50 text-primary-700 border-primary-100"
                                }`}>
                                    {faqs.length} questions
                                </span>
                                <button
                                    type="button"
                                    onClick={addFaq}
                                    className="btn-quick-action"
                                >
                                    <Plus size={14} />
                                    Add Question
                                </button>
                            </div>

                            {faqs.length < MIN_FAQS && (
                                <p className="text-[11px] font-bold text-amber-600 uppercase tracking-wide -mt-2">
                                    At least {MIN_FAQS} FAQs are required
                                </p>
                            )}

                            <div className="flex flex-col gap-3">
                                {faqs.map((faq, index) => (
                                    <div key={faq.id} className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/40 flex flex-col gap-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wide">
                                                Q{index + 1}
                                            </span>
                                            {faqs.length > MIN_FAQS && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeFaq(faq.id)}
                                                    className="text-neutral-400 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            )}
                                        </div>
                                        <input
                                            type="text"
                                            value={faq.question}
                                            onChange={(e) => updateFaq(faq.id, "question", e.target.value)}
                                            placeholder="e.g. Do I need prior trekking experience?"
                                            className="input bg-white"
                                        />
                                        <textarea
                                            rows={2}
                                            value={faq.answer}
                                            onChange={(e) => updateFaq(faq.id, "answer", e.target.value)}
                                            placeholder="Write the answer..."
                                            className="input bg-white leading-relaxed resize-none"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ================= RIGHT COLUMN (4 Cols) ================= */}
                    <div className="lg:col-span-4 flex flex-col gap-6">

                        {/* CARD: Pricing & Stats */}
                        <div className="card p-6 flex flex-col gap-5 text-sm">
                            <div className="flex items-center gap-2.5 border-b border-neutral-100 pb-4">
                                <DollarSign size={20} className="text-primary-700" />
                                <h4 className="card-title font-semibold">Pricing & Stats</h4>
                            </div>

                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-neutral-500 tracking-wide">Base Price</label>
                                    <div className="flex items-stretch gap-2">
                                        <div className="relative">
                                            <select
                                                value={currency}
                                                onChange={(e) => setCurrency(e.target.value as (typeof CURRENCIES)[number])}
                                                className="input pr-8 appearance-none cursor-pointer w-[90px]"
                                            >
                                                {CURRENCIES.map((c) => (
                                                    <option key={c} value={c}>{c}</option>
                                                ))}
                                            </select>
                                            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                                        </div>
                                        <input
                                            type="text"
                                            inputMode="decimal"       
                                            placeholder="2,499"
                                            className="input flex-1"
                                            {...register("price")}
                                        />
                                    </div>
                                    {errors.price && <p className="text-red-500 text-xs">{errors.price.message as string}</p>}
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-neutral-500 tracking-wide">Price Label</label>
                                    <div className="relative">
                                        <select
                                            value={priceLabel}
                                            onChange={(e) => setPriceLabel(e.target.value as IPriceLabel)}
                                            className="input pr-9 appearance-none cursor-pointer w-full"
                                        >
                                            {PRICE_LABELS.map((label: IPriceLabel) => (
                                                <option key={label} value={label}>{label}</option>
                                            ))}
                                        </select>
                                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-neutral-500 tracking-wide">Group Size</label>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        placeholder="1"
                                        className="input w-24 text-right"
                                        {...register("groupSize")}
                                    />
                                    {errors.groupSize && <p className="text-red-500 text-xs">{errors.groupSize.message as string}</p>}
                                </div>
                            </div>

                            <div className="border-t border-neutral-100" />

                            <div className="flex flex-col gap-3">
                                <div className="flex flex-row items-center justify-between gap-1.5">
                                    <label className="text-xs font-bold text-neutral-500 tracking-wide">Duration (Days)</label>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        placeholder="12"
                                        className="input w-24 text-right"
                                        {...register("durationDays")}
                                    />
                                </div>
                                {errors.durationDays && <p className="text-red-500 text-xs">{errors.durationDays.message as string}</p>}
                                
                                <div className="flex flex-row items-center justify-between gap-1.5">
                                    <label className="text-xs font-bold text-neutral-500 tracking-wide">Max Altitude (m)</label>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        placeholder="5364"
                                        className="input w-24 text-right"
                                        {...register("maxAltitude")}
                                    />
                                </div>
                                
                                {hasDifficultyLevels && (
                                    <>
                                        <div className="flex flex-row items-center justify-between gap-2">
                                            <label className="text-xs font-bold text-neutral-500 tracking-wide">Difficulty</label>
                                            <div className="relative">
                                                <select
                                                    className="input pr-9 appearance-none cursor-pointer min-w-[140px]"
                                                    {...register("difficulty")}
                                                >
                                                    <option value="">Select Difficulty</option>
                                                    {DIFFICULTIES.map((f) => (
                                                        <option key={f} value={f}>{f}</option>
                                                    ))}
                                                </select>
                                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                                            </div>
                                        </div>
                                        {errors.difficulty && <p className="text-red-500 text-xs">{errors.difficulty.message as string}</p>}
                                    </>
                                )}
                            </div>
                        </div>

                        {/* CARD: Categorization */}
                        <div className="card p-6 flex flex-col gap-5">
                            <div className="flex items-center gap-2.5 border-b border-neutral-100 pb-4">
                                <Mail size={20} className="text-primary-700" />
                                <h4 className="card-title font-semibold">Categorization</h4>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-neutral-500 tracking-wide">Package Type</label>
                                <div className="relative">
                                    <select
                                        className="input pr-9 appearance-none cursor-pointer min-w-[160px]"
                                        {...register("packageType")}
                                        onChange={(e) => {
                                            register("packageType").onChange(e);
                                            setSelectedPackageTypeId(e.target.value);
                                        }}
                                    >
                                        <option value="">Select Package Type</option>
                                        {packageTypes?.data?.map((d: IPackageType) => (
                                            <option key={d._id} value={d._id}>
                                                {d.name} {d.hasDifficultyLevels ? "⭐" : ""}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                                </div>
                                {errors.packageType && <p className="text-red-500 text-xs">{errors.packageType.message as string}</p>}
                                
                                {hasDifficultyLevels && (
                                    <p className="text-xs text-blue-600 font-medium mt-1">
                                        ⚡ This package type requires difficulty selection
                                    </p>
                                )}
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-neutral-500 tracking-wide">Primary Destination</label>
                                <div className="relative">
                                    <select
                                        className="input pr-9 appearance-none cursor-pointer min-w-[160px]"
                                        {...register("destination")}
                                    >
                                        <option value="">Select Destination</option>
                                        {destinations?.data?.map((d: IDestination) => (
                                            <option key={d._id} value={d._id}>{d.name}</option>
                                        ))}
                                    </select>
                                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                                </div>
                                {errors.destination && <p className="text-red-500 text-xs">{errors.destination.message as string}</p>}
                            </div>

                            {/* Featured Toggle */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {watchIsFeatured ? (
                                        <Star className="text-primary-400 fill-primary-400" size={20} />
                                    ) : (
                                        <StarOff className="text-neutral-400" size={20} />
                                    )}
                                    <div>
                                        <p className="text-sm font-semibold text-neutral-800">Featured Package</p>
                                        <p className="text-xs text-neutral-400">
                                            {watchIsFeatured ? "This package is featured and highlighted" : "This package is not featured"}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setValue("isFeatured",!watchIsFeatured,{shouldDirty:true})}
                                    className={`relative w-12 h-6 rounded-full transition-colors duration-200 cursor-pointer ${
                                        watchIsFeatured ? "bg-primary-400" : "bg-neutral-300"
                                    }`}
                                >
                                    <span
                                        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                                            watchIsFeatured ? "translate-x-6" : ""
                                        }`}
                                    />
                                </button>
                            </div>

                            <div className="border-t border-neutral-100 pt-4">
                                {/* Active Status Toggle */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        {watchIsActive ? (
                                            <CheckCircle className="text-primary-500" size={20} />
                                        ) : (
                                            <XCircle className="text-red-500" size={20} />
                                        )}
                                        <div>
                                            <p className="text-sm font-semibold text-neutral-800">Active Status</p>
                                            <p className="text-xs text-neutral-400">
                                                {watchIsActive ? "Package is active and visible" : "Package is inactive and hidden"}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setValue("isActive",!watchIsActive,{shouldDirty:true})}
                                        className={`relative w-12 h-6 rounded-full transition-colors duration-200 cursor-pointer ${
                                            watchIsActive ? "bg-primary-500" : "bg-neutral-300"
                                        }`}
                                    >
                                        <span
                                            className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                                                watchIsActive ? "translate-x-6" : ""
                                            }`}
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* CARD: Support Contacts */}
                        <div className="card p-6 flex flex-col gap-5 text-sm">
                            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                                <div className="flex items-center gap-2.5">
                                    <ShieldMinus size={20} className="text-primary-700" />
                                    <h4 className="card-title font-semibold">Support Contacts</h4>
                                </div>
                                <button
                                    type="button"
                                    onClick={addSupportContact}
                                    className="btn-quick-action"
                                >
                                    <Plus size={14} />
                                    Add
                                </button>
                            </div>

                            {supportContacts.length < MIN_SUPPORT_CONTACTS && (
                                <p className="text-[11px] font-bold text-amber-600 uppercase tracking-wide -mt-2">
                                    At least {MIN_SUPPORT_CONTACTS} contacts are required
                                </p>
                            )}

                            <div className="flex flex-col gap-3">
                                {supportContacts.map((contact) => (
                                    <div key={contact.id} className="flex items-center gap-2">
                                        <div className="flex-1 flex flex-col gap-2">
                                            <input
                                                type="text"
                                                value={contact.name}
                                                onChange={(e) => updateSupportContact(contact.id, "name", e.target.value)}
                                                placeholder="Name"
                                                className="input"
                                            />
                                            <input
                                                type="text"
                                                value={contact.phone}
                                                onChange={(e) => updateSupportContact(contact.id, "phone", e.target.value)}
                                                placeholder="Phone"
                                                className="input"
                                            />
                                        </div>
                                        {supportContacts.length > MIN_SUPPORT_CONTACTS && (
                                            <button
                                                type="button"
                                                onClick={() => removeSupportContact(contact.id)}
                                                className="text-neutral-400 hover:text-red-500 transition-colors self-start mt-2"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* TERMS & CONDITIONS */}
                        <div className="card p-6 flex flex-col gap-5 text-sm">
                            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                                <div className="flex flex-col gap-2.5">
                                    <div className="w-fit flex items-center gap-2">
                                        <FileText size={18} className="text-primary-700" />
                                        <h4 className="card-title font-semibold">Terms & Conditions</h4>
                                    </div>
                                    <span className={`badge normal-case font-bold text-[10px] w-fit border ${
                                        termsAndConditions.length < MIN_TERMS
                                            ? "bg-amber-50 text-amber-700 border-amber-100"
                                            : "bg-primary-50 text-primary-700 border-primary-100"
                                    }`}>
                                        {termsAndConditions.length} items
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={addTerm}
                                    className="btn-quick-action"
                                >
                                    <Plus size={14} />
                                    Add Term
                                </button>
                            </div>

                            {termsAndConditions.length < MIN_TERMS && (
                                <p className="text-[11px] font-bold text-amber-600 uppercase tracking-wide -mt-2">
                                    At least {MIN_TERMS} terms are required
                                </p>
                            )}

                            <div className="flex flex-col gap-3">
                                {termsAndConditions.map((term) => (
                                    <div key={term.id} className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/40 flex flex-col gap-3">
                                        <div className="flex items-center justify-between gap-3">
                                            <input
                                                type="text"
                                                value={term.title}
                                                onChange={(e) => updateTerm(term.id, "title", e.target.value)}
                                                placeholder="e.g. Cancellation Policy"
                                                className="input bg-white flex-1"
                                            />
                                            <label className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500 whitespace-nowrap cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={term.isRequired}
                                                    onChange={() => toggleTermRequired(term.id)}
                                                    className="cursor-pointer"
                                                />
                                                Required
                                            </label>
                                            {termsAndConditions.length > MIN_TERMS && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeTerm(term.id)}
                                                    className="text-neutral-400 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            )}
                                        </div>
                                        <textarea
                                            rows={2}
                                            value={term.description}
                                            onChange={(e) => updateTerm(term.id, "description", e.target.value)}
                                            placeholder="Describe this term..."
                                            className="input bg-white leading-relaxed resize-none"
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