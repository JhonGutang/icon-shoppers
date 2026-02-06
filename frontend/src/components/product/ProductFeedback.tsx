import React from "react";
import { useProductRatings } from "@/hooks/product/useProductRating";
import StarRating from "./StarRating";
import RatingDialog from "./RatingDialog";
import { Button } from "@/components/shared/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/shared/ui/avatar";
import { MessageSquare, Star } from "lucide-react";
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
      <Skeleton className="h-8 w-48" />
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    </div>;
  }

  return (
    <section className="mt-16 border-t pt-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            Customer Feedback <span className="text-muted-foreground text-lg font-medium">({total})</span>
          </h2>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1 text-yellow-500">
              <Star size={24} fill="currentColor" />
              <span className="text-3xl font-bold text-foreground">{average}</span>
            </div>
            <p className="text-muted-foreground">Based on local customer reviews</p>
          </div>
        </div>

        <RatingDialog
          productId={productId}
          productName={productName}
          trigger={
            <Button className="rounded-full px-8 shadow-md hover:shadow-lg transition-all">
              Write a Review
            </Button>
          }
        />
      </div>

      <div className="grid gap-6">
        {ratings.length > 0 ? (
          ratings.map((rating: any) => (
            <div key={rating.id} className="bg-muted/30 p-6 rounded-2xl border border-border/50">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border border-border">
                    <AvatarImage src={rating.user?.avatar} />
                    <AvatarFallback className="bg-primary/10 text-primary uppercase font-bold text-xs">
                      {rating.user?.name?.substring(0, 2) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-bold text-sm">{rating.user?.name || "Anonymous"}</h4>
                    <p className="text-xs text-muted-foreground">Verified Buyer</p>
                  </div>
                </div>
                <div className="text-right">
                  <StarRating rating={rating.rating} size={14} />
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {new Date(rating.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              {rating.feedback && (
                <div className="mt-4 flex gap-3">
                  <MessageSquare size={16} className="text-muted-foreground flex-shrink-0 mt-1" />
                  <p className="text-sm text-foreground leading-relaxed">
                    {rating.feedback}
                  </p>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center bg-muted/20 rounded-3xl border border-dashed">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <Star className="text-muted-foreground" size={24} />
            </div>
            <h3 className="font-bold text-lg">No reviews yet</h3>
            <p className="text-muted-foreground max-w-xs mt-1">
              Be the first to share your thoughts on this product with the community.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductFeedback;
