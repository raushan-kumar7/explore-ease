// import { Card, CardContent } from "@/components/ui/card";
// import { Subtitle } from "..";
// import { images } from "@/assets";

// const Gallery = () => {
//   const galleryImages = [
//     {
//       src: images.heroImg2,
//       alt: "Gallery image 1",
//       width: "600",
//       height: "400",
//     },
//     {
//       src: images.heroImg2,
//       alt: "Gallery image 2",
//       width: "600",
//       height: "800",
//     },
//     {
//       src: images.heroImg2,
//       alt: "Gallery image 3",
//       width: "600",
//       height: "500",
//     },
//     {
//       src: images.heroImg2,
//       alt: "Gallery image 4",
//       width: "600",
//       height: "600",
//     },
//     {
//       src: images.heroImg2,
//       alt: "Gallery image 5",
//       width: "600",
//       height: "700",
//     },
//     {
//       src: images.heroImg2,
//       alt: "Gallery image 6",
//       width: "600",
//       height: "450",
//     },
//   ];

//   return (
//     <section className="px-6 py-16 bg-gray-50">
//       <div className="max-w-7xl mx-auto">
//         <div className="mb-12">
//           <div className="flex items-center gap-3 mb-4">
//             <Subtitle Subtitle={"Our Gallery"} />
//           </div>
//           <div className="w-20 h-1 bg-orange-500" />
//           <p className="mt-4 text-gray-600 max-w-2xl">
//             Explore our collection of memorable moments and beautiful
//             destinations captured through our lens.
//           </p>
//         </div>

//         <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
//           {galleryImages.map((image, index) => (
//             <Card
//               key={index}
//               className="break-inside-avoid hover:shadow-xl transition-shadow duration-300 group cursor-pointer overflow-hidden"
//             >
//               <CardContent className="p-0 relative">
//                 <img
//                   src={image.src}
//                   alt={image.alt}
//                   className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
//                 />
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Gallery;


import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Subtitle } from "..";
import { images } from "@/assets";
import { 
  Dialog, 
  DialogContent, 
  DialogClose 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Search, RotateCw, X } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const galleryImages = [
    {
      src: images.heroImg2,
      alt: "Gallery image 1",
      width: "600",
      height: "400",
    },
    {
      src: images.heroImg2,
      alt: "Gallery image 2",
      width: "600",
      height: "800",
    },
    {
      src: images.heroImg2,
      alt: "Gallery image 3",
      width: "600",
      height: "500",
    },
    {
      src: images.heroImg2,
      alt: "Gallery image 4",
      width: "600",
      height: "600",
    },
    {
      src: images.heroImg2,
      alt: "Gallery image 5",
      width: "600",
      height: "700",
    },
    {
      src: images.heroImg2,
      alt: "Gallery image 6",
      width: "600",
      height: "450",
    },
  ];

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  return (
    <section className="px-6 py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center md:text-left">
          <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
            <Subtitle Subtitle={"Our Gallery"} />
          </div>
          <div className="w-20 h-1 bg-orange-500 mx-auto md:mx-0" />
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto md:mx-0">
            Explore our collection of memorable moments and beautiful
            destinations captured through our lens.
          </p>
        </div>
        
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {galleryImages.map((image, index) => (
            <Card
              key={index}
              className="break-inside-avoid hover:shadow-xl transition-all duration-300 group cursor-pointer overflow-hidden rounded-lg border-0 shadow-md"
              onClick={() => setSelectedImage(image)}
            >
              <CardContent className="p-0 relative">
                <div className="overflow-hidden">
                  <AspectRatio 
                    ratio={parseInt(image.width) / parseInt(image.height)}
                    className="bg-gray-100"
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onLoad={handleImageLoad}
                    />
                    {isLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                        <RotateCw className="w-8 h-8 text-gray-400 animate-spin" />
                      </div>
                    )}
                  </AspectRatio>
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          size="icon" 
                          variant="secondary" 
                          className="rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
                        >
                          <Search className="w-5 h-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>View Full Image</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-transparent border-0 shadow-2xl">
          <div className="relative bg-black">
            <img
              src={selectedImage?.src}
              alt={selectedImage?.alt}
              className="w-full h-auto object-contain max-h-screen"
            />
            <DialogClose className="absolute top-2 right-2">
              <Button 
                size="icon" 
                variant="secondary" 
                className="rounded-full bg-black/50 hover:bg-black/70"
              >
                <X className="w-5 h-5 text-white" />
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Gallery;