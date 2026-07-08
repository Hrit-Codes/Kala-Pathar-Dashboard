"use client"
import PageHeader from "@/src/components/layout/PageHeader";
import Pagination from "@/src/components/ui/Pagination";
import { ChevronDown, Search, SlidersHorizontal, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const DESTINATIONS = ["All Regions", "Everest", "Annapurna", "Manaslu", "Langtang", "Mustang"];
const DIFFICULTIES = ["All Levels", "Easy", "Moderate", "Hard", "Extreme"];
const FEATURED_OPTIONS = ["All Status", "Featured", "Not Featured"];

const mockPackages = [
    {
        _id: "1",
        title: "Everest Base Camp Luxury Trek",
        slug: "everest-base-camp-trek",
        badge: "Best Seller",
        thumbnail: "",
        price: 2450,
        currency: "USD",
        priceLabel: "per person",
        durationDays: 14,
        difficulty: "Hard",
        isFeatured: true,
        isActive: true,
        views: 2840,
        destination: "Solu-Khumbu, Nepal",
        groupSize: 12,
    },
    {
        _id: "2",
        title: "Annapurna Circuit Ultimate",
        slug: "annapurna-circuit",
        badge: "Popular",
        thumbnail: "",
        price: 1890,
        currency: "USD",
        priceLabel: "per person",
        durationDays: 18,
        difficulty: "Moderate",
        isFeatured: true,
        isActive: true,
        views: 1920,
        destination: "Annapurna Region",
        groupSize: 10,
    },
    {
        _id: "3",
        title: "Manaslu Circuit Off-Path",
        slug: "manaslu-circuit",
        badge: null,
        thumbnail: "",
        price: 2100,
        currency: "USD",
        priceLabel: "per person",
        durationDays: 16,
        difficulty: "Hard",
        isFeatured: false,
        isActive: true,
        views: 980,
        destination: "Manaslu Region",
        groupSize: 8,
    },
    {
        _id: "4",
        title: "Langtang Valley Trek",
        slug: "langtang-valley",
        badge: "New",
        thumbnail: "",
        price: 850,
        currency: "USD",
        priceLabel: "per person",
        durationDays: 10,
        difficulty: "Easy",
        isFeatured: false,
        isActive: false,
        views: 540,
        destination: "Langtang Region",
        groupSize: 15,
    },
];

export default function PackagesPage() {
    const router=useRouter();
    const [search, setSearch] = useState("");
    const [destination, setDestination] = useState("All Regions");
    const [difficulty, setDifficulty] = useState("All Levels");
    const [featured, setFeatured] = useState("All Status");
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const filtered = mockPackages.filter((pkg) => {
        const matchSearch =
            !search ||
            pkg.title.toLowerCase().includes(search.toLowerCase()) ||
            pkg.destination.toLowerCase().includes(search.toLowerCase());
        const matchDest = destination === "All Regions" || pkg.destination.includes(destination);
        const matchDiff = difficulty === "All Levels" || pkg.difficulty === difficulty;
        const matchFeat =
            featured === "All Status" ||
            (featured === "Featured" && pkg.isFeatured) ||
            (featured === "Not Featured" && !pkg.isFeatured);
        return matchSearch && matchDest && matchDiff && matchFeat;
    });

    // Pagination
    const limit = 10;
    const totalPages = Math.ceil(filtered.length / limit);
    const start = (currentPage - 1) * limit;
    const paginatedData = filtered.slice(start, start + limit);

    const getDifficultyBadge = (diff: string) => {
        const map: Record<string, string> = {
            Easy: "badge-success",
            Moderate: "badge-warning",
            Hard: "badge-danger",
            Extreme: "badge-danger",
        };
        return map[diff] || "badge-neutral";
    };

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((word) => word[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="w-full min-h-screen flex flex-col gap-6">
            <div className="w-full flex justify-between items-center">
                <PageHeader
                    heading="Expedition Packages"
                    subheading="Manage, edit, create high-altitude mountaineering experiences"
                />
                <button type="button" onClick={()=>router.push("/dashboard/packages/new")} className="btn-primary whitespace-nowrap">
                    Add Package
                </button>
            </div>

            {/* Filter Bar */}
            <div className="card p-4 flex flex-col gap-4">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
                    {/* Search */}
                    <div className="relative flex-1 min-w-0">
                        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by title or destination..."
                            className="input pl-10 w-full"
                        />
                    </div>

                    {/* Destination */}
                    <div className="relative">
                        <select
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            className="input pr-9 appearance-none cursor-pointer min-w-[160px]"
                        >
                            {DESTINATIONS.map((d) => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                    </div>

                    {/* Difficulty */}
                    <div className="relative">
                        <select
                            value={difficulty}
                            onChange={(e) => setDifficulty(e.target.value)}
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
                            value={featured}
                            onChange={(e) => setFeatured(e.target.value)}
                            className="input pr-9 appearance-none cursor-pointer min-w-[140px]"
                        >
                            {FEATURED_OPTIONS.map((f) => (
                                <option key={f} value={f}>{f}</option>
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

                {/* Advanced Filters */}
                {showAdvanced && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-neutral-100">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-neutral-500 tracking-wide">Min Price (USD)</label>
                            <input type="number" placeholder="0" className="input" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-neutral-500 tracking-wide">Max Price (USD)</label>
                            <input type="number" placeholder="10000" className="input" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-neutral-500 tracking-wide">Min Days</label>
                            <input type="number" placeholder="1" className="input" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-neutral-500 tracking-wide">Max Days</label>
                            <input type="number" placeholder="30" className="input" />
                        </div>
                    </div>
                )}

                {/* Result count */}
                <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-neutral-400 uppercase tracking-wide">
                        Showing {start + 1} - {Math.min(start + limit, filtered.length)} of {filtered.length} packages
                    </p>
                    {(search || destination !== "All Regions" || difficulty !== "All Levels" || featured !== "All Status") && (
                        <button
                            type="button"
                            onClick={() => {
                                setSearch("");
                                setDestination("All Regions");
                                setDifficulty("All Levels");
                                setFeatured("All Status");
                            }}
                            className="text-xs font-bold text-primary-600 hover:text-primary-700 transition-colors cursor-pointer"
                        >
                            Clear filters
                        </button>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className="card overflow-hidden">
                <table className="w-full border-collapse text-left">
                    <thead>
                        <tr className="bg-neutral-50 border-b border-neutral-100 text-xs font-bold tracking-wider text-neutral-500 uppercase">
                            <th className="py-3 px-6">Package</th>
                            <th className="py-3 px-6">Destination</th>
                            <th className="py-3 px-6">Price (USD)</th>
                            <th className="py-3 px-6">Duration</th>
                            <th className="py-3 px-6">Status</th>
                            <th className="py-3 px-6">Featured</th>
                            <th className="py-3 px-6 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 text-sm">
                        {isLoading && (
                            <tr>
                                <td colSpan={7} className="py-8 text-center text-neutral-500">
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
                                        Loading packages...
                                    </div>
                                </td>
                            </tr>
                        )}

                        {!isLoading && paginatedData.length === 0 && (
                            <tr>
                                <td colSpan={7} className="py-12 text-center text-neutral-500">
                                    <div className="flex flex-col items-center gap-2">
                                        <Search size={32} className="text-neutral-300" />
                                        <p className="font-medium">No packages found</p>
                                        <p className="text-xs">Try adjusting your filters</p>
                                    </div>
                                </td>
                            </tr>
                        )}

                        {!isLoading &&
                            paginatedData.map((pkg) => (
                                <tr key={pkg._id} className="hover:bg-neutral-50/50 transition-colors group">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-lg bg-secondary-50 flex items-center justify-center font-bold text-xs shrink-0 border border-neutral-100">
                                                {pkg.thumbnail ? (
                                                    <Image src={pkg.thumbnail} alt={pkg.title} width={40} height={40} className="rounded-lg object-cover" />
                                                ) : (
                                                    <span className="text-neutral-400 font-bold text-xs">
                                                        {getInitials(pkg.title)}
                                                    </span>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-bold text-neutral-900 text-sm line-clamp-1">{pkg.title}</p>
                                                <p className="text-xs text-neutral-400">
                                                    {pkg.difficulty} · {pkg.groupSize} max
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-neutral-600 font-medium">{pkg.destination}</td>
                                    <td className="py-4 px-6">
                                        <div>
                                            <p className="font-bold text-neutral-900">${pkg.price.toLocaleString()}</p>
                                            <p className="text-[10px] text-neutral-400 uppercase">{pkg.priceLabel}</p>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-1">
                                            <span className="font-semibold text-neutral-900">{pkg.durationDays}</span>
                                            <span className="text-xs text-neutral-400">days</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={pkg.isActive ? "badge-success" : "badge"}>
                                            {pkg.isActive ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                            <span className={pkg.isFeatured?"badge-success":"badge"}>
                                                {pkg.isFeatured?"Featured":"Standard"}
                                            </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center justify-center gap-1">
                                            <button
                                                className="p-2 rounded-lg hover:bg-neutral-100 transition-colors text-neutral-400 hover:text-blue-600"
                                                title="Edit package"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                className="p-2 rounded-lg hover:bg-neutral-100 transition-colors text-neutral-400 hover:text-red-600"
                                                title="Delete package"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                    <tfoot className="bg-neutral-50/40 border-t border-neutral-100">
                        <tr>
                            <td colSpan={7} className="px-6 py-4">
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
                                    <p className="text-sm font-medium text-neutral-600">
                                        Showing{" "}
                                        <span className="font-semibold text-neutral-900">
                                            {filtered.length > 0 ? start + 1 : 0}
                                        </span>{" "}
                                        to{" "}
                                        <span className="font-semibold text-neutral-900">
                                            {Math.min(start + limit, filtered.length)}
                                        </span>{" "}
                                        of{" "}
                                        <span className="font-semibold text-neutral-900">
                                            {filtered.length}
                                        </span>{" "}
                                        packages
                                    </p>

                                    {totalPages > 1 && (
                                        <Pagination
                                            currentPage={currentPage}
                                            totalPages={totalPages}
                                            onPageChange={setCurrentPage}
                                        />
                                    )}
                                </div>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
}