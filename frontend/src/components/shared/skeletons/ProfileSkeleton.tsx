
import { Skeleton } from "@/components/shared/ui/skeleton";

const ProfileSkeleton = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column - Main Content */}
      <div className="lg:col-span-2 space-y-10">
        {/* Profile Card Skeleton */}
        <div className="border border-stone-200 shadow-sm rounded-3xl overflow-hidden bg-white">
          <div className="bg-stone-50 px-8 py-6 border-b border-stone-100 flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
          <div className="p-8">
            <div className="grid md:grid-cols-3 gap-10">
              <div className="flex flex-col items-center gap-6">
                 <Skeleton className="h-32 w-32 rounded-full" />
                 <Skeleton className="h-4 w-32" />
              </div>
              <div className="md:col-span-2 space-y-6">
                <div className="grid md:grid-cols-2 gap-5">
                   <div className="space-y-2"><Skeleton className="h-4 w-20" /><Skeleton className="h-11 w-full rounded-md" /></div>
                   <div className="space-y-2"><Skeleton className="h-4 w-20" /><Skeleton className="h-11 w-full rounded-md" /></div>
                </div>
                <div className="grid md:grid-cols-2 gap-5">
                   <div className="space-y-2"><Skeleton className="h-4 w-20" /><Skeleton className="h-11 w-full rounded-md" /></div>
                   <div className="space-y-2"><Skeleton className="h-4 w-20" /><Skeleton className="h-11 w-full rounded-md" /></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Addresses Skeleton */}
         <div className="space-y-6">
             <div className="flex justify-between items-center">
                 <div className="flex items-center gap-4">
                     <Skeleton className="h-10 w-10 rounded-xl" />
                     <div className="space-y-1">
                         <Skeleton className="h-6 w-40" />
                         <Skeleton className="h-4 w-32" />
                     </div>
                 </div>
                 <Skeleton className="h-10 w-32 rounded-xl" />
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                 {[1, 2].map((i) => (
                     <div key={i} className="rounded-2xl border border-stone-200 bg-white p-6 h-40 flex flex-col justify-between">
                         <div className="space-y-3">
                             <div className="flex items-center justify-between">
                                 <Skeleton className="h-5 w-32" />
                                 {i === 1 && <Skeleton className="h-5 w-16 rounded-full" />}
                             </div>
                             <Skeleton className="h-4 w-full" />
                             <Skeleton className="h-4 w-2/3" />
                         </div>
                         <div className="flex gap-2">
                             <Skeleton className="h-8 w-8 rounded-md" />
                             <Skeleton className="h-8 w-20 rounded-md" />
                         </div>
                     </div>
                 ))}
             </div>
         </div>
      </div>

      {/* Right Column - Sidebar/Ad Area */}
      <div className="lg:col-span-1">
        <div className="sticky top-24">
            <div className="h-[500px] w-full rounded-3xl bg-stone-100 overflow-hidden relative">
                <Skeleton className="absolute inset-0 h-full w-full" />
                <div className="relative p-8 h-full flex flex-col justify-center items-center space-y-6 z-10">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <Skeleton className="h-8 w-3/4 text-center" />
                    <Skeleton className="h-24 w-full rounded-xl" />
                    <Skeleton className="h-14 w-full rounded-xl" />
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;
