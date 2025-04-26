import React, { ReactNode } from "react";
import Image from "next/image";
import { useIsMobile } from "../hooks/use-mobile";
import { Button } from "@/components/ui/button";
import useRedirectLink from "@/hooks/useRedirectLink";

interface LayoutProps {
  children: ReactNode;
  role: string;
}

const AuthLayout: React.FC<LayoutProps> = ({ children, role }) => {
  const { redirectLink} = useRedirectLink()
  const isMobile = useIsMobile();
  const sellerLogin = role === 'customer' ? 'Seller' : 'Customer'
  const authLink = role !== 'customer' ? '/customer-auth' : '/shop-auth'
  console.log(authLink);
  return (  
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="rounded-xl lg:border-2 border-gray-400 w-full h-full lg:w-[70vw] lg:h-[80vh] flex flex-col lg:flex-row gap-4 justify-center lg:justify-between lg:items-center px-10 lg:px-0 relative">
        <Button className="absolute top-4 right-4 capitalize" variant='ghost' onClick={() => redirectLink(authLink)}>Login as {sellerLogin}</Button>
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
