import { images } from "@/assets";
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to="/" className="flex items-center space-x-2">
      <img 
        src={images.logo} 
        alt="ExploreEase Logo" 
        className="h-[40px] w-[100px] md:h-[50px] md:w-[120px]" 
      />
    </Link>
  );
};

export default Logo;