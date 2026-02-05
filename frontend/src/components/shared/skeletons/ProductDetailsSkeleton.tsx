import { Skeleton } from "@/components/shared/ui/skeleton";

const ProductDetailsSkeleton = () => (
   <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
     <Skeleton className="aspect-square w-full rounded-3xl" />
     <div className="space-y-6">
       <div className="space-y-2">
         <Skeleton className="h-4 w-24" />
         <Skeleton className="h-12 w-3/4" />
       </div>
       <div className="flex justify-between">
         <Skeleton className="h-10 w-32" />
         <Skeleton className="h-10 w-40" />
       </div>
       <Skeleton className="h-40 w-full rounded-xl" />
       <div className="flex gap-4">
         <Skeleton className="h-12 w-32 rounded-full" />
         <Skeleton className="h-12 flex-1 rounded-full" />
         <Skeleton className="h-12 w-12 rounded-full" />
       </div>
     </div>
   </div>
);

export default ProductDetailsSkeleton;
