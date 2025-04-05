'use client'
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";
import useRedirectLink from "@/hooks/useRedirectLink";

const Product = () => {
    const {redirectLink} = useRedirectLink() 
    const products = [
        {id: 1, name: 'Headset', imageLink: 'https://i.pinimg.com/736x/ab/bc/81/abbc8189ad93d5ba17a19cbfdadfa447.jpg'},
        {id: 2, name: 'Shoes', imageLink: 'https://i.pinimg.com/736x/ea/b5/2d/eab52da932595bc0ea1d7b6c59041ff4.jpg'},
        {id: 3, name: 'Foods', imageLink: 'https://i.pinimg.com/736x/c4/a5/1d/c4a51de04302cf89d28e4d85545e7717.jpg'},
        {id: 4, name: 'School Supplies', imageLink: 'https://i.pinimg.com/736x/b0/72/3c/b0723cb46fc43ac57d346dd8cfedac34.jpg'},
        {id: 5, name: 'Smartphone', imageLink: 'https://i.pinimg.com/736x/45/0f/dc/450fdc828cd85c2365291945df5afe8f.jpg'},
        {id: 6, name: 'Laptop', imageLink: 'https://i.pinimg.com/736x/71/e8/f9/71e8f927d8ee86583d86b4da62f048ca.jpg'},
        {id: 7, name: 'Backpack', imageLink: 'https://i.pinimg.com/736x/0e/88/a5/0e88a5afd404cf8ea4335dd0ff5324ca.jpg'},
    ];
    
    return (
        <div className="w-full h-[100vh] flex flex-col justify-center items-center">
            <div className="text-2xl px-10 mb-10 text-center">
                Discover Trends from Well known Local Shops
            </div>
            <div className="px-10">
                <Carousel>
                    <CarouselContent>
                        {products.map(product => (
                            <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/3 cursor-pointer" onClick={() => redirectLink('/customer-auth')}>
                                <Card className="shadow-lg rounded-lg py-0 h-[40vh] flex items-center justify-center relative group">
                                    <CardContent className="flex flex-col items-center px-0 w-full h-full">
                                        <img
                                            src={product.imageLink}
                                            alt={product.name}
                                            className="w-full h-full object-cover rounded-lg"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 text-white group-hover:opacity-100 transition-opacity text-xl">
                                            {product.name}
                                        </div>
                                    </CardContent>
                                </Card>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </div>
        </div>
    );
};

export default Product;
