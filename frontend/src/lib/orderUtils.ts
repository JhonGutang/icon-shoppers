import { OrderStatus } from "@/types/order";

export const STATUS_OPTIONS: OrderStatus[] = [
  "All",
  "approved",
  "rejected",
  "to_be_delivered",
  "delivering",
  "received",
  "not_received",
  "completed"
];

export const formatStatus = (status: string): string => {
    if (status === "All") return "All";
    if (status === "active") return "Approved";
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };
  
  export const getStatusColor = (status: string): string => {
    switch (status.toLowerCase().replace(/ /g, "_")) {
      case "active":
      case "approved":
        return "bg-green-600";
      case "rejected":
        return "bg-red-600";
      case "to_be_delivered":
        return "bg-blue-500";
      case "delivering":
        return "bg-red-500";
      case "received":
        return "bg-green-500";
      case "not_received":
        return "bg-red-500";
      case "completed":
        return "bg-gray-500";
      default:
        return "bg-gray-300";
    }
  };