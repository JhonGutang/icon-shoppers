import { Shop } from "@/types/product";
import { Card, CardContent } from "./ui/card";
import StarRating from "./Rating";
import { Button } from "./ui/button";
import useRedirectLink from "@/hooks/useRedirectLink";

interface ShopsProps {
  shop: Shop;
}

const ShopsCard: React.FC<ShopsProps> = ({ shop }) => {
  const { redirectLink } = useRedirectLink();
  return (
    <Card className="lg:w-[25vw] lg:h-[40vh] px-0 pt-0 transition-transform duration-300 hover:scale-105">
      <CardContent className="px-0">
        <img
          src={shop.logo_image ? `${process.env.NEXT_PUBLIC_LARAVEL_API_URL}/storage/${shop.logo_image}` : 'https://i.pinimg.com/736x/fd/3d/8e/fd3d8e2a1dd4f09b4170d31e26913bab.jpg'}
          alt=""
          className="rounded-t-xl lg:h-[30vh] w-full"
        />
        <div className="p-3 lg:flex justify-between">
          <div className="text-lg">{shop.name}</div>
          <Button className="px-10 bg-green-700" onClick={() => redirectLink(shop.name)}>
            View Shop
          </Button>
        </div>

      </CardContent>
    </Card>
  );
};

export default ShopsCard;
