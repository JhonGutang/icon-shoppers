"use client";

import Navbar from "@/components/shared/layout/Navbar";
import { Button } from "@/components/shared/ui/button";
import { Skeleton } from "@/components/shared/ui/skeleton";
import { useUpdateOrderStatusMutation } from "@/hooks/order/useOrderMutations";
import { useInfiniteCustomerOrders } from "@/hooks/order/useOrderQuery";
import { cn } from "@/lib/utils";
import { Order } from "@/types/order";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUp,
  CheckCircle,
  ChevronRight,
  Clock3,
  LayoutGrid,
  Loader2,
  Package,
  Store,
  Tag,
  Truck,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const statuses = [
  { value: "ALL", label: "All Orders", icon: LayoutGrid },
  { value: "ORDERED", label: "Pending", icon: Clock3 },
  { value: "APPROVED", label: "Approved", icon: Tag },
  { value: "DELIVERING", label: "Delivering", icon: Truck },
  { value: "DELIVERED", label: "To Receive", icon: Package },
  { value: "COMPLETED", label: "Completed", icon: CheckCircle },
  { value: "CANCELLED", label: "Cancelled", icon: XCircle },
];

const OrderTrackingPage = () => {
  const [activeTab, setActiveTab] = useState("ALL");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteCustomerOrders(activeTab, 5);

  const allOrders = data?.pages.flatMap((page) => page.data) || [];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    setShowScrollTop(scrollTop > 400);
  };

  const scrollToTop = () => {
    scrollContainerRef.current?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="flex h-screen flex-col bg-stone-50/50 overflow-hidden">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-80 border-r border-stone-200 bg-white p-8 flex-col gap-8">
          <div>
            <h1 className="text-3xl font-black text-stone-900 tracking-tight mb-2">
              My Orders
            </h1>
            <p className="text-stone-500 text-sm font-light">
              Track and manage your local purchases
            </p>
          </div>

          <nav className="flex flex-col gap-2">
            {statuses.map((s) => {
              const Icon = s.icon;
              const isActive = activeTab === s.value;
              return (
                <button
                  key={s.value}
                  onClick={() => setActiveTab(s.value)}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-[#0E6835] text-white shadow-lg shadow-green-900/10 translate-x-1"
                      : "text-stone-600 hover:bg-stone-100 hover:text-stone-900",
                  )}
                >
                  <Icon
                    size={18}
                    className={cn(isActive ? "text-white" : "text-stone-400")}
                  />
                  {s.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="ml-auto w-1.5 h-1.5 rounded-full bg-white"
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0">
          {/* Mobile Status Bar */}
          <div className="lg:hidden border-b border-stone-200 bg-white overflow-x-auto custom-scrollbar whitespace-nowrap px-4 py-3 flex gap-2">
            {statuses.map((s) => (
              <button
                key={s.value}
                onClick={() => setActiveTab(s.value)}
                className={cn(
                  "px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all",
                  activeTab === s.value
                    ? "bg-[#0E6835] text-white"
                    : "bg-stone-100 text-stone-500 hover:bg-stone-200",
                )}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* List Container */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 lg:p-12 relative"
          >
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="lg:hidden mb-6">
                <h1 className="text-2xl font-black text-stone-900 tracking-tight">
                  My Orders
                </h1>
                <p className="text-stone-500 text-xs font-light">
                  Track and manage your local purchases
                </p>
              </div>

              <div className="space-y-6 pb-12 transition-all duration-500">
                {isLoading ? (
                  <div className="space-y-6 animate-in fade-in duration-500">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div
                        key={i}
                        className="bg-white rounded-3xl p-6 border border-stone-200 space-y-4"
                      >
                        <div className="flex justify-between">
                          <Skeleton className="h-6 w-32 rounded-lg" />
                          <Skeleton className="h-6 w-20 rounded-full" />
                        </div>
                        <div className="flex gap-4">
                          <Skeleton className="h-20 w-20 rounded-2xl" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-1/2" />
                            <Skeleton className="h-4 w-1/4" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : allOrders.length > 0 ? (
                  <AnimatePresence initial={false}>
                    {allOrders.map((order) => (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        <OrderCard order={order} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                ) : !isLoading && allOrders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-24 h-24 rounded-full bg-stone-100 flex items-center justify-center mb-6 text-stone-300">
                      <Package size={48} strokeWidth={1} />
                    </div>
                    <h3 className="text-xl font-bold text-stone-900">
                      No orders found
                    </h3>
                    <p className="text-stone-500 font-light mt-2 max-w-xs">
                      It looks like there{" "}
                      {activeTab === "ALL"
                        ? "aren't any orders"
                        : `aren't any ${activeTab.toLowerCase()} orders`}{" "}
                      yet. Keep exploring the local market!
                    </p>
                    <Button
                      asChild
                      variant="outline"
                      className="mt-8 rounded-full px-8 hover:bg-stone-100"
                    >
                      <Link href="/home">Continue Shopping</Link>
                    </Button>
                  </div>
                ) : null}

                {/* Infinite Scroll Trigger */}
                <div
                  ref={observerTarget}
                  className="py-8 flex justify-center w-full"
                >
                  {isFetchingNextPage ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full border-4 border-stone-100 border-t-[#0E6835] animate-spin" />
                        <Loader2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5 text-[#0E6835]" />
                      </div>
                      <p className="text-sm font-bold text-stone-400 uppercase tracking-widest">
                        Loading more orders...
                      </p>
                    </div>
                  ) : hasNextPage ? (
                    <Button
                      variant="ghost"
                      onClick={() => fetchNextPage()}
                      disabled={isFetchingNextPage}
                      className="rounded-full px-8 text-stone-400 hover:text-[#0E6835] transition-colors"
                    >
                      Scroll for more
                    </Button>
                  ) : (
                    allOrders.length > 0 && (
                      <div className="flex items-center gap-4 text-stone-300">
                        <div className="h-px w-12 bg-stone-200" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                          End of list
                        </span>
                        <div className="h-px w-12 bg-stone-200" />
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Floating Scroll to Top Button */}
            <div
              className={cn(
                "fixed bottom-8 right-8 z-50 transition-all duration-300",
                showScrollTop
                  ? "translate-y-0 opacity-100"
                  : "translate-y-12 opacity-0 pointer-events-none",
              )}
            >
              <Button
                onClick={scrollToTop}
                size="icon"
                className="h-12 w-12 rounded-full shadow-lg bg-[#0E6835] hover:bg-green-700 text-white group"
                aria-label="Scroll to top"
              >
                <ArrowUp className="h-6 w-6 transition-transform group-hover:-translate-y-1" />
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const OrderCard = ({ order }: { order: Order }) => {
  const getStatusStyle = (status: string) => {
    const s = status.toUpperCase();
    switch (s) {
      case "ORDERED":
        return {
          bg: "bg-orange-50",
          text: "text-orange-600",
          border: "border-orange-100",
          dot: "bg-orange-400",
        };
      case "APPROVED":
        return {
          bg: "bg-blue-50",
          text: "text-blue-600",
          border: "border-blue-100",
          dot: "bg-blue-400",
        };
      case "PROCESSING":
        return {
          bg: "bg-sky-50",
          text: "text-sky-600",
          border: "border-sky-100",
          dot: "bg-sky-400",
        };
      case "DELIVERING":
        return {
          bg: "bg-indigo-50",
          text: "text-indigo-600",
          border: "border-indigo-100",
          dot: "bg-indigo-400",
        };
      case "DELIVERED":
        return {
          bg: "bg-emerald-50",
          text: "text-emerald-600",
          border: "border-emerald-100",
          dot: "bg-emerald-400",
        };
      case "COMPLETED":
        return {
          bg: "bg-[#0E6835]/10",
          text: "text-[#0E6835]",
          border: "border-[#0E6835]/20",
          dot: "bg-[#0E6835]",
        };
      case "CANCELLED":
        return {
          bg: "bg-rose-50",
          text: "text-rose-600",
          border: "border-rose-100",
          dot: "bg-rose-400",
        };
      default:
        return {
          bg: "bg-stone-50",
          text: "text-stone-600",
          border: "border-stone-100",
          dot: "bg-stone-400",
        };
    }
  };

  const style = getStatusStyle(order.status as string);

  return (
    <div className="group bg-white rounded-[2rem] border border-stone-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-stone-300 transition-all duration-300">
      {/* Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 pb-4 gap-4 border-b border-stone-100 bg-stone-50/30">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white border border-stone-200 flex items-center justify-center text-[#0E6835] shadow-sm overflow-hidden">
            {order.shop.logo ? (
              <img
                src={`${process.env.NEXT_PUBLIC_LARAVEL_API_URL}/storage/${order.shop.logo}`}
                alt={order.shop.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <Store size={20} />
            )}
          </div>
          <div>
            <h4 className="font-black text-stone-900 group-hover:text-[#0E6835] transition-colors leading-none">
              {order.shop.name}
            </h4>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-[10px] font-mono font-bold text-stone-400 tracking-wider">
                ORDER #{order.orderNumber}
              </span>
              <span className="text-stone-300">/</span>
              <span className="text-[10px] text-stone-400 font-medium tracking-tight">
                {new Date(order.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>

        <div
          className={cn(
            "inline-flex items-center gap-2 px-4 py-2 rounded-full border text-[10px] font-black uppercase tracking-[0.2em]",
            style.bg,
            style.text,
            style.border,
          )}
        >
          <span
            className={cn("w-1.5 h-1.5 rounded-full animate-pulse", style.dot)}
          />
          {order.statusLabel}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6">
        <div className="flex flex-col gap-6">
          <div className="space-y-4">
            {order.products.map((product: any) => (
              <div
                key={product.order_item_id}
                className="flex gap-4 group/item"
              >
                <div className="relative h-20 w-20 rounded-2xl overflow-hidden border border-stone-100 flex-shrink-0">
                  <img
                    src={
                      product.image
                        ? `${process.env.NEXT_PUBLIC_LARAVEL_API_URL}/storage/${product.image}`
                        : "https://placehold.co/100x100"
                    }
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform group-hover/item:scale-110 duration-500"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-black/40 backdrop-blur-sm text-white text-[10px] font-bold text-center py-0.5">
                    x{product.quantity}
                  </div>
                </div>
                <div className="flex-1 py-1 flex flex-col justify-between">
                  <div>
                    <h5 className="text-sm font-bold text-stone-900 group-hover/item:text-[#0E6835] transition-colors">
                      {product.name}
                    </h5>
                    <p className="text-xs text-stone-400 mt-0.5">
                      Unit Price: ₱{product.price.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-black text-stone-900">
                      ₱
                      {(
                        Number(product.price) * product.quantity
                      ).toLocaleString()}
                    </p>
                    <Link
                      href={`/products/${product.slug || "#"}`}
                      className="text-[10px] font-bold text-[#0E6835] hover:underline flex items-center gap-1"
                    >
                      View Product <ArrowRight size={10} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="h-px bg-stone-100 w-full" />

          {/* Footer Info */}
          <div className="flex flex-col sm:flex-row items-end sm:items-center justify-between gap-6">
            <div className="grid grid-cols-2 sm:flex items-center gap-6 w-full sm:w-auto">
              <div>
                <p className="text-[9px] font-bold text-stone-400 uppercase tracking-[0.15em] mb-1">
                  Total Amount
                </p>
                <p className="text-2xl font-black text-[#0E6835] leading-none">
                  ₱{order.totalAmount.toLocaleString()}
                </p>
              </div>
              <div className="sm:pl-6 sm:border-l border-stone-100">
                <p className="text-[9px] font-bold text-stone-400 uppercase tracking-[0.15em] mb-1">
                  Payment
                </p>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-stone-900 leading-none">
                    {order.paymentMethod}
                  </span>
                  <span className="text-[10px] text-stone-500 mt-1 uppercase">
                    {order.paymentStatus}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                asChild
                className="rounded-2xl flex-1 sm:flex-none h-12 px-8 border-stone-200 hover:bg-stone-50 group/btn"
              >
                <Link
                  href={`/orders/${order.orderNumber}`}
                  className="flex items-center gap-2"
                >
                  <span>Details</span>
                  <ChevronRight
                    size={16}
                    className="transition-transform group-hover/btn:translate-x-1"
                  />
                </Link>
              </Button>

              <AnimatePresence>
                {(order.status as string).toUpperCase() === "DELIVERED" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex-1 sm:flex-none"
                  >
                    {/* Using a simple button here that calls a prop function would be better,
                         but since this is a server component wrapper or complicated client component,
                         we need to ensure we have the mutation logic available.

                         NOTE: This component (OrderTrackingPage) uses 'useInfiniteCustomerOrders'
                         but needs 'useUpdateOrderStatusMutation' or similar to handle the action.
                         Let's verify if we have access to the mutation.
                      */}
                    <ReceivingButton orderId={order.id} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ReceivingButton = ({ orderId }: { orderId: number }) => {
  const updateStatusMutation = useUpdateOrderStatusMutation();

  const handleReceived = async () => {
    try {
      await updateStatusMutation.mutateAsync({ orderId, status: "received" });
      toast.success("Order marked as received!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
    }
  };

  return (
    <Button
      onClick={handleReceived}
      disabled={updateStatusMutation.isPending}
      className="w-full h-12 rounded-2xl bg-[#0E6835] hover:bg-green-800 text-white font-bold px-8 shadow-lg shadow-green-900/20"
    >
      {updateStatusMutation.isPending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Updating...
        </>
      ) : (
        "Mark as Received"
      )}
    </Button>
  );
};

export default OrderTrackingPage;
