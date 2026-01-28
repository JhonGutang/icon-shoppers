"use client";

import React from "react";
import { 
  TrendingUp, 
  ShoppingBag, 
  Package, 
  Star, 
  ArrowUpRight,
  Plus,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import AnalyticsCard from "@/components/shop/AnalyticsCard";
import { useShopAnalytics } from "@/hooks/useShopAnalytics";
import Link from "next/link";

const ShopDashboard = () => {
  const { analytics, loading, error } = useShopAnalytics();

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-10 w-10 text-green-600">
             <Package className="h-10 w-10 animate-spin" />
          </div>
          <p className="text-gray-500 font-medium">Gathering shop insights...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-100 bg-red-50 p-8 text-center">
        <p className="text-red-800 font-medium">{error}</p>
        <Button 
          variant="outline" 
          className="mt-4 border-red-200 text-red-800 hover:bg-red-100"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </Card>
    );
  }

  const stats = [
    {
      title: "Total Revenue",
      value: `₱${(analytics?.total_revenue || 0).toLocaleString()}`,
      description: "Lifetime sales from delivered orders",
      icon: TrendingUp,
      colorClass: "bg-green-50/50 border-l-4 border-green-500",
      iconColorClass: "bg-green-100 text-green-600",
    },
    {
      title: "Pending Orders",
      value: analytics?.pending_orders || 0,
      description: "New orders awaiting processing",
      icon: ShoppingBag,
      colorClass: "bg-amber-50/50 border-l-4 border-amber-500",
      iconColorClass: "bg-amber-100 text-amber-600",
    },
    {
      title: "Active Products",
      value: analytics?.total_products || 0,
      description: "Items currently listed in your shop",
      icon: Package,
      colorClass: "bg-blue-50/50 border-l-4 border-blue-500",
      iconColorClass: "bg-blue-100 text-blue-600",
    },
    {
      title: "Shop Rating",
      value: `${analytics?.average_rating || 0}/5`,
      description: "Based on customer feedback",
      icon: Star,
      colorClass: "bg-indigo-50/50 border-l-4 border-indigo-500",
      iconColorClass: "bg-indigo-100 text-indigo-600",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">Your Shop Insights</h2>
          <p className="mt-1 text-gray-500">Real-time overview of your store&apos;s performance.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/shop/products">
            <Button className="bg-green-600 hover:bg-green-700 shadow-md">
              <Plus size={18} className="mr-2" />
              Add Product
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <AnalyticsCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-none shadow-sm h-full">
          <CardHeader className="border-b bg-gray-50/50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Recent Sales</CardTitle>
                <CardDescription>Visualizing your recent shop activity</CardDescription>
              </div>
              <TrendingUp className="text-green-600 h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="p-12">
            <div className="flex h-48 flex-col items-center justify-center rounded-xl bg-gray-50 text-center border-2 border-dashed border-gray-200">
              <ArrowUpRight className="h-10 w-10 text-gray-300 mb-2" />
              <p className="text-sm text-gray-400 font-medium">Sales chart data arriving soon...</p>
              <p className="text-xs text-gray-400 mt-1">Keep growing your shop to see more trends.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm h-full flex flex-col">
          <CardHeader className="border-b bg-gray-50/50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
                <CardDescription>Manage your store efficiently</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-6 space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <Link href="/shop/orders" className="group">
                <div className="flex items-center justify-between rounded-xl border p-4 transition-all hover:border-green-200 hover:bg-green-50 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="rounded-lg bg-orange-100 p-2 text-orange-600">
                      <ShoppingBag size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Manage Orders</p>
                      <p className="text-xs text-gray-500">Track and fulfill customer requests</p>
                    </div>
                  </div>
                  <ArrowRight size={18} className="text-gray-300 group-hover:text-green-600 transition-colors" />
                </div>
              </Link>

              <Link href="/shop/products" className="group">
                <div className="flex items-center justify-between rounded-xl border p-4 transition-all hover:border-green-200 hover:bg-green-50 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
                      <Package size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Inventory Control</p>
                      <p className="text-xs text-gray-500">Update stock levels and visibility</p>
                    </div>
                  </div>
                  <ArrowRight size={18} className="text-gray-300 group-hover:text-green-600 transition-colors" />
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ShopDashboard;
