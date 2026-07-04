"use client";

import {
    ShieldCheck,
    Tag,
    Plus,
    Pencil,
    Trash2,
    X,
    Clock,
    LayoutTemplate,
} from "lucide-react";
import { useState } from "react";

// ─── Mock Data ──────────────────────────────────────────────────────────────
const MIN_AFFILIATIONS = 3;
const MAX_AFFILIATIONS = 5;
const MAX_BADGES = 6;
const MIN_BADGES = 2;

const mockAffiliations = [
    { _id: "1", abbreviation: "TAAN", name: "Trekking Agencies' Association of Nepal", logo: "", order: 1 },
    { _id: "2", abbreviation: "NMA",  name: "Nepal Mountaineering Association",         logo: "", order: 2 },
    { _id: "3", abbreviation: "NTB",  name: "Nepal Tourism Board",                      logo: "", order: 3 },
    { _id: "4", abbreviation: "HRA",  name: "Himalayan Rescue Association",              logo: "", order: 4 },
];

const mockBadges = [
    "Government Registered",
    "Eco-Tourism Certified",
    "Sustainable Travel",
    "Expert Local Guides",
    "24/7 Field Support",
];

export default function AffiliationsTab() {
    const [sectionTitle,   setSectionTitle]   = useState("Our Affiliations");
    const [sectionTagline, setSectionTagline] = useState("Trusted by leading industry organizations");
    const [affiliations,   setAffiliations]   = useState(mockAffiliations);
    const [badges,         setBadges]         = useState(mockBadges);
    const [newBadge,       setNewBadge]       = useState("");
    const [isDirty,        setIsDirty]        = useState(false);

    const canDeleteAffiliation = affiliations.length > MIN_AFFILIATIONS;
    const canAddAffiliation    = affiliations.length < MAX_AFFILIATIONS;
    const canAddBadge          = badges.length < MAX_BADGES;
    const canRemoveBadge = badges.length > MIN_BADGES;

    const handleAddBadge = () => {
        const trimmed = newBadge.trim();
        if (!trimmed || !canAddBadge) return;
        setBadges((prev) => [...prev, trimmed]);
        setNewBadge("");
        setIsDirty(true);
    };

    const handleRemoveBadge = (idx: number) => {
        if (!canRemoveBadge) return;
        setBadges((prev) => prev.filter((_, i) => i !== idx));
        setIsDirty(true);
    };

    const handleDeleteAffiliation = (id: string) => {
        if (!canDeleteAffiliation) return;
        setAffiliations((prev) => prev.filter((a) => a._id !== id));
        setIsDirty(true);
    };

    return (
        <div className="w-full flex flex-col gap-6 pb-24">

            {/* ── Section Branding ─────────────────────────────────────── */}
            <div className="card p-6 flex flex-col gap-5">
                <div className="flex items-center gap-2.5 border-b border-neutral-100 pb-4">
                    <LayoutTemplate size={18} className="text-primary-700" />
                    <h4 className="card-title">Section Branding</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-neutral-500 tracking-wide">
                            Section Title
                        </label>
                        <input
                            type="text"
                            value={sectionTitle}
                            onChange={(e) => { setSectionTitle(e.target.value); setIsDirty(true); }}
                            className="input"
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-neutral-500 tracking-wide">
                            Section Tagline
                        </label>
                        <input
                            type="text"
                            value={sectionTagline}
                            onChange={(e) => { setSectionTagline(e.target.value); setIsDirty(true); }}
                            className="input"
                        />
                    </div>
                </div>
            </div>

            {/* ── Affiliations Manager ──────────────────────────────────── */}
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
                            className="btn-primary flex items-center gap-1.5"
                        >
                            <Plus size={14} />
                            Add Partner
                        </button>
                    )}
                </div>

                {/* Minimum guard notice */}
                {!canDeleteAffiliation && (
                    <p className="text-[11px] font-bold text-amber-600 uppercase tracking-wide">
                        Minimum {MIN_AFFILIATIONS} affiliations must exist at all times
                    </p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {affiliations.length === 0 ? (
                        <div className="col-span-2 flex flex-col items-center justify-center gap-2 py-10 text-neutral-400">
                            <ShieldCheck size={28} className="text-neutral-300" />
                            <p className="text-sm font-semibold text-neutral-500">No affiliations added yet</p>
                            <p className="text-xs text-neutral-400">Add at least {MIN_AFFILIATIONS} affiliations to publish this section</p>
                        </div>
                     ) : (
                        affiliations.map((item) => (
                        <div
                            key={item._id}
                            className="flex items-center gap-3 p-3 rounded-xl border border-neutral-200 bg-neutral-50/50"
                        >
                            {/* Logo placeholder */}
                            <div className="h-10 w-10 rounded-lg border border-neutral-200 bg-white flex items-center justify-center shrink-0 overflow-hidden">
                                {item.logo ? (
                                    <img src={item.logo} alt={item.abbreviation} className="h-full w-full object-contain p-1" />
                                ) : (
                                    <span className="text-[10px] font-black text-neutral-400">
                                        {item.abbreviation.slice(0, 2)}
                                    </span>
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-sm font-bold text-neutral-800">
                                        {item.abbreviation}
                                    </span>
                                    <span className="badge bg-neutral-100 text-neutral-500 normal-case font-semibold text-[10px]">
                                        Order #{item.order}
                                    </span>
                                </div>
                                <p className="text-xs text-neutral-500 truncate mt-0.5">{item.name}</p>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                    type="button"
                                    className="h-8 w-8 rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-500 hover:text-primary-700 hover:border-primary-200 transition-colors"
                                >
                                    <Pencil size={13} />
                                </button>
                                <button
                                    type="button"
                                    disabled={!canDeleteAffiliation}
                                    onClick={() => handleDeleteAffiliation(item._id)}
                                    className="h-8 w-8 rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-500 hover:text-red-500 hover:border-red-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    <Trash2 size={13} />
                                </button>
                            </div>
                        </div>
                    )))}
                </div>
            </div>

            {/* ── Trust Badges Manager ──────────────────────────────────── */}
            <div className="card p-6 flex flex-col gap-5">
                <div className="flex items-center gap-2.5 border-b border-neutral-100 pb-4">
                    <Tag size={18} className="text-primary-700" />
                    <h4 className="card-title">Trust Badges Manager</h4>
                </div>

                {/* Existing badges */}
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

                {/* Minimum guard notice */}
                {!canRemoveBadge && (
                    <p className="text-[11px] font-bold text-amber-600 uppercase tracking-wide">
                        Minimum {MIN_BADGES} badges must exist at all times
                    </p>
                )}

                {/* Max/Add input */}
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

            {/* ── Sticky Footer ─────────────────────────────────────────── */}
            <div className="fixed bottom-0 left-0 right-0 z-10 bg-white border-t border-neutral-200 px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-neutral-400 font-medium">
                    <Clock size={13} />
                    <span>Last autosaved at 14:32 PM</span>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => setIsDirty(false)}
                        disabled={!isDirty}
                        className="btn-secondary disabled:opacity-40"
                    >
                        Discard Changes
                    </button>
                    <button
                        type="submit"
                        disabled={!isDirty}
                        className="btn-primary disabled:opacity-40"
                    >
                        Update Section
                    </button>
                </div>
            </div>
        </div>
    );
}