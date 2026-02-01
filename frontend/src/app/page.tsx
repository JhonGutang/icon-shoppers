"use client";

import React, { useRef, useEffect } from "react";
import Navbar from "@/components/landing-page/Navbar";
import Hero from "@/components/landing-page/Hero";
import AboutUs from "@/components/landing-page/About-us";
import Footer from "@/components/landing-page/Footer";
import { useProducts } from "@/hooks/queries/useProductsQuery";
import ProductGrid from "@/components/ProductGrid";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronRight, Sparkles } from "lucide-react";
import useAuthStore from "@/stores/useAuthStore";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function LandingPage() {
  const router = useRouter();
  const { accessToken, hasHydrated } = useAuthStore();
  const productRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (hasHydrated && accessToken) {
      router.push("/home");
    }
  }, [accessToken, hasHydrated, router]);

  const scrollToProducts = () => {
    productRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const { data: productsData, isLoading: isProductsLoading } = useProducts({ per_page: 10 });

  return (
    <div className="flex min-h-screen flex-col bg-stone-50/50">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <Hero onViewProducts={scrollToProducts} />

        {/* Products Section */}
        <section id="products" className="py-20 container mx-auto px-4 sm:px-6 lg:px-8" ref={productRef}>
          <div className="flex flex-col items-center text-center mb-12 space-y-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-stone-100 border border-stone-200 text-[#0E6835] text-[10px] font-black uppercase tracking-[0.3em]"
            >
              <Sparkles size={12} />
              Curated Selection
            </motion.div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-stone-900 tracking-tight">
              The Local <span className="italic font-light">Marketplace</span>
            </h2>
            <p className="text-stone-500 max-w-2xl text-lg font-light leading-relaxed">
              Discover a meticulously curated collection of authentic goods, crafted with passion and skill by the artisans of our community. 
            </p>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <ProductGrid 
              isLanding={true}
              products={productsData?.data || []} 
              isLoading={isProductsLoading} 
            />
            
            {/* View More Call to Action */}
            <div className="mt-12 relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-stone-200"></div>
              </div>
              <div className="relative flex justify-center">
                <Link 
                  href="/auth"
                  className="inline-flex items-center gap-3 px-10 py-4 bg-white border border-stone-200 rounded-full text-stone-900 font-bold hover:bg-stone-50 hover:border-stone-300 transition-all group shadow-sm hover:shadow-md"
                >
                  <span className="text-sm uppercase tracking-widest">Sign in to view more products</span>
                  <div className="w-6 h-6 rounded-full bg-[#0E6835] flex items-center justify-center text-white group-hover:translate-x-1 transition-transform">
                    <ChevronRight size={14} />
                  </div>
                </Link>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Our Story (About Us) Section */}
        <section id="about-us">
          <AboutUs />
        </section>
      </main>

      <Footer />
    </div>
  );
}
