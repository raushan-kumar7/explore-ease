// import React, { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { motion } from "framer-motion";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import { images } from "@/assets";
// import { SearchBar } from "@/components";
// import TourCard from "@/components/Tours/TourCard";
// import { useTour } from "@/hooks";

// const Tours = () => {
//   const [pageCount, setPageCount] = useState(1);
//   const [page, setPage] = useState(1);
//   const { tours, loading, error, getAllTours } = useTour();

//   useEffect(() => {
//     getAllTours({ page, limit: 9 });
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [page]);

//   // Update pageCount when tours data changes
//   useEffect(() => {
//     if (tours && tours.pagination) {
//       setPageCount(tours.pagination.totalPages || 1);
//     }
//   }, [tours]);

//   const handlePageChange = (newPage) => {
//     if (newPage >= 1 && newPage <= pageCount) {
//       setPage(newPage);
//     }
//   };

//   // Get tour items from the nested structure
//   const tourItems = tours && tours.tours ? tours.tours : [];

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       className="min-h-screen bg-gray-50"
//     >
//       {/* Hero Section with Image */}
//       <div className="relative h-[400px] w-full">
//         <div className="absolute inset-0 bg-black/40 z-10" />
//         <img
//           src={images.travel1}
//           alt="Tours header"
//           className="w-full h-full object-cover"
//         />
//         <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white">
//           <motion.h1
//             initial={{ y: 20, opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//             className="text-5xl font-bold font-heading mb-4"
//           >
//             Discover Amazing Tours
//           </motion.h1>
//           <motion.p
//             initial={{ y: 20, opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//             transition={{ delay: 0.2 }}
//             className="text-xl text-gray-200 font-body"
//           >
//             Explore the world with our curated travel experiences
//           </motion.p>
//         </div>
//       </div>

//       {/* Search Section */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-30">
//         <motion.div
//           initial={{ y: 20, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ delay: 0.4 }}
//           className="bg-white rounded-xl shadow-lg p-6"
//         >
//           <SearchBar />
//         </motion.div>
//       </div>

//       {/* Tours Grid */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         <motion.h2
//           initial={{ y: 20, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ delay: 0.6 }}
//           className="text-3xl font-bold font-heading text-gray-900 mb-8"
//         >
//           Popular Tours
//         </motion.h2>

//         {loading ? (
//           <div className="flex justify-center items-center h-64">
//             <p>Loading tours...</p>
//           </div>
//         ) : error ? (
//           <div className="flex justify-center items-center h-64">
//             <p className="text-red-500">Error loading tours: {error.message}</p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
//             {tourItems && tourItems.length > 0 ? (
//               tourItems.map((tour) => <TourCard key={tour._id} tour={tour} />)
//             ) : (
//               <div className="col-span-3 text-center py-10">
//                 <p>No tours found.</p>
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Pagination */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
//         <motion.div
//           initial={{ y: 20, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ delay: 1 }}
//           className="flex justify-center items-center space-x-2"
//         >
//           <Button
//             variant="outline"
//             className="flex items-center space-x-2 cursor-pointer"
//             onClick={() => handlePageChange(page - 1)}
//             disabled={page === 1 || loading}
//           >
//             <ChevronLeft className="w-4 h-4" />
//             <span>Previous</span>
//           </Button>

//           {[...Array(pageCount || 1)].map((_, index) => (
//             <Button
//               key={index + 1}
//               variant="outline"
//               className={
//                 page === index + 1 ? "bg-orange-50 text-orange-600" : ""
//               }
//               onClick={() => handlePageChange(index + 1)}
//               disabled={loading}
//             >
//               {index + 1}
//             </Button>
//           ))}

//           <Button
//             variant="outline"
//             className="flex items-center space-x-2 cursor-pointer"
//             onClick={() => handlePageChange(page + 1)}
//             disabled={page === pageCount || loading}
//           >
//             <span>Next</span>
//             <ChevronRight className="w-4 h-4" />
//           </Button>
//         </motion.div>
//       </div>
//     </motion.div>
//   );
// };

// export default Tours;

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { images } from "@/assets";
import { SearchBar } from "@/components";
import TourCard from "@/components/Tours/TourCard";
import { useTour } from "@/hooks";
import { 
  ContentLoader, 
  CardLoader, 
  ErrorDisplay, 
  EmptyState 
} from "@/components/ui/loaders";

const Tours = () => {
  const [pageCount, setPageCount] = useState(1);
  const [page, setPage] = useState(1);
  const { tours, loading, error, getAllTours } = useTour();

  useEffect(() => {
    getAllTours({ page, limit: 9 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // Update pageCount when tours data changes
  useEffect(() => {
    if (tours && tours.pagination) {
      setPageCount(tours.pagination.totalPages || 1);
    }
  }, [tours]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pageCount) {
      setPage(newPage);
    }
  };

  // Get tour items from the nested structure
  const tourItems = tours && tours.tours ? tours.tours : [];

  const handleRetry = () => {
    getAllTours({ page, limit: 9 });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50"
    >
      {/* Hero Section with Image */}
      <div className="relative h-[400px] w-full">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <img
          src={images.travel1}
          alt="Tours header"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl font-bold font-heading mb-4"
          >
            Discover Amazing Tours
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-200 font-body"
          >
            Explore the world with our curated travel experiences
          </motion.p>
        </div>
      </div>

      {/* Search Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-30">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <SearchBar />
        </motion.div>
      </div>

      {/* Tours Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-3xl font-bold font-heading text-gray-900 mb-8"
        >
          Popular Tours
        </motion.h2>

        {loading ? (
          <>
            <ContentLoader message="Finding the best tours for you..." />
            <CardLoader count={6} />
          </>
        ) : error ? (
          <ErrorDisplay 
            error={error} 
            onRetry={handleRetry} 
            title="Failed to load tours" 
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {tourItems && tourItems.length > 0 ? (
              tourItems.map((tour) => <TourCard key={tour._id} tour={tour} />)
            ) : (
              <EmptyState 
                title="No tours available" 
                description="We couldn't find any tours matching your criteria. Try adjusting your search or check back later."
                action={
                  <Button 
                    variant="outline" 
                    onClick={handleRetry}
                    className="mt-2 border-orange-300 hover:bg-orange-50 text-orange-600"
                  >
                    Refresh Tours
                  </Button>
                }
              />
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex justify-center items-center space-x-2"
        >
          <Button
            variant="outline"
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1 || loading}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{loading ? "Loading" : "Previous"}</span>
          </Button>

          {[...Array(pageCount || 1)].map((_, index) => (
            <Button
              key={index + 1}
              variant="outline"
              className={
                page === index + 1 ? "bg-orange-50 text-orange-600" : ""
              }
              onClick={() => handlePageChange(index + 1)}
              disabled={loading}
            >
              {index + 1}
            </Button>
          ))}

          <Button
            variant="outline"
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => handlePageChange(page + 1)}
            disabled={page === pageCount || loading}
          >
            <span>{loading ? "Loading" : "Next"}</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Tours;