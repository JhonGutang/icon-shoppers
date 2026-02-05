import { useInfiniteProducts } from "@/hooks/product/useProductsQuery";
import { useEffect, useRef } from "react";
import { Button } from "@/components/shared/ui/button";
import { Loader2 } from "lucide-react";
import ProductContainer from "@/components/product/ProductContainer";

interface ProductProps {
  location: string;
  sort?: string;
}

const Products: React.FC<ProductProps> = ({ sort = "newest" }) => {
  const observerTarget = useRef<HTMLDivElement>(null);
  
  const { 
    data, 
    isLoading, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage 
  } = useInfiniteProducts({ 
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
    <ProductContainer
      products={allProducts}
      isLoading={isLoading}
    >
      <div ref={observerTarget} className="col-span-full py-2 flex justify-center w-full">
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
        ) : null}
      </div>
    </ProductContainer>
  );
};

export default Products;
