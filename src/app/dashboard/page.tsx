import Image from "next/image";
import Link from "next/link";
import { Edit, PlusCircle, ImageIcon, Users, Zap, Search, Eye, Mail, PackageIcon } from "lucide-react";
import PageHeader from "@/src/components/layout/PageHeader";
import { DashboardAnalyticsData, getAnalytics, getTopPackages, TopPackage } from "@/src/lib/api/analytics";

export default async function DashboardPage() {
  const packagesResponse = await getTopPackages();
  const topPackages: TopPackage[] = packagesResponse?.data || [];
  const analyticsResponse=await getAnalytics();
  const defaultStats: DashboardAnalyticsData = {
    inquiries: {
      thisMonth: 0,
      lastMonth: 0,
      total: 0,
      pending: 0,
      percentageChange: 0,
      trend: "up",
    },
    views: {
      thisMonth: 0,
      lastMonth: 0,
      total: 0,
      percentageChange: 0,
      trend: "up",
    },
    subscribers: {
      thisMonth: 0,
      lastMonth: 0,
      total: 0,
      active: 0,
      percentageChange: 0,
      trend: "up",
    },
    packages: {
      total: 0,
      active: 0,
      inactive: 0,
    },
    generatedAt: new Date().toISOString(),
  };
  const stats:DashboardAnalyticsData=analyticsResponse?.data || defaultStats 

  return (
    <div className="w-full min-h-screen flex flex-col gap-5">
      <PageHeader 
        heading="Welcome back, Admin" 
        subheading="Here is what's been happening with Kala Pathar Expeditions today"
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Views Card */}
        <div className="card p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-blue-50">
              <Eye size={20} className="text-blue-600" />
            </div>
            {stats.views.percentageChange !== 0 && (
              <span className={`text-xs font-semibold ${stats.views.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                {stats.views.trend === "up" ? "↑" : "↓"} {Math.abs(stats.views.percentageChange)}%
              </span>
            )}
          </div>
          <div className="mt-6">
            <p className="stat-label">Page Views</p>
            <div className="flex items-baseline gap-2 mt-1">
              <h3 className="text-2xl font-bold text-neutral-900 tracking-tight">
                {stats.views.thisMonth.toLocaleString()}
              </h3>
              <span className="text-xs text-neutral-400">this month</span>
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              vs {stats.views.lastMonth.toLocaleString()} last month
            </p>
          </div>
        </div>

        {/* Inquiries Card */}
        <div className="card p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-emerald-50">
              <Mail size={20} className="text-emerald-600" />
            </div>
            {stats.inquiries.percentageChange !== 0 && (
              <span className={`text-xs font-semibold ${stats.inquiries.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                {stats.inquiries.trend === "up" ? "↑" : "↓"} {Math.abs(stats.inquiries.percentageChange)}%
              </span>
            )}
          </div>
          <div className="mt-6">
            <p className="stat-label">Inquiries</p>
            <div className="flex items-baseline gap-2 mt-1">
              <h3 className="text-2xl font-bold text-neutral-900 tracking-tight">
                {stats.inquiries.thisMonth}
              </h3>
              <span className="text-xs text-neutral-400">this month</span>
            </div>
            <div className="flex items-center gap-3 mt-1">
              <p className="text-xs text-neutral-400">
                vs {stats.inquiries.lastMonth} last month
              </p>
              {stats.inquiries.pending > 0 && (
                <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                  {stats.inquiries.pending} pending
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Subscribers Card */}
        <div className="card p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-purple-50">
              <Users size={20} className="text-purple-600" />
            </div>
            {stats.subscribers.percentageChange !== 0 && (
              <span className={`text-xs font-semibold ${stats.subscribers.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                {stats.subscribers.trend === "up" ? "↑" : "↓"} {Math.abs(stats.subscribers.percentageChange)}%
              </span>
            )}
          </div>
          <div className="mt-6">
            <p className="stat-label">Subscribers</p>
            <div className="flex items-baseline gap-2 mt-1">
              <h3 className="text-2xl font-bold text-neutral-900 tracking-tight">
                {stats.subscribers.total.toLocaleString()}
              </h3>
              <span className="text-xs text-neutral-400">total</span>
            </div>
            <div className="flex items-center gap-3 mt-1">
              <p className="text-xs text-neutral-400">
                +{stats.subscribers.thisMonth} this month
              </p>
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                {stats.subscribers.active} active
              </span>
            </div>
          </div>
        </div>

        {/* Packages Card */}
        <div className="card p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-amber-50">
              <PackageIcon size={20} className="text-amber-600" />
            </div>
          </div>
          <div className="mt-6">
            <p className="stat-label">Packages</p>
            <div className="mt-1 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-600">Total</span>
                <span className="text-lg font-bold text-neutral-900">
                  {stats.packages.total}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-600">Active</span>
                <span className="text-lg font-bold text-emerald-600">
                  {stats.packages.active}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-600">Inactive</span>
                <span className="text-lg font-bold text-neutral-400">
                  {stats.packages.inactive}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Packages Table - Takes 2/3 of the space */}
        <div className="lg:col-span-2 card overflow-hidden">
          <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
            <h4 className="font-semibold text-neutral-900">Top Packages</h4>
            <Link 
              href="/dashboard/packages" 
              className="text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors"
            >
              View All →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-100 text-xs font-bold tracking-wider text-neutral-500 uppercase">
                  <th className="py-3 px-4">Package</th>
                  <th className="py-3 px-4">Destination</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-sm">
                {topPackages.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-neutral-500">
                      <div className="flex flex-col items-center gap-2">
                        <Search size={32} className="text-neutral-300" />
                        <p className="font-medium">No packages found</p>
                        <p className="text-xs text-neutral-400">Create your first package to get started</p>
                      </div>
                    </td>
                  </tr>
                )}

                {topPackages.map((pkg) => (
                  <tr key={pkg._id} className="hover:bg-neutral-50/50 transition-colors group">
                    {/* Package Info */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-neutral-100 flex items-center justify-center shrink-0 overflow-hidden border border-neutral-200">
                          {pkg.thumbnail ? (
                            <Image 
                              src={pkg.thumbnail} 
                              alt={pkg.title} 
                              width={40} 
                              height={40} 
                              className="object-cover"
                            />
                          ) : (
                            <span className="text-xs font-bold text-neutral-400">
                              {pkg.title.charAt(0)}
                            </span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-neutral-900 text-sm truncate max-w-[150px]">
                            {pkg.title}
                          </p>
                          <p className="text-xs text-neutral-400">
                            {pkg.packageType?.name || "Uncategorized"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Destination */}
                    <td className="py-3 px-4">
                      <span className="text-sm text-neutral-600">
                        {pkg.destination?.name || "Not assigned"}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-bold text-neutral-900">
                          ${pkg.price.toLocaleString()}
                        </p>
                        <p className="text-[10px] text-neutral-400 uppercase">
                          {pkg.currency || "USD"}
                        </p>
                      </div>
                    </td>

                    {/* Duration */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-neutral-900">
                          {pkg.durationDays}
                        </span>
                        <span className="text-xs text-neutral-400">days</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <div className="flex flex-col gap-1">
                        {pkg.isFeatured && (
                          <span className="badge bg-amber-50 text-amber-700 border border-amber-200 text-[10px]">
                            Featured
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-1">
                        <Link
                          href={`/dashboard/packages/edit/${pkg._id}`}
                          className="p-2 rounded-lg hover:bg-neutral-100 transition-colors text-neutral-400 hover:text-blue-600"
                          title="Edit package"
                        >
                          <Edit size={16} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {topPackages.length > 0 && (
            <div className="p-4 border-t border-neutral-100">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
                <p className="text-xs text-neutral-400">
                  Showing {topPackages.length} of {topPackages.length} packages
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions - Takes 1/3 of the space */}
        <div className="flex flex-col gap-6">
          <div className="card p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Zap size={20} className="text-primary-700" />
              <h4 className="card-title font-semibold">Quick Actions</h4>
            </div>

            <Link 
              href="/dashboard/packages/new" 
              className="btn-quick-action"
            >
              <PlusCircle size={20} className="text-neutral-900" />
              <span className="text-sm font-semibold text-neutral-900">Create New Package</span>
            </Link>

            <Link 
              href="/dashboard/gallery" 
              className="btn-quick-action"
            >
              <ImageIcon size={20} className="text-neutral-900" />
              <span className="text-sm font-semibold text-neutral-900">View Gallery Items</span>
            </Link>

            <Link 
              href="/dashboard/companyinfo" 
              className="btn-quick-action"
            >
              <Users size={20} className="text-neutral-900" />
              <span className="text-sm font-semibold text-neutral-900">Manage Company Info</span>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}