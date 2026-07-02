import PageHeader from "@/src/components/layout/PageHeader";
import { DASHBOARD_STATS, RECENT_INQUIRIES } from "@/src/lib/constants";
import { ImageIcon, PlusCircle, Users, Zap } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="w-full min-h-screen flex flex-col gap-5">
        <PageHeader heading="Welcome back, Admin" subheading="Here is what's been happening with Himalayan Elite today"/>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {DASHBOARD_STATS.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card p-6 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className={`p-2.5 rounded-xl ${stat.iconBg}`}>
                  <Icon size={20} />
                </div>
              </div>

              <div className="mt-6">
                <p className="stat-label">{stat.title}</p>
                <h3 className="text-neutral-900 mt-1.5 tracking-tight">{stat.value}</h3>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Recent Inquiries */}
        <div className="card lg:col-span-2 overflow-hidden">
          <div className="p-6 flex items-center justify-between border-b border-neutral-100">
            <h4 className="card-title">Recent Inquiries</h4>
            <button className="text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors cursor-pointer">
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-100 text-xs font-bold tracking-wider text-neutral-500 uppercase">
                  <th className="py-3 px-6">Full Name</th>
                  <th className="py-3 px-6">Subject</th>
                  <th className="py-3 px-6 text-center">Status</th>
                  <th className="py-3 px-6">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-sm">
                {RECENT_INQUIRIES.map((row) => (
                  <tr key={row.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="py-4 px-6 flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-secondary-50 flex items-center justify-center font-bold text-xs shrink-0">
                        {row.initials}
                      </div>
                      <span className="font-bold text-neutral-900 whitespace-nowrap">{row.name}</span>
                    </td>
                    <td className="py-4 px-6 text-description max-w-[220px] font-medium">
                      {row.subject}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={row.status === "PENDING" ? "badge-pending" : "badge-success"}>
                        {row.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-neutral-500 font-medium whitespace-nowrap">
                      {row.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col gap-6">
          <div className="card p-4 flex flex-col gap-4">
            <div className="p-2 flex items-center gap-2">
              <Zap size={20} className="text-primary-700" />
              <h4 className="card-title">Quick Actions</h4>
            </div>

            <button className="btn-quick-action">
              <PlusCircle size={20} className="text-neutral-900" />
              <span className="text-sm font-semibold text-neutral-900">Create New Package</span>
            </button>

            <button className="btn-quick-action">
              <ImageIcon size={20} className="text-neutral-900" />
              <span className="text-sm font-semibold text-neutral-900">Add Gallery Image</span>
            </button>

            <button className="btn-quick-action">
              <Users size={20} className="text-neutral-900" />
              <span className="text-sm font-semibold text-neutral-900">Manage Company Info</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}