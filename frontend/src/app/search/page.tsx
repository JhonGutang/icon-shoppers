"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useProducts } from "@/hooks/queries/useProductsQuery";
import ProductGrid from "@/components/ProductGrid";
import Navbar from "@/components/Navbar";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { useCategories } from "@/hooks/queries/useCategoryQuery";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SearchResults = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  
  const [filters, setFilters] = useState({
    category_id: searchParams.get("category") ? Number(searchParams.get("category")) : undefined,
    min_price: 0,
    max_price: 10000,
    sort: "newest",
    page: 1,
  });

  const { data: productsData, isLoading } = useProducts({ 
    query, 
    ...filters 
  });
  
  const { data: categories } = useCategories();

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-64 space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-4">Filters</h2>
              <div className="space-y-4">
                {/* Categories */}
                <div>
                  <h3 className="font-semibold mb-2 text-sm uppercase text-muted-foreground">Category</h3>
                  <div className="space-y-2">
                    {categories?.map((cat) => (
                      <div key={cat.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`cat-${cat.id}`} 
                          checked={filters.category_id === cat.id}
                          onCheckedChange={(checked) => {
                            setFilters(prev => ({
                              ...prev,
                              category_id: checked ? cat.id : undefined
                            }));
                          }}
                        />
                        <label 
                          htmlFor={`cat-${cat.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {cat.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h3 className="font-semibold mb-2 text-sm uppercase text-muted-foreground">Price Range</h3>
                  <div className="px-2">
                    <Slider
                      defaultValue={[filters.min_price, filters.max_price]}
                      max={10000}
                      step={100}
                      onValueChange={([min, max]: number[]) => setFilters(prev => ({ ...prev, min_price: min, max_price: max }))}
                      className="my-4"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>₱{filters.min_price}</span>
                      <span>₱{filters.max_price}+</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Results Area */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold">
                  {query ? `Search Results for "${query}"` : "All Products"}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {productsData?.meta?.total || 0} items found
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground hidden sm:inline">Sort by:</span>
                <Select 
                  value={filters.sort} 
                  onValueChange={(val: string) => setFilters(prev => ({ ...prev, sort: val }))}
                >
                  <SelectTrigger className="w-[140px]">
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

            <ProductGrid 
              products={productsData?.data || []} 
              isLoading={isLoading} 
              emptyMessage={`No products found for "${query}"`}
            />
            
            {/* Pagination placeholder */}
            {productsData?.meta && productsData.meta.last_page > 1 && (
               <div className="mt-12 flex justify-center">
                  {/* Pagination component would go here */}
               </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading search...</div>}>
      <SearchResults />
    </Suspense>
  );
}
