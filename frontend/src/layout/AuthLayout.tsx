import React, { ReactNode } from "react";
import Image from "next/image";
import { useIsMobile } from "../hooks/use-mobile";
import { motion } from "framer-motion";
import { ShoppingBasket } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

const AuthLayout: React.FC<LayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();

  return (  
    <div className="relative h-screen w-full flex items-center justify-center bg-[#fafaf9] overflow-hidden antialiased">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] aspect-square rounded-full bg-green-100 blur-[120px]" />
        <div className="absolute bottom-[5%] right-[-5%] w-[35%] aspect-square rounded-full bg-stone-200 blur-[100px]" />
      </div>

      <div className="container relative z-10 px-4 flex justify-center items-center h-full">
        <div className="relative w-full max-w-[1100px] bg-white/[0.6] backdrop-blur-2xl border border-white/60 rounded-[3rem] shadow-2xl shadow-stone-200/50 flex flex-col lg:flex-row overflow-hidden h-[85vh] min-h-[620px] max-h-[850px]">
          
          {/* Visual Side */}
          {!isMobile && (
            <div className="lg:w-[50%] relative overflow-hidden hidden lg:block m-4 rounded-[2.8rem]">
              <Image
                src="/local_story.png"
                alt="Icon Shoppers Community"
                fill
                className="object-cover scale-105 brightness-[0.7]"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 via-transparent to-transparent" />
              <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-[2.8rem]" />
              
              <div className="absolute bottom-12 left-12 right-12 text-white z-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h1 className="text-4xl font-black mb-4 tracking-tight leading-tight">
                    Every visit <br />
                    is a <span className="italic font-light text-green-300">discovery.</span>
                  </h1>
                  <p className="text-lg font-light opacity-80 leading-relaxed max-w-sm">
                    Join a community that celebrates local treasures and artisanal passion.
                  </p>
                </motion.div>
              </div>

              {/* Floating Quote Card */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.6 }}
                className="absolute top-[25%] -right-10 bg-white/10 backdrop-blur-2xl border border-white/20 p-6 rounded-[2rem] shadow-2xl max-w-[200px] hidden xl:block z-20"
              >
                <p className="text-stone-600 text-sm font-light leading-snug italic">
                  &quot;Every item has a soul and a story waiting to be told.&quot;
                </p>
                <div className="mt-4 flex items-center gap-2">
                   <div className="w-6 h-6 rounded-full bg-stone-900 border border-white/10 flex items-center justify-center">
                      <span className="text-[6px] font-bold text-white">S.S</span>
                   </div>
                   <p className="text-white/70 text-[8px] font-bold uppercase tracking-widest">Local Storyteller</p>
                </div>
              </motion.div>

              {/* Glass Tag */}
              <div className="absolute top-10 left-10 py-3 px-5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">Live Marketplace</span>
              </div>
            </div>
          )}

          {/* Form Side */}
          <div className="lg:w-[50%] p-8 lg:p-10 flex flex-col h-full overflow-hidden">
            <div className="w-full max-w-sm mx-auto flex flex-col h-full">
              {/* Logo Area */}
              <div className="mb-6 flex items-center gap-3">
                <div className="bg-[#0E6835] p-2 rounded-2xl shadow-lg shadow-green-900/10">
                  <ShoppingBasket className="text-white h-5 w-5" />
                </div>
                <span className="text-stone-950 text-lg font-black tracking-tighter uppercase">
                  Icon<span className="text-[#0E6835]">Shoppers</span>
                </span>
              </div>

              {/* Page Content - Anchored to top to prevent clipping */}
              <div className="flex-1 flex flex-col justify-start overflow-y-auto overflow-x-hidden custom-scrollbar pr-1 pt-2">
                {children}
              </div>

              {/* Bottom Footer */}
              <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-[9px] text-stone-400 font-bold uppercase tracking-widest">
                <span>© 2026 Icon Shoppers</span>
                <div className="flex gap-4">
                  <span className="hover:text-[#0E6835] cursor-pointer transition-colors">Privacy</span>
                  <span className="hover:text-[#0E6835] cursor-pointer transition-colors">Terms</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
