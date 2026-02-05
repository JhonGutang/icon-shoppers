import React from "react";
import { Card, CardContent } from "@/components/shared/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/shared/ui/carousel";

interface ImageCarouselProps {
  images: {id: string, link: string}[]
}
const ImageCarousel:React.FC<ImageCarouselProps> = ({images}) => {
    return (
        <Carousel className="w-[90vw]  ">
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={index} className="">
                <div className="p-1">
                  <Card className="py-0">
                    <CardContent className="flex aspect-square items-center justify-center p-0 h-[30vh] lg:h-[50vh] ">
                      <img src={image.link} alt="" className="h-full w-full object-cover rounded-xl" />
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      )
}
 
export default ImageCarousel;