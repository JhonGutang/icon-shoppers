import { ShoppingBasket, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-stone-900 text-stone-300 pt-20 pb-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="bg-green-600 p-2 rounded-xl">
                <ShoppingBasket className="text-white h-6 w-6" />
              </div>
              <span className="text-white text-xl font-black tracking-tighter">
                ICON<span className="text-green-500">SHOPPERS</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              Empowering local artisans and small businesses from Pinamungajan to Balamban. We bring our community&apos;s finest products directly to your doorstep.
            </p>
            <div className="flex gap-4">
              <a href="#" className="bg-white/5 p-3 rounded-full hover:bg-green-600 hover:text-white transition-all">
                <Facebook size={20} />
              </a>
              <a href="#" className="bg-white/5 p-3 rounded-full hover:bg-green-600 hover:text-white transition-all">
                <Instagram size={20} />
              </a>
              <a href="#" className="bg-white/5 p-3 rounded-full hover:bg-green-600 hover:text-white transition-all">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="/" className="hover:text-green-500 transition-colors">Home</Link></li>
              <li><Link href="#about-us" className="hover:text-green-500 transition-colors">Our Story</Link></li>
              <li><Link href="#products" className="hover:text-green-500 transition-colors">Marketplace</Link></li>
              <li><Link href="/auth" className="hover:text-green-500 transition-colors">Partner with Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Support</h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="#" className="hover:text-green-500 transition-colors">Help Center</Link></li>
              <li><Link href="#" className="hover:text-green-500 transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-green-500 transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-green-500 transition-colors">Shipping Info</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Contact Us</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-green-500 shrink-0" />
                <span>Pinamungajan, Cebu, Philippines</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-green-500 shrink-0" />
                <span>+63 123 456 7890</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-green-500 shrink-0" />
                <span>hello@iconshoppers.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 text-center text-xs text-stone-500">
          <p>© {currentYear} Icon Shoppers. All rights reserved. Locally crafted with love.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
