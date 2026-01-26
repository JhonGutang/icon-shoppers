"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, EyeClosed, ShoppingCart, Store, Star, Heart } from "lucide-react";
import React from "react";
import { Product } from "@/types/product";
import useAuthStore from "@/stores/useAuthStore";
import { useToggleWishlistMutation } from "@/hooks/mutations/useWishlistMutations";
import { useCartStore } from "@/stores/useCartStore";
import { cartService } from "@/services/cartService";
import { useSnackbar } from "@/components/context/SnackbarContext";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  location?: string;
  className?: string;
  isLanding?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  location,
  className,
  isLanding = false,
}) => {
  const shopId = useAuthStore((state) => state.id);
  const role = useAuthStore((state) => state.userType);
  const token = useAuthStore((state) => state.accessToken);
  const isProductOwner = shopId === product.shop_id && location === "profile" && role === "merchant";
  
  const { addProduct: addToCartStore } = useCartStore();
  const { openSnackbar } = useSnackbar();
  const toggleWishlist = useToggleWishlistMutation();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLanding) {
      openSnackbar("Please login to see product details", "info");
      window.location.href = '/auth';
      return;
    }
    if (!token) {
      window.location.href = '/auth';
      return;
    }
    
    addToCartStore(product);
    cartService.addToCart(product.id, 1);
    openSnackbar("Added to cart", "success");
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLanding) {
      openSnackbar("Please login to manage your wishlist", "info");
      window.location.href = '/auth';
      return;
    }
    if (!token) {
      window.location.href = '/auth';
      return;
    }
    toggleWishlist.mutate(product.id);
  };

  if (isLanding) {
    return (
      <div 
        onClick={() => {
          openSnackbar("Please login to see product details", "info");
          window.location.href = '/auth';
        }}
        className="cursor-pointer"
      >
        <Card
          className={cn(
            "group relative overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-lg hover:-translate-y-1",
            className
          )}
        >
          {/* Product Image */}
          <div className="aspect-square w-full overflow-hidden bg-muted">
            <img
              src={
                product.image
                  ? `${process.env.NEXT_PUBLIC_LARAVEL_API_URL}/storage/${product.image}`
                  : "https://placehold.co/400x400?text=No+Image"
              }
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>

          <CardContent className="p-3">
            {/* Shop Name */}
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <Store size={12} />
              <span className="line-clamp-1">{product.shop?.name || product.shop_name}</span>
            </div>

            {/* Product Name */}
            <h3 className="mt-1 line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-tight">
              {product.name}
            </h3>

            {/* Price */}
            <div className="mt-2 flex items-center justify-between">
              <div className="text-base font-bold text-primary">
                ₱{parseFloat(product.price).toLocaleString()}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Link href={`/products/${product.slug || product.id}`}>
      <Card
        className={cn(
          "group relative overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-lg hover:-translate-y-1",
          className
        )}
      >
        {/* Wishlist Toggle */}
        {(role !== "merchant" && !isLanding) && (
          <button
            onClick={handleToggleWishlist}
            className={cn(
              "absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm transition-all hover:scale-110",
              product.is_in_wishlist ? "text-red-500" : "text-muted-foreground hover:text-red-500"
            )}
          >
            <Heart size={18} fill={product.is_in_wishlist ? "currentColor" : "none"} />
          </button>
        )}

        {/* Product Image */}
        <div className="aspect-square w-full overflow-hidden bg-muted">
          <img
            src={
              product.image
                ? `${process.env.NEXT_PUBLIC_LARAVEL_API_URL}/storage/${product.image}`
                : "https://placehold.co/400x400?text=No+Image"
            }
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Featured Badge */}
          {Boolean(product.is_featured) && (
            <div className="absolute left-2 top-2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
              Featured
            </div>
          )}
        </div>

        <CardContent className="p-3">
          {/* Shop Name */}
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <Store size={12} />
            <span className="line-clamp-1">{product.shop?.name || product.shop_name}</span>
          </div>

          {/* Product Name */}
          <h3 className="mt-1 line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-tight">
            {product.name}
          </h3>

          {/* Rating & Sales */}
          <div className="mt-1.5 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              <Star size={12} className="fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-medium">{product.average_rating || 0}</span>
              <span className="text-[10px] text-muted-foreground">
                ({product.review_count || 0})
              </span>
            </div>
            <div className="text-[10px] text-muted-foreground">
              {product.sales_count || 0} sold
            </div>
          </div>

          {/* Price & Add to Cart */}
          <div className="mt-2 flex items-center justify-between">
            <div className="text-base font-bold text-primary">
              ₱{parseFloat(product.price).toLocaleString()}
            </div>
            
            {(!isLanding && role !== "merchant") && (
              <Button
                size="icon"
                variant="secondary"
                className="h-8 w-8 rounded-full shadow-sm hover:bg-primary hover:text-primary-foreground"
                onClick={handleAddToCart}
              >
                <ShoppingCart size={16} />
              </Button>
            )}

            {isProductOwner && (
               <div onClick={(e) => e.stopPropagation()}>
                  <VisibilityToggle product={product} />
               </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

const VisibilityToggle: React.FC<{ product: Product }> = ({ product }) => {
  // Merchant visibility logic will be handled here
  return (
    <Button variant="ghost" size="icon" className="h-8 w-8">
      {product.is_visible ? <Eye size={16} /> : <EyeClosed size={16} />}
    </Button>
  );
};

export default ProductCard;
