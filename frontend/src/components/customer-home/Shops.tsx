import { useEffect, useState } from "react";
import { fetchAllShops } from "@/services/shopService";
import { Shop } from "@/types/product";
import ShopsCard from "../ShopsCard";
import { Skeleton } from "../ui/skeleton";

const Shops = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Add loading state

  useEffect(() => {
    const getShops = async () => {
      const shopData = await fetchAllShops();
      setShops(shopData);
      setLoading(false); // Set loading to false after fetching data
    };

    getShops();
  }, []);

  return (
    <div className="w-full">
      <div className="text-xl mb-6 px-6">Shops</div>
      <div className="flex gap-4 px-7">
        {loading ? ( // Check if loading
          Array.from({ length: 5 }).map((_, index) => ( // Show skeletons
            <Skeleton key={index} className="lg:w-[40vw] lg:h-[45vh] mb-4" />
          ))
        ) : (
          shops.map((shop) => (
            <div key={shop.id}>
              <ShopsCard shop={shop} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Shops;
