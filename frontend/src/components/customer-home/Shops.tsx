import { useRef, useEffect } from "react";
import ShopsCard from "../ShopsCard";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";
import { Store, Loader2 } from "lucide-react";
import { useInfiniteShops } from "@/hooks/queries/useShopsQuery";
import { Button } from "../ui/button";
import ShopContainer from "../ShopContainer";

interface ShopProps {
  location: string;
  sort?: string;
}

const Shops:React.FC<ShopProps> = ({location, sort = "newest"}) => {
  const observerTarget = useRef<HTMLDivElement>(null);
  
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteShops({ sort });

  const allShops = data?.pages.flatMap(page => page.data) || [];

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
    <ShopContainer
      shops={allShops}
      isLoading={isLoading}
    >
      {/* Loader/Observer Target */}
      {location === "Shops" && (
        <div ref={observerTarget} className="col-span-full py-2 flex justify-center w-full">
          {isFetchingNextPage ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Loading more shops...</p>
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
      )}
    </ShopContainer>
  );
};

export default Shops;
