"use client";

import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useOrders } from "@/hooks/useOrders";
import { STATUS_OPTIONS, formatStatus, getStatusColor } from "@/lib/orderUtils";
import { StatusButtons } from "@/components/StatusButton";
import { toast } from "sonner";
import { Package, ShoppingBag, TrendingUp, Users, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import useProductAction from "@/hooks/useProductActions";
import CreateProduct from "../profile/CreateProduct";
import ProductCard from "../ProductCard";
import useAuth from "@/hooks/useAuth";
import useRedirectLink from "@/hooks/useRedirectLink";

const SellerDashboard = () => {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("all");
  const [orders, setOrders] = useState<any[]>([]);
  const { fetchOrders, handleStatusUpdate } = useOrders();
  const { products, handleFetchShopProducts } = useProductAction();
  const { handleGetProfile } = useAuth();
  const { redirectLink } = useRedirectLink();
  const [shopName, setShopName] = useState<string>("");

  useEffect(() => {
    loadOrders();
    handleFetchShopProducts();
    loadProfile();
  }, [orderStatusFilter]);

  const loadProfile = async () => {
    const profile = await handleGetProfile();
    if (profile?.name) {
       setShopName(profile.name);
    }
  };

  const loadOrders = async () => {
    const data = await fetchOrders(orderStatusFilter as any);
    if (data) setOrders(data);
  };

  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      await handleStatusUpdate(orderId, newStatus as any);
      toast.success(`Order updated to ${formatStatus(newStatus)}`);
      loadOrders();
    } catch {
      toast.error("Failed to update order");
    }
  };

  // Metrics (Derived)
  const totalSales = orders
    .filter(o => o.status === 'DELIVERED')
    .reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
  const pendingOrders = orders.filter(o => o.status === 'PENDING').length;
  const totalProducts = products?.length || 0;

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between">
        <div>
            <h2 className="text-3xl font-bold tracking-tight">Merchant Dashboard</h2>
            <p className="text-muted-foreground">Managing {shopName || "your shop"}</p>
        </div>
        <div className="flex items-center gap-3">
            {shopName && (
                <Button 
                    variant="outline" 
                    className="gap-2 border-green-200 text-green-700 hover:bg-green-50"
                    onClick={() => redirectLink(shopName)}
                >
                    <ExternalLink className="h-4 w-4" />
                    View Public Shop
                </Button>
            )}
            <CreateProduct />
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList className="bg-white border p-1 rounded-xl h-12">
          <TabsTrigger value="overview" className="rounded-lg px-6 data-[state=active]:bg-green-600 data-[state=active]:text-white">Overview</TabsTrigger>
          <TabsTrigger value="orders" className="rounded-lg px-6 data-[state=active]:bg-green-600 data-[state=active]:text-white">Orders ({pendingOrders} New)</TabsTrigger>
          <TabsTrigger value="products" className="rounded-lg px-6 data-[state=active]:bg-green-600 data-[state=active]:text-white">Products</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-l-4 border-l-green-600">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₱{totalSales.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">From delivered orders</p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-amber-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                <ShoppingBag className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingOrders}</div>
                <p className="text-xs text-muted-foreground">Needs your attention</p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Products</CardTitle>
                <Package className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalProducts}</div>
                <p className="text-xs text-muted-foreground">Listed in your shop</p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-indigo-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Customers</CardTitle>
                <Users className="h-4 w-4 text-indigo-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">Regional shoppers</p>
              </CardContent>
            </Card>
          </div>
          
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>You have {pendingOrders} orders waiting for processing.</CardDescription>
            </CardHeader>
            <CardContent>
                {/* Simplified view or chart could go here */}
                <div className="h-[200px] flex items-center justify-center border-2 border-dashed rounded-lg bg-gray-50 text-gray-400">
                    Activity Visualization Placeholder
                </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
           <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
             {STATUS_OPTIONS.map(status => (
               <Button
                 key={status}
                 variant={orderStatusFilter === status ? "default" : "outline"}
                 size="sm"
                 className={`rounded-full transition-all ${orderStatusFilter === status ? "bg-green-600" : ""}`}
                 onClick={() => setOrderStatusFilter(status)}
               >
                 {formatStatus(status)}
               </Button>
             ))}
           </div>

           <Card>
             <CardContent className="p-0">
               <Table>
                 <TableHeader className="bg-gray-50">
                   <TableRow>
                     <TableHead className="w-[100px]">ID</TableHead>
                     <TableHead>Customer</TableHead>
                     <TableHead>Items</TableHead>
                     <TableHead>Total</TableHead>
                     <TableHead>Status</TableHead>
                     <TableHead className="text-right">Action</TableHead>
                   </TableRow>
                 </TableHeader>
                 <TableBody>
                   {orders.length === 0 ? (
                     <TableRow>
                       <TableCell colSpan={6} className="h-32 text-center text-gray-400 italic">No orders found.</TableCell>
                     </TableRow>
                   ) : (
                     orders.map((order) => (
                       <TableRow key={order.id}>
                         <TableCell className="font-mono text-xs uppercase">#{order.id}</TableCell>
                         <TableCell>
                           <div className="font-medium">{order.customer?.name || "Guest User"}</div>
                           <div className="text-xs text-gray-500">{order.shipping_address}</div>
                         </TableCell>
                         <TableCell>
                           <div className="text-xs">
                             {order.order_items?.map((item: any) => (
                               <div key={item.id}>{item.product?.name} x{item.quantity}</div>
                             )) || "1 product"}
                           </div>
                         </TableCell>
                         <TableCell className="font-bold">₱{Number(order.total_amount).toFixed(2)}</TableCell>
                         <TableCell>
                           <span className={`px-2 py-1 rounded-full text-[10px] font-bold text-white shadow-sm ${getStatusColor(order.status)}`}>
                             {formatStatus(order.status)}
                           </span>
                         </TableCell>
                         <TableCell className="text-right">
                           <StatusButtons 
                             status={order.status} 
                             onStatusUpdate={(newStatus) => updateStatus(order.id.toString(), newStatus)} 
                           />
                         </TableCell>
                       </TableRow>
                     ))
                   )}
                 </TableBody>
               </Table>
             </CardContent>
           </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
              {products?.map((product) => (
                <ProductCard key={product.id} product={product} location="profile" />
              ))}
              {products?.length === 0 && (
                  <div className="col-span-full h-64 flex flex-col items-center justify-center bg-white border-2 border-dashed rounded-xl text-gray-400">
                    <ShoppingBag className="h-10 w-10 mb-2 opacity-20" />
                    <p>No products yet. Start adding items to your shop!</p>
                  </div>
              )}
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SellerDashboard;
