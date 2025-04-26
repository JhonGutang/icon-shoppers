import Shops from "./Shops";
import Products from "./Products";

const Default = () => {
  return (
    <div className="w-full h-screen flex flex-col lg:gap-10 gap-6">
      <Shops location="home" />
      <Products location="home" />
    </div>
  );
};




export default Default;
