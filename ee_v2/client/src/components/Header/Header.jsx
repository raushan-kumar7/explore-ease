import React from "react";
import Logo from "./Logo";
import Navbar from "./Navbar";
import { Menu, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Header = () => {
  return (
    <header className="border-b sticky top-0 bg-white z-50">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full ml-2 md:ml-10 mr-2 md:mr-20">
          <Logo />
          <Navbar />
          
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <button aria-label="Menu" className="p-2">
                <Menu size={24} />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[240px] sm:w-[300px]">
              <div className="py-4">
                <Navbar isMobile={true} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;