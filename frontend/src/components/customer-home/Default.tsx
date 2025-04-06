import Shops from "./Shops";
import Products from "./Products";

const Default = () => {
  return (
    <div className="w-full h-screen flex flex-col lg:gap-10 gap-6">
      <Shops />
      <Products />
    </div>
  );
};




export default Default;
