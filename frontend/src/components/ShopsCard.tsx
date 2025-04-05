import { Shop } from "@/types/product";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import StarRating from "./Rating";
import { Button } from "./ui/button";
import useRedirectLink from "@/hooks/useRedirectLink";

interface ShopsProps {
  shop: Shop;
}

const ShopsCard: React.FC<ShopsProps> = ({ shop }) => {
  const {redirectLink} = useRedirectLink()
  return (
    <Card className="w-[25vw] h-[45vh] px-0 pt-0">
      <CardContent className="px-0">
        <img
          src="https://i.pinimg.com/736x/fd/3d/8e/fd3d8e2a1dd4f09b4170d31e26913bab.jpg"
          alt=""
          className="rounded-t-xl"
        />
        <div className="p-3 flex justify-between">
          <div className="text-lg">{shop.name}</div>
          <div>
            <StarRating/>
          </div>
        </div>

        <div className="w-full text-center">
            <Button className="px-10 bg-green-700" onClick={() => redirectLink(shop.name)}>
                View Shop
            </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShopsCard;
