import { 
  ShoppingBasket, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Instagram, 
  Twitter,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-stone-950 text-stone-400 pt-32 pb-12 border-t border-stone-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Pre-Footer Branding area - Glass Backdrop accent */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.8 }}
          className="relative group bg-white/[0.02] backdrop-blur-sm border border-white/5 rounded-[3rem] p-10 md:p-16 mb-20"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
            <div className="space-y-6 max-w-xl">
               <div className="flex items-center gap-4">
                <div className="bg-[#0E6835] p-3 rounded-2xl shadow-xl shadow-green-900/40">
                  <ShoppingBasket className="text-white h-7 w-7" />
                </div>
                <span className="text-white text-3xl font-black tracking-tighter uppercase">
                  Icon<span className="text-[#0E6835]">Shoppers</span>
                </span>
              </div>
              <p className="text-stone-400 font-light leading-relaxed text-lg">
                Elevating the local marketplace experience. Connecting you with handcrafted treasures and community favorites from our hearth to your home.
              </p>
            </div>
            
            <div className="flex flex-col gap-6">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-stone-500">Connect with us</p>
              <div className="flex gap-4">
                {[
                  { icon: <Facebook size={22} />, label: "Facebook" },
                  { icon: <Instagram size={22} />, label: "Instagram" },
                  { icon: <Twitter size={22} />, label: "Twitter" }
                ].map((social, i) => (
                  <a 
                    key={i}
                    href="#" 
                    className="w-14 h-14 flex items-center justify-center rounded-[1.2rem] bg-white/5 backdrop-blur-xl border border-white/10 text-stone-400 hover:bg-[#0E6835] hover:text-white hover:border-transparent hover:-translate-y-1.5 transition-all duration-500 shadow-2xl"
                    aria-label={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-20"
        >
          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-white font-bold tracking-tight uppercase text-xs tracking-[0.2em]">Explore</h4>
            <ul className="space-y-4">
              {['Home', 'Our Story', 'Marketplace', 'Partner with Us'].map((item) => (
                <li key={item}>
                  <Link 
                    href={item === 'Home' ? '/' : `#${item.toLowerCase().replace(' ', '-')}`} 
                    className="group flex items-center gap-2 hover:text-white transition-colors text-sm font-light"
                  >
                    <ArrowRight size={12} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#0E6835]" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-6">
            <h4 className="text-white font-bold tracking-tight uppercase text-xs tracking-[0.2em]">Support</h4>
            <ul className="space-y-4">
              {['Help Center', 'Terms of Service', 'Privacy Policy', 'Shipping Info'].map((item) => (
                <li key={item}>
                  <Link href="#" className="hover:text-white transition-colors text-sm font-light">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-2 space-y-8">
            <h4 className="text-white font-bold tracking-tight uppercase text-xs tracking-[0.2em]">Get in Touch</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-stone-900 flex items-center justify-center shrink-0 text-[#0E6835]">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-white text-sm font-bold mb-1">Visit Us</p>
                    <p className="text-xs text-stone-500 font-light leading-relaxed">Pinamungajan, Cebu<br />Philippines, 6039</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                 <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-stone-900 flex items-center justify-center shrink-0 text-[#0E6835]">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-white text-sm font-bold mb-1">Email</p>
                    <p className="text-xs text-stone-500 font-light truncate">hello@iconshoppers.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-stone-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] uppercase tracking-[0.2em] text-stone-600 font-medium">
            © {currentYear} Icon Shoppers. All rights reserved. 
          </p>
          <div className="flex items-center gap-6 text-[10px] uppercase tracking-[0.2em] text-stone-600">
            <span className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-[#0E6835]" />
              Locally Crafted
            </span>
            <span className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-[#0E6835]" />
              Community Focused
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
