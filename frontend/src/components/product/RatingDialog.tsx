import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/shared/ui/dialog";
import { Button } from "@/components/shared/ui/button";
import { Textarea } from "@/components/shared/ui/textarea";
import StarRating from "./StarRating";
import { useRateProductMutation } from "@/hooks/product/useProductRating";

interface RatingDialogProps {
  productId: number;
  productName: string;
  trigger?: React.ReactNode;
}

const RatingDialog: React.FC<RatingDialogProps> = ({
  productId,
  productName,
  trigger,
}) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [open, setOpen] = useState(false);
  const rateMutation = useRateProductMutation();

  const handleSubmit = async () => {
    if (rating === 0) return;
    
    rateMutation.mutate(
      { productId, rating, feedback },
      {
        onSuccess: () => {
          setOpen(false);
          setRating(0);
          setFeedback("");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button>Rate Product</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Rate {productName}</DialogTitle>
          <DialogDescription>
            Share your experience with this product. Your feedback helps others make better choices.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="flex flex-col items-center justify-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Your Rating</span>
            <StarRating
              rating={rating}
              onRatingChange={setRating}
              interactive
              size={32}
            />
          </div>
          <div className="grid gap-2">
            <span className="text-sm font-medium text-muted-foreground">Your Feedback</span>
            <Textarea
              placeholder="Tell us what you like or dislike about this product..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="resize-none min-h-[120px]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={rating === 0 || rateMutation.isPending}
            className="w-full"
          >
            {rateMutation.isPending ? "Submitting..." : "Submit Review"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RatingDialog;
