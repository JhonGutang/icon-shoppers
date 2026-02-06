"use client";

import React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Star, Store } from "lucide-react";
import { useScrollLock } from "@/hooks/shared/useScrollLock";

interface RoleSwitchLoaderProps {
  isLoading?: boolean;
  targetRole?: "customer" | "merchant";
}

const SELLER_QUOTES = [
  "Turning your passion into profit...",
  "Preparing your digital storefront...",
  "Success represents the 1% of your work, which results from the 99% that is called failure.",
  "Business opportunities are like buses, there's always another one coming."
];

const CUSTOMER_QUOTES = [
  "Getting the best deals ready for you...",
  "Personalizing your shopping experience...",
  "The customer's perception is your reality.",
  "Quality in a service or product is not what you put into it. It is what the customer gets out of it."
];

export default function RoleSwitchLoader({ isLoading = true, targetRole = "customer" }: RoleSwitchLoaderProps) {
  const [isMounted, setIsMounted] = React.useState(false);
  const [quote, setQuote] = React.useState("");

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  React.useEffect(() => {
    if (isLoading) {
      const quotes = targetRole === "merchant" ? SELLER_QUOTES : CUSTOMER_QUOTES;
      setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    }
  }, [targetRole, isLoading]);

  useScrollLock(isLoading);

  if (!isMounted) return null;

  const MainIcon = targetRole === "merchant" ? Store : ShoppingBag;

  return createPortal(
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#FDFDFD]"
        >
          <div className="relative flex flex-col items-center justify-center p-4 text-center">
            {/* Animated Background Blob */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
                rotate: [0, 90, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 top-1/2 left-1/2 -ml-32 -mt-32 -z-10 h-64 w-64 rounded-full bg-gradient-to-tr from-[#0E6835]/20 to-[#4CC292]/20 blur-3xl filter"
            />

            {/* Main Logo / Icon Animation */}
            <div className="relative mb-8">
              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative z-10 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-[#0E6835] shadow-2xl shadow-[#0E6835]/30"
              >
                <MainIcon size={48} className="text-white" strokeWidth={1.5} />
                
                {/* Floating particles */}
                <motion.div
                  animate={{
                    y: [0, -20, 0],
                    x: [0, 10, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: 0.2,
                    ease: "easeOut",
                  }}
                  className="absolute -right-2 -top-2"
                >
                  <Star size={16} className="fill-[#4CC292] text-[#4CC292]" />
                </motion.div>
                <motion.div
                  animate={{
                    y: [0, -15, 0],
                    x: [0, -10, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    delay: 0.5,
                    ease: "easeOut",
                  }}
                  className="absolute -left-2 -bottom-2"
                >
                  <div className="h-3 w-3 rounded-full bg-[#D2B48C]" />
                </motion.div>
              </motion.div>

              {/* Ripple Effect */}
              <motion.div
                animate={{
                  scale: [1, 2],
                  opacity: [0.5, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
                className="absolute inset-0 z-0 rounded-[2rem] border border-[#0E6835]/30 bg-transparent"
              />
            </div>

            {/* Text Animation */}
            <div className="flex flex-col items-center gap-4 max-w-md">
              <motion.h2 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold tracking-tight text-[#0E6835]"
              >
                Switching to {targetRole === 'merchant' ? 'Seller' : 'Customer'} Mode
              </motion.h2>

               {/* Quote Section */}
               <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="relative mt-2 px-8"
              >
                <span className="absolute left-0 top-0 text-4xl text-[#0E6835]/20 font-serif">&quot;</span>
                <p className="text-stone-600 font-medium italic relative z-10 px-2 min-h-[48px] flex items-center justify-center">
                  {quote}
                </p>
                <span className="absolute right-0 bottom-0 text-4xl text-[#0E6835]/20 font-serif h-4 overflow-hidden flex items-end">&quot;</span>
              </motion.div>

              <motion.div 
                className="flex items-center gap-1 mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <span className="text-sm font-semibold uppercase tracking-widest text-stone-400">
                  Please Wait
                </span>
                <motion.span
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, times: [0, 0.5, 1] }}
                  className="text-[#0E6835]"
                >
                  .
                </motion.span>
                <motion.span
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.2, times: [0, 0.5, 1] }}
                  className="text-[#0E6835]"
                >
                  .
                </motion.span>
                <motion.span
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.4, times: [0, 0.5, 1] }}
                  className="text-[#0E6835]"
                >
                  .
                </motion.span>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
