import React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: number;
  className?: string;
  onRatingChange?: (rating: number) => void;
  interactive?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 5,
  size = 18,
  className,
  onRatingChange,
  interactive = false,
}) => {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {Array.from({ length: maxRating }).map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= rating;

        return (
          <Star
            key={index}
            size={size}
            className={cn(
              "transition-all duration-200",
              isFilled 
                ? "text-yellow-500 fill-yellow-500" 
                : "text-muted-foreground/30 fill-none stroke-[1.5px]",
              interactive ? "cursor-pointer hover:text-yellow-400 hover:scale-110 active:scale-95 translate-y-[-1px]" : ""
            )}
            onClick={() => interactive && onRatingChange?.(starValue)}
          />
        );
      })}
    </div>
  );
};

export default StarRating;
