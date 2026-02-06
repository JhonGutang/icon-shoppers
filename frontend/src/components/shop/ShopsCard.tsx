import { Shop } from "@/types/product";
import { Card } from "@/components/shared/ui/card";
import { Button } from "@/components/shared/ui/button";
import useRedirectLink from "@/hooks/shared/useRedirectLink";
import { Store, Star, ArrowRight, ShieldCheck, ArrowUpRight } from "lucide-react";
import BaseCard from "@/components/shared/BaseCard";

interface ShopsProps {
  shop: Shop;
}

const ShopsCard: React.FC<ShopsProps> = ({ shop }) => {
  const { redirectLink } = useRedirectLink();
  
  const handleVisit = () => {
    redirectLink(shop.name);
  };

  const imageUrl = shop.logo_image
    ? `${process.env.NEXT_PUBLIC_LARAVEL_API_URL}/storage/${shop.logo_image}`
    : "https://i.pinimg.com/736x/fd/3d/8e/fd3d8e2a1dd4f09b4170d31e26913bab.jpg";

  const badges = (
    <div className="flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-md px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-[#0E6835] shadow-sm">
      <ShieldCheck size={9} className="fill-[#0E6835]" />
      Verified
    </div>
  );

  const info = (
    <>
      <div className="mb-1 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-[#0E6835]">
          <Store size={10} />
          <span>Local Merchant</span>
        </div>
        {(shop.rating || 5.0) > 0 && (
          <div className="flex items-center gap-1 rounded-full bg-stone-100 px-1.5 py-0.5">
            <Star size={9} className="fill-[#0E6835] text-[#0E6835]" />
            <span className="text-[9px] font-black text-stone-700">{shop.rating || "5.0"}</span>
          </div>
        )}
      </div>

      <h3 className="line-clamp-2 text-sm font-bold text-stone-900 leading-tight tracking-tight">
        {shop.name}
      </h3>
    </>
  );

  return (
    <div className="relative h-full flex flex-col group cursor-pointer" onClick={handleVisit}>
      <BaseCard
        image={imageUrl}
        imageAlt={shop.name}
        badges={badges}
        info={info}
      />
    </div>
  );
};

export default ShopsCard;

