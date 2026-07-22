"use client";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Mountain,
  Image as ImageIcon,
  X,
  Menu
} from 'lucide-react';
import { menuItems } from '@/src/lib/constants';
import { useEffect, useState } from 'react';
import { logout } from '@/src/lib/api/auth';
import { toast } from 'sonner';

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen]=useState(false);
  const [isLoggingOut, setIsLoggingOut]=useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(()=>{
    setSidebarOpen(false)
  },[pathname]);

  const handleLogout=async()=>{
    setIsLoggingOut(true);
    try{
      await logout();
      localStorage.removeItem("access_token");
      router.push("/login");
    }catch(error:any){
      const message= error.response?.data?.message || "Failed to logout. Please try again.";
      toast.error(message);
    }finally{
      setIsLoggingOut(false);
    }
  }

  return (
    <div className='w-screen h-full'>
      <div className='lg:hidden fixed top-4 left-4 z-50'>
        <button
          onClick={()=>setSidebarOpen(!sidebarOpen)}
          className='p-2 bg-white rounded-lg shadow-lg border border-gray-200 text-gray-600 hover:text-gray-900'
        >
          {sidebarOpen?(
            <X className='w-6 h-6'/>
          ):(
            <Menu className='w-6 h-6'/>
          )}
        </button>
      </div>

      {/* Backdrop overlay - only visible on mobile when sidebar is open */}
      {sidebarOpen && (
        <div 
          className='fixed inset-0 bg-black/50 z-40 lg:hidden'
          onClick={()=>setSidebarOpen(false)}
          />
      )}
      <aside className={`fixed top-0 left-0 h-full w-[280px] bg-[#091124] border-r border-white/5 flex flex-col justify-between text-neutral-400 z-50 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}>
        
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
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-semibold tracking-wide transition-all group duration-300 w-full hover:text-white hover:bg-white/[0.02] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </aside>
    </div>
  );
}