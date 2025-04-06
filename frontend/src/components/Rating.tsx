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
  readonly = false 
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
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    className={`cursor-pointer ${
                        star <= (hover || rating) 
                            ? "fill-yellow-400 text-yellow-400" 
                            : "text-gray-300"
                    }`}
                    onMouseEnter={() => !readonly && setHover(star)}
                    onMouseLeave={() => !readonly && setHover(0)}
                    onClick={() => handleRating(star)}
                />
            ))}
        </div>
    );
}

export default StarRating;