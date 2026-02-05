"use client";

import { Button } from "@/components/shared/ui/button";
import { Card } from "@/components/shared/ui/card";
import { 
  Eye, 
  EyeClosed, 
  ShoppingCart, 
  Store, 
  Star, 
  Heart, 
  Trash2, 
  Trophy,
  ArrowUpRight 
} from "lucide-react";
import React from "react";
import { Product } from "@/types/product";
import useAuthStore from "@/stores/useAuthStore";
import { useToggleWishlistMutation } from "@/hooks/customer/useWishlistMutations";
import { useCartStore } from "@/stores/useCartStore";
import { cartService } from "@/services/cartService";
import { useSnackbar } from "@/components/shared/context/SnackbarContext";
import Link from "next/link";
import { cn } from "@/lib/utils";
import useProductAction from "@/hooks/product/useProductActions";
import EditProduct from "@/components/shop/EditProduct";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: Product;
  location?: string;
  className?: string;
  isLanding?: boolean;
  shopName?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  location,
  className,
  isLanding = false,
}) => {
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

  const cardContent = (
    <Card
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-[2.5rem] border-0 bg-white p-2 transition-all duration-500 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)]",
        className,
        !product.is_visible && "opacity-75 grayscale-[0.5]"
      )}
    >
      {/* Product Image Wrapper */}
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2.2rem] bg-stone-100">
        <img
          src={
            product.image
              ? `${process.env.NEXT_PUBLIC_LARAVEL_API_URL}/storage/${product.image}`
              : "https://placehold.co/400x400?text=No+Image"
          }
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />

        {/* Dynamic Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        
        {/* Top Badges */}
        <div className="absolute left-4 top-4 flex flex-col gap-2">
          {Boolean(product.is_featured) && (
            <div className="flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-md px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#0E6835] shadow-sm">
              <Trophy size={10} className="fill-[#0E6835]" />
              Featured
            </div>
          )}
        </div>

        {/* Action Overlays (Non-Landing) */}
        {!isLanding && (
          <div className="absolute right-4 top-4 flex flex-col gap-2 translate-x-12 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100">
            {role !== "merchant" && (
              <button
                onClick={handleToggleWishlist}
                className={cn(
                  "flex cursor-pointer h-10 w-10 items-center justify-center rounded-full bg-white shadow-xl transition-all hover:scale-110",
                  product.is_in_wishlist ? "text-red-500" : "text-stone-400 hover:text-red-500"
                )}
              >
                <Heart size={18} fill={product.is_in_wishlist ? "currentColor" : "none"} />
              </button>
            )}

            {isProductOwner && (
              <>
                <button
                  onClick={onToggleVisibility}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-stone-600 shadow-xl transition-all hover:scale-110"
                >
                  {product.is_visible ? <Eye size={18} /> : <EyeClosed size={18} />}
                </button>
                <button
                  onClick={onToggleFeatured}
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-xl transition-all hover:scale-110",
                    product.is_featured ? "text-yellow-500" : "text-stone-400"
                  )}
                >
                  <Trophy size={18} fill={product.is_featured ? "currentColor" : "none"} />
                </button>
              </>
            )}
          </div>
        )}

        {/* Quick View / External link Icon */}
        <div className="absolute bottom-4 right-4 translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <div className="flex h-12 w-12 items-center justify-center rounded-[1.2rem] bg-[#0E6835] text-white shadow-xl shadow-green-900/30">
            <ArrowUpRight size={22} />
          </div>
        </div>
      </div>

      {/* Product Information */}
      <div className="flex flex-1 flex-col px-3 py-3">
        <div className="mb-1.5 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-[#0E6835]">
            <Store size={12} />
            <span className="line-clamp-1">{product.shop?.name || product.shop_name}</span>
          </div>
          {product.average_rating > 0 && (
            <div className="flex items-center gap-1 rounded-full bg-stone-100 px-2 py-0.5">
              <Star size={10} className="fill-[#0E6835] text-[#0E6835]" />
              <span className="text-[10px] font-black text-stone-700">{product.average_rating}</span>
            </div>
          )}
        </div>

        <h3 className="line-clamp-2 text-[15px] font-bold text-stone-900 leading-tight tracking-tight">
          {product.name}
        </h3>

        <div className="mt-auto flex items-center justify-between pt-3">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Price</span>
            <span className="text-2xl font-black text-stone-950">
              ₱{parseFloat(product.price).toLocaleString()}
            </span>
          </div>

          {!isLanding && role !== "merchant" && (
            <Button
              onClick={handleAddToCart}
              className="h-12 w-12 rounded-2xl bg-stone-900 text-white shadow-xl shadow-stone-900/20 transition-all hover:bg-[#0E6835] hover:scale-105"
              size="icon"
            >
              <ShoppingCart size={20} />
            </Button>
          )}

          {isLanding && (
            <div className="h-12 w-12 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-300">
              <ShoppingCart size={20} />
            </div>
          )}
        </div>
      </div>
    </Card>
  );

  if (isLanding) {
    return (
      <div 
        onClick={() => {
          openSnackbar("Please login to see product details", "info");
          window.location.href = '/auth';
        }}
        className="cursor-pointer"
      >
        {cardContent}
      </div>
    );
  }

  return (
    <div className="relative h-full flex flex-col">
      <Link href={`/products/${product.slug || product.id}`} className="flex-1">
        {cardContent}
      </Link>

      {/* Merchant Management Overlay - Subtle */}
      {isProductOwner && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 flex gap-2 px-1" 
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex-1">
            <EditProduct product={product} />
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-11 w-11 rounded-2xl border-stone-200 bg-white text-stone-400 shadow-none hover:border-red-100 hover:bg-red-50 hover:text-red-500"
            onClick={onDelete}
          >
            <Trash2 size={18} />
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default ProductCard;
