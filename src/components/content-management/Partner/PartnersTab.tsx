"use client";

import { LayoutTemplate, ShieldCheck, Tag, Plus, Clock, X } from "lucide-react";
import { useEffect, useState } from "react";
import PartnerForm from "./AffiliationForm"; 
import type { IPartnerSection } from "@/src/types/partner";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { addAffiliation, deleteAffiliation, updateAffiliation, updatePartnerSection } from "@/src/lib/api/partner";
import { toast } from "sonner";
import { PageLoader } from "../../ui/PageLoader";

const MIN_AFFILIATIONS = 3;
const MAX_AFFILIATIONS = 5;
const MAX_BADGES = 6;
const MIN_BADGES = 2;

interface AffiliationItem {
    _id: string;
    abbreviation: string;
    name: string;
    logo: string;
    order: number;
    _newLogo?: File | null;
}


export default function PartnersTab({initialData}:{initialData:IPartnerSection | null}) {
    const router= useRouter();
    const [isLoading, setIsLoading]=useState(!initialData);

    //Section states
    const [sectionTitle,   setSectionTitle]   = useState(initialData?.sectionTitle || "");
    const [sectionTagline, setSectionTagline] = useState(initialData?.sectionTagline || "");
    const [badges,         setBadges]         = useState(initialData?.badges || []);
    const [newBadge,       setNewBadge]       = useState("");
    const [isSectionDirty, setIsSectionDirty] = useState(false);

    const [affiliations, setAffiliations] = useState<AffiliationItem[]>(() => {
        if (!initialData?.affiliations) return [];
        return initialData.affiliations.map((a) => ({
            _id: a._id,
            abbreviation: a.abbreviation,
            name: a.name,
            logo: a.logo,
            order: a.order
        }));
    });

    const [editingId, setEditingId]=useState<string | null>(null);
    const [editDraft, setEditDraft]=useState<Partial<AffiliationItem>>({});
    const [logoPreview, setLogoPreview]=useState<string>("");

    // Sync data if initialData changes
    useEffect(()=>{
        if(initialData){
            setSectionTitle(initialData.sectionTitle || "");
            setSectionTagline(initialData.sectionTagline || "");

            setBadges(initialData.badges || []);

            if(initialData.affiliations){
                setAffiliations(initialData.affiliations.map((a)=>({
                    _id:a._id,
                    abbreviation:a.abbreviation,
                    name:a.name,
                    logo:a.logo,
                    order:a.order
                })))
            }
            setIsLoading(false);
        }
    },[initialData])

    const canDeleteAffiliation = affiliations.length > MIN_AFFILIATIONS;
    const canAddAffiliation    = affiliations.length < MAX_AFFILIATIONS;
    const canAddBadge          = badges.length < MAX_BADGES;
    const canRemoveBadge       = badges.length > MIN_BADGES;

    //Section Mutation

    const sectionMutation= useMutation({
        mutationFn:()=>updatePartnerSection({
            sectionTitle: sectionTitle || "",
            sectionTagline: sectionTagline || "",
            badges
        }),
        onSuccess:()=>{
            toast.success("Section updated successfully");
            setIsSectionDirty(false);
            router.refresh();
        },
        onError:(error:any)=>{
            toast.error(error.response?.data?.message || "Failed to update section");
        }
    })

    // Affiliation mutations
    const updateAffiliationMutation = useMutation({
        mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
            updateAffiliation(id, formData),
        onSuccess: () => {
            toast.success("Affiliation updated successfully");
            setEditingId(null);
            setEditDraft({});
            setLogoPreview("");
            router.refresh();
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to update affiliation");
        },
    });

    const addAffiliationMutation = useMutation({
        mutationFn: (formData: FormData) => addAffiliation(formData),
        onSuccess: () => {
            toast.success("Affiliation added successfully");
            router.refresh();
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to add affiliation");
        },
    });

    const deleteAffiliationMutation = useMutation({
        mutationFn: (id: string) => deleteAffiliation(id),
        onSuccess: (_, id) => {
            toast.success("Affiliation deleted");
            setAffiliations((prev) => prev.filter((a) => a._id !== id));
            router.refresh();
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to delete affiliation");
        },
    });

    // Affiliation Handlers
    
    const handleStartEdit = (item: AffiliationItem) => {
        setEditingId(item._id);
        setEditDraft({ ...item });
        setLogoPreview(item.logo);
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditDraft({});
        setLogoPreview("");
    };

    const handleConfirmEdit = (id: string) => {
        const formData= new FormData();
        if(editDraft.abbreviation) formData.append("abbreviation",editDraft.abbreviation);
        if(editDraft.name) formData.append("name",editDraft.name);
        if(editDraft.order!==undefined) formData.append("order",String(editDraft.order));
        if(editDraft._newLogo) formData.append("logo",editDraft._newLogo);

        if(id.startsWith("temp-")){
            addAffiliationMutation.mutate(formData,{
                onSuccess:()=>{
                    handleCancelEdit();
                    router.refresh();
                },
                onError:()=>{
                    setAffiliations((prev)=>prev.filter((a)=>a._id!==id));
                    handleCancelEdit();
                }
            })
        }else{
            updateAffiliationMutation.mutate({id,formData});
        }
    };

    const handleLogoChange = (file: File) => {
        setEditDraft((prev) => ({ ...prev, _newLogo: file }));
        setLogoPreview(URL.createObjectURL(file));
    };

    const handleAddAffiliation=()=>{
        if(!canAddAffiliation) return;
        const tempId=`temp-${Date.now()}`;

        const newPartner:AffiliationItem={
            _id:tempId,
            abbreviation:"",
            name:"",
            logo:"",
            order:affiliations.length+1,
        }
        setAffiliations((prev)=>[...prev,newPartner])

        setEditingId(tempId);
        setEditDraft(newPartner);
        setLogoPreview("");

    }

    const handleDelete = (id: string) => {
        if (!canDeleteAffiliation) return;
        deleteAffiliationMutation.mutate(id);
    };

    // ── Badge Handlers ───────────────────────────────────────────────────────

    const handleAddBadge = () => {
        const trimmed = newBadge.trim();
        if (!trimmed || !canAddBadge) return;
        setBadges((prev) => [...prev, trimmed]);
        setNewBadge("");
        setIsSectionDirty(true);
    };

    const handleRemoveBadge = (idx: number) => {
        if (!canRemoveBadge) return;
        setBadges((prev) => prev.filter((_, i) => i !== idx));
        setIsSectionDirty(true);
    };

    const isPending=updateAffiliationMutation.isPending || addAffiliationMutation.isPending || deleteAffiliationMutation.isPending;

    if(isLoading){
        return(
            <PageLoader/>
        )
    }

    const hasInitialData=!!initialData;

    return (
        <div className="w-full flex flex-col gap-6 pb-24">

            {/* ── Section Branding ──────────────────────────────────────────── */}
            <div className="card p-6 flex flex-col gap-5">
                <div className="flex items-center gap-2.5 border-b border-neutral-100 pb-4">
                    <LayoutTemplate size={18} className="text-primary-700" />
                    <h4 className="card-title">Section Branding</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-neutral-500 tracking-wide">Section Title</label>
                        <input
                            type="text"
                            value={sectionTitle}
                            onChange={(e) => { setSectionTitle(e.target.value); setIsSectionDirty(true); }}
                            className="input"
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-neutral-500 tracking-wide">Section Tagline</label>
                        <input
                            type="text"
                            value={sectionTagline}
                            onChange={(e) => { setSectionTagline(e.target.value); setIsSectionDirty(true); }}
                            className="input"
                        />
                    </div>
                </div>
            </div>

            {/* ── Affiliations Manager ───────────────────────────────────────── */}
            <div className="card p-6 flex flex-col gap-5">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                    <div className="flex items-center gap-2.5">
                        <ShieldCheck size={18} className="text-primary-700" />
                        <h4 className="card-title">Affiliations Manager</h4>
                        <span className="badge bg-primary-50 text-primary-700 border border-primary-100 normal-case font-bold text-[11px]">
                            {affiliations.length} / {MAX_AFFILIATIONS} Items
                        </span>
                    </div>
                    {canAddAffiliation && (
                        <button
                            type="button"
                            disabled={isPending}
                            onClick={handleAddAffiliation}
                            className="btn-primary flex items-center gap-1.5 disabled:opacity-50"
                            // wire to your add affiliation modal/form here
                        >
                            <Plus size={14} />
                            Add Partner
                        </button>
                    )}
                </div>

                {!canDeleteAffiliation && (
                    <p className="text-[11px] font-bold text-amber-600 uppercase tracking-wide">
                        Minimum {MIN_AFFILIATIONS} affiliations must exist at all times
                    </p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {affiliations.length === 0 ? (
                        <div className="col-span-2 flex flex-col items-center justify-center gap-2 py-10">
                            <ShieldCheck size={28} className="text-neutral-300" />
                            <p className="text-sm font-semibold text-neutral-500">No affiliations added yet</p>
                            <p className="text-xs text-neutral-400">
                                Add at least {MIN_AFFILIATIONS} affiliations to publish this section
                            </p>
                        </div>
                    ) : (
                        affiliations.map((item) => (
                            <PartnerForm
                                key={item._id}
                                item={item}
                                isEditing={editingId === item._id}
                                editDraft={editDraft}
                                logoPreview={logoPreview}
                                canDeleteAffiliation={canDeleteAffiliation}
                                isSaving={updateAffiliationMutation.isPending && editingId === item._id}
                                isDeleting={deleteAffiliationMutation.isPending}
                                onStartEdit={handleStartEdit}
                                onCancelEdit={handleCancelEdit}
                                onConfirmEdit={handleConfirmEdit}
                                onDraftChange={setEditDraft}
                                onLogoChange={handleLogoChange}
                                onDelete={handleDelete}
                            />
                        ))
                    )}
                </div>
            </div>

            {/* ── Trust Badges Manager ───────────────────────────────────────── */}
            <div className="card p-6 flex flex-col gap-5">
                <div className="flex items-center gap-2.5 border-b border-neutral-100 pb-4">
                    <Tag size={18} className="text-primary-700" />
                    <h4 className="card-title">Trust Badges Manager</h4>
                </div>

                <div className="flex flex-wrap gap-2 min-h-[48px] p-3 rounded-xl border border-neutral-200 bg-neutral-50/30">
                    {badges.map((badge, idx) => (
                        <span
                            key={idx}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-50 border border-primary-100 text-xs font-bold text-primary-700"
                        >
                            {badge}
                            <button
                                type="button"
                                onClick={() => handleRemoveBadge(idx)}
                                disabled={!canRemoveBadge}
                                className="text-primary-400 hover:text-red-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                <X size={12} />
                            </button>
                        </span>
                    ))}
                    {badges.length === 0 && (
                        <span className="text-xs text-neutral-400 font-medium self-center">
                            No badges added yet
                        </span>
                    )}
                </div>

                {!canRemoveBadge && (
                    <p className="text-[11px] font-bold text-amber-600 uppercase tracking-wide">
                        Minimum {MIN_BADGES} badges must exist at all times
                    </p>
                )}

                {canAddBadge ? (
                    <div className="flex items-center gap-3">
                        <input
                            type="text"
                            value={newBadge}
                            onChange={(e) => setNewBadge(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddBadge(); }}}
                            placeholder="Enter new badge title..."
                            className="input flex-1"
                        />
                        <button
                            type="button"
                            onClick={handleAddBadge}
                            disabled={!newBadge.trim()}
                            className="btn-primary disabled:opacity-50"
                        >
                            Add
                        </button>
                    </div>
                ) : (
                    <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wide">
                        Maximum {MAX_BADGES} items allowed
                    </p>
                )}
            </div>

            {/* ── Sticky Footer — section branding only ─────────────────────── */}
            <div className="fixed bottom-0 left-0 right-0 z-10 bg-white border-t border-neutral-200 px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-neutral-400 font-medium">
                    <Clock size={13} />
                    <span>Affiliations save instantly · Section changes need manual save</span>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => {
                            if(hasInitialData){
                                setSectionTitle(initialData?.sectionTitle || "");
                                setSectionTagline(initialData?.sectionTagline || "");
                                setBadges(initialData?.badges || [])
                            }else{
                                setSectionTitle("");
                                setSectionTagline("");
                                setBadges([]);
                            }
                            setIsSectionDirty(false);
                        }}
                        disabled={!isSectionDirty || sectionMutation.isPending}
                        className="btn-secondary disabled:opacity-40"
                    >
                        Discard Changes
                    </button>
                    <button
                        type="button"
                        onClick={() => sectionMutation.mutate()}
                        disabled={!isSectionDirty || sectionMutation.isPending}
                        className="btn-primary disabled:opacity-40"
                    >
                        {sectionMutation.isPending ? "Saving..." : "Update Section"}
                    </button>
                </div>
            </div>
        </div>

    );
}