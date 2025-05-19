// import { useState } from "react";
// import { Star, MapPin, Sparkles, Clock, ChevronLeft, ChevronRight, Users } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { useNavigate } from "react-router-dom";

// const TourCard = ({ tour }) => {
//   const navigate = useNavigate();
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const [direction, setDirection] = useState(0);
//   const [isHovered, setIsHovered] = useState(false);
  
//   const countryCodeMap = {
//     "India": 'IN',
//     "United States": 'US',
//     "Canada": 'CA',
//     "United Kingdom": 'GB',
//     "Australia": 'AU',
//     "Germany": 'DE',
//     "France": 'FR',
//   };

//   const formatLocation = (location) => {
//     if (typeof location === 'string') return location;

//     if (typeof location === 'object' && location !== null) {
//       const { city, state, country } = location;

//       const countryCode = countryCodeMap[country] || country;

//       return [city, state, countryCode]
//         .filter(Boolean)
//         .join(', ');
//     }

//     return 'Unknown Location';
//   };

//   const formatPrice = (price) => {
//     return new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: 'INR',
//       maximumFractionDigits: 0,
//     }).format(price);
//   };

//   const slideVariants = {
//     enter: (direction) => ({
//       x: direction > 0 ? 1000 : -1000,
//       opacity: 0
//     }),
//     center: {
//       zIndex: 1,
//       x: 0,
//       opacity: 1
//     },
//     exit: (direction) => ({
//       zIndex: 0,
//       x: direction < 0 ? 1000 : -1000,
//       opacity: 0
//     })
//   };

//   const swipeConfidenceThreshold = 10000;
//   const swipePower = (offset, velocity) => {
//     return Math.abs(offset) * velocity;
//   };

//   const paginate = (newDirection) => {
//     setDirection(newDirection);
//     if (Array.isArray(tour.images)) {
//       setCurrentImageIndex((prev) => {
//         if (newDirection > 0) {
//           return prev === tour.images.length - 1 ? 0 : prev + 1;
//         }
//         return prev === 0 ? tour.images.length - 1 : prev - 1;
//       });
//     }
//   };

//   const nextImage = (e) => {
//     e.stopPropagation();
//     paginate(1);
//   };

//   const prevImage = (e) => {
//     e.stopPropagation();
//     paginate(-1);
//   };

//   const handleBookNow = () => {
//     navigate(`/tours/${tour._id}`);
//   };

//   const handleTitleClick = () => {
//     navigate(`/tours/${tour.slug || tour._id}`);
//   };

//   return (
//     <Card 
//       className="group overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border-gray-200 rounded-xl w-full bg-white p-0"
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       <CardHeader className="p-0 relative">
//         <div 
//           className="overflow-hidden h-48 relative cursor-pointer rounded-tl-xl rounded-tr-xl"
//           onClick={handleTitleClick}
//         >
//           <AnimatePresence initial={false} custom={direction}>
//             <motion.img
//               key={currentImageIndex}
//               src={Array.isArray(tour.images) ? tour.images[currentImageIndex] : tour.image}
//               alt={tour.title}
//               className="w-full h-full object-cover object-center absolute top-0 left-0 transition-transform duration-700"
//               style={{ transform: isHovered ? "scale(1.08)" : "scale(1)" }}
//               custom={direction}
//               variants={slideVariants}
//               initial="enter"
//               animate="center"
//               exit="exit"
//               transition={{
//                 x: { type: "spring", stiffness: 300, damping: 30 },
//                 opacity: { duration: 0.2 }
//               }}
//               drag="x"
//               dragConstraints={{ left: 0, right: 0 }}
//               dragElastic={1}
//               onDragEnd={(e, { offset, velocity }) => {
//                 const swipe = swipePower(offset.x, velocity.x);

//                 if (swipe < -swipeConfidenceThreshold) {
//                   paginate(1);
//                 } else if (swipe > swipeConfidenceThreshold) {
//                   paginate(-1);
//                 }
//               }}
//             />
//           </AnimatePresence>
          
//           {/* Image gradient overlay */}
//           <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-80"></div>
          
