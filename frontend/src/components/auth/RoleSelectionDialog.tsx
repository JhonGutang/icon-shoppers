"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/shared/ui/dialog";
import { Button } from "@/components/shared/ui/button";
import { ShoppingBag, Store } from "lucide-react";

interface RoleSelectionDialogProps {
  isOpen: boolean;
  onSelect: (role: "customer" | "seller") => void;
}

export const RoleSelectionDialog = ({
  isOpen,
  onSelect,
}: RoleSelectionDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">Choose Your Mode</DialogTitle>
          <DialogDescription className="text-center">
            You own a shop! How would you like to continue today?
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <Button
            variant="outline"
            className="h-24 flex flex-col gap-2 border-2 hover:border-green-600 hover:bg-green-50 transition-all group"
            onClick={() => onSelect("customer")}
          >
            <ShoppingBag className="h-8 w-8 text-green-600 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-lg text-gray-800">Continue as Customer</span>
          </Button>

          <Button
            variant="outline"
            className="h-24 flex flex-col gap-2 border-2 hover:border-green-600 hover:bg-green-50 transition-all group"
            onClick={() => onSelect("seller")}
          >
            <Store className="h-8 w-8 text-green-600 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-lg text-gray-800">Continue as Seller</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
