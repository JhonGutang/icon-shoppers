import { OrderStatus } from "@/types/order";

export const STATUS_OPTIONS: OrderStatus[] = [
  "all",
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED"
];

export const formatStatus = (status: string): string => {
    if (!status) return "";
    if (status.toLowerCase() === "all") return "All Orders";
    return status
      .charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };
  
  export const getStatusColor = (status: string): string => {
    switch (status.toUpperCase()) {
      case "PENDING":
        return "bg-amber-500";
      case "PROCESSING":
        return "bg-blue-500";
      case "SHIPPED":
        return "bg-indigo-500";
      case "DELIVERED":
        return "bg-green-600";
      case "CANCELLED":
        return "bg-red-600";
      default:
        return "bg-gray-400";
    }
  };