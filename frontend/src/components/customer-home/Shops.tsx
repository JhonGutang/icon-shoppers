import { useEffect, useState } from "react";
import { fetchAllShops } from "@/services/shopService";
import { Shop } from "@/types/product";
import ShopsCard from "../ShopsCard";

const Shops = () => {
  const [shops, setShops] = useState<Shop[]>([]);

  useEffect(() => {
    const getShops = async () => {
      const shopData = await fetchAllShops();
      setShops(shopData);
    };

    getShops();
  }, []);

  return (
    <div className="w-full">
      <div className="text-xl mb-6 px-6">Shops</div>
      <div className="flex gap-4 px-7">
        {shops.map((shop) => (
            <div key={shop.id}>
                <ShopsCard shop={shop}/>
            </div>
        ))}
      </div>
    </div>
  );
};

export default Shops;
