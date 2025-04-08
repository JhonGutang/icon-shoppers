"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchSpecificShop } from "@/services/shopService";
import { Product, Shop } from "@/types/product";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import ProductCard from "@/components/ProductCard";
import CartNavbar from "@/components/mobile/CartNavbar";
import { Button } from "@/components/ui/button";
const ShopPage = () => {
  const { shopName } = useParams();
  const [shop, setShop] = useState<Shop | null>(null);
  const [category, setCategory] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(true);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  useEffect(() => {
    let isMounted = true;
    const fetchShopData = async () => {
      if (shopName) {
        const formattedShopName = Array.isArray(shopName)
          ? shopName[0]
          : shopName;
        try {
          setLoading(true);
          const data = await fetchSpecificShop(formattedShopName);
          if (isMounted) {
            setShop(data);
            setAllProducts(data.products || []);
            setFeaturedProducts(
              data.products?.filter(
                (product: Product) => product.is_featured
              ) || []
            );
          }
        } catch (error) {
          console.error("Error fetching shop:", error);
        } finally {
          if (isMounted) setLoading(false);
        }
      }
    };

    fetchShopData();

    return () => {
      isMounted = false;
    };
  }, [shopName]);

  const handleToggleChange = (
    _: React.MouseEvent<HTMLElement>,
    newCategory: string | null
  ) => {
    if (newCategory) setCategory(newCategory);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  const productsToDisplay =
    category === "featured" ? featuredProducts : allProducts;

  return (
    <div className="space-y-5">
      <CartNavbar />
      <div className="w-full px-5">
        {/* Shop Details */}
        <div className="flex flex-col gap-5 lg:items-start items-center mb-5">
          <div className="w-1/2 lg:w-full lg:h-[40vh]">
            <img
              src="https://i.pinimg.com/736x/06/6f/79/066f790bcd35c0847b8b6a221fa04a10.jpg"
              alt={shop?.name || "Shop Image"}
              className="object-cover w-full h-full rounded-xl border-2"
            />
          </div>

          <div className="flex  justify-between w-full items-center lg:gap-0 gap-4 lg:px-10">
            <div>
              <h1 className="text-3xl font-semibold">{shop?.name}</h1>
              <div className="text-sm">
                <div className="flex gap-2">
                  <div>Email:</div>
                  <div>{shop?.email}</div>
                </div>
                <div className="flex gap-2">
                  <div>Contact Number:</div>
                  <div>{shop?.contact_number}</div>
                </div>
              </div>
            </div>
          <div>
            <Button className="bg-green-600">Rate Shop</Button>
          </div>
          </div>
        </div>

        {/* Shop Description */}
        <div className="mb-5 lg:px-10">
          <h2 className="font-semibold">Description</h2>
          <p className="mt-2">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore
            nesciunt saepe natus? Ullam amet libero eum, repellat eos odit eius
            sunt veritatis hic praesentium impedit autem iste? Ut, a laudantium.
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-5 lg:px-10">
          <ToggleButtonGroup
            size="small"
            value={category}
            exclusive
            onChange={handleToggleChange}
            aria-label="category filter"
          >
            <ToggleButton value="all" aria-label="all products">
              All
            </ToggleButton>
            <ToggleButton value="featured" aria-label="featured products">
              Featured
            </ToggleButton>
          </ToggleButtonGroup>
        </div>

        {/* Products List */}
        <div className="columns-2 lg:columns-4 gap-1 pb-5 lg:px-10">
          {Array.isArray(productsToDisplay) && productsToDisplay.length ? (
            productsToDisplay.map((product) => (
              <div key={product.id} className="break-inside-avoid mb-3">
                <ProductCard product={product} shopName={shop?.name} />
              </div>
            ))
          ) : (
            <p className="text-center">No products available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
