import { Button } from "./ui/button";
interface NavbarProps {
    activeComponent: string,
    setActiveComponent: (value: string) => void
}

const Navbar:React.FC<NavbarProps> = ({activeComponent, setActiveComponent}) => {
    
    const labels = [
        "Home",
        "Products",
        "Shops",
        "Cart",
        "Check Orders",
        "My Account"
    ];

    return ( 
        <div className="w-[60vw] h-[60px] border-2 border-black rounded-full items-center justify-center flex gap-3 py-3 mb-3">
            {labels.map((label, index) => (
                <Button 
                    variant='ghost' 
                    key={index} 
                    className={`hover:bg-green-500 hover:px-10  rounded-full hover:text-white ${activeComponent === label ? 'bg-green-500 text-white px-10' : ''}`}
                    onClick={() => setActiveComponent(label)}
                >
                    {label}
                </Button>
            ))}
        </div>
     );
}
 
export default Navbar;