import { Button } from "../ui/button";

interface HeroProps {
  onViewProducts: () => void;
}

const Hero = ({ onViewProducts }: HeroProps) => {
  return (
    <div className="w-full h-[100vh] flex items-center hero-background">
      <div className="w-1/2 px-10">
        <div className="text-4xl">
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
