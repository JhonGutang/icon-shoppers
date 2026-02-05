import { Skeleton } from "@/components/shared/ui/skeleton";

const ShopDetailsSkeleton = () => {
    return (
      <div className="pb-12">
        {/* Banner Skeleton */}
        <div className="relative w-full h-[250px] md:h-[350px] bg-muted overflow-hidden">
          <Skeleton className="w-full h-full" />
          <div className="absolute bottom-0 left-0 w-full">
            <div className="container mx-auto px-4 pb-8 flex flex-col md:flex-row items-end gap-6">
              {/* Logo Skeleton */}
              <div className="relative -mb-4 md:-mb-12 h-24 w-24 md:h-36 md:w-36 shrink-0">
                 <Skeleton className="w-full h-full rounded-2xl border-4 border-background" />
              </div>
              
              <div className="flex-1 pb-2 space-y-3">
                 <Skeleton className="h-8 w-64 bg-white/20" />
                 <div className="flex gap-4">
                    <Skeleton className="h-4 w-24 bg-white/20" />
                    <Skeleton className="h-4 w-24 bg-white/20" />
                 </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 mt-8 md:mt-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar Skeleton */}
            <div className="lg:col-span-3 space-y-6">
               <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-4">
                  <Skeleton className="h-6 w-40 mb-4" />
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="space-y-2">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    ))}
                  </div>
               </div>
               <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-4">
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-20 w-full" />
               </div>
            </div>

            {/* Main Content Skeleton */}
            <div className="lg:col-span-9 space-y-8">
               <div className="flex gap-2 mb-6">
                  <Skeleton className="h-12 w-32 rounded-xl" />
                  <Skeleton className="h-12 w-32 rounded-xl" />
                  <Skeleton className="h-12 w-32 rounded-xl" />
               </div>
               
               <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div key={i} className="space-y-3">
                      <Skeleton className="aspect-square w-full rounded-xl" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                      </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </div>
      </div>
    );
};
  
export default ShopDetailsSkeleton;
