import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

const MessagesSkeleton = () => {
  return (
    <div className="flex h-full gap-4">
      {/* Sidebar Skeleton */}
      <Card className="flex w-full max-w-sm flex-col overflow-hidden shadow-md border-none bg-white">
        <div className="p-4 border-b">
          <Skeleton className="h-7 w-24 mb-4" />
          <Skeleton className="h-10 w-full rounded-full" />
        </div>
        <div className="flex-1 overflow-y-auto">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-4 border-b">
              <Skeleton className="h-12 w-12 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-10" />
                </div>
                <Skeleton className="h-3 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Chat Window Skeleton */}
      <Card className="flex flex-1 flex-col overflow-hidden shadow-md border-none bg-white">
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div>
                      <Skeleton className="h-4 w-32 mb-1" />
                      <Skeleton className="h-3 w-16" />
                  </div>
              </div>
              <div className="flex gap-2">
                  <Skeleton className="h-8 w-8 rounded-md" />
                  <Skeleton className="h-8 w-8 rounded-md" />
              </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 p-4 space-y-4 bg-[#f0f2f5] flex flex-col justify-end">
              <div className="flex justify-start">
                  <Skeleton className="h-10 w-48 rounded-2xl rounded-tl-none" />
              </div>
              <div className="flex justify-end">
                  <Skeleton className="h-16 w-64 rounded-2xl rounded-tr-none" />
              </div>
              <div className="flex justify-end">
                  <Skeleton className="h-8 w-32 rounded-2xl rounded-tr-none" />
              </div>
              <div className="flex justify-start">
                  <Skeleton className="h-12 w-56 rounded-2xl rounded-tl-none" />
              </div>
          </div>

          {/* Input Area */}
          <div className="p-4 border-t">
              <div className="flex gap-2">
                  <Skeleton className="flex-1 h-11 rounded-full" />
                  <Skeleton className="h-11 w-11 rounded-full" />
              </div>
          </div>
      </Card>
    </div>
  );
};

export default MessagesSkeleton;
