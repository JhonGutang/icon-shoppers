import { OrderStatus } from "@/types/order";

export const STATUS_OPTIONS: OrderStatus[] = [
  "ordered",
  "approved",
  "processing",
  "delivering",
  "delivered",
  "cancelled"
];

export const formatStatus = (status: string): string => {
    if (!status) return "";
    if (status.toLowerCase() === "all") return "All Orders";
    return status
      .charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };
  
  export const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case "ordered":
      case "pending":
        return "bg-amber-500";
      case "approved":
      case "processing":
        return "bg-blue-500";
      case "shipped":
      case "delivering":
        return "bg-indigo-500";
      case "delivered":
      case "received":
      case "completed":
        return "bg-green-600";
      case "rejected":
      case "cancelled":
        return "bg-red-600";
      default:
        return "bg-gray-400";
    }
  };