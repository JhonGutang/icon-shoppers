import { Star } from "lucide-react";
import { useState } from "react";

interface StarRatingProps {
  initialRating?: number;
  onChange?: (rating: number) => void;
  readonly?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({
  initialRating = 0,
  onChange,
  readonly = false,
}) => {
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState(0);

  const handleRating = (value: number) => {
    if (readonly) return;
    setRating(value);
    onChange?.(value);
  };

  return (
    <div className="w-full flex lg:gap-2">
      {[1, 2, 3, 4, 5].map((star) => {
        const isActive = star <= (hover || rating);
        return (
          <Star
            key={star}
            size={24}
            fill={isActive ? "#facc15" : "none"}
            stroke={isActive ? "#facc15" : "#d1d5db"}
            strokeWidth={2}
            className={`cursor-pointer transition-colors duration-150 ${
              readonly ? "pointer-events-none" : ""
            }`}
            onMouseEnter={() => !readonly && setHover(star)}
            onMouseLeave={() => !readonly && setHover(0)}
            onClick={() => handleRating(star)}
          />
        );
      })}
    </div>
  );
};

export default StarRating;