//           {Array.isArray(tour.images) && tour.images.length > 1 && (
//             <>
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 className="absolute left-2 top-1/2 -translate-y-1/2 bg-orange-600 hover:bg-orange-700 p-2 rounded-full cursor-pointer z-10 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
//                 onClick={prevImage}
//               >
//                 <ChevronLeft className="w-5 h-5 text-white" />
//               </Button>
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 className="absolute right-2 top-1/2 -translate-y-1/2 bg-orange-600 hover:bg-orange-700 p-2 rounded-full cursor-pointer z-10 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
//                 onClick={nextImage}
//               >
//                 <ChevronRight className="w-5 h-5 text-white" />
//               </Button>
//               <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
//                 {tour.images.map((_, index) => (
//                   <div
//                     key={index}
//                     className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
//                       currentImageIndex === index ? 'bg-white w-3' : 'bg-white/60'
//                     }`}
//                   />
//                 ))}
//               </div>
//             </>
//           )}
//         </div>
//         {tour.featured && (
//           <Badge className="absolute top-4 right-4 bg-orange-500 hover:bg-orange-600 transition-colors cursor-pointer px-3 py-1.5 flex items-center gap-1 z-10 font-medium">
//             <Sparkles className="w-4 h-4" />
//             <span>Featured</span>
//           </Badge>
//         )}
//         <Badge className="absolute bottom-4 left-4 bg-white/90 text-gray-800 px-3 py-1.5 flex items-center gap-1 z-10 font-medium">
//           <Clock className="w-4 h-4" />
//           <span>{tour.duration}</span>
//         </Badge>
//       </CardHeader>
//       <CardContent className="p-6">
//         <div className="flex items-center justify-between mb-1">
//           <div className="flex items-center gap-1.5">
//             <MapPin className="w-4 h-4 text-orange-500" />
//             <span className="text-gray-600 text-sm font-medium">{formatLocation(tour.location)}</span>
//           </div>
//           <div className="flex items-center gap-1.5">
//             <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
//             <span className="text-gray-600 text-sm font-bold">{tour.rating}</span>
//             <span className="text-gray-400 text-sm">({Array.isArray(tour.reviews) ? tour.reviews.length : 0})</span>
//           </div>
//         </div>
//         <h3 
//           onClick={handleTitleClick}
//           className="text-xl font-semibold font-heading mb-3 group-hover:text-orange-500 transition-colors cursor-pointer line-clamp-1"
//         >
//           {tour.title}
//         </h3>
//         <p className="text-gray-600 text-sm line-clamp-2 mb-4">
//           {tour.description || `Experience the breathtaking beauty of ${formatLocation(tour.location)} with our expertly curated tour package. Perfect for adventure seekers and nature lovers.`}
//         </p>
//         {tour.maxGroupSize && (
//           <div className="flex items-center gap-1.5 text-gray-600 text-sm">
//             <Users className="w-4 h-4 text-icons" />
//             <span>Max group size: <span className="font-medium">{tour.maxGroupSize} people</span></span>
//           </div>
//         )}
//       </CardContent>
//       <CardFooter className="flex justify-between items-center p-6 border-t bg-gradient-to-r from-orange-50 to-gray-50">
//         <div>
//           <span className="text-2xl font-bold text-orange-600">{formatPrice(tour.price)}</span>
//           <span className="text-gray-500 font-body text-sm ml-1">/person</span>
//         </div>
//         <Button 
//           onClick={handleBookNow}
//           className="bg-orange-500 hover:bg-orange-600 transition-colors cursor-pointer px-6 py-2 font-medium text-white rounded-full shadow-sm hover:shadow-md"
//         >
//           Book Now
//         </Button>
//       </CardFooter>
//     </Card>
//   );
// };

// export default TourCard;

