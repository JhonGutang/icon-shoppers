import { useEffect, useState } from "react";
import { fetchAllShops } from "@/services/shopService";
import { Shop } from "@/types/product";
import ShopsCard from "../ShopsCard";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";
import { Store } from "lucide-react";

interface ShopProps {
  location: string
}

const Shops:React.FC<ShopProps> = ({location}) => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getShops = async () => {
      const result = await fetchAllShops();
      // Ensure we handle both direct array and paginated response
      const shopData = Array.isArray(result) ? result : (result?.data || []);
      setShops(shopData);
      setLoading(false);
    };

    getShops();
  }, []);

  // Search is now handled by the global Navbar search bar

  return (
    <div className="w-full">
      <div className={cn(
        "flex gap-6 pb-4",
        location === "Shops" 
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-items-center" 
          : "overflow-x-auto px-5 no-scrollbar"
      )}>
        {loading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="w-full sm:max-w-xs md:max-w-sm">
              <Skeleton className="aspect-[16/9] w-full rounded-xl mb-4" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))
        ) : shops.length > 0 ? (
          shops.map((shop) => (
            <div key={shop.id} className={cn(
              location !== "Shops" && "flex-shrink-0 w-[280px] sm:w-[320px]"
            )}>
              <ShopsCard shop={shop} />
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center w-full bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <Store className="h-12 w-12 text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium text-lg">No shops found matching your search</p>
            <p className="text-gray-400 text-sm mt-1">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shops;
