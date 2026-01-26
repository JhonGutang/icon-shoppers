import { useEffect, useState } from "react";
import { fetchAllShops } from "@/services/shopService";
import { Shop } from "@/types/product";
import ShopsCard from "../ShopsCard";
import { Skeleton } from "../ui/skeleton";

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
      <div className={`flex gap-4  ${location === "Shops" ? "flex-wrap justify-center" : "overflow-x-scroll px-5 pb-2"}`}>
        {loading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="lg:w-[40vw] lg:h-[45vh] mb-4" />
          ))
        ) : shops.length > 0 ? (
          shops.map((shop) => (
            <div key={shop.id}>
              <ShopsCard shop={shop} />
            </div>
          ))
        ) : (
          <div className="text-center w-full">Shop not found</div>
        )}
      </div>
    </div>
  );
};

export default Shops;
