"use client";

import React, { useEffect } from "react";
import { Plus, Package, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import useProductAction from "@/hooks/useProductActions";
import CreateProduct from "@/components/profile/CreateProduct";
import { Card } from "@/components/ui/card";

const ShopProductsPage = () => {
  const { products, loading, handleFetchShopProducts } = useProductAction();

  useEffect(() => {
    handleFetchShopProducts();
  }, [handleFetchShopProducts]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">Product Management</h2>
          <p className="mt-1 text-gray-500">Add, edit, and manage your shop's inventory.</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleFetchShopProducts}
            disabled={loading}
          >
            <RefreshCcw className={cn("mr-2 h-4 w-4", loading && "animate-spin")} />
            Refresh
          </Button>
          <CreateProduct />
        </div>
      </div>

      {loading && products?.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="aspect-[3/4] animate-pulse bg-gray-100 border-none shadow-none"></Card>
          ))}
        </div>
      ) : products?.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed bg-white p-20 text-center">
          <div className="rounded-full bg-green-50 p-6 text-green-600 mb-6">
            <Package size={48} />
          </div>
          <h3 className="text-xl font-bold text-gray-900">No products yet</h3>
          <p className="mt-2 text-gray-500 max-w-sm">
            Start adding products to your shop to attract local customers and grow your business.
          </p>
          <div className="mt-8">
            <CreateProduct />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
          {products?.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              location="shop" 
              className="h-full"
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Helper for cn (sometimes needed if not imported correctly)
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}

export default ShopProductsPage;
