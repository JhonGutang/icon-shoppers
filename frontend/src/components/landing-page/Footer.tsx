import { Facebook, Instagram, Mail, Phone } from "lucide-react";
import { Button } from "../ui/button";
import useRedirectLink from "@/hooks/useRedirectLink";

const Footer = () => {
  const { redirectLink } = useRedirectLink();
  return (
    <div className="w-full border-t-2 border-green-700">
      <div className="w-full lg:flex justify-between items-center mb-5 lg:mb-0">
        <div className="flex justify-center lg:justify-start items-center">
          <img
            src="/logo.png"
            alt=""
            className="lg:w-[150px] lg:h-[150px] w-[70px] "
          />
          <div className="flex lg:px-8 px-2 gap-5">
            <div>
              <div className="text-sm">Email</div>
              <div className="text-xs">iconshoppers@gmail.com</div>
            </div>
            <div>
              <div className="text-sm">Phone Number</div>
              <div className="text-xs">09955695397</div>
            </div>
          </div>
        </div>
        <div className="h-full px-10">
          <div className="mb-4 text-center lg:text-start">
            Join our community supporting local shops in Cebu!
          </div>
          <div className="flex gap-3">
            <Button
              className="bg-green-600"
              onClick={() => redirectLink("/auth")}
            >
              Join Icon Shoppers
            </Button>
            <Button
              className="bg-green-600"
              onClick={() => redirectLink("/customer-auth")}
            >
              Sellers Center
            </Button>
          </div>
        </div>
      </div>

      <div className="w-full text-xs lg:text-sm lg:flex border-t-4 px-10 py-2 justify-between">
        <div className="flex gap-3 justify-center">
          <div>Icon Shoppers</div>
          <div>Copyright 2025</div>
          <div>All Rights Reserved</div>
        </div>

        <div className="flex gap-3 justify-center">
          <div>Terms and Condition</div>
          <div>About Us</div>
          <div>Products</div>
        </div>

        <div className="flex gap-3 justify-center">
          <div>Socials: </div>
          <Facebook />
          <Instagram />
          <Mail />
          <Phone />
        </div>
      </div>
    </div>
  );
};

export default Footer;
