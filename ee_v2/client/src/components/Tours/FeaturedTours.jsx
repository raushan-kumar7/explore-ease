import { useEffect, useRef } from "react";
import { Star } from "lucide-react";
import TourCard from "./TourCard";
import { Subtitle } from "..";
import { useTour } from "@/hooks";

const FeaturedTours = () => {
  const { featuredTours, loading, getFeaturedTours } = useTour();
  const requestSent = useRef(false);

  useEffect(() => {
    // Only fetch if we haven't already requested the data
    if (!requestSent.current) {
      getFeaturedTours();
      requestSent.current = true;
    }
    
    // Cleanup function to prevent memory leaks
    return () => {
      // Reset flag on unmount (optional, depending on your use case)
      // requestSent.current = false;
    };
  }, [getFeaturedTours]); // Include getFeaturedTours in the dependency array

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
            <Subtitle Subtitle={"Featured Tours"} />
            <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Explore Our Featured Tours
          </h2>
          <p className="text-gray-600">
            Discover our hand-picked premium tour packages for unforgettable
            adventures
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 ml-20 mr-20">
          {loading ? (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-600">Loading featured tours...</p>
            </div>
          ) : featuredTours && featuredTours.length > 0 ? (
            featuredTours.map((tour) => <TourCard key={tour._id} tour={tour} />)
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-600">No featured tours available at the moment</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedTours;