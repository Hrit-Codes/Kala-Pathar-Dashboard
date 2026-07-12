// src/components/packages/PackagesFilter.tsx
"use client";

import { Search, SlidersHorizontal, ChevronDown, X } from "lucide-react";
import { useDebounce } from "@/src/hooks/useDebounce";
import { useState } from "react";

const DIFFICULTIES = ["All Status","Beginner", "Moderate", "Challenging", "Extreme"];
const FEATURED_OPTIONS = [
    { label: "All Status", value: "All Status" },
    { label: "Featured", value: "Featured" },
    { label: "Not Featured", value: "Not Featured" },
];

export interface PackagesFilterValues {
    search: string;
    destination: string;
    difficulty: string;
    isFeatured: string;
    minPrice: number | undefined;
    maxPrice: number | undefined;
    minDays: number | undefined;
    maxDays: number | undefined;
}

interface PackagesFilterProps {
    destinations: { _id: string; name: string }[];
    onChange: (filters: PackagesFilterValues) => void;
    totalResults?: number;
}

export default function PackagesFilter({
    destinations,
    onChange,
    totalResults,
}: PackagesFilterProps) {
    const [search, setSearch] = useState("");
    const [destination, setDestination] = useState("");
    const [difficulty, setDifficulty] = useState("All Levels");
    const [isFeatured, setIsFeatured] = useState("All Status");
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [minPrice, setMinPrice] = useState<number | undefined>();
    const [maxPrice, setMaxPrice] = useState<number | undefined>();
    const [minDays, setMinDays] = useState<number | undefined>();
    const [maxDays, setMaxDays] = useState<number | undefined>();

    const debouncedSearch = useDebounce(search, 500);
    const debouncedMinPrice = useDebounce(minPrice, 500);
    const debouncedMaxPrice = useDebounce(maxPrice, 500);
    const debouncedMinDays = useDebounce(minDays, 500);
    const debouncedMaxDays = useDebounce(maxDays, 500);

    const hasActiveFilters =
        search ||
        destination ||
        difficulty !== "All Levels" ||
        isFeatured !== "All Status" ||
        minPrice ||
        maxPrice ||
        minDays ||
        maxDays;

    const handleChange = (updates: Partial<PackagesFilterValues>) => {
        onChange({
            search: debouncedSearch,
            destination,
            difficulty,
            isFeatured,
            minPrice: debouncedMinPrice,
            maxPrice: debouncedMaxPrice,
            minDays: debouncedMinDays,
            maxDays: debouncedMaxDays,
            ...updates,
        });
    };

    const handleClearAll = () => {
        setSearch("");
        setDestination("");
        setDifficulty("All Levels");
        setIsFeatured("All Status");
        setMinPrice(undefined);
        setMaxPrice(undefined);
        setMinDays(undefined);
        setMaxDays(undefined);
        onChange({
            search: "",
            destination: "",
            difficulty: "All Levels",
            isFeatured: "All Status",
            minPrice: undefined,
            maxPrice: undefined,
            minDays: undefined,
            maxDays: undefined,
        });
    };

    return (
        <div className="card p-4 flex flex-col gap-4">
            {/* Main filters row */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-3">

                {/* Search */}
                <div className="relative flex-1 min-w-0">
                    <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            handleChange({ search: e.target.value });
                        }}
                        placeholder="Search by title or destination..."
                        className="input pl-10 w-full"
                    />
                </div>

                {/* Destination */}
                <div className="relative">
                    <select
                        value={destination}
                        onChange={(e) => {
                            setDestination(e.target.value);
                            handleChange({ destination: e.target.value });
                        }}
                        className="input pr-9 appearance-none cursor-pointer min-w-[160px]"
                    >
                        <option value="">All Regions</option>
                        {destinations.map((d) => (
                            <option key={d._id} value={d._id}>{d.name}</option>
                        ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                </div>

                {/* Difficulty */}
                <div className="relative">
                    <select
                        value={difficulty}
                        onChange={(e) => {
                            setDifficulty(e.target.value);
                            handleChange({ difficulty: e.target.value });
                        }}
                        className="input pr-9 appearance-none cursor-pointer min-w-[150px]"
                    >
                        {DIFFICULTIES.map((d) => (
                            <option key={d} value={d}>{d}</option>
                        ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                </div>

                {/* Featured */}
                <div className="relative">
                    <select
                        value={isFeatured}
                        onChange={(e) => {
                            setIsFeatured(e.target.value);
                            handleChange({ isFeatured: e.target.value });
                        }}
                        className="input pr-9 appearance-none cursor-pointer min-w-[140px]"
                    >
                        {FEATURED_OPTIONS.map((f) => (
                            <option key={f.value} value={f.value}>{f.label}</option>
                        ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                </div>

                {/* Advanced toggle */}
                <button
                    type="button"
                    onClick={() => setShowAdvanced((p) => !p)}
                    className={`h-10 w-10 shrink-0 flex items-center justify-center rounded-xl border transition-colors cursor-pointer ${
                        showAdvanced
                            ? "border-primary-300 bg-primary-50 text-primary-700"
                            : "border-neutral-200 bg-white text-neutral-500 hover:border-neutral-300"
                    }`}
                    title="Advanced filters"
                >
                    <SlidersHorizontal size={16} />
                </button>
            </div>

            {/* Advanced filters */}
            {showAdvanced && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-neutral-100">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-neutral-500 tracking-wide">Min Price (USD)</label>
                        <input
                            type="number"
                            placeholder="0"
                            value={minPrice ?? ""}
                            onChange={(e) => {
                                const val = e.target.value ? Number(e.target.value) : undefined;
                                setMinPrice(val);
                                handleChange({ minPrice: val });
                            }}
                            className="input"
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-neutral-500 tracking-wide">Max Price (USD)</label>
                        <input
                            type="number"
                            placeholder="10000"
                            value={maxPrice ?? ""}
                            onChange={(e) => {
                                const val = e.target.value ? Number(e.target.value) : undefined;
                                setMaxPrice(val);
                                handleChange({ maxPrice: val });
                            }}
                            className="input"
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-neutral-500 tracking-wide">Min Days</label>
                        <input
                            type="number"
                            placeholder="1"
                            value={minDays ?? ""}
                            onChange={(e) => {
                                const val = e.target.value ? Number(e.target.value) : undefined;
                                setMinDays(val);
                                handleChange({ minDays: val });
                            }}
                            className="input"
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-neutral-500 tracking-wide">Max Days</label>
                        <input
                            type="number"
                            placeholder="30"
                            value={maxDays ?? ""}
                            onChange={(e) => {
                                const val = e.target.value ? Number(e.target.value) : undefined;
                                setMaxDays(val);
                                handleChange({ maxDays: val });
                            }}
                            className="input"
                        />
                    </div>
                </div>
            )}

            {/* Results row */}
            <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-neutral-400 uppercase tracking-wide">
                    {totalResults ?? 0} package{totalResults !== 1 ? "s" : ""} found
                </p>
                {hasActiveFilters && (
                    <button
                        type="button"
                        onClick={handleClearAll}
                        className="flex items-center gap-1 text-xs font-bold text-primary-600 hover:text-primary-700 transition-colors cursor-pointer"
                    >
                        <X size={12} />
                        Clear filters
                    </button>
                )}
            </div>
        </div>
    );
}