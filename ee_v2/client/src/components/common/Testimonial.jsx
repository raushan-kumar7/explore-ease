import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { Subtitle } from "..";
import { images } from "@/assets";


const TestimonialCard = ({ name, role, comment, rating, image }) => (
  <Card className="border-none shadow-none">
    <CardContent className="p-6">
      <div className="flex flex-col items-center text-center">
        <Avatar className="w-20 h-20 mb-4 border border-orange-500 object-contain cursor-pointer tranform-scale-150">
          <AvatarImage src={image} alt={name}/>
          <AvatarFallback>{name[0]}</AvatarFallback>
        </Avatar>
        
        <div className="flex gap-1 mb-4">
          {[...Array(rating)].map((_, i) => (
            <Star key={i} className="w-5 h-5 fill-orange-500 text-orange-500" />
          ))}
        </div>
        
        <p className="text-gray-600 mb-4 italic">
          "{comment}"
        </p>
        
        <h4 className="font-semibold text-lg text-gray-800">{name}</h4>
        <p className="text-gray-500 text-sm">{role}</p>
      </div>
    </CardContent>
  </Card>
);

const Testimonial = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Adventure Traveler",
      comment: "The most amazing travel experience of my life! The attention to detail and personalized service was outstanding.",
      rating: 5,
      image: images.person
    },
    {
      name: "Michael Chen",
      role: "Business Traveler",
      comment: "Exceptional service and seamless arrangements. They made my business trip feel like a luxury vacation.",
      rating: 5,
      image: images.person
    },
    {
      name: "Emma Wilson",
      role: "Family Vacationer",
      comment: "Our family trip was perfectly organized. Every activity was family-friendly and memorable.",
      rating: 5,
      image: images.person
    },
    {
      name: "David Thompson",
      role: "Solo Traveler",
      comment: "The cultural experiences they arranged were authentic and unforgettable. Highly recommended!",
      rating: 5,
      image: images.person
    }
  ];

  return (
    <section className="px-6 py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Subtitle Subtitle={"Client Testimonials"} />
          </div>
          <div className="w-20 h-1 bg-orange-500 mx-auto mb-4" />
          <p className="text-gray-600 max-w-2xl mx-auto">
            Hear what our valued clients have to say about their unforgettable travel experiences with us.
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-5xl mx-auto"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                <TestimonialCard {...testimonial} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center gap-4 mt-8">
            <CarouselPrevious className="relative static text-icons hover:text-yellow-400 cursor-pointer" />
            <CarouselNext className="relative static text-icons hover:text-yellow-400 cursor-pointer" />
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export default Testimonial;