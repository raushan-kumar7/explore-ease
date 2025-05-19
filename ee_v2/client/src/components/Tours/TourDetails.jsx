import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTour, useAuth } from "@/hooks";
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  Star, 
  ChevronLeft, 
  ChevronRight,
  DollarSign,
  Info,
  CheckCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

const TourDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getTourById, currentTour, loading, error } = useTour();
  const { isAuthenticated } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [bookingDate, setBookingDate] = useState(null);
  const [isBookingSubmitted, setIsBookingSubmitted] = useState(false);

  useEffect(() => {
    // Fetch tour details when component mounts
    if (id) {
      getTourById(id);
    }
  }, [id, getTourById]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <div className="text-xl font-medium">Loading tour details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Alert variant="destructive">
          <AlertDescription>
            Error loading tour: {error.message || "Failed to load tour details"}
          </AlertDescription>
        </Alert>
        <Button 
          className="mt-4"
          onClick={() => navigate("/tours")}
        >
          Back to Tours
        </Button>
      </div>
    );
  }

  if (!currentTour) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-xl font-medium">Tour not found</div>
        <Button 
          className="mt-4"
          onClick={() => navigate("/tours")}
        >
          Back to Tours
        </Button>
      </div>
    );
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleNextImage = () => {
    if (Array.isArray(currentTour.images) && currentTour.images.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === currentTour.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const handlePrevImage = () => {
    if (Array.isArray(currentTour.images) && currentTour.images.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? currentTour.images.length - 1 : prev - 1
      );
    }
  };

  const handleBookNow = () => {
    if (!isAuthenticated) {
      alert("Please sign in first to book this tour.");
      navigate("/auth/signin", { state: { from: `/tours/${id}` } });
      return;
    }

    // Handle booking logic here
    setIsBookingSubmitted(true);
    // In a real application, you would submit the booking to your backend
  };

  // Format location
  const formatLocation = (location) => {
    if (typeof location === 'string') return location;

    if (typeof location === 'object' && location !== null) {
      const { city, state, country } = location;
      return [city, state, country].filter(Boolean).join(', ');
    }

    return 'Unknown Location';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button */}
      <Button 
        variant="ghost" 
        className="mb-6 flex items-center gap-2 hover:bg-gray-100"
        onClick={() => navigate("/tours")}
      >
        <ChevronLeft className="w-5 h-5" />
        <span>Back to Tours</span>
      </Button>

      {/* Tour Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Tour Gallery */}
          <div className="relative mb-8 rounded-xl overflow-hidden border border-gray-200 shadow-md">
            <div className="aspect-w-16 aspect-h-9 h-96 relative">
              <AnimatePresence initial={false}>
                <motion.img
                  key={currentImageIndex}
                  src={Array.isArray(currentTour.images) ? currentTour.images[currentImageIndex] : currentTour.image}
                  alt={currentTour.title}
                  className="w-full h-full object-cover object-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                />
              </AnimatePresence>
              
              {Array.isArray(currentTour.images) && currentTour.images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 p-2 rounded-full cursor-pointer z-10"
                    onClick={handlePrevImage}
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-800" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 p-2 rounded-full cursor-pointer z-10"
                    onClick={handleNextImage}
                  >
                    <ChevronRight className="w-5 h-5 text-gray-800" />
                  </Button>
                  
                  {/* Image indicators */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                    {currentTour.images.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          currentImageIndex === index ? 'bg-white w-4' : 'bg-white/60'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* Tour Title and Rating */}
          <div className="mb-6">
            <div className="flex flex-wrap justify-between items-start gap-4">
              <h1 className="text-3xl font-bold">{currentTour.title}</h1>
              <div className="flex items-center gap-1.5 bg-orange-50 px-3 py-1.5 rounded-lg">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <span className="text-gray-800 font-bold">{currentTour.rating}</span>
                <span className="text-gray-500">({Array.isArray(currentTour.reviews) ? currentTour.reviews.length : 0} reviews)</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 mt-2 text-gray-600">
              <MapPin className="w-4 h-4 text-orange-500" />
              <span>{formatLocation(currentTour.location)}</span>
            </div>
          </div>
          
          {/* Tour Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="bg-orange-50 border-none">
              <CardContent className="p-4 flex flex-col items-center">
                <Clock className="w-6 h-6 text-orange-500 mb-2" />
                <div className="text-center">
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="font-medium">{currentTour.duration}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-orange-50 border-none">
              <CardContent className="p-4 flex flex-col items-center">
                <Users className="w-6 h-6 text-orange-500 mb-2" />
                <div className="text-center">
                  <p className="text-sm text-gray-600">Group Size</p>
                  <p className="font-medium">Max {currentTour.maxGroupSize} people</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-orange-50 border-none">
              <CardContent className="p-4 flex flex-col items-center">
                <DollarSign className="w-6 h-6 text-orange-500 mb-2" />
                <div className="text-center">
                  <p className="text-sm text-gray-600">Price</p>
                  <p className="font-medium">{formatPrice(currentTour.price)}/person</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Tour Description */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-orange-500" />
              About This Tour
            </h2>
            <p className="text-gray-700 whitespace-pre-line">
              {currentTour.description || `Experience the breathtaking beauty of ${formatLocation(currentTour.location)} with our expertly curated tour package. Perfect for adventure seekers and nature lovers.`}
            </p>
          </div>
          
          {/* Tour Itinerary - would be implemented if you have itinerary data */}
          {/* Tour Reviews - would be implemented if you have reviews data */}
        </div>
        
        {/* Booking Card */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24 overflow-hidden border-gray-200 shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Book This Tour</h3>
              
              <div className="mb-6">
                <p className="text-gray-600 mb-1">Price per person</p>
                <p className="text-3xl font-bold text-orange-600">{formatPrice(currentTour.price)}</p>
              </div>
              
              <Separator className="my-4" />
              
              {isBookingSubmitted ? (
                <div className="text-center p-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                  <h4 className="text-lg font-medium mb-2">Booking Request Submitted!</h4>
                  <p className="text-gray-600 mb-4">We'll contact you shortly with confirmation details.</p>
                  <Button 
                    className="w-full bg-orange-500 hover:bg-orange-600"
                    onClick={() => navigate("/user-dashboard")}
                  >
                    View My Bookings
                  </Button>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
                      <input 
                        type="date" 
                        className="w-full border border-gray-300 rounded-md p-2"
                        onChange={(e) => setBookingDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Number of Travelers</label>
                      <select className="w-full border border-gray-300 rounded-md p-2">
                        {[...Array(currentTour.maxGroupSize)].map((_, i) => (
                          <option key={i} value={i + 1}>{i + 1} {i === 0 ? 'person' : 'people'}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-orange-500 hover:bg-orange-600 transition-colors"
                    onClick={handleBookNow}
                    disabled={!bookingDate}
                  >
                    Book Now
                  </Button>
                  
                  {!isAuthenticated && (
                    <p className="text-sm text-gray-500 mt-2 text-center">
                      You'll need to sign in before booking
                    </p>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TourDetails;