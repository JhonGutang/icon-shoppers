"use client";

import { AnimatePresence, motion } from "framer-motion";
import React from 'react';

interface SkeletonLayerProps {
  isLoading: boolean;
  children: React.ReactNode;
  fallback: React.ReactNode;
}

const SkeletonLayer = ({ isLoading, children, fallback }: SkeletonLayerProps) => {
  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="skeleton"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="w-full h-full"
        >
          {fallback}
        </motion.div>
      ) : (
        <motion.div
           key="content"
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ duration: 0.3, ease: "easeOut" }}
           className="w-full h-full"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SkeletonLayer;
