"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Mountain, 
  Map, 
  MessageSquare, 
  Image as ImageIcon,  
  Settings, 
  Building2,
  FileText
} from 'lucide-react';

const menuItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Packages', href: '/dashboard/packages', icon: Mountain },
  { name: 'Categories & Destinations', href: '/dashboard/categories&destinations', icon: Map },
  { name: 'Inquiries', href: '/dashboard/inquiries', icon: MessageSquare },
  { name: 'Gallery', href: '/dashboard/gallery', icon: ImageIcon },
  { name: 'Company Info', href: '/dashboard/companyinfo', icon: Building2 },
  { name: "Content Management", href:"/dashboard/contentManagement",icon:FileText},
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed top-0 left-0 h-full w-[280px] bg-[#091124] border-r border-white/5 flex flex-col justify-between text-neutral-400 z-50">
      
      {/* Brand Header */}
      <div>
        <div className="p-6 border-b border-white/5 flex items-center gap-4">
          <div className="h-10 w-10 bg-[#059669] rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-900/30">
            <Mountain size={20} className="fill-white/10" />
          </div>
          <div>
            <h2 className="text-white font-bold tracking-wide leading-tight text-sm sm:text-base">Admin Panel</h2>
            <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-semibold">Himalayan Modernist</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-semibold tracking-wide transition-all group duration-300 ${
                  isActive 
                    ? "text-white bg-white/5 font-bold" 
                    : "hover:text-white hover:bg-white/[0.02]"
                }`}
              >
                {/* Active Indicator Bar */}
                {isActive && (
                  <span className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-[#10B981] rounded-r-md" />
                )}
                
                <Icon 
                  size={20} 
                  className={`transition-colors duration-300 ${
                    isActive ? "text-[#10B981]" : "text-neutral-500 group-hover:text-neutral-300"
                  }`} 
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / Settings Section */}
      <div className="p-4 border-t border-white/5">
        <Link
          href="/dashboard/settings"
          className={`flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-semibold tracking-wide transition-all group duration-300 ${
            pathname === '/dashboard/settings' 
              ? "text-white bg-white/5 font-bold" 
              : "hover:text-white hover:bg-white/[0.02]"
          }`}
        >
          <Settings 
            size={20} 
            className={`transition-colors duration-300 ${
              pathname === '/dashboard/settings' ? "text-[#10B981]" : "text-neutral-500 group-hover:text-neutral-300"
            }`} 
          />
          <span>Settings</span>
        </Link>
      </div>
    </aside>
  );
}