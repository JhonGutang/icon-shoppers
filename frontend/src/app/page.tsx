'use client'
import { useRef } from "react";
import Navbar from "@/components/landing-page/Navbar";
import Hero from "@/components/landing-page/Hero";
import AboutUs from "@/components/landing-page/About-us";
import Product from "@/components/landing-page/Product";
import Footer from "@/components/landing-page/Footer";

const LandingPage = () => {
  const productRef = useRef<HTMLDivElement>(null);

  const scrollToProducts = () => {
    productRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return ( 
    <div>
      <Navbar/>
      <div id="home"><Hero onViewProducts={scrollToProducts} /></div>
      <div id="about-us"><AboutUs/></div>
      <div id="products" ref={productRef}> <Product/> </div>
      <Footer/>
    </div>
   );
}
 
export default LandingPage;