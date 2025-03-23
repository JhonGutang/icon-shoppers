import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, EyeClosed, Menu, Star } from "lucide-react";
import React from "react";
import { Product } from "@/types/product";
import useProductAction from "@/hooks/useProductActions";
import useRedirectLink from "@/hooks/useRedirectLink";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Option } from "@/types/option";

interface ProductCardProps  {
  product: Product
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {redirectLink } = useRedirectLink()
  const { handleDeleteProduct } = useProductAction();
  const type = "seller";
  const menuOptions: Option[] = [
    { label: "Edit", link: "", onClick: () => console.log("Edit clicked")   },
    { label: "Delete", link: "" , onClick: () => handleDeleteProduct(product.id) },
  ];
  return (
    <Card className=" w-[40vw] py-3 lg:w-[20vw] lg:h-[40vh] lg:gap-3 gap-2 cursor-pointer" onClick={() => redirectLink(`profile/${product.id}`)}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{product.name}</CardTitle>
          {/* {type === "seller" ? (
            <Edit options={menuOptions} id={id} />
          ) : (
            <Rate />
          )} */}
        </div>
      </CardHeader>
      <CardContent className="flex items-center justify-center">
        <img
          src={product.image ?? 'https://i.pinimg.com/736x/c5/a0/03/c5a00375d647591a14dd36e31151acb1.jpg'}
          alt={product.name}
          className="w-full h-auto max-h-[140px] lg:max-h-[170px] object-cover rounded-xl"
        />
      </CardContent>
      <CardFooter className="h-[20%] flex justify-between">
        <div>{product.price}</div>
        <Visibility type={type} product={product} />
      </CardFooter>
    </Card>
  );
};

const Edit: React.FC<{ options: Option[]; id: number }> = ({ options, id }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer">
        <Menu size={20} />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {options.map((option) => (
          <div key={option.label}>
            <DropdownMenuItem className="cursor-pointer">
              <Button variant='ghost' onClick={ () => option.onClick?.(id)}>{option.label}</Button>
            </DropdownMenuItem>
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const Rate = () => {
  return (
    <Button variant="outline" size="icon">
      <Star />
    </Button>
  );
};

const Visibility: React.FC<{ type: string, product: Product }> = ({ type, product }) => {
  const { handleProductVisibility } = useProductAction()
  return (
    <Button variant="outline" size="icon" onClick={(event) => handleProductVisibility(event, product)}>
      {product.is_visible ? (<Eye/>) : (<EyeClosed/>)}
      
    </Button>
  );
};

export default ProductCard;
