import { Suspense } from "react";
import HomeContent from "@/components/customer-home/HomeContent";

const Home = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
};

export default Home;
