import { ChevronLeft } from "lucide-react";
import { Button } from "../ui/button";
import useRedirectLink from "@/hooks/useRedirectLink";
const CartNavbar = () => {
  const {redirectLink} = useRedirectLink()
  return (
    <div className="w-full flex items-center lg:px-8 h-[8vh]">
      <Button variant='ghost' className="flex gap-1" onClick={() => redirectLink('/home')}>
        <ChevronLeft />
        <div>Back</div>
      </Button>
      <img src="/logo.png" alt="" className="w-[60px] absolute left-1/2 -translate-x-1/2 cursor-pointer" onClick={() => redirectLink('/home')}/>
      <div>
      </div>
    </div>
  );
};

export default CartNavbar;
