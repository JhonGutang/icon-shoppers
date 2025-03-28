"use client";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/types/product";
import useAuth from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { Profile } from "@/types/auth";
import useProductAction from "@/hooks/useProductActions";
import useCustomerActions from "@/hooks/useCustomerActions";
import { Flame, ShoppingBag, Store } from "lucide-react";
import ImageCarousel from "@/components/imageCarousel";
import { Button } from "@/components/ui/button";
import useRedirectLink from "@/hooks/useRedirectLink";

const Home = () => {
  const { handleOrdersInCart } = useCustomerActions();
  const { handleGetProfile } = useAuth();
  const { handleFetchAllProducts, handleFetchFeaturedProducts } =
    useProductAction();
  const [user, setUser] = useState<Profile>();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [profile, products, featured] = await Promise.all([
        handleGetProfile(),
        handleFetchAllProducts(),
        handleFetchFeaturedProducts(),
      ]);
      setUser(profile);
      setAllProducts(products);
      setFeaturedProducts(featured);
    };

    fetchData();
    handleOrdersInCart();
  }, []);

  return (
    <div className="flex flex-col gap-4 w-full px-5">
      <Navbar name={user?.name} />
      <Promotional />
      <FeaturedCategory products={featuredProducts} />
      <ShopCategory />
      <AllProducts products={allProducts} />
    </div>
  );
};

const Promotional = () => {
  const promotionalImages = [
    {
      id: "jollibee",
      link: "https://i.pinimg.com/736x/b4/b6/9f/b4b69fd4ac4a0c0d0f6b7788b75c9461.jpg",
    },
    {
      id: "mcdo",
      link: "https://i.pinimg.com/736x/1f/c0/33/1fc033c33f3303950f018f864beb336c.jpg",
    },
    {
      id: "mangInasal",
      link: "https://i.pinimg.com/736x/4c/ce/8b/4cce8ba9c8084d2b12342d4920675f30.jpg",
    },
  ];

  return (
    <div className="flex justify-center items-center">
      <ImageCarousel images={promotionalImages} />
    </div>
  );
};

interface ProductCategoryProps {
  products: Product[];
}

const FeaturedCategory = ({ products }: ProductCategoryProps) => {
  const { redirectLink } = useRedirectLink();

  return (
    <div className="lg:px-10">
      <div className="w-full">
        <div className="flex items-center justify-between gap-2">
          <div className="flex gap-2">
            <Flame />
            <div className="text-xl font-bold">Featured Products</div>
          </div>
          <Button variant="ghost" className="text-sm" onClick={() => redirectLink('products')}>
            View All
          </Button>
        </div>
      </div>

      {/* Responsive Masonry Layout */}
      <div className="columns-2 sm:columns-2 md:columns-3 lg:columns-4 gap-4 p-3 space-y-4">
        {products.map((product) => (
          <div key={`${product.id}-${product.name}`} className="break-inside-avoid w-full">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};


const ShopCategory = () => {
  return (
    <div className="w-full lg:px-10">
      <div className="text-xl font-bold flex items-center gap-2">
        <Store />
        <div>Popular Shops</div>
      </div>
      <div className="w-full flex lg:justify-start justify-center lg:p-5 py-10">
        <div className="text-2xl font-bold">Under Construction</div>
      </div>
    </div>
  );
};

const AllProducts = ({ products }: ProductCategoryProps) => {
  const { redirectLink } = useRedirectLink();

  return (
    <div className="lg:px-10">
      <div className="w-full">
        <div className="flex items-center justify-between gap-2">
          <div className="flex gap-2">
            <ShoppingBag />
            <div className="text-xl font-bold">All Products</div>
          </div>
          <Button variant="ghost" className="text-sm" onClick={() => redirectLink('products')}>
            View All
          </Button>
        </div>
      </div>

      <div className="columns-2 gap-5 p-3 space-y-3 lg:columns-4">
        {products.map((product) => (
          <div key={`${product.id}-${product.name}`} className="break-inside-avoid w-full">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};


export default Home;