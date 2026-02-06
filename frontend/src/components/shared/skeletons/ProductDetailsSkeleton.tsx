import { Skeleton } from "@/components/shared/ui/skeleton";

const ProductDetailsSkeleton = () => (
  <div className="container mx-auto px-4 py-8">
    <div className="mb-12 flex items-center justify-between">
      <Skeleton className="h-10 w-32 rounded-full" />
      <Skeleton className="hidden md:block h-4 w-64 rounded-full" />
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
      {/* Visuals Skeleton (5/12) */}
      <div className="lg:col-span-5">
        <Skeleton className="aspect-square w-full rounded-[2.5rem]" />
      </div>

      {/* Action Skeleton (7/12) */}
      <div className="lg:col-span-7 space-y-10">
        {/* Tabs Skeleton */}
        <div className="flex gap-10 border-b border-stone-100 pb-1">
          <Skeleton className="h-4 w-20 mb-4" />
          <Skeleton className="h-4 w-20 mb-4" />
          <Skeleton className="h-4 w-20 mb-4" />
        </div>

        <div className="space-y-10">
          {/* Identity Skeleton */}
          <div className="space-y-6">
            <div className="flex gap-3">
              <Skeleton className="h-8 w-32 rounded-full" />
              <Skeleton className="h-8 w-24 rounded-full" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-12 w-3/4 rounded-xl" />
              <div className="flex gap-4">
                <Skeleton className="h-10 w-32 rounded-xl" />
                <Skeleton className="h-6 w-24 rounded-xl mt-2" />
              </div>
            </div>
          </div>

          {/* Action Container Skeleton */}
          <div className="p-8 rounded-[2.5rem] border border-stone-100 space-y-8">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 space-y-3">
                <Skeleton className="h-4 w-16 ml-4" />
                <Skeleton className="h-11 w-full rounded-xl" />
              </div>
              <div className="flex-1 flex gap-3 self-end">
                <Skeleton className="h-11 flex-1 rounded-xl" />
                <Skeleton className="h-11 w-11 rounded-xl" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 pt-4">
              <Skeleton className="h-16 w-full rounded-2xl" />
              <Skeleton className="h-16 w-full rounded-2xl" />
              <Skeleton className="h-16 w-full rounded-2xl" />
            </div>
          </div>

          {/* Shop Card Skeleton */}
          <Skeleton className="h-28 w-full rounded-[2rem]" />

          {/* Story Skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-20 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ProductDetailsSkeleton;
