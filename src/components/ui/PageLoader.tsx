import { Loader2 } from "lucide-react";

export const PageLoader = () => {
  return (
    <div className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center">
      <div className="relative">
        {/* Animated logo or loader */}
        <div className="text-4xl font-bold text-transparent bg-gradient-to-r from-primary-400 to-secondary-500 bg-clip-text animate-pulse">
          Kala Pathar
        </div>
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
          <Loader2 className="w-6 h-6 text-primary-400 animate-spin" />
        </div>
      </div>
    </div>
  );
};