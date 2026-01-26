import { Button } from "@/components/ui/button"
import { Check, X, Truck, Package, PlayCircle } from "lucide-react"

interface StatusButtonsProps {
  onStatusUpdate?: (status: string) => void
  status?: string
  isCustomer?: boolean
}

export function StatusButtons({ onStatusUpdate, status, isCustomer = false }: StatusButtonsProps) {
  const currentStatus = status?.toUpperCase();

  const handleUpdate = (newStatus: string) => {
    if (onStatusUpdate) onStatusUpdate(newStatus);
  };

  if (isCustomer) {
    if (currentStatus === 'SHIPPED') {
      return (
        <Button 
          variant="default" 
          onClick={() => handleUpdate('DELIVERED')}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <Package className="mr-1 h-4 w-4" />
          Mark as Received
        </Button>
      )
    }
    return null;
  }

  // Merchant Actions
  switch (currentStatus) {
    case 'PENDING':
      return (
        <div className="flex gap-2">
          <Button 
            variant="default" 
            onClick={() => handleUpdate('PROCESSING')}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <PlayCircle className="mr-1 h-4 w-4" />
            Process
          </Button>
          <Button 
            variant="destructive" 
            onClick={() => handleUpdate('CANCELLED')}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <X className="mr-1 h-4 w-4" />
            Reject
          </Button>
        </div>
      );
    case 'PROCESSING':
      return (
        <Button 
          variant="default" 
          onClick={() => handleUpdate('SHIPPED')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          <Truck className="mr-1 h-4 w-4" />
          Ship Order
        </Button>
      );
    case 'SHIPPED':
      return (
        <div className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-md font-medium">
          <Truck className="h-4 w-4" />
          <span>In Transit</span>
        </div>
      );
    case 'DELIVERED':
      return (
        <div className="flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-md font-medium">
          <Check className="h-4 w-4" />
          <span>Completed</span>
        </div>
      );
    case 'CANCELLED':
      return (
        <div className="flex items-center justify-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-md font-medium">
          <X className="h-4 w-4" />
          <span>Cancelled</span>
        </div>
      );
    default:
      return null;
  }
}
