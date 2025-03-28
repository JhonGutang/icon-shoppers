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
      <div>Icon Shopper</div>
      <div>
        <UserRound />
      </div>
    </div>
  );
};

export default CartNavbar;
