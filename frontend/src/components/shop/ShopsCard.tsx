import { Shop } from "@/types/product";
import { Card } from "@/components/shared/ui/card";
import { Button } from "@/components/shared/ui/button";
import useRedirectLink from "@/hooks/shared/useRedirectLink";
import { Store, Star, ArrowRight, ShieldCheck, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShopsProps {
  shop: Shop;
}

const ShopsCard: React.FC<ShopsProps> = ({ shop }) => {
  const { redirectLink } = useRedirectLink();
  
  const handleVisit = () => {
    redirectLink(shop.name);
  };

  return (
    <div className="relative h-full flex flex-col group cursor-pointer" onClick={handleVisit}>
      <Card
        className={cn(
          "group relative flex h-full flex-col overflow-hidden rounded-[2.5rem] border-0 bg-white p-2 transition-all duration-500 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)]"
        )}
      >
        {/* Shop Banner/Logo Image */}
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2.2rem] bg-stone-100">
          <img
            src={
              shop.logo_image
                ? `${process.env.NEXT_PUBLIC_LARAVEL_API_URL}/storage/${shop.logo_image}`
                : "https://i.pinimg.com/736x/fd/3d/8e/fd3d8e2a1dd4f09b4170d31e26913bab.jpg"
            }
            alt={shop.name}
            className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
          />
          
          {/* Dynamic Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          
          {/* Top Badges */}
          <div className="absolute left-4 top-4">
            <div className="flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-md px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#0E6835] shadow-sm">
              <ShieldCheck size={10} className="fill-[#0E6835]" />
              Verified
            </div>
          </div>

          {/* Quick View / External link Icon */}
          <div className="absolute bottom-4 right-4 translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            <div className="flex h-12 w-12 items-center justify-center rounded-[1.2rem] bg-[#0E6835] text-white shadow-xl shadow-green-900/30">
              <ArrowUpRight size={22} />
            </div>
          </div>
        </div>

        {/* Shop Information */}
        <div className="flex flex-1 flex-col px-3 py-3">
          <div className="mb-1.5 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-[#0E6835]">
              <Store size={12} />
              <span>Local Merchant</span>
            </div>
            {(shop.rating || 5.0) > 0 && (
              <div className="flex items-center gap-1 rounded-full bg-stone-100 px-2 py-0.5">
                <Star size={10} className="fill-[#0E6835] text-[#0E6835]" />
                <span className="text-[10px] font-black text-stone-700">{shop.rating || "5.0"}</span>
              </div>
            )}
          </div>

          <h3 className="line-clamp-2 text-[15px] font-bold text-stone-900 leading-tight tracking-tight">
            {shop.name}
          </h3>
        </div>
      </Card>
    </div>
  );
};

export default ShopsCard;

