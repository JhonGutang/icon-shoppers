import { Facebook, Instagram, Mail, Phone } from "lucide-react";
import { Button } from "../ui/button";

const Footer = () => {
  return (
    <div className="w-full border-t-2 border-green-700">
      <div className="w-full flex justify-between items-center">
        <div className="flex items-center">
          <img src="/logo.png" alt="" className="w-[150px] h-[150px] " />
          <div className="flex px-8 gap-5">
            <div>
              <div>Email</div>
              <div>iconshoppers@gmail.com</div>
            </div>
            <div>
              <div>Phone Number</div>
              <div>09955695397</div>
            </div>
          </div>
        </div>
        <div className="h-full px-10">
          <div className="mb-4">
            Join our community supporting local shops in Cebu!
          </div>
          <div className="flex gap-3">
            <Button className="bg-green-600">Join Icon Shoppers</Button>
            <Button className="bg-green-600">Sellers Center</Button>
          </div>
        </div>
      </div>

      <div className="w-full flex border-t-4 px-10 py-2 justify-between">
        <div className="flex gap-3">
          <div>Icon Shoppers</div>
          <div>Copyright 2025</div>
          <div>All Rights Reserved</div>
        </div>

    <div className="flex gap-3">

        <div>Terms and Condition</div>
        <div>About Us</div>
        <div>Products</div>
    </div>

    <div className="flex gap-3">
        <div>Socials: </div>
        <Facebook/>
        <Instagram/>
        <Mail/>
        <Phone/>
    </div>
      </div>
    </div>
  );
};

export default Footer;
