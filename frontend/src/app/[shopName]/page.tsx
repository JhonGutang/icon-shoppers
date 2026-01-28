"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchSpecificShop } from "@/services/shopService";
import { Product, Shop } from "@/types/product";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/landing-page/Footer";
import ProtectedRoute from "@/components/ProtectedRoute";
import ProductContainer from "@/components/ProductContainer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Phone, Star, MapPin, Calendar, Info, Store } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const ShopPage = () => {
  const { shopName } = useParams();
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  useEffect(() => {
    let isMounted = true;
    const fetchShopData = async () => {
      if (shopName) {
        const formattedShopName = Array.isArray(shopName)
          ? shopName[0]
          : shopName;
        try {
          setLoading(true);
          const data = await fetchSpecificShop(formattedShopName);
          if (isMounted) {
            setShop(data);
            setAllProducts(data.products || []);
            setFeaturedProducts(
              data.products?.filter(
                (product: Product) => product.is_featured
              ) || []
            );
          }
        } catch (error) {
          console.error("Error fetching shop:", error);
        } finally {
          if (isMounted) setLoading(false);
        }
      }
    };

    fetchShopData();

    return () => {
      isMounted = false;
    };
  }, [shopName]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-primary/20 rounded-full"></div>
          <p className="text-muted-foreground font-medium">Loading shop details...</p>
        </div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
          <Info size={64} className="text-muted-foreground mb-4" />
          <h1 className="text-3xl font-bold mb-2">Shop Not Found</h1>
          <p className="text-muted-foreground max-w-md">
            The shop you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <Button asChild className="mt-8 rounded-full px-8">
            <Link href="/">Back to Home</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <ProtectedRoute requireAuth={false}>
      <div className="flex min-h-screen flex-col bg-background">
        <Navbar />

        <main className="flex-1 pb-12">
          {/* Shop Header / Banner Area */}
          <div className="relative w-full h-[250px] md:h-[350px] bg-muted overflow-hidden">
            {shop.banner_image ? (
              <img
                src={`${process.env.NEXT_PUBLIC_LARAVEL_API_URL}/storage/${shop.banner_image}`}
                alt={`${shop.name} Banner`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-primary/10 via-primary/5 to-background flex items-center justify-center">
                <Store size={80} className="text-primary/20" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            
            <div className="absolute bottom-0 left-0 w-full">
              <div className="container mx-auto px-4 pb-8 flex flex-col md:flex-row items-end gap-6">
                {/* Shop Logo */}
                <div className="relative -mb-4 md:-mb-12 h-24 w-24 md:h-36 md:w-36 rounded-2xl border-4 border-background bg-white shadow-xl overflow-hidden shrink-0">
                  <img
                    src={shop.logo_image ? `${process.env.NEXT_PUBLIC_LARAVEL_API_URL}/storage/${shop.logo_image}` : "https://placehold.co/200x200?text=Shop"}
                    alt={shop.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1 pb-2">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h1 className="text-2xl md:text-4xl font-bold text-white drop-shadow-md">
                      {shop.name}
                    </h1>
                    <Badge variant="secondary" className="bg-primary text-primary-foreground font-bold">
                      Verified Seller
                    </Badge>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-white/90 text-sm md:text-base">
                    <div className="flex items-center gap-1.5 drop-shadow-sm">
                      <Star size={16} className="fill-yellow-400 text-yellow-400" />
                      <span className="font-bold">{shop.rating || "N/A"}</span>
                      <span className="opacity-75">Rating</span>
                    </div>
                    <div className="h-1 w-1 rounded-full bg-white/50"></div>
                    <div className="flex items-center gap-1.5 drop-shadow-sm">
                      <span className="font-bold">{shop.follower_count || 0}</span>
                      <span className="opacity-75">Followers</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4 mt-8 md:mt-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Sidebar Info */}
              <div className="lg:col-span-3 space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border p-6">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <Info size={18} className="text-primary" />
                    Shop Information
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Email</div>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail size={14} className="text-muted-foreground" />
                        <span>{shop.email}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Contact</div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone size={14} className="text-muted-foreground" />
                        <span>{shop.contact_number}</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Region</div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin size={14} className="text-muted-foreground" />
                        <span>Pinamungajan to Balamban</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Joined</div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar size={14} className="text-muted-foreground" />
                        <span>Local Seller</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border p-6">
                  <h3 className="font-bold text-lg mb-4">Description</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {shop.description || "Welcome to our shop! We provide the best local products from Pinamungajan to Balamban. Supporting local farmers and producers with every purchase."}
                  </p>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="lg:col-span-9 space-y-8">
                <Tabs defaultValue="all" className="w-full">
                  <div className="flex items-center justify-between mb-6">
                    <TabsList className="bg-muted/50 p-1 h-12 rounded-xl">
                      <TabsTrigger value="all" className="rounded-lg px-6 font-bold">All Products</TabsTrigger>
                      <TabsTrigger value="featured" className="rounded-lg px-6 font-bold">Featured</TabsTrigger>
                      <TabsTrigger value="reviews" className="rounded-lg px-6 font-bold">Reviews</TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="all" className="mt-0">
                    <ProductContainer 
                      products={allProducts}
                      isLoading={loading}
                      emptyMessage="This shop has no products yet."
                      shopName={shop.name}
                    />
                  </TabsContent>

                  <TabsContent value="featured" className="mt-0">
                    <ProductContainer 
                      products={featuredProducts}
                      isLoading={loading}
                      emptyMessage="This shop has no featured products."
                      shopName={shop.name}
                    />
                  </TabsContent>

                  <TabsContent value="reviews" className="mt-0">
                    <div className="bg-white rounded-2xl shadow-sm border p-8 text-center">
                      <div className="mb-4 flex justify-center">
                        <div className="flex items-center gap-2 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full font-bold">
                          <Star size={20} className="fill-yellow-900" />
                          <span className="text-2xl">{shop.rating || "5.0"}</span>
                        </div>
                      </div>
                      <h3 className="text-xl font-bold mb-2">Shop Rating & Feedback</h3>
                      <p className="text-muted-foreground max-w-md mx-auto">
                        Customers love shopping here! Below are some of the feedbacks from our verified buyers.
                      </p>
                      
                      <div className="mt-10 grid gap-4 text-left">
                        {/* Placeholder for real feedback */}
                        <div className="p-4 rounded-xl border bg-muted/20">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex text-yellow-500">
                              <Star size={14} className="fill-current" />
                              <Star size={14} className="fill-current" />
                              <Star size={14} className="fill-current" />
                              <Star size={14} className="fill-current" />
                              <Star size={14} className="fill-current" />
                            </div>
                            <span className="text-xs font-bold text-muted-foreground">Verified Buyer</span>
                          </div>
                          <p className="text-sm font-medium italic">&quot;Great quality and fast delivery! Highly recommend this shop.&quot;</p>
                        </div>
                        <div className="p-4 rounded-xl border bg-muted/20">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex text-yellow-500">
                              <Star size={14} className="fill-current" />
                              <Star size={14} className="fill-current" />
                              <Star size={14} className="fill-current" />
                              <Star size={14} className="fill-current" />
                              <Star size={14} className="fill-current" />
                            </div>
                            <span className="text-xs font-bold text-muted-foreground">Verified Buyer</span>
                          </div>
                          <p className="text-sm font-medium italic">&quot;Fresh products every time. Very friendly seller!&quot;</p>
                        </div>
                      </div>

                      <Button className="mt-8 rounded-full">
                        Write a Review
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default ShopPage;
