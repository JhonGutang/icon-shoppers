"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const DashboardRedirect = () => {
  const router = useRouter();
  useEffect(() => {
    router.replace("/");
  }, [router]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-pulse text-green-600 font-medium italic">Redirecting to Dashboard...</div>
    </div>
  );
};

export default DashboardRedirect;
