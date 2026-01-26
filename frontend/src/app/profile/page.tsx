"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const ProfileRedirect = () => {
  const router = useRouter();
  useEffect(() => {
    router.replace("/home");
  }, [router]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-pulse text-green-600 font-medium italic">Redirecting to Home...</div>
    </div>
  );
};

export default ProfileRedirect;
