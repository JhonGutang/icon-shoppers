import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShoppingCart, Star } from "lucide-react";
import React from "react";
import { Product } from "@/types/product";

const ProductCard:React.FC<Product> = ({name, image, price}) => {
  return (

      <Card className=" w-[40vw] py-3 lg:w-[20vw] lg:h-[40vh] lg:gap-3 gap-2 cursor-pointer">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{name}</CardTitle>
            <Button variant="outline" size="icon">
              <Star />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <img
            src={image}
            alt={name}
            className="w-full h-auto max-h-[140px] lg:max-h-[170px] object-cover rounded-xl"
          />
        </CardContent>
        <CardFooter className="h-[20%] flex justify-between">
          <div>{price}</div>
          <Button variant="outline" size="icon">
            <ShoppingCart />
          </Button>
        </CardFooter>
      </Card>
  );
};

export default ProductCard;
