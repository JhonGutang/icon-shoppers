import { Skeleton } from "@/components/shared/ui/skeleton";

const CartSkeleton = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Cart Items Area */}
      <div className="lg:col-span-2 space-y-6">
        {[1, 2].map((group) => (
          <div key={group} className="rounded-2xl border border-border overflow-hidden bg-card">
            <div className="bg-muted/30 px-4 py-3 border-b flex items-center gap-2">
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-6 w-32" />
            </div>
            
            <div className="divide-y">
              {[1, 2].map((item) => (
                <div key={item} className="p-4 flex gap-4">
                  <Skeleton className="h-20 w-20 flex-shrink-0 rounded-lg" />
                  
                  <div className="flex-1 min-w-0 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-5 w-24" />
                    
                    <div className="mt-2 flex items-center justify-between">
                      <Skeleton className="h-8 w-24 rounded-full" />
                      <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Order Summary Area */}
      <div className="lg:col-span-1">
        <div className="sticky top-24 rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <Skeleton className="h-7 w-40 mb-4" />
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          
          <hr className="my-4" />
          
          <div className="flex justify-between">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-24" />
          </div>
          
          <Skeleton className="w-full mt-6 h-12 rounded-full" />
          
          <div className="flex justify-center mt-4">
              <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartSkeleton;