import { useState } from "react";
import { Star, MapPin, Sparkles, Clock, ChevronLeft, ChevronRight, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks"; // Import useAuth hook for authentication state

const TourCard = ({ tour }) => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const { isAuthenticated } = useAuth(); // Get authentication state
  
  const countryCodeMap = {
    "India": 'IN',
    "United States": 'US',
    "Canada": 'CA',
    "United Kingdom": 'GB',
    "Australia": 'AU',
    "Germany": 'DE',
    "France": 'FR',
  };

  const formatLocation = (location) => {
    if (typeof location === 'string') return location;

    if (typeof location === 'object' && location !== null) {
      const { city, state, country } = location;

      const countryCode = countryCodeMap[country] || country;

      return [city, state, countryCode]
        .filter(Boolean)
        .join(', ');
    }

    return 'Unknown Location';
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection) => {
    setDirection(newDirection);
    if (Array.isArray(tour.images)) {
      setCurrentImageIndex((prev) => {
        if (newDirection > 0) {
          return prev === tour.images.length - 1 ? 0 : prev + 1;
        }
        return prev === 0 ? tour.images.length - 1 : prev - 1;
      });
    }
  };

  const nextImage = (e) => {
    e.stopPropagation();
    paginate(1);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    paginate(-1);
  };

  const handleBookNow = () => {
    if (!isAuthenticated) {
      // Show alert if user is not signed in
      alert("Please sign in first to book this tour.");
      // Optionally redirect to login page
      navigate("/auth/signin");
      return;
    }
    
    // Proceed with booking if user is signed in
    navigate(`/tours/${tour._id}`);
  };

  const handleTitleClick = () => {
    navigate(`/tours/${tour.slug || tour._id}`);
  };

  return (
    <Card 
      className="group overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border-gray-200 rounded-xl w-full bg-white p-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="p-0 relative">
        <div 
          className="overflow-hidden h-48 relative cursor-pointer rounded-tl-xl rounded-tr-xl"
          onClick={handleTitleClick}
        >
          <AnimatePresence initial={false} custom={direction}>
            <motion.img
              key={currentImageIndex}
              src={Array.isArray(tour.images) ? tour.images[currentImageIndex] : tour.image}
              alt={tour.title}
              className="w-full h-full object-cover object-center absolute top-0 left-0 transition-transform duration-700"
              style={{ transform: isHovered ? "scale(1.08)" : "scale(1)" }}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x);

                if (swipe < -swipeConfidenceThreshold) {
                  paginate(1);
                } else if (swipe > swipeConfidenceThreshold) {
                  paginate(-1);
                }
              }}
            />
          </AnimatePresence>
          
          {/* Image gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-80"></div>
          
          {Array.isArray(tour.images) && tour.images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-orange-600 hover:bg-orange-700 p-2 rounded-full cursor-pointer z-10 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                onClick={prevImage}
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-orange-600 hover:bg-orange-700 p-2 rounded-full cursor-pointer z-10 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                onClick={nextImage}
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </Button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                {tour.images.map((_, index) => (
                  <div
                    key={index}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      currentImageIndex === index ? 'bg-white w-3' : 'bg-white/60'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
        {tour.featured && (
          <Badge className="absolute top-4 right-4 bg-orange-500 hover:bg-orange-600 transition-colors cursor-pointer px-3 py-1.5 flex items-center gap-1 z-10 font-medium">
            <Sparkles className="w-4 h-4" />
            <span>Featured</span>
          </Badge>
        )}
        <Badge className="absolute bottom-4 left-4 bg-white/90 text-gray-800 px-3 py-1.5 flex items-center gap-1 z-10 font-medium">
          <Clock className="w-4 h-4" />
          <span>{tour.duration}</span>
        </Badge>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-orange-500" />
            <span className="text-gray-600 text-sm font-medium">{formatLocation(tour.location)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="text-gray-600 text-sm font-bold">{tour.rating}</span>
            <span className="text-gray-400 text-sm">({Array.isArray(tour.reviews) ? tour.reviews.length : 0})</span>
          </div>
        </div>
        <h3 
          onClick={handleTitleClick}
          className="text-xl font-semibold font-heading mb-3 group-hover:text-orange-500 transition-colors cursor-pointer line-clamp-1"
        >
          {tour.title}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-2 mb-4">
          {tour.description || `Experience the breathtaking beauty of ${formatLocation(tour.location)} with our expertly curated tour package. Perfect for adventure seekers and nature lovers.`}
        </p>
        {tour.maxGroupSize && (
          <div className="flex items-center gap-1.5 text-gray-600 text-sm">
            <Users className="w-4 h-4 text-icons" />
            <span>Max group size: <span className="font-medium">{tour.maxGroupSize} people</span></span>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center p-6 border-t bg-gradient-to-r from-orange-50 to-gray-50">
        <div>
          <span className="text-2xl font-bold text-orange-600">{formatPrice(tour.price)}</span>
          <span className="text-gray-500 font-body text-sm ml-1">/person</span>
        </div>
        <Button 
          onClick={handleBookNow}
          className="bg-orange-500 hover:bg-orange-600 transition-colors cursor-pointer px-6 py-2 font-medium text-white rounded-full shadow-sm hover:shadow-md"
        >
          Book Now
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TourCard;