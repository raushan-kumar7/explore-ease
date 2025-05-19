import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, Send } from "lucide-react";

const LocationMap = () => (
  <div className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
    <svg
      viewBox="0 0 400 300"
      className="w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background */}
      <rect width="400" height="300" fill="#f3f4f6" />
      
      {/* Roads */}
      <path d="M50 150 H350" stroke="#d1d5db" strokeWidth="6" />
      <path d="M200 50 V250" stroke="#d1d5db" strokeWidth="6" />
      
      {/* Buildings */}
      <rect x="160" y="110" width="80" height="80" fill="#9ca3af" />
      <rect x="170" y="120" width="60" height="60" fill="#f3f4f6" />
      
      {/* Location Marker */}
      <circle cx="200" cy="150" r="15" fill="#b45309" opacity="0.2" />
      <circle cx="200" cy="150" r="8" fill="#b45309" />
      <circle cx="200" cy="150" r="4" fill="#f3f4f6" />
      
      {/* Text */}
      <text
        x="200"
        y="200"
        textAnchor="middle"
        fill="#4b5563"
        fontSize="14"
        fontFamily="system-ui"
      >
        ExploreEase Office
      </text>
      <text
        x="200"
        y="220"
        textAnchor="middle"
        fill="#6b7280"
        fontSize="12"
        fontFamily="system-ui"
      >
        Ghorasahan, Bihar
      </text>
    </svg>
  </div>
);

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const officeAddress = "Ghorasahan, Bihar, India, 845303";

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setFormData({
      name: "",
      email: "",
      message: "",
    });
  };

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 ml-30 mr-30">
        {/* Contact Details & Map Section */}
        <div className="space-y-8">
          <div className="space-y-6">
            <h2 className="text-3xl text-center font-bold font-heading">Get in Touch</h2>
            <p className="text-muted-foreground font-body">
              Have questions? We'd love to hear from you. Send us a message and
              we'll respond as soon as possible.
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-icons" />
                <span>+91 6855555596</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-icons" />
                <span>info@exploreease.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-icons" />
                <span>Ghorasahan, Bihar, India, 845303</span>
              </div>
            </div>
          </div>
          
          {/* Location Map */}
          <LocationMap />
          {/* <MapCard address={officeAddress}/> */}
        </div>

        {/* Contact Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center font-heading mb-5">Send us a Message</CardTitle>
            <CardDescription>
              Fill out the form below and we'll get back to you as soon as
              possible.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="mt-1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  className="mt-1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="How can we help you?"
                  className="min-h-32 mt-1"
                />
              </div>

              <CardFooter className="px-0">
                <Button 
                  type="submit"
                  className="w-36 bg-yellow-700 hover:bg-yellow-800 cursor-pointer"
                >
                  <Send className="w-4 h-4 mr-2 text-icons" />
                  Send Message
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Contact;