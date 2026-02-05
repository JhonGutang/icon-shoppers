"use client";

import { useState } from "react";
import Navbar from "@/components/shared/layout/Navbar";
import Footer from "@/components/landing-page/Footer";
import ProtectedRoute from "@/components/shared/auth/ProtectedRoute";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shared/ui/tabs";
import Products from "@/components/customer-home/Products";
import Shops from "@/components/customer-home/Shops";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shared/ui/select";
import { cn } from "@/lib/utils";
import { useInfiniteProducts } from "@/hooks/product/useProductsQuery";

import PageLoader from "@/components/shared/loaders/PageLoader";

export default function Home() {
  const [filters, setFilters] = useState({
    sort: "newest",
  });
  
  const { isLoading: isProductsLoading } = useInfiniteProducts({ 
    sort: filters.sort 
  });

  return (
    <ProtectedRoute redirectTo="/auth">
      <PageLoader isLoading={isProductsLoading} />
      <div className={cn("flex min-h-screen flex-col bg-background transition-opacity duration-300", isProductsLoading ? "opacity-0" : "opacity-100")}>
        <Navbar />
        
        <main className="flex-1 overflow-x-hidden">
          <div className="container mx-auto px-4 py-8">
            <Tabs defaultValue="products" className="w-full">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <TabsList className="grid w-full max-w-md grid-cols-2 h-12">
                  <TabsTrigger value="products" className="text-lg font-bold cursor-pointer">Explore Products</TabsTrigger>
                  <TabsTrigger value="shops" className="text-lg font-bold cursor-pointer">Explore Shops</TabsTrigger>
                </TabsList>

                <div className="flex items-center gap-2">
                  <Select 
                    value={filters.sort} 
                    onValueChange={(val) => setFilters(prev => ({ ...prev, sort: val }))}
                  >
                    <SelectTrigger className="w-[160px] h-12 rounded-xl cursor-pointer">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest" className="cursor-pointer">Newest</SelectItem>
                      <SelectItem value="featured" className="cursor-pointer">Featured First</SelectItem>
                      <SelectItem value="price_asc" className="cursor-pointer">Price: Low to High</SelectItem>
                      <SelectItem value="price_desc" className="cursor-pointer">Price: High to Low</SelectItem>
                      <SelectItem value="popular" className="cursor-pointer">Most Popular</SelectItem>
                      <SelectItem value="rating" className="cursor-pointer">Top Rated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <TabsContent value="products" className="mt-0">
                <Products 
                  location="Products" 
                  sort={filters.sort}
                  minItemWidth={240}
                  gap={6}
                />
              </TabsContent>

              <TabsContent value="shops" className="mt-0">
                <Shops 
                  location="Shops" 
                  sort={filters.sort}
                />
              </TabsContent>
            </Tabs>
          </div>
        </main>

        <Footer />
      </div>
    </ProtectedRoute>
  );
}
