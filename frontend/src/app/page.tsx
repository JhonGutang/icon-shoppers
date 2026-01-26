"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/landing-page/Footer";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Products from "@/components/customer-home/Products";
import Shops from "@/components/customer-home/Shops";
import { useCategories } from "@/hooks/queries/useCategoryQuery";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Home() {
  const { data: categories } = useCategories();
  const [filters, setFilters] = useState({
    category_id: undefined as number | undefined,
    sort: "newest",
  });

  return (
    <ProtectedRoute redirectTo="/auth">
      <div className="flex min-h-screen flex-col bg-background">
        <Navbar />
        
        <main className="flex-1 overflow-x-hidden">
          <div className="container mx-auto px-4 py-8">
            <Tabs defaultValue="products" className="w-full">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <TabsList className="grid w-full max-w-md grid-cols-2 h-12">
                  <TabsTrigger value="products" className="text-lg font-bold">Explore Products</TabsTrigger>
                  <TabsTrigger value="shops" className="text-lg font-bold">Explore Shops</TabsTrigger>
                </TabsList>

                <div className="flex items-center gap-2">
                  <Select 
                    value={filters.category_id?.toString() || "all"} 
                    onValueChange={(val) => setFilters(prev => ({ 
                      ...prev, 
                      category_id: val === "all" ? undefined : Number(val) 
                    }))}
                  >
                    <SelectTrigger className="w-[160px] h-12 rounded-xl">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories?.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select 
                    value={filters.sort} 
                    onValueChange={(val) => setFilters(prev => ({ ...prev, sort: val }))}
                  >
                    <SelectTrigger className="w-[160px] h-12 rounded-xl">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="price_asc">Price: Low to High</SelectItem>
                      <SelectItem value="price_desc">Price: High to Low</SelectItem>
                      <SelectItem value="popular">Most Popular</SelectItem>
                      <SelectItem value="rating">Top Rated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <TabsContent value="products" className="mt-0">
                <div className="bg-white rounded-2xl shadow-sm border p-4 sm:p-6">
                  <Products 
                    location="Products" 
                    categoryId={filters.category_id}
                    sort={filters.sort}
                  />
                </div>
              </TabsContent>

              <TabsContent value="shops" className="mt-0">
                <div className="bg-white rounded-2xl shadow-sm border p-4 sm:p-6">
                  <Shops location="Shops" />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>

        <Footer />
      </div>
    </ProtectedRoute>
  );
}
