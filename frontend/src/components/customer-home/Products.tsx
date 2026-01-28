import ProductCard from "@/components/ProductCard";
import { useInfiniteProducts } from "@/hooks/queries/useProductsQuery";
import { Skeleton } from "../ui/skeleton";
import { useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

interface ProductProps {
  location: string;
  categoryId?: number;
  sort?: string;
}

const Products: React.FC<ProductProps> = ({ categoryId, sort = "newest" }) => {
  const observerTarget = useRef<HTMLDivElement>(null);
  
  const { 
    data, 
    isLoading, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage 
  } = useInfiniteProducts({ 
    category_id: categoryId, 
    sort 
  });
  
  const allProducts = data?.pages.flatMap(page => page.data) || [];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="w-full h-full">
      <div className="flex justify-center">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-3 max-w-7xl mx-auto w-full">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="w-full">
                <Skeleton className="h-64 w-full rounded-2xl" />
              </div>
            ))
          ) : allProducts.length > 0 ? (
            <>
              {allProducts.map((product) => (
                <div key={product.id} className="w-full">
                  <ProductCard product={product} />
                </div>
              ))}
              
              {/* Loader/Observer Target */}
              <div ref={observerTarget} className="col-span-full py-8 flex justify-center">
                {isFetchingNextPage ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Loading more products...</p>
                  </div>
                ) : hasNextPage ? (
                  <Button 
                    variant="outline" 
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className="rounded-full px-8"
                  >
                    Load More
                  </Button>
                ) : (
                  <p className="text-sm text-muted-foreground">You've reached the end!</p>
                )}
              </div>
            </>
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
