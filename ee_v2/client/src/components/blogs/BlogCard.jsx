// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
// } from "@/components/ui/card";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
// import { CalendarIcon, Clock, BookOpen, Heart, Share2 } from "lucide-react";
// import { formatDate, estimateReadTime } from "@/utils/format";
// import { motion } from "framer-motion";
// import { useNavigate } from "react-router-dom";

// const BlogCard = ({ blog, index }) => {
//   const navigate = useNavigate();

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.4, delay: index * 0.1 }}
//     >
//       <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 rounded-xl border-opacity-50 h-full flex flex-col">
//         <div className="aspect-video w-full relative overflow-hidden group -top-6">
//           <img
//             src={blog.image}
//             alt={blog.title}
//             className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105 rounded-tl-xl rounded-tr-xl"
//           />
//           <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//           <Badge className="absolute top-3 right-3 bg-orange-500 hover:bg-orange-600 shadow-md">
//             {blog.tags?.[0] || "General"}
//           </Badge>
//         </div>
//         <CardHeader className="pb-2">
//           <h3 className="text-xl font-semibold line-clamp-2 group-hover:text-orange-500 transition-colors" onClick={() => {navigate(`/blogs/${blog.slug}`)}}>
//             {blog.title}
//           </h3>
//         </CardHeader>
//         <CardContent className="pb-2 flex-grow">
//           <p className="text-muted-foreground line-clamp-3">
//             {blog.description}
//           </p>
//         </CardContent>
//         <CardFooter className="pt-4 flex justify-between items-center border-t border-border/50">
//           <div className="flex items-center gap-2">
//             <Avatar className="h-8 w-8 ring-2 ring-orange-500/20">
//               <AvatarImage src={`${blog.author.avatar}`} />
//               <AvatarFallback>{`${blog.author.firstName.charAt(
//                 0
//               )}${blog.author.lastName.charAt(0)}`}</AvatarFallback>
//             </Avatar>
//             <div className="text-sm font-medium">{`${blog.author.firstName} ${blog.author.lastName}`}</div>
//           </div>

//           <div className="flex items-center gap-1 text-xs text-muted-foreground">
//             <CalendarIcon className="h-3.5 w-3.5" />
//             <span>{formatDate(blog.createdAt)}</span>
//             <span className="mx-1">•</span>
//             <Clock className="h-3.5 w-3.5" />
//             <span>{estimateReadTime(blog.description)}</span>
//           </div>
//         </CardFooter>
//         <div className="px-4 pb-3 flex justify-between items-center text-muted-foreground text-sm">
//           <Button
//             variant="ghost"
//             size="sm"
//             className="flex items-center gap-1 h-8 px-2 hover:text-orange-500"
//           >
//             <Heart className="h-4 w-4" />
//             <span>Like</span>
//           </Button>
//           <Button
//             variant="ghost"
//             size="sm"
//             className="flex items-center gap-1 h-8 px-2 hover:text-orange-500"
//           >
//             <BookOpen className="h-4 w-4" />
//             <span>Read</span>
//           </Button>
//           <Button
//             variant="ghost"
//             size="sm"
//             className="flex items-center gap-1 h-8 px-2 hover:text-orange-500"
//           >
//             <Share2 className="h-4 w-4" />
//             <span>Share</span>
//           </Button>
//         </div>
//       </Card>
//     </motion.div>
//   );
// };

// export default BlogCard;

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Clock, BookOpen, Heart, Share2 } from "lucide-react";
import { formatDate, estimateReadTime } from "@/utils/format";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const BlogCard = ({ blog, index }) => {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);

  const handleReadClick = () => {
    navigate(`/blogs/${blog.slug}`);
  };

  const handleLikeClick = () => {
    setLiked(!liked);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 rounded-xl border-opacity-50 h-full flex flex-col">
        <div
          className="aspect-video w-full relative overflow-hidden group cursor-pointer -top-6"
          onClick={handleReadClick}
        >
          <img
            src={blog.image}
            alt={blog.title}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105 rounded-t-xl"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          {blog.tags && blog.tags.length > 0 && (
            <div className="absolute top-3 right-3 flex flex-wrap gap-2 justify-end">
              {blog.tags.slice(0, 2).map((tag) => (
                <Badge
                  key={tag}
                  className="bg-orange-500 hover:bg-orange-600 shadow-md text-xs font-medium"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
        <CardHeader className="pb-0">
          <h3
            className="text-xl font-semibold line-clamp-2 hover:text-orange-500 transition-colors cursor-pointer"
            onClick={handleReadClick}
          >
            {blog.title}
          </h3>
        </CardHeader>
        <CardContent className="pb-0 flex-grow">
          <p className="text-muted-foreground line-clamp-3 mb-3">
            {blog.description}
          </p>
        </CardContent>
        <CardFooter className="pt-4 flex justify-between items-center border-t border-border/50">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 ring-2 ring-orange-500/20">
              <AvatarImage src={`${blog.author.avatar}`} />
              <AvatarFallback>{`${blog.author.firstName.charAt(
                0
              )}${blog.author.lastName.charAt(0)}`}</AvatarFallback>
            </Avatar>
            <div className="text-sm font-medium">{`${blog.author.firstName} ${blog.author.lastName}`}</div>
          </div>

          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <CalendarIcon className="h-3.5 w-3.5" />
            <span>{formatDate(blog.createdAt)}</span>
            <span className="mx-1">•</span>
            <Clock className="h-3.5 w-3.5" />
            <span>{estimateReadTime(blog.description)}</span>
          </div>
        </CardFooter>
        <div className="px-4 pb-3 flex justify-between items-center text-muted-foreground text-sm">
          <Button
            variant="ghost"
            size="sm"
            className={`flex items-center gap-1 h-8 px-2 ${
              liked ? "text-red-500" : "hover:text-red-500"
            }`}
            onClick={handleLikeClick}
          >
            <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
            <span>{liked ? "Liked" : "Like"}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 h-8 px-2 hover:text-orange-500"
            onClick={handleReadClick}
          >
            <BookOpen className="h-4 w-4" />
            <span>Read</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 h-8 px-2 hover:text-orange-500"
          >
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default BlogCard;
