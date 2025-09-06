import { Suspense } from "react";
import CustomerLayout from "@/layout/CustomerLayout";
import HomeContent from "@/components/customer-home/HomeContent";

const Home = () => {
  return (
    <CustomerLayout>
      <Suspense fallback={<div>Loading...</div>}>
        <HomeContent />
      </Suspense>
    </CustomerLayout>
  );
};

export default Home;
