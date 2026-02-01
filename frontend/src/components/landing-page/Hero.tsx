"use client";

import { Button } from "../ui/button";
import { motion } from "framer-motion";
import { ShoppingBag, ArrowRight } from "lucide-react";

interface HeroProps {
  onViewProducts: () => void;
}

const Hero = ({ onViewProducts }: HeroProps) => {
  return (
    <div className="relative w-full min-h-screen flex items-center overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0 hero-background" />
      
      {/* Decorative elements */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
        className="absolute -top-24 -right-24 w-96 h-96 bg-green-500 rounded-full blur-3xl text-primary"
      />
      
      {/* Content container */}
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="lg:w-3/5 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-green-600/30 border border-green-500/50 text-green-200 text-sm font-medium mb-6 backdrop-blur-sm">
              Supporting Local Sellers
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-black leading-tight mb-6 text-shadow-sm"
          >
            Your <span className="text-[#4CC292]">Hometown</span> Market, <br />
            Now Just a Click Away.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg sm:text-xl lg:text-2xl text-gray-200 mb-10 max-w-2xl font-light"
          >
            Connecting you to your community&rsquo;s freshest produce and handcrafted goods. Quick, easy, and strictly local.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button 
              size="lg"
              className="bg-[#0E6835] hover:bg-[#084d26] text-white px-8 h-14 text-lg rounded-full transition-all duration-300 shadow-lg shadow-green-900/20 group"
              onClick={onViewProducts}
            >
              <ShoppingBag className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              Start Shopping
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-md px-8 h-14 text-lg rounded-full transition-all duration-300"
              asChild
            >
              <a href="#about-us">
                Our Story
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
          </motion.div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden lg:block"
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
          <motion.div 
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-white rounded-full"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default Hero;
