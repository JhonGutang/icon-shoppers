import { Button } from "@/components/shared/ui/button";
import { Check, Clock3, Package, PlayCircle, Truck, X } from "lucide-react";

interface StatusButtonsProps {
  onStatusUpdate?: (status: string) => void;
  status?: string;
  isCustomer?: boolean;
}

export function StatusButtons({
  onStatusUpdate,
  status,
  isCustomer = false,
}: StatusButtonsProps) {
  const currentStatus = status?.toLowerCase();

  const handleUpdate = (newStatus: string) => {
    if (onStatusUpdate) onStatusUpdate(newStatus);
  };

  if (isCustomer) {
    if (currentStatus === "delivering" || currentStatus === "shipped") {
      return (
        <Button
          variant="default"
          onClick={() => handleUpdate("received")}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <Package className="mr-1 h-4 w-4" />
          Mark as Received
        </Button>
      );
    }
    return null;
  }

  // Merchant Actions
  switch (currentStatus) {
    case "ordered":
    case "pending":
      return (
        <div className="flex gap-2">
          <Button
            variant="default"
            onClick={() => handleUpdate("approved")}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <PlayCircle className="mr-1 h-4 w-4" />
            Approve
          </Button>
          <Button
            variant="destructive"
            onClick={() => handleUpdate("rejected")}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <X className="mr-1 h-4 w-4" />
            Reject
          </Button>
        </div>
      );
    case "approved":
      return (
        <Button
          variant="default"
          onClick={() => handleUpdate("processing")}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <PlayCircle className="mr-1 h-4 w-4" />
          Process
        </Button>
      );
    case "processing":
      return (
        <Button
          variant="default"
          onClick={() => handleUpdate("delivering")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          <Truck className="mr-1 h-4 w-4" />
          Ship Order
        </Button>
      );
    case "delivering":
    case "shipped":
      return (
        <div className="flex items-center gap-2">
          <Button
            variant="default"
            size="sm"
            onClick={() => handleUpdate("delivered")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <Truck className="mr-1 h-3 w-3" />
            Mark as Delivered
          </Button>
        </div>
      );
    case "delivered":
      return (
        <div className="flex items-center gap-1 px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-md font-medium">
          <Clock3 className="h-4 w-4" />
          <span>Waiting for Confirmation</span>
        </div>
      );
    case "received":
    case "completed":
      return (
        <div className="flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-md font-medium">
          <Check className="h-4 w-4" />
          <span>Completed</span>
        </div>
      );
    case "rejected":
    case "cancelled":
      return (
        <div className="flex items-center justify-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-md font-medium">
          <X className="h-4 w-4" />
          <span>Rejected / Cancelled</span>
        </div>
      );
    default:
      return null;
  }
}
