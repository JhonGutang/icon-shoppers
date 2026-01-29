import { Shop } from "@/types/product";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import useRedirectLink from "@/hooks/useRedirectLink";
import { Store, Star, ArrowRight, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShopsProps {
  shop: Shop;
}

const ShopsCard: React.FC<ShopsProps> = ({ shop }) => {
  const { redirectLink } = useRedirectLink();
  
  return (
    <div className="relative h-full flex flex-col">
      <Card
        className={cn(
          "group relative overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-lg hover:-translate-y-1 flex flex-col",
          "w-full sm:max-w-xs md:max-w-sm"
        )}
      >
        {/* Shop Banner/Logo Image */}
        <div className="aspect-[16/9] w-full overflow-hidden bg-muted relative">
          <img
            src={
              shop.logo_image
                ? `https://icon-shoppers.onrender.com/storage/${shop.logo_image}`
                : "https://i.pinimg.com/736x/fd/3d/8e/fd3d8e2a1dd4f09b4170d31e26913bab.jpg"
            }
            alt={shop.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Verified Badge */}
          <div className="absolute right-2 top-2">
            <div className="flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-sm px-2 py-0.5 text-[10px] font-bold shadow-sm border border-green-100">
              <ShieldCheck size={12} />
              <span>Verified Seller</span>
            </div>
          </div>
        </div>

        <CardContent className="p-4 flex flex-1 flex-col">
          {/* Shop Type/Label */}
          <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-1">
            <Store size={12} className="text-green-600" />
            <span>Local Merchant</span>
          </div>

          {/* Shop Name */}
          <h3 className="line-clamp-1 text-lg font-bold text-gray-900 transition-colors">
            {shop.name}
          </h3>

          {/* Rating & Stats */}
          <div className="mt-2 flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Star size={14} className="fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-semibold">{shop.rating || "5.0"}</span>
            </div>
            <div className="h-1 w-1 rounded-full bg-gray-300" />
            <div className="text-xs text-muted-foreground font-medium">
              {shop.follower_count || 0} Followers
            </div>
          </div>

          {/* Footer Action */}
          <div className="mt-6 pt-4 border-t border-gray-50">
            <Button 
              className="w-full text-white rounded-xl h-10 shadow-sm transition-all group/btn"
              onClick={() => redirectLink(shop.name)}
            >
              <span>Visit Store</span>
              <ArrowRight size={16} className="ml-2 transition-transform group-hover/btn:translate-x-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShopsCard;
