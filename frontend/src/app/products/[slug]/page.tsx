"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { useProductDetails, useRelatedProducts } from "@/hooks/product/useProductsQuery";
import Navbar from "@/components/shared/layout/Navbar";
import { Button } from "@/components/shared/ui/button";
import { Badge } from "@/components/shared/ui/badge";
import { 
  ShoppingCart, 
  Heart, 
  Store, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Star, 
  Plus, 
  Minus,
  ChevronRight,
  Sparkles,
  ArrowLeft
} from "lucide-react";
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
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useRouter } from "next/navigation";

/**
 * ProductGallery handles the scroll-parallax effect for the product image.
 * Moving this to a sub-component ensures useScroll is called with a hydrated ref.
 */
const ProductGallery = ({ product }: { product: any }) => {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });

  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);

  return (
    <div ref={targetRef} className="lg:col-span-5">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="group relative aspect-square overflow-hidden rounded-[2.5rem] bg-stone-200/40 border border-stone-200/60 shadow-xl shadow-stone-200/30"
      >
        <motion.img
          style={{ scale: imgScale, y: imgY }}
          src={
            product.image
              ? `${process.env.NEXT_PUBLIC_LARAVEL_API_URL}/storage/${product.image}`
              : "https://placehold.co/1000x1000?text=Product+Image"
          }
          alt={product.name}
          className="h-full w-full object-cover"
        />
        
        {/* Floating Selection Badge */}
        <div className="absolute top-8 left-8">
          <div className="flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/90 backdrop-blur-md border border-white text-[#0E6835] text-[9px] font-black uppercase tracking-[0.3em] shadow-lg">
            <Sparkles size={12} className="fill-[#0E6835]" />
            Local Craft
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const ProductDetailsPage = () => {
  const router = useRouter();
  const { slug } = useParams() as { slug: string };
  const { data: product, isLoading, isError } = useProductDetails(slug);
  const { data: relatedProducts } = useRelatedProducts(product?.id || 0);
  const toggleWishlist = useToggleWishlistMutation();
  const { productsInCart, addProduct, fetchCart } = useCartStore();
  const { openSnackbar } = useSnackbar();
  
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("product");
  const [showMobileCTA, setShowMobileCTA] = useState(false);

  useEffect(() => {
    if (productsInCart.length === 0) {
      fetchCart();
    }

    const handleScroll = () => {
      // Show mobile CTA when scrolled past the main image area (~400px)
      setShowMobileCTA(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [productsInCart.length]);

  if (isError || (!isLoading && !product)) return (
    <div className="flex min-h-screen flex-col bg-stone-50/50">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center p-20 text-center">
        <h2 className="text-2xl font-black text-stone-900 mb-4 tracking-tight">Product Not Found</h2>
        <p className="text-stone-500 mb-8 font-light italic">The story of this piece has come to an end or is yet to be written.</p>
        <Button onClick={() => router.push("/home")} variant="outline" className="rounded-full px-10 border-stone-200 text-stone-900 font-black uppercase tracking-widest text-[10px]">
          Back to Marketplace
        </Button>
      </div>
    </div>
  );

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      await cartService.addToCart(product.id, quantity);
      addProduct(product as any, quantity);
      openSnackbar(`Added ${quantity} item(s) to collection`, "success");
    } catch (error) {
      openSnackbar("Failed to update collection", "error");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-stone-50/50">
      <Navbar />
      
      <SkeletonLayer isLoading={isLoading} fallback={<ProductDetailsSkeleton />}>
        {product && (
          <main className="flex-1 container mx-auto px-4 py-8">
            {/* Nav & Navigation */}
            <div className="mb-12 flex items-center justify-between">
              <button 
                onClick={() => router.back()}
                className="group flex items-center gap-3 text-stone-500 hover:text-stone-900 transition-all"
              >
                <div className="w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all group-hover:-translate-x-1">
                  <ArrowLeft size={16} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Return</span>
              </button>

              <div className="hidden md:flex items-center gap-4 text-[10px] uppercase tracking-[0.2em] font-medium text-stone-400">
                <Link href="/home" className="hover:text-stone-900 transition-colors">Home</Link>
                <span className="text-stone-200">/</span>
                <span className="text-stone-900 font-black">{product.name}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              {/* Left Column: Gallery (5/12) */}
              <ProductGallery product={product} />

              {/* Right Column: Tabs & Content (7/12) */}
              <div className="lg:col-span-7 lg:sticky lg:top-24 space-y-10">
                {/* Custom Tabs Trigger */}
                <div className="flex gap-10 border-b border-stone-200/60 pb-1">
                  <button 
                    onClick={() => setActiveTab("product")}
                    className={cn(
                      "text-[10px] font-black uppercase tracking-[0.3em] pb-5 transition-all relative",
                      activeTab === "product" ? "text-stone-900" : "text-stone-400 hover:text-stone-600"
                    )}
                  >
                    Product
                    {activeTab === "product" && (
                      <motion.div layoutId="tab-underline-main" className="absolute bottom-0 left-0 right-0 h-1 bg-[#0E6835]" />
                    )}
                  </button>
                  <button 
                    onClick={() => setActiveTab("details")}
                    className={cn(
                      "text-[10px] font-black uppercase tracking-[0.3em] pb-5 transition-all relative",
                      activeTab === "details" ? "text-stone-900" : "text-stone-400 hover:text-stone-600"
                    )}
                  >
                    Details
                    {activeTab === "details" && (
                      <motion.div layoutId="tab-underline-main" className="absolute bottom-0 left-0 right-0 h-1 bg-[#0E6835]" />
                    )}
                  </button>
                  <button 
                    onClick={() => setActiveTab("feedback")}
                    className={cn(
                      "text-[10px] font-black uppercase tracking-[0.3em] pb-5 transition-all relative",
                      activeTab === "feedback" ? "text-stone-900" : "text-stone-400 hover:text-stone-600"
                    )}
                  >
                    Feedback
                    {activeTab === "feedback" && (
                      <motion.div layoutId="tab-underline-main" className="absolute bottom-0 left-0 right-0 h-1 bg-[#0E6835]" />
                    )}
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  {activeTab === "product" ? (
                    <motion.div 
                      key="product-tab"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="space-y-10"
                    >
                      {/* Identity & Price Section */}
                      <div className="space-y-6">
                        <div className="flex items-center gap-3">
                          <Badge className="bg-[#0E6835] hover:bg-[#0E6835]/90 rounded-full px-5 py-1.5 text-[10px] font-black uppercase tracking-widest border-0">
                            {product.category?.name || "Premium Selection"}
                          </Badge>
                          {product.average_rating > 0 && (
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-stone-200 text-stone-900 text-[10px] font-black uppercase tracking-widest shadow-sm">
                              <Star size={12} className="fill-[#0E6835] text-[#0E6835]" />
                              {Number(product.average_rating).toFixed(1)}
                              {product.review_count > 0 && (
                                <span className="text-stone-400 font-medium lowercase">({product.review_count} reviews)</span>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <h1 className="text-4xl md:text-5xl font-black text-stone-900 tracking-tighter leading-none">
                            {product.name}
                          </h1>
                          <div className="flex items-baseline gap-4">
                            <span className="text-4xl font-light text-stone-900 tracking-tighter">
                              ₱{parseFloat(product.price).toLocaleString()}
                            </span>
                            <span className="text-stone-400 text-[9px] font-black uppercase tracking-[0.2em]">
                              Cash on Delivery
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Container */}
                      <div className="p-8 rounded-[2.5rem] bg-stone-50/50 border border-stone-200/40 shadow-sm space-y-8">
                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="flex-1 space-y-3">
                            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-stone-400 pl-4">Quantity</label>
                            <div className="flex h-11 items-center justify-between rounded-xl border border-stone-200 bg-white px-5">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 rounded-full hover:bg-stone-50"
                                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                              >
                                <Minus size={16} className="text-stone-600" />
                              </Button>
                              <span className="text-lg font-black text-stone-900">{quantity}</span>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 rounded-full hover:bg-stone-50"
                                onClick={() => setQuantity(q => q + 1)}
                              >
                                <Plus size={16} className="text-stone-600" />
                              </Button>
                            </div>
                          </div>

                          <div className="flex-1 flex gap-3 self-end">
                            <Button 
                              className="h-11 flex-1 rounded-xl bg-[#0E6835] text-white hover:bg-[#0E6835]/90 text-[11px] font-black uppercase tracking-widest shadow-lg shadow-[#0E6835]/10 transition-all active:scale-[0.98] group"
                              onClick={handleAddToCart}
                            >
                              <ShoppingCart className="mr-3 group-hover:-translate-y-0.5 transition-transform" size={16} />
                              Add To Collection
                            </Button>
                            
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className={cn(
                                "h-11 w-11 rounded-xl border-stone-200 bg-white hover:bg-stone-50 transition-all",
                                product.is_in_wishlist ? "text-red-500 border-red-50 bg-red-50" : ""
                              )}
                              onClick={() => toggleWishlist.mutate(product.id)}
                            >
                              <Heart size={18} fill={product.is_in_wishlist ? "currentColor" : "none"} className={cn(product.is_in_wishlist && "animate-pulse")} />
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Redesigned Shop Card */}
                      <Link 
                        href={`/${product.shop?.slug || product.shop_id}`} 
                        className="group relative flex items-center justify-between p-7 rounded-[2.5rem] bg-white border border-stone-200/60 shadow-sm hover:shadow-xl hover:border-[#0E6835]/20 transition-all duration-500 overflow-hidden"
                      >
                        <div className="flex items-center gap-5">
                          <div className="relative">
                            <div className="w-14 h-14 rounded-2xl bg-stone-50 flex items-center justify-center border border-stone-100 group-hover:bg-white group-hover:scale-110 transition-all duration-500">
                              <Store className="text-[#0E6835]" size={28} />
                            </div>
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#4CC292] rounded-full border-2 border-white flex items-center justify-center">
                              <ShieldCheck size={8} className="text-white" />
                            </div>
                          </div>
                          
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0E6835]">Certified Merchant</span>
                            </div>
                            <h4 className="font-black text-stone-900 text-xl tracking-tighter leading-none group-hover:translate-x-1 transition-transform">
                              {product.shop?.name || product.shop_name}
                            </h4>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="hidden sm:block text-right">
                            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-stone-400">View</p>
                            <p className="text-[10px] font-black uppercase tracking-[0.1em] text-stone-900">Studio</p>
                          </div>
                          <div className="w-10 h-10 rounded-full border border-stone-100 flex items-center justify-center group-hover:bg-[#0E6835] group-hover:text-white group-hover:border-[#0E6835] transition-all duration-500">
                            <ChevronRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ) : activeTab === "details" ? (
                    <motion.div 
                      key="details-tab"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="space-y-10 pt-4"
                    >
                      {/* Description / Story */}
                      <div className="space-y-6">
                        <div className="space-y-4">
                          <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0E6835]">Description</h5>
                          <p className="text-stone-900 font-light leading-relaxed italic text-lg">
                            "{product.description || "Every stitch and surface tells a story of local craftsmanship, reflecting the soul of our community and the dedication of our artisans."}"
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-6 pt-10 border-t border-stone-100">
                        <PolicyItem icon={<ShieldCheck size={20} className="text-[#0E6835]" />} title="Verified" />
                        <PolicyItem icon={<Truck size={20} className="text-[#0E6835]" />} title="Local Courier" />
                        <PolicyItem icon={<RotateCcw size={20} className="text-[#0E6835]" />} title="7-Day Return" />
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="feedback-tab"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="pt-4"
                    >
                      <ProductFeedback productId={product.id} productName={product.name} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Removed redundant feedback section as it's now in tabs */}

            <section className="mt-20 pt-20 border-t border-stone-200">
              <div className="flex flex-col items-center text-center mb-16 space-y-4">
                <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-stone-100 text-[#0E6835] text-[9px] font-black uppercase tracking-[0.3em] shadow-sm">
                  <Sparkles size={12} className="fill-[#0E6835]" />
                  Curated Collection
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-stone-900 tracking-tighter uppercase leading-none">
                  Suggested <span className="italic font-light">Products</span>
                </h2>
              </div>
              <ProductGrid products={relatedProducts || []} isLoading={!relatedProducts} />
            </section>
          </main>
        )}
      </SkeletonLayer>

      {/* Mobile Sticky Action Bar */}
      <AnimatePresence>
        {showMobileCTA && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 z-50 lg:hidden p-5 bg-white/90 backdrop-blur-2xl border-t border-stone-200 shadow-[0_-20px_50px_rgba(0,0,0,0.1)]"
          >
            <div className="flex items-center gap-6 max-w-lg mx-auto">
              <div className="flex-1">
                <p className="text-[9px] font-black uppercase tracking-widest text-[#0E6835] mb-1">{product?.name}</p>
                <p className="text-2xl font-black text-stone-900 leading-none tracking-tighter">₱{product ? parseFloat(product.price).toLocaleString() : 0}</p>
              </div>
              <Button 
                onClick={handleAddToCart}
                className="h-14 px-10 rounded-full bg-stone-900 text-white font-black uppercase tracking-widest text-[10px] shadow-2xl active:scale-95 transition-transform"
              >
                Add Collection
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const DetailItem = ({ label, value }: { label: string; value: string }) => (
    <div className="p-6 rounded-[2rem] bg-white border border-stone-200/60 shadow-sm hover:shadow-md transition-shadow">
      <span className="block text-[8px] font-black uppercase tracking-[0.3em] text-stone-400 mb-2">{label}</span>
      <span className="font-black text-stone-900 text-sm tracking-tight">{value}</span>
    </div>
);

const PolicyItem = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
  <div className="flex flex-col items-center text-center gap-3">
    <div className="w-14 h-14 rounded-3xl bg-stone-50 flex items-center justify-center shadow-inner border border-stone-50">
      {icon}
    </div>
    <span className="text-[9px] font-black uppercase tracking-widest text-stone-500 leading-none">{title}</span>
  </div>
);

export default ProductDetailsPage;
