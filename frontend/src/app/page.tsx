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
        <section id="home">
          <Hero onViewProducts={scrollToProducts} />
        </section>

        {/* Products Section */}
        <section id="products" className="py-28 container mx-auto px-4 sm:px-6 lg:px-8" ref={productRef}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-6">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-4 rounded-2xl shadow-inner">
                <Sparkles className="text-green-700" size={32} />
              </div>
              <div>
                <h2 className="text-3xl font-black text-stone-900 tracking-tight">Local Marketplace</h2>
                <p className="text-stone-500">Discover authentic goods from the heart of our community</p>
              </div>
            </div>
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <ProductGrid 
              isLanding={true}
              products={productsData?.data || []} 
              isLoading={isProductsLoading} 
            />
            
            <div className="mt-16 text-center">
              <Link 
                href="/auth"
                className="inline-flex items-center gap-2 text-stone-900 font-bold hover:text-green-700 transition-colors group"
              >
                <span>Sign in to view more products</span>
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
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
