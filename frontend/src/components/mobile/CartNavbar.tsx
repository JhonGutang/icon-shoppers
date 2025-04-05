import { ChevronLeft, UserRound } from "lucide-react";
import { Button } from "../ui/button";
import useRedirectLink from "@/hooks/useRedirectLink";
const CartNavbar = () => {
  const {redirectLink} = useRedirectLink()
  return (
    <div className="w-full flex justify-between items-center px-8 h-[8vh]">
      <Button variant='ghost' className="flex gap-1" onClick={() => redirectLink('/')}>
        <ChevronLeft />
        <div>Back</div>
      </Button>
      <img src="/logo.png" alt="" className="w-[60px]" onClick={() => redirectLink('/')}/>
      <div>
        <UserRound />
      </div>
    </div>
  );
};

export default CartNavbar;
