import { useEffect, useState } from "react";
import { fetchAllShops } from "@/services/shopService";
import { Shop } from "@/types/product";
import ShopsCard from "../ShopsCard";
import { Skeleton } from "../ui/skeleton";
import { Input } from "../ui/input";

interface ShopProps {
  location: string
}

const Shops:React.FC<ShopProps> = ({location}) => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    const getShops = async () => {
      const shopData = await fetchAllShops(search);
      setShops(shopData);
      setLoading(false);
    };

    getShops();
  }, [search]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  return (
    <div className="w-full">
      <div className="mb-6 px-6 flex gap-5 items-center ">
        <div className="text-xl ">Shops</div>
        {location === "Shops" && (
          <Input
            placeholder="Search Shops..."
            className="w-[50vw] h-[45px] rounded-full pl-5"
            value={search}
            onChange={handleSearchChange}
          />
        )}
      </div>
      <div className="flex gap-4 px-7">
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
