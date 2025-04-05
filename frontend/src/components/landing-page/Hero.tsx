import { Button } from "../ui/button";

interface HeroProps {
  onViewProducts: () => void;
}

const Hero = ({ onViewProducts }: HeroProps) => {
  return (
    <div className="w-full h-[100vh] flex items-center hero-background">
      <div className="lg:w-1/2 lg:px-10 pl-4">
        <div className="lg:text-4xl text-2xl">
          Your Hometown Market, Now Just a Click Away.
        </div>
        <div className="mb-5">
          Connecting you to your community&rsquo;s best — quick, easy, and local.
        </div>
        <div>
            <Button className="bg-green-700" onClick={onViewProducts}>
                View Products
            </Button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
