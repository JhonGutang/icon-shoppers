"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useOrderDetails } from "@/hooks/queries/useOrderQuery";
import Navbar from "@/components/Navbar";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Store, Package, MapPin, CreditCard, Calendar, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const OrderDetailsPage = () => {
  const { orderNumber } = useParams() as { orderNumber: string };
  const { data: order, isLoading, isError } = useOrderDetails(orderNumber);

  if (isLoading) return <OrderDetailsSkeleton />;
  if (isError || !order) return <div className="p-20 text-center">Order not found.</div>;

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
    <div className="flex min-h-screen flex-col bg-muted/30">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="mb-6">
          <Button variant="ghost" asChild className="rounded-full pl-2">
            <Link href="/orders">
              <ArrowLeft size={18} className="mr-2" />
              Back to Orders
            </Link>
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-6">
            {/* Order Header */}
            <section className="rounded-2xl border bg-card p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">Order #{order.orderNumber}</h1>
                        <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                            <Calendar size={14} />
                            <span className="text-xs">{new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}</span>
                        </div>
                    </div>
                    <Badge className={cn("rounded-full px-4 py-1 font-bold", statusColors[order.status])}>
                        {order.statusLabel}
                    </Badge>
                </div>
            </section>

            {/* Products */}
            <section className="rounded-2xl border bg-card shadow-sm overflow-hidden">
                <div className="bg-muted/30 px-6 py-4 border-b flex items-center gap-2">
                    <Store size={18} className="text-primary" />
                    <span className="font-bold">{order.shop.name}</span>
                </div>
                <div className="divide-y">
                    {order.products.map((product) => (
                        <div key={product.id} className="p-6 flex gap-4">
                            <img 
                                src={product.image ? `${process.env.NEXT_PUBLIC_LARAVEL_API_URL}/storage/${product.image}` : "https://placehold.co/100x100"} 
                                alt={product.name}
                                className="h-20 w-20 rounded-xl object-cover border"
                            />
                            <div className="flex-1">
                                <h3 className="font-bold">{product.name}</h3>
                                <p className="text-sm text-muted-foreground">Quantity: {product.quantity}</p>
                                <p className="text-muted-foreground text-xs mt-1 italic">Price: ₱{parseFloat(product.price as string).toLocaleString()}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold">₱{product.subtotal.toLocaleString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="bg-muted/10 p-6 flex flex-col items-end space-y-2">
                    <div className="flex justify-between w-full max-w-[200px] text-sm">
                        <span className="text-muted-foreground">Subtotal:</span>
                        <span>₱{order.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between w-full max-w-[200px] text-sm">
                        <span className="text-muted-foreground">Shipping Fee:</span>
                        <span>₱{order.shippingFee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between w-full max-w-[200px] text-lg font-bold border-t pt-2 mt-2">
                        <span>Total:</span>
                        <span className="text-primary">₱{order.totalAmount.toLocaleString()}</span>
                    </div>
                </div>
            </section>
          </div>

          <div className="w-full lg:w-80 space-y-6">
            {/* Delivery Info */}
            <section className="rounded-2xl border bg-card p-6 shadow-sm">
                <h2 className="font-bold mb-4 flex items-center gap-2">
                    <MapPin size={18} className="text-primary" />
                    Delivery Info
                </h2>
                <div className="text-sm space-y-3">
                    <div>
                        <p className="font-semibold">Shipping Address</p>
                        <p className="text-muted-foreground mt-1 whitespace-pre-wrap">{order.shippingAddress}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Method</p>
                        <p className="text-muted-foreground">{order.deliveryMethod || "Standard Delivery"}</p>
                    </div>
                </div>
            </section>

            {/* Payment Info */}
            <section className="rounded-2xl border bg-card p-6 shadow-sm">
                <h2 className="font-bold mb-4 flex items-center gap-2">
                    <CreditCard size={18} className="text-primary" />
                    Payment Info
                </h2>
                <div className="text-sm space-y-3">
                    <div>
                        <p className="font-semibold">Method</p>
                        <p className="text-muted-foreground uppercase">{order.paymentMethod}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Status</p>
                        <p className="text-muted-foreground uppercase">{order.paymentStatus}</p>
                    </div>
                </div>
            </section>

            {/* Support */}
            <section className="rounded-2xl border bg-card p-6 shadow-sm bg-primary/5 border-primary/10 text-center">
                <p className="text-xs font-medium text-muted-foreground mb-4">Need help with your order?</p>
                <Button variant="outline" className="w-full rounded-full border-primary/20 hover:bg-primary/10">Contact Support</Button>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

const OrderDetailsSkeleton = () => (
    <div className="flex min-h-screen flex-col bg-muted/30">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
            <Skeleton className="h-8 w-40 mb-6 rounded-full" />
            <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1 space-y-6">
                    <Skeleton className="h-24 w-full rounded-2xl" />
                    <Skeleton className="h-96 w-full rounded-2xl" />
                </div>
                <div className="w-full lg:w-80 space-y-6">
                    <Skeleton className="h-40 w-full rounded-2xl" />
                    <Skeleton className="h-40 w-full rounded-2xl" />
                </div>
            </div>
        </div>
    </div>
);

export default OrderDetailsPage;
