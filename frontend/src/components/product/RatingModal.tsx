"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import StarRating from "../Rating";
import { useSnackbar } from "@/components/context/SnackbarContext";

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, feedback: string) => void;
  productId?: number;
}

const RatingModal = ({ isOpen, onClose, onSubmit, productId }: RatingModalProps) => {
  console.log(productId);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const { openSnackbar } = useSnackbar(); 
  

  const handleSubmit = () => {
    if (rating === 0) {
      openSnackbar("Please select a rating", "error");
      return;
    }
    
    onSubmit(rating, feedback);
    setRating(0);
    setFeedback("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Rate this product</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-3">
            <span className="text-gray-600">Rating:</span>
            <StarRating
              initialRating={rating}
              onChange={(newRating) => setRating(newRating)}
            />
          </div>
          <div className="grid gap-2">
            <Textarea
              placeholder="Share your experience with this product..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RatingModal;
