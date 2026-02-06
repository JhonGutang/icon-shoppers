"use client";

import React from "react";
import { Card } from "@/components/shared/ui/card";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface BaseCardProps {
  image: string;
  imageAlt: string;
  badges?: React.ReactNode;
  actions?: React.ReactNode;
  info: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  imageContainerClassName?: string;
  imageClassName?: string;
  aspectRatio?: string;
  showQuickView?: boolean;
  isGrayscale?: boolean;
}

const BaseCard: React.FC<BaseCardProps> = ({
  image,
  imageAlt,
  badges,
  actions,
  info,
  footer,
  className,
  imageContainerClassName,
  imageClassName,
  aspectRatio = "aspect-[4/5]",
  showQuickView = true,
  isGrayscale = false,
}) => {
  return (
    <Card
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-[1.25rem] border-0 bg-white p-1 transition-all duration-500 hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)]",
        className,
        isGrayscale && "opacity-75 grayscale-[0.5]"
      )}
    >
      {/* Image Wrapper */}
      <div 
        className={cn(
          "relative w-full overflow-hidden rounded-[1rem] bg-stone-100", 
          aspectRatio,
          imageContainerClassName
        )}
      >
        <img
          src={image}
          alt={imageAlt}
          className={cn(
            "h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110",
            imageClassName
          )}
        />

        {/* Dynamic Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        
        {/* Top Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {badges}
        </div>

        {/* Action Overlays */}
        <div className="absolute right-3 top-3 flex flex-col gap-2 translate-x-12 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100">
          {actions}
        </div>

        {/* Quick View Icon */}
        {showQuickView && (
          <div className="absolute bottom-3 right-3 translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#0E6835] text-white shadow-xl shadow-green-900/30">
              <ArrowUpRight size={18} />
            </div>
          </div>
        )}
      </div>

      {/* Information Section */}
      <div className="flex flex-1 flex-col p-2">
        {info}
        {footer && <div className="mt-auto pt-2">{footer}</div>}
      </div>
    </Card>
  );
};

export default BaseCard;
