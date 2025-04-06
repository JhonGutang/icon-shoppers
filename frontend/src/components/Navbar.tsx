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
        <div className="lg:w-[60vw] lg:min-h-[60px] overflow-x-auto overflow-y-hidden min-h-[6vh] w-[90%] p-2  border-2 border-black rounded-full items-center lg:justify-center flex gap-3 lg:py-3 mb-3">
            {labels.map((label, index) => (
                <Button 
                    variant='ghost' 
                    key={index} 
                    className={`hover:bg-green-500 lg:hover:px-10  rounded-full hover:text-white ${activeComponent === label ? 'bg-green-500 text-white lg:px-10' : ''}`}
                    onClick={() => setActiveComponent(label)}
                >
                    {label}
                </Button>
            ))}
        </div>
     );
}
 
export default Navbar;