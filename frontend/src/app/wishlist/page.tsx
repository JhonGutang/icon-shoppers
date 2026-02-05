"use client";

import React from "react";
import Navbar from "@/components/shared/layout/Navbar";
import { useQuery } from "@tanstack/react-query";
import { wishlistService } from "@/services/wishlistService";
import { QUERY_KEYS } from "@/constants/queryKeys";
import ProductCard from "@/components/product/ProductCard";
import { Button } from "@/components/shared/ui/button";
import { HeartOff, ShoppingBag } from "lucide-react";
import Link from "next/link";
import SkeletonLayer from "@/components/shared/skeletons/SkeletonLayer";
import WishlistSkeleton from "@/components/shared/skeletons/WishlistSkeleton";

const WishlistPage = () => {
  const { data: wishlistData, isLoading } = useQuery({
    queryKey: QUERY_KEYS.WISHLIST.ALL,
    queryFn: () => wishlistService.getWishlist(),
  });


  const products = React.useMemo(() => {
    if (!wishlistData) return [];
    
    if (wishlistData.data && Array.isArray(wishlistData.data)) {
      return wishlistData.data.map((item: any) => item.product).filter(Boolean);
    }
    
    if (Array.isArray(wishlistData)) {
      return wishlistData.map((item: any) => item.product).filter(Boolean);
    }
    
    return [];
  }, [wishlistData]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <h1 className="mb-8 text-3xl font-bold tracking-tight">My Wishlist</h1>

        <SkeletonLayer isLoading={isLoading} fallback={<WishlistSkeleton />}>
        {products.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex h-96 flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <HeartOff size={40} className="text-muted-foreground" />
            </div>
            <h2 className="text-xl font-bold">Your wishlist is empty</h2>
            <p className="mt-2 text-muted-foreground">Save items you like for later!</p>
            <Button asChild className="mt-6 rounded-full px-8">
              <Link href="/search">
                <ShoppingBag className="mr-2" size={18} />
                Explore Products
              </Link>
            </Button>
          </div>
        )}
        </SkeletonLayer>
      </main>
    </div>
  );
};

export default WishlistPage;
