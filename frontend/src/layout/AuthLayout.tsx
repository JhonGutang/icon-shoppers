import React, { ReactNode } from "react";
import Image from "next/image";
import { useIsMobile } from "../hooks/use-mobile";

interface LayoutProps {
  children: ReactNode;
}

const AuthLayout: React.FC<LayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="rounded-xl lg:border-2 border-gray-400 w-full h-full lg:w-[70vw] lg:h-[80vh] flex flex-col lg:flex-row gap-4 justify-center lg:justify-between lg:items-center px-10 lg:px-0">
        {!isMobile && (
          <div className="lg:w-[50%] flex flex-col lg:items-center gap-5">
            <Image
              src="/auth-picture.jpg"
              alt="web shopping"
              width={500}
              height={50}
            />
          </div>
        )}
        <div className="lg:w-[50%] lg:p-10">
          <div className="flex justify-center">
            <img src="/logo.png" alt="" className="w-[130px] h-[130px]" />
          </div>
          <div className="text-center text-2xl lg:text-xl main-text-color">
            Welcome Back!!
          </div>
          <div className="text-center lg:text-md text-md">
            Your Local Marketplace is Ready for you!
          </div>
          <div className="mt-10 text-center flex flex-col gap-9">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
