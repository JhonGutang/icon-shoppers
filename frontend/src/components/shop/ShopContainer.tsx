import React from "react";
import ShopsCard from "@/components/shop/ShopsCard";
import { Shop } from "@/types/product";
import { Skeleton } from "@/components/shared/ui/skeleton";
import { Store } from "lucide-react";

interface ShopContainerProps {
  shops: Shop[];
  isLoading: boolean;
  emptyMessage?: string;
  title?: string;
  children?: React.ReactNode;
}

const ShopContainer: React.FC<ShopContainerProps> = ({
  shops,
  isLoading,
  emptyMessage = "No shops found matching your search",
  title,
  children,
}) => {
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 w-full">
      {title && (
        <h2 className="text-2xl font-bold mb-6 text-foreground">{title}</h2>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
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
        ) : shops.length > 0 ? (
          <>
            {shops.map((shop) => (
              <div key={shop.id} className="w-full">
                <ShopsCard shop={shop} />
              </div>
            ))}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center w-full col-span-full">
            <Store className="h-12 w-12 text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium text-lg">{emptyMessage}</p>
            <p className="text-gray-400 text-sm mt-1">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </div>
      
      {children && (
        <div className="mt-8 flex justify-center">
          {children}
        </div>
      )}
    </div>
  );
};

export default ShopContainer;
