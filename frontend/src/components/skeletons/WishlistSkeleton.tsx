import { Skeleton } from "@/components/ui/skeleton";

const WishlistSkeleton = () => {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="aspect-square w-full rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <Skeleton className="h-8 w-full rounded-full mt-2" />
        </div>
      ))}
    </div>
  );
};

export default WishlistSkeleton;
