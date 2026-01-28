import { useRef, useEffect } from "react";
import ShopsCard from "../ShopsCard";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";
import { Store, Loader2 } from "lucide-react";
import { useInfiniteShops } from "@/hooks/queries/useShopsQuery";
import { Button } from "../ui/button";

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
    <div className="w-full">
      <div className={cn(
        "flex gap-6 pb-4",
        location === "Shops" 
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-items-center" 
          : "overflow-x-auto px-5 no-scrollbar"
      )}>
        {isLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="w-full sm:max-w-xs md:max-w-sm">
              <Skeleton className="aspect-[16/9] w-full rounded-xl mb-4" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))
        ) : allShops.length > 0 ? (
          <>
            {allShops.map((shop) => (
              <div key={shop.id} className={cn(
                location !== "Shops" && "flex-shrink-0 w-[280px] sm:w-[320px]"
              )}>
                <ShopsCard shop={shop} />
              </div>
            ))}

            {/* Loader/Observer Target */}
            {location === "Shops" && (
              <div ref={observerTarget} className="col-span-full py-8 flex justify-center w-full">
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
                ) : (
                  <p className="text-sm text-muted-foreground">You've reached the end!</p>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center w-full bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 col-span-full">
            <Store className="h-12 w-12 text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium text-lg">No shops found matching your search</p>
            <p className="text-gray-400 text-sm mt-1">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shops;
