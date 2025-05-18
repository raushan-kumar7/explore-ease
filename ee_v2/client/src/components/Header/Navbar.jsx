import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, MapPin, Info, PhoneCall, Rss, LogIn } from "lucide-react";

const Navbar = ({ isMobile = false }) => {
  const location = useLocation();
  
  const publicNavLinks = [
    { id: 1, name: "Home", path: "/", icon: Home },
    { id: 2, name: "Tour", path: "/tours", icon: MapPin },
    { id: 3, name: "Blog", path: "/blogs", icon: Rss },
    { id: 4, name: "About", path: "/about", icon: Info },
    { id: 5, name: "Contact", path: "/contact", icon: PhoneCall },
    { id: 6, name: "Sign In", path: "/auth/signin", icon: LogIn },
  ];

  const renderNavLinks = (links) => {
    return links.map((link) => (
      <Button
        key={link.id}
        variant="ghost"
        asChild
        className={`${isMobile ? "w-full justify-start" : ""} text-[16px] font-heading transition-colors duration-200 ${
          location.pathname === link.path
            ? "text-orange-400 font-semibold"
            : "hover:text-orange-400"
        }`}
      >
        <Link to={link.path} className="flex items-center gap-2">
          {link.icon && <link.icon size={18} />}
          {link.name}
        </Link>
      </Button>
    ));
  };

  return (
    <nav
      className={`${
        isMobile 
          ? "flex flex-col space-y-2 w-full" 
          : "hidden md:flex items-center space-x-6"
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      {renderNavLinks(publicNavLinks)}
    </nav>
  );
};

export default Navbar;