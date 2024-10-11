import { Menu, X } from "lucide-react";
import { useState } from "react";
import LeafIcon from "../assets/plant-icon.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav>
      <div className="bg-green-600 text-white p-4 sm:px-6 lg:px-8 mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <img src={LeafIcon} alt="icon" className="h-8 w-8 bg-white rounded-sm p-1" />
          <a href="#" className="text-2xl font-bold">
            PlantBuddy
          </a>
        </div>

        {/* Hamburger Menu for Mobile */}
        <div className="lg:hidden mr-4">
          <button onClick={toggleMenu} className="text-white">
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Nav Links - Hidden on Mobile, Shown on Larger Screens */}
        <div className={`space-x-6 hidden lg:block`}>
          <a href="#" className="block py-2 lg:inline-block hover:underline">
            Home
          </a>
          <a href="#" className="block py-2 lg:inline-block hover:underline">
            About
          </a>
          <a href="#" className="block py-2 lg:inline-block hover:underline">
            Contact
          </a>
          <a href="#" className="block py-2 lg:inline-block hover:underline">
            Other
          </a>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="lg:hidden">
          <a href="#" className="block py-4 px-4 text-white bg-green-700">
            Home
          </a>
          <a href="#" className="block py-4 px-4 text-white bg-green-700">
            About
          </a>
          <a href="#" className="block py-4 px-4 text-white bg-green-700">
            Contact
          </a>
          <a href="#" className="block py-4 px-4 text-white bg-green-700">
            Other
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
