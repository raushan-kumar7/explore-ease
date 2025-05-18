import React from "react";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { images } from "@/assets";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-50 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Social Media */}
          <Card className="border-none shadow-none bg-transparent">
            <CardContent className="space-y-4 pt-6">
              <img
                src={images.logo}
                alt="logo"
                className="h-16 w-auto object-contain ml-20"
              />
              <p className="text-text text-sm text-center">
                Your trusted partner for amazing travel experiences and
                unforgettable adventures.
              </p>
              <div className="flex space-x-4 items-center justify-center">
                <Facebook className="w-5 h-5 text-icons hover:text-primary cursor-pointer" />
                <Instagram className="w-5 h-5 text-icons hover:text-primary cursor-pointer" />
                <Twitter className="w-5 h-5 text-icons hover:text-primary cursor-pointer" />
              </div>
            </CardContent>
          </Card>

          {/* Discover */}
          <Card className="border-none shadow-none bg-transparent">
            <CardContent className="space-y-4 pt-6">
              <h4 className="text-lg font-semibold text-heading">Discover</h4>
              <ul className="space-y-2">
                <li className="text-text hover:text-primary cursor-pointer">
                  Home
                </li>
                <li className="text-text hover:text-primary cursor-pointer">
                  About
                </li>
                <li className="text-text hover:text-primary cursor-pointer">
                  Tours
                </li>
                <li className="text-text hover:text-primary cursor-pointer">
                  Blog
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card className="border-none shadow-none bg-transparent">
            <CardContent className="space-y-4 pt-6">
              <h4 className="text-lg font-semibold text-heading">
                Quick Links
              </h4>
              <ul className="space-y-2">
                <li className="text-text hover:text-primary cursor-pointer">
                  Gallery
                </li>
                <li className="text-text hover:text-primary cursor-pointer">
                  FAQ
                </li>
                <li className="text-text hover:text-primary cursor-pointer">
                  Terms & Conditions
                </li>
                <li className="text-text hover:text-primary cursor-pointer">
                  Privacy Policy
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Contact Details */}
          <Card className="border-none shadow-none bg-transparent">
            <CardContent className="space-y-4 pt-6">
              <h4 className="text-lg font-semibold text-heading">Contact</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-icons" />
                  <span className="text-text text-sm">
                    Ghorasahan, Bihar, India, 845303
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-icons" />
                  <span className="text-text text-sm">
                    info@exploreease.com
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-icons" />
                  <span className="text-text text-sm">+91 6855555596</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-8 bg-yellow-400" />

        <div className="text-center text-text text-sm">
          <p>© {year} ExploreEase. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;