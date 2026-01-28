import ProductCard from "@/components/ProductCard";
import { useProducts } from "@/hooks/queries/useProductsQuery";
import { Skeleton } from "../ui/skeleton";

interface ProductProps {
  location: string;
  categoryId?: number;
  sort?: string;
}

const Products: React.FC<ProductProps> = ({ categoryId, sort = "newest" }) => {
  const { data: result, isLoading } = useProducts({ 
    category_id: categoryId, 
    sort 
  });
  
  const allProducts = result?.data || [];

  return (
    <div className="w-full h-full">
      <div className="flex justify-center">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-3 max-w-7xl mx-auto w-full">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="w-full">
                <Skeleton className="h-64 w-full rounded-2xl" />
              </div>
            ))
          ) : allProducts.length > 0 ? (
            allProducts.map((product) => (
              <div key={product.id} className="w-full">
                <ProductCard product={product} />
              </div>
            ))
          ) : (
            <div className="text-center w-full col-span-full py-10 text-muted-foreground">
              No products found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
