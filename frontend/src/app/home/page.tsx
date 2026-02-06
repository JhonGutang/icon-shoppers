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
import { ShoppingBag, Store } from "lucide-react";
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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
              <TabsList className="inline-flex gap-4 w-fit h-auto p-1.5 bg-stone-100/80 backdrop-blur-md rounded-[22px] shadow-sm">
                <TabsTrigger 
                  value="products" 
                  className="px-6 py-3 rounded-[16px] flex items-center gap-2.5 text-base font-bold transition-all duration-300 data-[state=active]:bg-[#0E6835] data-[state=active]:text-white data-[state=active]:shadow-xl data-[state=active]:shadow-green-900/20 hover:bg-white/50 cursor-pointer"
                >
                  <ShoppingBag size={20} className="stroke-[2.5]" />
                  <span>Explore Products</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="shops" 
                  className="px-6 py-3 rounded-[16px] flex items-center gap-2.5 text-base font-bold transition-all duration-300 data-[state=active]:bg-[#0E6835] data-[state=active]:text-white data-[state=active]:shadow-xl data-[state=active]:shadow-green-900/20 hover:bg-white/50 cursor-pointer"
                >
                  <Store size={20} className="stroke-[2.5]" />
                  <span>Explore Shops</span>
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-3">
                <div className="hidden lg:flex items-center gap-2 text-stone-400">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Sort By Filter</span>
                  <div className="h-px w-8 bg-stone-200" />
                </div>
                <Select 
                  value={filters.sort} 
                  onValueChange={(val) => setFilters(prev => ({ ...prev, sort: val }))}
                >
                  <SelectTrigger className="w-[180px] h-[58px] rounded-[22px] border-none bg-white shadow-sm text-stone-700 font-bold hover:shadow-md transition-all duration-300 cursor-pointer focus:ring-[#0E6835]/20">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-stone-200 shadow-2xl p-1">
                    <SelectItem value="newest" className="rounded-xl py-3 cursor-pointer focus:bg-stone-50">Newest</SelectItem>
                    <SelectItem value="featured" className="rounded-xl py-3 cursor-pointer focus:bg-stone-50">Featured First</SelectItem>
                    <SelectItem value="price_asc" className="rounded-xl py-3 cursor-pointer focus:bg-stone-50">Price: Low to High</SelectItem>
                    <SelectItem value="price_desc" className="rounded-xl py-3 cursor-pointer focus:bg-stone-50">Price: High to Low</SelectItem>
                    <SelectItem value="popular" className="rounded-xl py-3 cursor-pointer focus:bg-stone-50">Most Popular</SelectItem>
                    <SelectItem value="rating" className="rounded-xl py-3 cursor-pointer focus:bg-stone-50">Top Rated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

              <TabsContent value="products" className="mt-0">
                <Products 
                  location="Products" 
                  sort={filters.sort}
                  minItemWidth={200}
                  gap={4}
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
