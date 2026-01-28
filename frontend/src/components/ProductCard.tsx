"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, EyeClosed, ShoppingCart, Store, Star, Heart, Edit, Trash2, Trophy } from "lucide-react";
import React from "react";
import { Product } from "@/types/product";
import useAuthStore from "@/stores/useAuthStore";
import { useToggleWishlistMutation } from "@/hooks/mutations/useWishlistMutations";
import { useCartStore } from "@/stores/useCartStore";
import { cartService } from "@/services/cartService";
import { useSnackbar } from "@/components/context/SnackbarContext";
import Link from "next/link";
import { cn } from "@/lib/utils";
import useProductAction from "@/hooks/useProductActions";
import EditProduct from "@/components/shop/EditProduct";

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
  const isProductOwner = role === "merchant" && (location === "shop" || location === "profile");
  
  const { addProduct: addToCartStore } = useCartStore();
  const { openSnackbar } = useSnackbar();
  const toggleWishlist = useToggleWishlistMutation();
  const { handleDeleteProduct, handleProductVisibility, handleFeatureToggle } = useProductAction();

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

  const onDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this product?")) {
      handleDeleteProduct(product.id);
    }
  };

  const onToggleVisibility = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    handleProductVisibility(e, product);
  };

  const onToggleFeatured = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleFeatureToggle(product);
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
    <div className="relative h-full flex flex-col">
      <Link href={`/products/${product.slug || product.id}`} className="flex-1">
        <Card
          className={cn(
            "group relative h-full bg-card overflow-hidden rounded-xl border border-border transition-all hover:shadow-lg hover:-translate-y-1 flex flex-col",
            className,
            !product.is_visible && "opacity-75 grayscale-[0.5]"
          )}
        >
          {/* Wishlist Toggle / Merchant Overlay */}
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

          {/* Merchant Quick Actions Overlay */}
          {isProductOwner && (
            <div className="absolute right-3 top-3 z-10 flex flex-col gap-2">
               <button
                onClick={onToggleVisibility}
                title={product.is_visible ? "Hide product" : "Show product"}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm transition-all hover:scale-110 shadow-sm",
                  product.is_visible ? "text-green-600" : "text-gray-400"
                )}
              >
                {product.is_visible ? <Eye size={16} /> : <EyeClosed size={16} />}
              </button>
               <button
                onClick={onToggleFeatured}
                title={product.is_featured ? "Unfeature" : "Feature product"}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm transition-all hover:scale-110 shadow-sm",
                  product.is_featured ? "text-yellow-500" : "text-gray-400"
                )}
              >
                <Trophy size={16} fill={product.is_featured ? "currentColor" : "none"} />
              </button>
            </div>
          )}

          {/* Product Image */}
          <div className="aspect-square w-full overflow-hidden bg-muted relative">
            <img
              src={
                product.image
                  ? `${process.env.NEXT_PUBLIC_LARAVEL_API_URL}/storage/${product.image}`
                  : "https://placehold.co/400x400?text=No+Image"
              }
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            
            {/* Status Badges */}
            <div className="absolute left-2 top-2 flex flex-col gap-1">
              {Boolean(product.is_featured) && (
                <div className="rounded-full bg-yellow-400 px-2 py-0.5 text-[10px] font-bold text-yellow-900 shadow-sm">
                  Top Featured
                </div>
              )}
              {!product.is_visible && (
                <div className="rounded-full bg-gray-800 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                  Hidden
                </div>
              )}
            </div>
          </div>

          <CardContent className="p-3 flex flex-1 flex-col">
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
              <div className="text-[10px] text-muted-foreground font-medium">
                {product.sales_count || 0} sold
              </div>
            </div>

            {/* Price & Primary Action */}
            <div className="mt-auto pt-3 flex items-center justify-between">
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
            </div>
          </CardContent>
        </Card>
      </Link>

      {/* Merchant Management Bar */}
      {isProductOwner && (
        <div className="mt-2 flex gap-2" onClick={(e) => e.stopPropagation()}>
          <EditProduct product={product} />
          <Button 
            variant="outline" 
            size="sm" 
            className="h-9 w-9 rounded-xl border-gray-200 hover:border-red-200 hover:bg-red-50 text-gray-400 hover:text-red-600"
            onClick={onDelete}
          >
            <Trash2 size={14} />
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
