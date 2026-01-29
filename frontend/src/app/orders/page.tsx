"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { useCustomerOrders } from "@/hooks/queries/useOrderQuery";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Truck, Clock, CheckCircle2, ChevronRight, Store, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { cn } from "@/lib/utils";

import { Order, OrderStatus } from "@/types/order";

const OrderTrackingPage = () => {
  const [activeTab, setActiveTab] = useState("ALL");
  const { data: ordersData, isLoading } = useCustomerOrders(activeTab);

  const statuses = [
    { value: "ALL", label: "All" },
    { value: "ORDERED", label: "Pending" },
    { value: "APPROVED", label: "Approved" },
    { value: "DELIVERING", label: "Shipping" },
    { value: "COMPLETED", label: "Completed" },
    { value: "CANCELLED", label: "Cancelled" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <h1 className="mb-8 text-3xl font-bold tracking-tight">My Orders</h1>

        <Tabs defaultValue="ALL" className="w-full" onValueChange={setActiveTab}>
          <div className="mb-6 overflow-x-auto pb-2">
            <TabsList className="bg-background border h-11 w-max">
              {statuses.map((s) => (
                <TabsTrigger 
                    key={s.value} 
                    value={s.value}
                    className="px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md transition-all"
                >
                  {s.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-48 w-full rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {ordersData?.data.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
              
              {ordersData?.data.length === 0 && (
                <div className="flex h-64 flex-col items-center justify-center rounded-2xl border-2 border-dashed bg-card text-center">
                  <Package size={48} className="text-muted-foreground mb-4 opacity-50" />
                  <p className="font-bold text-lg">No orders found</p>
                  <p className="text-sm text-muted-foreground">Orders matching this status will appear here.</p>
                </div>
              )}
            </div>
          )}
        </Tabs>
      </main>
    </div>
  );
};

const OrderCard = ({ order }: { order: Order }) => {
  const statusColors: Record<string, string> = {
    ORDERED: "bg-orange-100 text-orange-700 border-orange-200",
    APPROVED: "bg-blue-100 text-blue-700 border-blue-200",
    PROCESSING: "bg-blue-100 text-blue-700 border-blue-200",
    DELIVERING: "bg-indigo-100 text-indigo-700 border-indigo-200",
    DELIVERED: "bg-green-100 text-green-700 border-green-200",
    RECEIVED: "bg-purple-100 text-purple-700 border-purple-200",
    COMPLETED: "bg-green-100 text-green-700 border-green-200",
    CANCELLED: "bg-red-100 text-red-700 border-red-200",
  };

  return (
    <Card className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="bg-muted/30 py-3 flex flex-row items-center justify-between border-b">
        <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 font-bold text-sm">
                <Store size={14} className="text-primary" />
                {order.shop.name}
            </div>
            <span className="text-muted-foreground">|</span>
            <span className="text-xs font-mono text-muted-foreground">#{order.orderNumber}</span>
        </div>
        <Badge variant="outline" className={cn("rounded-full px-3 py-0.5 font-bold text-[10px]", statusColors[(order.status as string).toUpperCase()])}>
          {order.statusLabel}
        </Badge>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="space-y-4">
          {order.products.map((product: any) => (
            <div key={product.order_item_id} className="flex gap-4">
              <img 
                src={product.image ? `https://icon-shoppers.onrender.com/storage/${product.image}` : "https://placehold.co/80x80"} 
                alt={product.name}
                className="h-16 w-16 rounded-xl object-cover flex-shrink-0 border"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold line-clamp-1">{product.name}</h4>
                <p className="text-xs text-muted-foreground mt-0.5">Quantity: {product.quantity}</p>
                <p className="text-sm font-bold text-primary mt-1">₱{product.price.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="bg-muted/10 p-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-sm">
            <div className="flex flex-col">
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Total Amount</span>
                <span className="text-lg font-black text-primary">₱{order.totalAmount.toLocaleString()}</span>
            </div>
            <div className="hidden sm:block h-8 w-px bg-border mx-2" />
            <div className="flex flex-col">
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Payment</span>
                <span className="font-bold text-xs uppercase">{order.paymentMethod} • {order.paymentStatus}</span>
            </div>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button variant="outline" size="sm" asChild className="rounded-full flex-1 sm:flex-none">
                <Link href={`/orders/${order.orderNumber}`}>Details</Link>
            </Button>
            {(order.status as string) === 'ORDERED' && (
                <Button variant="ghost" size="sm" className="text-destructive hover:bg-red-50 hover:text-red-600 rounded-full flex-1 sm:flex-none">
                    Cancel
                </Button>
            )}
            {(order.status as string) === 'DELIVERED' && (
                <Button size="sm" className="rounded-full flex-1 sm:flex-none">
                   Received
                </Button>
            )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default OrderTrackingPage;
