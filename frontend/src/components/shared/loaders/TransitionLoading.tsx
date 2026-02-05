"use client";

import React from "react";
import { Loader2 } from "lucide-react";

interface TransitionLoadingProps {
  message?: string;
}

const TransitionLoading: React.FC<TransitionLoadingProps> = ({ 
  message = "Switching accounts..." 
}) => {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/80 backdrop-blur-md">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-4 border-green-100 border-t-green-600 animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-6 w-6 text-green-600 animate-pulse" />
          </div>
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900">{message}</h2>
          <p className="text-sm text-gray-500 mt-1 italic">Please wait for a moment</p>
        </div>
      </div>
    </div>
  );
};

export default TransitionLoading;
