"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Heart, Shrub, Store, Quote } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";

const AboutUs = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["5%", "-5%"]);

  const highlights = [
    {
      icon: <Shrub size={20} />,
      title: "Handpicked Daily",
      desc: "Fresh bouquets and treats sourced directly from local gardens."
    },
    {
      icon: <Heart size={20} />,
      title: "Community Heartbeat",
      desc: "Every purchase supports a neighbor's dream and family."
    },
    {
      icon: <Store size={20} />,
      title: "Local Treasures",
      desc: "Discover unique accessories and goods you won't find anywhere else."
    }
  ];

  return (
    <section 
      id="about-us" 
      ref={containerRef}
      className="relative py-32 overflow-hidden bg-white"
    >
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-[10%] -left-[10%] w-[40%] aspect-square rounded-full bg-stone-100 blur-[100px]" />
        <div className="absolute bottom-[10%] -right-[10%] w-[30%] aspect-square rounded-full bg-green-50 blur-[80px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
          
          {/* Image Side - Asymmetrical */}
          <motion.div 
            style={{ y: imageY }}
            className="lg:col-span-5 relative"
          >
            <div className="relative aspect-[3/4] rounded-[3rem] overflow-hidden shadow-2xl shadow-stone-200">
              <Image 
                src="/local_story.png" 
                alt="Local community products" 
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-[3rem]" />
            </div>
            
            {/* Floating Card - Glassmorphism */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.5 }}
              className="absolute -bottom-10 -right-10 hidden md:block bg-white/70 backdrop-blur-xl border border-white/40 p-8 rounded-[2rem] text-stone-900 max-w-[280px] shadow-2xl shadow-stone-200/50"
            >
              <Quote className="text-[#0E6835] mb-4 opacity-50" size={32} fill="currentColor" />
              <p className="text-sm font-medium leading-relaxed italic text-stone-700">
                &quot;We believe the most beautiful things aren&apos;t just made; they&apos;re grown and crafted right here in our backyard.&quot;
              </p>
            </motion.div>
          </motion.div>

          {/* Text Side */}
          <motion.div 
            style={{ y: textY }}
            className="lg:col-span-7 space-y-12"
          >
            <div className="space-y-6">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false }}
                className="flex items-center gap-3 text-[#0E6835] text-[10px] font-black uppercase tracking-[0.3em]"
              >
                <div className="w-12 h-[1px] bg-[#0E6835]" />
                Our Heritage
              </motion.div>
              <motion.h2 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-6xl font-black text-stone-950 tracking-tight leading-[1.1]"
              >
                Every Product <br />
                Tells a <span className="text-[#0E6835] italic font-light">Community</span> Story
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ delay: 0.2 }}
                className="text-xl text-stone-500 font-light leading-relaxed max-w-xl"
              >
                Icon Shoppers isn&apos;t just an app; it&apos;s a digital plaza. We bring the charm of local bouquets, the warmth of handmade accessories, and the authentic taste of community snacks directly to you.
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
              {highlights.map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ delay: i * 0.1 }}
                  className="space-y-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-[#0E6835]">
                    {item.icon}
                  </div>
                  <h4 className="text-lg font-bold text-stone-900">{item.title}</h4>
                  <p className="text-sm text-stone-500 leading-relaxed font-light">{item.desc}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false }}
              className="pt-8 flex items-center gap-6"
            >
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-stone-200 overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                  </div>
                ))}
              </div>
              <p className="text-xs text-stone-400 font-medium">
                Joined by <span className="text-stone-900 font-bold">2,400+</span> local shoppers
              </p>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default AboutUs;
