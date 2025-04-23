import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, X, Truck } from "lucide-react"

interface StatusButtonsProps {
  onApprove?: () => void
  onReject?: () => void
  status?: string
}

export function StatusButtons({ onApprove, onReject, status: initialStatus }: StatusButtonsProps) {
  const [status, setStatus] = useState(initialStatus)

  const handleStartDelivery = () => {
    // Optionally call external logic
    onApprove?.()
    // Then update local UI status
    setStatus("delivering")
  }

  if (status === 'delivering') {
    return (
      <div className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-md font-medium">
        <Truck className="h-4 w-4" />
        <span>On Delivery</span>
      </div>
    )
  }

  if (status === 'rejected' || status === 'completed') {
    return (
      <div className="flex items-center justify-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md font-medium">
        <span>Completed</span>
      </div>
    )
  }

  if (status === 'to_be_delivered') {
    return (
      <Button 
        variant="default" 
        onClick={handleStartDelivery}
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        <Truck className="mr-1 h-4 w-4" />
        Start Delivery
      </Button>
    )
  }

  return (
    <div className="flex gap-2">
      <Button 
        variant="default" 
        onClick={onApprove}
        className="bg-green-600 hover:bg-green-700 text-white"
      >
        <Check className="mr-1 h-4 w-4" />
        Approve
      </Button>
      <Button 
        variant="destructive" 
        onClick={onReject}
        className="bg-red-600 hover:bg-red-700 text-white"
      >
        <X className="mr-1 h-4 w-4" />
        Reject
      </Button>
    </div>
  )
}
