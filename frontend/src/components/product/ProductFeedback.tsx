import React from "react";
import { useProductRatings } from "@/hooks/product/useProductRating";
import StarRating from "./StarRating";
import RatingDialog from "./RatingDialog";
import { Button } from "@/components/shared/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/shared/ui/avatar";
import { MessageSquare, Star, Sparkles } from "lucide-react";
import { Skeleton } from "@/components/shared/ui/skeleton";

interface ProductFeedbackProps {
  productId: number;
  productName: string;
}

const ProductFeedback: React.FC<ProductFeedbackProps> = ({
  productId,
  productName,
}) => {
  const { data, isLoading, isError } = useProductRatings(productId);

  const ratings = data?.ratings || [];
  const total = data?.total || 0;
  const average = data?.average || 0;

  if (isLoading) {
    return <div className="space-y-4">
      <Skeleton className="h-8 w-48 rounded-full" />
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 w-full rounded-2xl" />
        ))}
      </div>
    </div>;
  }

  return (
    <section className="w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white shadow-sm border border-stone-100">
                <Star size={12} className="fill-[#0E6835] text-[#0E6835]" />
                <span className="text-xl font-black text-stone-900 tracking-tighter">{average}</span>
            </div>
            <span className="text-stone-400 text-[8px] font-black uppercase tracking-widest mt-1">Scale of 5.0</span>
          </div>
        </div>

        <RatingDialog
          productId={productId}
          productName={productName}
          trigger={
            <Button className="rounded-full h-10 px-8 bg-stone-900 text-white hover:bg-stone-800 font-black uppercase tracking-widest text-[9px] shadow-md transition-all">
              Add Your Note
            </Button>
          }
        />
      </div>

      <div className="space-y-6">
        {ratings.length > 0 ? (
          ratings.map((rating: any) => (
            <div key={rating.id} className="relative p-5 md:p-6 rounded-2xl bg-white group transition-all duration-300">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border border-stone-100 shadow-sm">
                    <AvatarImage src={rating.user?.avatar} />
                    <AvatarFallback className="bg-stone-50 text-stone-500 uppercase font-black text-[10px]">
                      {rating.user?.name?.substring(0, 2) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-black text-stone-900 text-sm tracking-tight leading-none mb-1.5">{rating.user?.name || "Anonymous"}</h4>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-sm bg-[#0E6835]/5 text-[#0E6835] text-[7px] font-black uppercase tracking-wider">
                        <Sparkles size={8} className="fill-[#0E6835]" />
                        Member
                      </div>
                      <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">
                        {new Date(rating.created_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center px-2 py-1 rounded-full bg-stone-50 border border-stone-100/50">
                  <StarRating rating={rating.rating} size={10} />
                </div>
              </div>
              
              {rating.feedback && (
                <div className="mt-4">
                  <p className="text-stone-600 leading-relaxed font-light text-sm tracking-tight italic">
                    &quot;{rating.feedback}&quot;
                  </p>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-stone-100/30 rounded-[3rem] border border-dashed border-stone-300">
            <div className="h-16 w-16 rounded-3xl bg-white flex items-center justify-center mb-6 shadow-sm border border-stone-100">
              <MessageSquare className="text-stone-300" size={32} />
            </div>
            <h3 className="font-black text-stone-900 text-xl tracking-tight">No stories yet</h3>
            <p className="text-stone-500 max-w-xs mt-2 font-light">
              Be the first to share your experience with this local creation.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductFeedback;
