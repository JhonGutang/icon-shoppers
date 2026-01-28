import React, { ReactNode } from "react";
import Image from "next/image";
import { useIsMobile } from "../hooks/use-mobile";

interface LayoutProps {
  children: ReactNode;
}

const AuthLayout: React.FC<LayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();

  return (  
    <div className="w-screen h-screen flex justify-center items-center bg-gray-50">
      <div className="rounded-2xl lg:border border-gray-100 bg-white w-full h-full lg:w-[75vw] lg:h-[85vh] flex flex-col lg:flex-row gap-4 justify-center lg:justify-between lg:items-center px-10 lg:px-0 relative lg:shadow-2xl">
        {!isMobile && (
          <div className="lg:w-[50%] h-full relative overflow-hidden hidden lg:block rounded-l-2xl">
             <Image
              src="/auth-picture.jpg"
              alt="Icon Shoppers Marketplace"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-green-900/20 backdrop-blur-[2px] flex flex-col justify-end p-12 text-white">
                <h1 className="text-4xl font-black mb-4">Gourmet at your doorstep.</h1>
                <p className="text-lg opacity-90">Join the community of food lovers and local treasures.</p>
            </div>
          </div>
        )}
        <div className="lg:w-[50%] lg:p-12 flex flex-col items-center justify-center">
          <div className="mb-8">
            <img src="/logo.png" alt="Icon Shoppers Logo" className="w-[120px] h-[120px] object-contain" />
          </div>
          
          <div className="w-full max-w-sm">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
