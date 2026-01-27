"use client";

import React, { useEffect, useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useShopOrders } from "@/hooks/useShopOrders";
import { STATUS_OPTIONS, formatStatus, getStatusColor } from "@/lib/orderUtils";
import { StatusButtons } from "@/components/StatusButton";
import { toast } from "sonner";
import { ShoppingBag, Search, Filter, RefreshCcw } from "lucide-react";
import { Input } from "@/components/ui/input";

const ShopOrdersPage = () => {
  const [statusFilter, setStatusFilter] = useState("ALL");
  const { orders, loading, error, fetchOrders, updateStatus } = useShopOrders();

  useEffect(() => {
    fetchOrders(statusFilter);
  }, [statusFilter, fetchOrders]);

  const handleStatusChange = async (orderId: number, newStatus: any) => {
    const success = await updateStatus(orderId, newStatus);
    if (success) {
      toast.success(`Order #${orderId} updated to ${formatStatus(newStatus)}`);
      fetchOrders(statusFilter);
    } else {
      toast.error("Failed to update order status");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">Order Management</h2>
          <p className="mt-1 text-gray-500">Track and fulfill your customer orders.</p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => fetchOrders(statusFilter)}
          disabled={loading}
          className="w-fit"
        >
          <RefreshCcw className={cn("mr-2 h-4 w-4", loading && "animate-spin")} />
          Refresh
        </Button>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="bg-white border-b">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
              <Button
                variant={statusFilter === "ALL" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("ALL")}
                className={cn("rounded-full", statusFilter === "ALL" && "bg-green-600")}
              >
                All Orders
              </Button>
              {STATUS_OPTIONS.map((status) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter(status)}
                  className={cn("rounded-full transition-all whitespace-nowrap", statusFilter === status && "bg-green-600")}
                >
                  {formatStatus(status)}
                </Button>
              ))}
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input 
                placeholder="Search order ID..." 
                className="pl-10 rounded-xl"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow>
                <TableHead className="w-[120px] font-bold">Order ID</TableHead>
                <TableHead className="font-bold">Customer</TableHead>
                <TableHead className="font-bold">Date</TableHead>
                <TableHead className="font-bold">Items</TableHead>
                <TableHead className="font-bold">Total Amount</TableHead>
                <TableHead className="font-bold">Status</TableHead>
                <TableHead className="text-right font-bold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={7} className="h-16">
                      <div className="h-4 w-full animate-pulse rounded bg-gray-100"></div>
                    </TableCell>
                  </TableRow>
                ))
              ) : orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <ShoppingBag className="h-12 w-12 mb-4 opacity-20" />
                      <p className="font-medium">No orders found</p>
                      <p className="text-sm">Try changing your filters or check back later.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <TableCell className="font-mono text-xs uppercase text-green-700 font-bold">
                      #{order.orderNumber || order.id}
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold text-gray-900">{order.userName || "Customer"}</div>
                      <div className="text-xs text-gray-500 truncate max-w-[200px]">{order.shippingAddress}</div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {order.products?.slice(0, 2).map((item: any) => (
                          <span key={item.id} className="text-xs text-gray-600">
                            {item.name} x{item.quantity}
                          </span>
                        ))}
                        {order.products?.length > 2 && (
                          <span className="text-[10px] text-green-600 font-medium italic">
                            +{order.products.length - 2} more items
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-bold text-gray-900">₱{Number(order.totalAmount).toLocaleString()}</span>
                    </TableCell>
                    <TableCell>
                       <Badge className={cn("shadow-sm", getStatusColor(order.status))}>
                          {formatStatus(order.status)}
                       </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                       <StatusButtons 
                          status={order.status} 
                          onStatusUpdate={(newStatus) => handleStatusChange(order.id, newStatus)} 
                       />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

// Helper for cn (sometimes needed if not imported correctly)
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}

export default ShopOrdersPage;
