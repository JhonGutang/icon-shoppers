"use client";

import React from "react";
import { Button } from "../ui/button";
import { motion, Variants, useScroll, useTransform } from "framer-motion";
import { ShoppingBag, ArrowRight, Sparkles, Globe, Heart, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface HeroProps {
  onViewProducts: () => void;
}

const Hero = ({ onViewProducts }: HeroProps) => {
  const router = useRouter();
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);
  const rotate = useTransform(scrollY, [0, 500], [0, 10]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 1, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const glassVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8, backdropFilter: "blur(0px)" },
    visible: {
      opacity: 1,
      scale: 1,
      backdropFilter: "blur(12px)",
      transition: { duration: 1.2, ease: "easeOut", delay: 1 },
    },
  };

  const titleWords = "Crafted Locally, Shared Globally.".split(" ");

  return (
    <section id="home" className="relative w-full h-screen flex items-center bg-[#fdfcf9] overflow-hidden selection:bg-[#0E6835]/20">
      {/* Background Sophistication */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,#4CC29215_0%,transparent_50%)]" />
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-[#D2B48C]/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-[#0E6835]/5 rounded-full blur-[150px] -z-10" />
      
      {/* Decorative Text Parallax */}
      <motion.div 
        style={{ y: y1, opacity: 0.03 }}
        className="absolute top-20 right-10 text-[15rem] font-black pointer-events-none select-none"
      >
        ICON
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-8">
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.1 }}
            className="lg:col-span-7 flex flex-col space-y-8 z-20"
          >
            <motion.div variants={itemVariants} className="flex items-center space-x-2">
              <div className="h-[1px] w-12 bg-[#0E6835]/40" />
              <span className="text-[#0E6835] text-xs font-bold tracking-[0.3em] uppercase">
                Premium Local Goods
              </span>
            </motion.div>

            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-[4.5rem] font-black text-stone-900 leading-[0.85] tracking-tighter">
                {titleWords.map((word, i) => (
                  <motion.span 
                    key={i} 
                    className="inline-block px-4 -mx-4 italic last:not-italic font-black overflow-hidden"
                  >
                    <motion.span
                      initial={{ y: "100%" }}
                      whileInView={{ y: 0 }}
                      viewport={{ once: false }}
                      transition={{ duration: 0.8, delay: 0.5 + i * 0.1, ease: [0.33, 1, 0.68, 1] }}
                      className="inline-block pr-4"
                    >
                      {word}
                    </motion.span>
                  </motion.span>
                ))}
              </h1>
              
              <motion.p 
                variants={itemVariants}
                className="text-sm sm:text-base text-stone-500 max-w-lg leading-relaxed font-light"
              >
                Experience the authentic essence of Pinamungajan and Balamban. From artisanal crafts to heritage harvests, we bring the best of the community to your table.
              </motion.p>
            </div>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg"
                className="bg-[#0E6835] hover:bg-stone-900 text-white px-8 h-14 text-base rounded-full shadow-2xl shadow-green-900/10 group transition-all duration-500 overflow-hidden relative"
                onClick={() => router.push("/auth")}
              >
                <span className="relative z-10 flex items-center">
                  Get Started
                  <Sparkles className="ml-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
                </span>
                <motion.div 
                  className="absolute inset-0 bg-white/10 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500"
                />
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="bg-stone-100/50 backdrop-blur-md hover:bg-white text-stone-800 border-stone-200/50 px-8 h-14 text-base rounded-full transition-all duration-500 shadow-sm group"
                onClick={onViewProducts}
              >
                <span className="flex items-center">
                  Marketplace
                  <ShoppingBag className="ml-2 h-4 w-4 group-hover:translate-y-[-2px] transition-transform" />
                </span>
              </Button>
            </motion.div>

            {/* Premium Trust Signal Strip */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-wrap items-center gap-x-8 gap-y-3 pt-6"
            >
              {[
                { icon: Globe, text: "Community Roots" },
                { icon: ShieldCheck, text: "Verified Quality" },
                { icon: Heart, text: "Direct Support" }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 group cursor-default">
                  <div className="w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center group-hover:border-[#0E6835] transition-colors duration-500">
                    <item.icon className="w-4 h-4 text-stone-400 group-hover:text-[#0E6835] transition-colors duration-500" />
                  </div>
                  <span className="text-sm font-bold text-stone-500 uppercase tracking-widest">{item.text}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Dynamic Image Grid Column */}
          <div className="lg:col-span-5 relative h-[400px] lg:h-[550px] flex items-center">
            
            {/* Main Image Layer */}
            <motion.div 
              style={{ y: y2, rotate }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 w-full aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] ring-1 ring-white/20"
            >
              <Image 
                src="/diverse_local_products.png" 
                alt="Diverse Local Artisan Products" 
                fill
                className="object-cover hover:scale-110 transition-transform duration-[2s] ease-out"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 via-transparent to-transparent opacity-60" />
            </motion.div>

            {/* Overlapping Glass Card */}
            <motion.div 
              variants={glassVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }}
              className="absolute -bottom-6 -right-12 lg:-right-20 z-30 p-8 rounded-[2rem] bg-white/40 backdrop-blur-xl border border-white/40 shadow-2xl max-w-xs"
            >
              <div className="flex flex-col gap-4">
                <div className="w-12 h-12 bg-[#0E6835] rounded-2xl flex items-center justify-center shadow-lg shadow-green-900/20">
                  <Sparkles className="text-white w-6 h-6" />
                </div>
                <h3 className="text-2xl font-black text-stone-900 leading-tight">Authentic Heritage</h3>
                <p className="text-stone-600 text-sm font-medium leading-relaxed">
                  Every product tells a story of tradition, skill, and the vibrant spirit of our local artisans.
                </p>
              </div>
            </motion.div>

            {/* Background Texture/Shape */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border-[1px] border-stone-200 rounded-full -z-10 opacity-40 animate-[spin_60s_linear_infinite]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] border-[1px] border-stone-100 rounded-full -z-10 opacity-30 animate-[spin_90s_linear_reverse_infinite]" />
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
