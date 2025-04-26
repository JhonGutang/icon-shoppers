import { Button } from "../ui/button";

interface HeroProps {
  onViewProducts: () => void;
}

const Hero = ({ onViewProducts }: HeroProps) => {
  return (
    <div className="relative w-full min-h-screen flex items-center">
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Background image with proper mobile handling */}
      <div className="absolute inset-0 hero-background" />
      
      {/* Content container */}
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:w-1/2 text-white space-y-6">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
            Your Hometown Market, Now Just a Click Away.
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-100">
            Connecting you to your community&rsquo;s best — quick, easy, and local.
          </p>
          <div className="pt-2">
            <Button 
              className="bg-green-700 hover:bg-green-800 text-white px-8 py-3 text-lg rounded-lg transition-all duration-300 transform hover:scale-105"
              onClick={onViewProducts}
            >
              View Products
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
