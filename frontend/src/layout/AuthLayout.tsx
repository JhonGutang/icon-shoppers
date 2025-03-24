import React, { ReactNode } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
interface LayoutProps {
  trigger: ReactNode;
  children: ReactNode;
}

const AuthLayout: React.FC<LayoutProps> = ({ children, trigger }) => {

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="rounded-xl lg:border-2 border-gray-400 w-full h-full border-2 lg:w-[70vw] lg:h-[70vh] flex flex-col lg:flex-row gap-4 justify-center lg:justify-between lg:items-center px-10 lg:px-0">
        <div className="lg:w-[50%] flex flex-col lg:items-center gap-5">
          <Image
            src="/web-shopping.svg"
            alt="web shopping"
            width={300}
            height={50}
          />
          {trigger}
        </div>
        <div className="lg:w-[50%] lg:p-10">
          <div className="text-center lg:text-xl">Welcome to</div>
          <div className="text-center lg:text-2xl text-lg">
            E Commerce Website
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
