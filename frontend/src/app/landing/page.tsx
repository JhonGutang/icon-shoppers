"use client";

import React, { useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/landing-page/Hero";
import AboutUs from "@/components/landing-page/About-us";
import Footer from "@/components/landing-page/Footer";
import { useProducts, useFeaturedProducts } from "@/hooks/queries/useProductsQuery";
import ProductGrid from "@/components/ProductGrid";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronRight, TrendingUp, Sparkles } from "lucide-react";
import { useCategories } from "@/hooks/queries/useCategoryQuery";
import useAuthStore from "@/stores/useAuthStore";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();
  const { accessToken, hasHydrated } = useAuthStore();
  const productRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (hasHydrated && accessToken) {
      router.push("/");
    }
  }, [accessToken, hasHydrated, router]);

  const scrollToProducts = () => {
    productRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const { data: featuredData, isLoading: isFeaturedLoading } = useFeaturedProducts(1);
  const { data: latestData, isLoading: isLatestLoading } = useProducts({ sort: 'newest', per_page: 5 });
  const { data: categories } = useCategories();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar isLanding={true} />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section id="home">
          <Hero onViewProducts={scrollToProducts} />
        </section>

        {/* Category Icons */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
             <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
                {categories?.map((cat) => (
                  <Link 
                    key={cat.id} 
                    href="/auth"
                    className="flex flex-col items-center group"
                  >
                    <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-card border-border flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:border-primary/40 transition-all">
                       <span className="text-primary font-bold">{cat.name.substring(0, 1)}</span>
                    </div>
                    <span className="mt-2 text-xs font-bold text-muted-foreground group-hover:text-primary">{cat.name}</span>
                  </Link>
                ))}
             </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16 container mx-auto px-4" ref={productRef}>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Sparkles className="text-primary" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight">Featured for You</h2>
                <p className="text-sm text-muted-foreground">Hand-picked quality from local artisans</p>
              </div>
            </div>
            <Button variant="ghost" asChild className="rounded-full">
              <Link href="/auth">
                View All <ChevronRight size={16} />
              </Link>
            </Button>
          </div>
          
          <ProductGrid 
            isLanding={true}
            products={(featuredData?.data || []).slice(0, 5)} 
            isLoading={isFeaturedLoading} 
          />
        </section>

        {/* Latest Arrivals */}
        <section className="py-16 container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <TrendingUp className="text-blue-600" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight">Latest Arrivals</h2>
                <p className="text-sm text-muted-foreground">The newest additions from your favorite shops</p>
              </div>
            </div>
            <Button variant="ghost" asChild className="rounded-full">
              <Link href="/auth">
                View All <ChevronRight size={16} />
              </Link>
            </Button>
          </div>
          
          <ProductGrid 
            isLanding={true}
            products={latestData?.data || []} 
            isLoading={isLatestLoading} 
          />
        </section>

        <section id="about-us">
          <AboutUs />
        </section>
      </main>

      <Footer />
    </div>
  );
}
