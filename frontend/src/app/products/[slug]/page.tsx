"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useProductDetails, useRelatedProducts } from "@/hooks/product/useProductsQuery";
import Navbar from "@/components/shared/layout/Navbar";
import { Button } from "@/components/shared/ui/button";
import { Badge } from "@/components/shared/ui/badge";
import { ShoppingCart, Heart, Store, ShieldCheck, Truck, RotateCcw, Star, Plus, Minus } from "lucide-react";
import ProductGrid from "@/components/product/ProductGrid";
import { useToggleWishlistMutation } from "@/hooks/customer/useWishlistMutations";
import { cartService } from "@/services/cartService";
import { useSnackbar } from "@/components/shared/context/SnackbarContext";
import { useCartStore } from "@/stores/useCartStore";
import { cn } from "@/lib/utils";
import Link from "next/link";
import SkeletonLayer from "@/components/shared/skeletons/SkeletonLayer";
import ProductDetailsSkeleton from "@/components/shared/skeletons/ProductDetailsSkeleton";
import ProductFeedback from "@/components/product/ProductFeedback";

const ProductDetailsPage = () => {
  const { slug } = useParams() as { slug: string };
  const { data: product, isLoading, isError } = useProductDetails(slug);
  const { data: relatedProducts } = useRelatedProducts(product?.id || 0);
  const toggleWishlist = useToggleWishlistMutation();
  const { productsInCart, addProduct, fetchCart } = useCartStore();
  const { openSnackbar } = useSnackbar();
  
  const [quantity, setQuantity] = useState(1);

  // Initialize cart on mount if not already done
  React.useEffect(() => {
    if (productsInCart.length === 0) {
      fetchCart();
    }
  }, []);

  if (isError || (!isLoading && !product)) return <div className="p-20 text-center">Product not found.</div>;

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      await cartService.addToCart(product.id, quantity);
      addProduct(product as any, quantity);
      openSnackbar(`Added ${quantity} item(s) to cart`, "success");
    } catch (error) {
      openSnackbar("Failed to add item to cart", "error");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <SkeletonLayer isLoading={isLoading} fallback={<ProductDetailsSkeleton />}>
          {product && (
            <main className="container mx-auto px-4 py-8 flex-1">
                {/* Breadcrumbs placeholder */}
                <div className="mb-6 flex gap-2 text-xs text-muted-foreground">
                <span>Home</span> / <span>Products</span> / <span className="text-foreground font-medium">{product.name}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                {/* Left: Product Images */}
                <div className="space-y-4">
                    <div className="aspect-square overflow-hidden rounded-3xl bg-muted border border-border shadow-sm">
                    <img
                        src={
                        product.image
                            ? `${process.env.NEXT_PUBLIC_LARAVEL_API_URL}/storage/${product.image}`
                            : "https://placehold.co/800x800?text=Product+Image"
                        }
                        alt={product.name}
                        className="h-full w-full object-cover"
                    />
                    </div>
                </div>

                {/* Right: Product Info */}
                <div className="flex flex-col">
                    <div className="mb-2">
                    <Badge variant="secondary" className="mb-2">{product.category?.name || "General"}</Badge>
                    <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">{product.name}</h1>
                    </div>

                    {/* Price & Rating */}
                    <div className="mt-4 flex items-center justify-between">
                    <div className="text-3xl font-bold text-primary">
                        ₱{parseFloat(product.price).toLocaleString()}
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-yellow-500">
                            <Star size={18} fill="currentColor" />
                            <span className="text-lg font-bold text-foreground">{product.average_rating || 0}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">| {product.review_count || 0} Reviews</span>
                    </div>
                    </div>

                    <div className="mt-2 text-sm text-muted-foreground">
                    {product.sales_count || 0} units sold
                    </div>

                    {/* Description */}
                    <div className="mt-8">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground inline-block border-b-2 border-primary pb-1">Description</h3>
                    <p className="mt-4 text-muted-foreground leading-relaxed whitespace-pre-wrap">
                        {product.description || "No description available for this product."}
                    </p>
                    </div>

                    <hr className="my-8" />

                    {/* Variations placeholder */}
                    {product.variants && product.variants.length > 0 && (
                    <div className="mb-8">{/* Variation chips would go here */}</div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="flex h-12 items-center justify-center rounded-full border border-border bg-muted/30 px-2 shadow-inner">
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 rounded-full"
                            onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        >
                        <Minus size={16} />
                        </Button>
                        <span className="w-12 text-center font-bold">{quantity}</span>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 rounded-full"
                            onClick={() => setQuantity(q => q + 1)}
                        >
                        <Plus size={16} />
                        </Button>
                    </div>

                    <Button 
                        className="h-12 flex-1 rounded-full text-lg font-bold shadow-lg"
                        onClick={handleAddToCart}
                    >
                        <ShoppingCart className="mr-2" size={20} />
                        Add to Cart
                    </Button>
                    
                    <Button 
                        variant="outline" 
                        size="icon" 
                        className={cn(
                            "h-12 w-12 rounded-full border-border bg-muted/20",
                            product.is_in_wishlist ? "text-red-500 bg-red-50" : ""
                        )}
                        onClick={() => toggleWishlist.mutate(product.id)}
                    >
                        <Heart size={20} fill={product.is_in_wishlist ? "currentColor" : "none"} />
                    </Button>
                    </div>

                    {/* Shop Card */}
                    <Link href={`/${product.shop?.slug || product.shop_id}`} className="mt-10 group bg-muted/30 p-4 rounded-2xl border border-border/60 hover:border-primary/40 transition-colors">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <Store className="text-primary" size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold group-hover:text-primary transition-colors">{product.shop?.name || product.shop_name}</h4>
                            <p className="text-xs text-muted-foreground">Authorized Merchant</p>
                        </div>
                        </div>
                        <Button variant="ghost" className="text-primary">Visit Shop</Button>
                    </div>
                    </Link>

                    {/* Policies */}
                    <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <PolicyItem icon={<ShieldCheck className="text-green-500" />} title="Quality Guaranteed" />
                    <PolicyItem icon={<Truck className="text-blue-500" />} title="Fast Local Delivery" />
                    <PolicyItem icon={<RotateCcw className="text-orange-500" />} title="7 Days Return" />
                    </div>
                </div>
                </div>

                {/* Product Feedback */}
                <ProductFeedback productId={product.id} productName={product.name} />

                {/* Related Products */}
                <section className="mt-24">
                <h2 className="text-2xl font-bold mb-8">Related Products</h2>
                <ProductGrid products={relatedProducts || []} isLoading={!relatedProducts} />
                </section>
            </main>
          )}
      </SkeletonLayer>
    </div>
  );
};

const PolicyItem = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
  <div className="flex flex-col items-center text-center p-3">
    <div className="mb-2">{icon}</div>
    <span className="text-[10px] font-bold uppercase tracking-tight text-muted-foreground">{title}</span>
  </div>
);

export default ProductDetailsPage;
