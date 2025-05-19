// // import React, { useEffect, useState } from "react";
// // import { useParams, useNavigate } from "react-router-dom";
// // import { useBlog } from "@/hooks";
// // import {
// //   CalendarIcon,
// //   Clock,
// //   Heart,
// //   Share2,
// //   ArrowLeft,
// //   Bookmark,
// //   MessageSquare,
// //   User,
// //   Twitter,
// //   Facebook,
// //   Linkedin,
// // } from "lucide-react";
// // import { Button } from "@/components/ui/button";
// // import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// // import { Badge } from "@/components/ui/badge";
// // import { Skeleton } from "@/components/ui/skeleton";
// // import { formatDate, estimateReadTime } from "@/utils/format";
// // import { toast } from "sonner";

// // const BlogDetails = () => {
// //   const { slug } = useParams();
// //   const navigate = useNavigate();
// //   const { getBlogByIdOrSlug, currentBlog, loading } = useBlog();
// //   const [liked, setLiked] = useState(false);
// //   const [bookmarked, setBookmarked] = useState(false);

// //   useEffect(() => {
// //     if (slug) {
// //       getBlogByIdOrSlug(slug);
// //     }
// //     // Reset scroll position when component mounts
// //     window.scrollTo(0, 0);
// //   }, [slug]);

// //   const handleLike = () => {
// //     setLiked(!liked);
// //     toast.success(`${!liked ? "Blog added to your likes" : "Blog removed from your likes"}`);
// //   };

// //   const handleBookmark = () => {
// //     setBookmarked(!bookmarked);
// //     toast.success(`${!bookmarked ? "Blog saved to your bookmarks" : "Blog removed from your bookmarks"}`);
// //   };

// //   const handleShare = (platform) => {
// //     const url = window.location.href;
// //     const text = `Check out this amazing blog: ${currentBlog?.title}`;
    
// //     let shareUrl;
// //     switch (platform) {
// //       case 'twitter':
// //         shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
// //         break;
// //       case 'facebook':
// //         shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
// //         break;
// //       case 'linkedin':
// //         shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
// //         break;
// //       default:
// //         // Copy to clipboard
// //         navigator.clipboard.writeText(url);
// //         toast.success("Link copied to clipboard!");
// //         return;
// //     }
    
// //     window.open(shareUrl, '_blank', 'noopener,noreferrer');
// //   };

// //   if (loading) {
// //     return <BlogDetailsSkeleton />;
// //   }

// //   if (!currentBlog) {
// //     return (
// //       <div className="max-w-4xl mx-auto py-16 px-4">
// //         <div className="text-center py-16">
// //           <h2 className="text-2xl font-bold mb-4">Blog not found</h2>
// //           <p className="text-muted-foreground mb-8">The blog you're looking for doesn't exist or has been removed.</p>
// //           <Button 
// //             onClick={() => navigate('/blogs')}
// //             className="bg-orange-500 hover:bg-orange-600"
// //           >
// //             <ArrowLeft className="mr-2 h-4 w-4" />
// //             Back to Blogs
// //           </Button>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <article className="max-w-5xl mx-auto py-10 px-4">
// //       {/* Back button */}
// //       <Button 
// //         variant="ghost" 
// //         size="sm" 
// //         className="mb-8 hover:bg-orange-50"
// //         onClick={() => navigate('/blogs')}
// //       >
// //         <ArrowLeft className="mr-2 h-4 w-4" />
// //         Back to blogs
// //       </Button>

// //       {/* Blog header */}
// //       <div className="mb-8">
// //         <div className="flex flex-wrap gap-2 mb-4">
// //           {currentBlog.tags && currentBlog.tags.map(tag => (
// //             <Badge 
// //               key={tag} 
// //               className="bg-orange-100 text-orange-600 hover:bg-orange-200 border-none"
// //             >
// //               {tag}
// //             </Badge>
// //           ))}
// //         </div>
        
// //         <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
// //           {currentBlog.title}
// //         </h1>
        
// //         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
// //           <div className="flex items-center gap-3">
// //             <Avatar className="h-10 w-10 ring-2 ring-orange-500/20">
// //               <AvatarImage src={currentBlog.author.avatar} />
// //               <AvatarFallback>
// //                 {`${currentBlog.author.firstName.charAt(0)}${currentBlog.author.lastName.charAt(0)}`}
// //               </AvatarFallback>
// //             </Avatar>
// //             <div>
// //               <div className="font-medium">{`${currentBlog.author.firstName} ${currentBlog.author.lastName}`}</div>
// //               <div className="text-sm text-muted-foreground flex items-center gap-2">
// //                 <CalendarIcon className="h-3.5 w-3.5" />
// //                 <span>{formatDate(currentBlog.createdAt)}</span>
// //                 <span className="mx-1">•</span>
// //                 <Clock className="h-3.5 w-3.5" />
// //                 <span>{estimateReadTime(currentBlog.description)} min read</span>
// //               </div>
// //             </div>
// //           </div>
          
// //           <div className="flex items-center gap-2">
// //             <Button 
// //               variant="outline" 
// //               size="sm" 
// //               className={`${liked ? 'text-red-500 border-red-200' : ''} hover:bg-red-50`}
// //               onClick={handleLike}
// //             >
// //               <Heart className={`h-4 w-4 mr-1.5 ${liked ? 'fill-current' : ''}`} />
// //               {liked ? 'Liked' : 'Like'}
// //             </Button>
// //             <Button 
// //               variant="outline" 
// //               size="sm" 
// //               className={`${bookmarked ? 'text-orange-500 border-orange-200' : ''} hover:bg-orange-50`}
// //               onClick={handleBookmark}
// //             >
// //               <Bookmark className={`h-4 w-4 mr-1.5 ${bookmarked ? 'fill-current' : ''}`} />
// //               {bookmarked ? 'Saved' : 'Save'}
// //             </Button>
// //             <Button 
// //               variant="outline" 
// //               size="icon" 
// //               className="hover:bg-blue-50"
// //               onClick={() => handleShare('default')}
// //             >
// //               <Share2 className="h-4 w-4" />
// //             </Button>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Feature image */}
// //       <div className="relative aspect-[21/9] w-full overflow-hidden rounded-xl mb-8">
// //         <img
// //           src={currentBlog.image}
// //           alt={currentBlog.title}
// //           className="object-cover w-full h-full"
// //         />
// //       </div>

// //       {/* Blog content */}
// //       <div className="prose prose-lg max-w-none mb-12">
// //         <p className="text-xl text-muted-foreground leading-relaxed mb-8">
// //           {currentBlog.description}
// //         </p>
        
// //         {/* Here is where you would render the full blog content */}
// //         {/* This is a placeholder for the blog content - replace with actual content */}
// //         <h2>Introduction</h2>
// //         <p>
// //           {currentBlog.description} Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
// //           Phasellus ac magna vel augue sagittis feugiat vitae in mi. Morbi a vestibulum nisi, 
// //           at tincidunt libero. Cras finibus, nulla non convallis placerat, mi risus 
// //           accumsan orci, vel fringilla nisl felis et turpis.
// //         </p>
        
// //         <h2>The Journey Begins</h2>
// //         <p>
// //           Aliquam erat volutpat. Donec congue arcu eu odio facilisis efficitur. 
// //           Morbi fringilla accumsan tincidunt. Nulla eget felis malesuada, rhoncus 
// //           erat et, aliquet urna. Praesent dui enim, bibendum et ex sed, dignissim 
// //           facilisis sapien. Nullam in odio nisl.
// //         </p>
        
// //         <blockquote>
// //           The mountains are calling and I must go. What wild adventure awaits around the bend?
// //         </blockquote>
        
// //         <p>
// //           Sed vehicula, mauris non eleifend laoreet, lectus dui dignissim ipsum, 
// //           ac finibus lectus urna quis massa. Vivamus eu ex sit amet dolor ullamcorper 
// //           fermentum ac in purus. Cras nec sem mauris.
// //         </p>
        
// //         <h2>Exploring the Wilderness</h2>
// //         <p>
// //           Curabitur vitae tellus nisl. Ut venenatis risus libero, eu feugiat dolor mollis eu. 
// //           Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; 
// //           Sed vel tristique ligula. Maecenas eget tellus vel nisl porta faucibus sed at libero.
// //         </p>
// //       </div>

// //       {/* Author info */}
// //       <div className="border-t border-b py-8 mb-12">
// //         <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
// //           <Avatar className="h-20 w-20 ring-2 ring-orange-500/20">
// //             <AvatarImage src={currentBlog.author.avatar} />
// //             <AvatarFallback className="text-xl">
// //               {`${currentBlog.author.firstName.charAt(0)}${currentBlog.author.lastName.charAt(0)}`}
// //             </AvatarFallback>
// //           </Avatar>
// //           <div>
// //             <h3 className="text-xl font-semibold mb-2">{`${currentBlog.author.firstName} ${currentBlog.author.lastName}`}</h3>
// //             <p className="text-muted-foreground mb-4">
// //               Travel enthusiast and adventure seeker with a passion for exploring off-the-beaten-path 
// //               destinations. Sharing stories and tips from around the globe.
// //             </p>
// //             <div className="flex gap-2">
// //               <Button variant="outline" size="sm" className="hover:bg-orange-50">
// //                 <User className="h-4 w-4 mr-1.5" />
// //                 View Profile
// //               </Button>
// //               <Button variant="outline" size="sm" className="hover:bg-orange-50">
// //                 <MessageSquare className="h-4 w-4 mr-1.5" />
// //                 Message
// //               </Button>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Share section */}
// //       <div className="mb-16">
// //         <h3 className="text-lg font-medium mb-4">Share this article</h3>
// //         <div className="flex gap-3">
// //           <Button 
// //             variant="outline" 
// //             className="hover:bg-blue-50 hover:text-blue-500" 
// //             size="icon"
// //             onClick={() => handleShare('twitter')}
// //           >
// //             <Twitter className="h-4 w-4" />
// //           </Button>
// //           <Button 
// //             variant="outline" 
// //             className="hover:bg-blue-700 hover:text-blue-700" 
// //             size="icon"
// //             onClick={() => handleShare('facebook')}
// //           >
// //             <Facebook className="h-4 w-4" />
// //           </Button>
// //           <Button 
// //             variant="outline" 
// //             className="hover:bg-blue-600 hover:text-blue-600" 
// //             size="icon"
// //             onClick={() => handleShare('linkedin')}
// //           >
// //             <Linkedin className="h-4 w-4" />
// //           </Button>
// //           <Button 
// //             variant="outline" 
// //             className="hover:bg-orange-50 hover:text-orange-500"
// //             onClick={() => handleShare('default')}
// //           >
// //             <Share2 className="h-4 w-4 mr-1.5" />
// //             Copy Link
// //           </Button>
// //         </div>
// //       </div>

// //       {/* Related posts - would be added here */}
// //     </article>
// //   );
// // };

// // // Skeleton loader for blog details
// // const BlogDetailsSkeleton = () => {
// //   return (
// //     <div className="max-w-5xl mx-auto py-10 px-4">
// //       <Button variant="ghost" size="sm" className="mb-8">
// //         <ArrowLeft className="mr-2 h-4 w-4" />
// //         Back to blogs
// //       </Button>

// //       <div className="mb-8">
// //         <div className="flex gap-2 mb-4">
// //           <Skeleton className="h-6 w-20 rounded-full" />
// //           <Skeleton className="h-6 w-24 rounded-full" />
// //         </div>
        
// //         <Skeleton className="h-12 w-full mb-4" />
// //         <Skeleton className="h-12 w-3/4 mb-6" />
        
// //         <div className="flex justify-between items-center gap-4 mb-6">
// //           <div className="flex items-center gap-3">
// //             <Skeleton className="h-10 w-10 rounded-full" />
// //             <div>
// //               <Skeleton className="h-5 w-32 mb-1" />
// //               <Skeleton className="h-4 w-48" />
// //             </div>
// //           </div>
          
// //           <div className="flex items-center gap-2">
// //             <Skeleton className="h-8 w-20" />
// //             <Skeleton className="h-8 w-20" />
// //             <Skeleton className="h-8 w-8" />
// //           </div>
// //         </div>
// //       </div>

// //       <Skeleton className="aspect-[21/9] w-full rounded-xl mb-8" />

// //       <div className="space-y-4 mb-12">
// //         <Skeleton className="h-8 w-1/3 mb-2" />
// //         <Skeleton className="h-4 w-full" />
// //         <Skeleton className="h-4 w-full" />
// //         <Skeleton className="h-4 w-full" />
// //         <Skeleton className="h-4 w-2/3" />
        
// //         <div className="py-4">
// //           <Skeleton className="h-8 w-1/3 mb-2" />
// //           <Skeleton className="h-4 w-full" />
// //           <Skeleton className="h-4 w-full" />
// //           <Skeleton className="h-4 w-full" />
// //           <Skeleton className="h-4 w-3/4" />
// //         </div>
// //       </div>

// //       <div className="border-t border-b py-8 mb-12">
// //         <div className="flex gap-6 items-start">
// //           <Skeleton className="h-20 w-20 rounded-full" />
// //           <div className="flex-1">
// //             <Skeleton className="h-6 w-48 mb-2" />
// //             <Skeleton className="h-4 w-full mb-1" />
// //             <Skeleton className="h-4 w-full mb-1" />
// //             <Skeleton className="h-4 w-2/3 mb-4" />
// //             <div className="flex gap-2">
// //               <Skeleton className="h-8 w-28" />
// //               <Skeleton className="h-8 w-28" />
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       <div className="mb-16">
// //         <Skeleton className="h-6 w-40 mb-4" />
// //         <div className="flex gap-3">
// //           <Skeleton className="h-9 w-9" />
// //           <Skeleton className="h-9 w-9" />
// //           <Skeleton className="h-9 w-9" />
// //           <Skeleton className="h-9 w-28" />
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default BlogDetails;


// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useBlog } from "@/hooks";
// import {
//   CalendarIcon,
//   Clock,
//   Heart,
//   Share2,
//   ArrowLeft,
//   Bookmark,
//   MessageSquare,
//   User,
//   Twitter,
//   Facebook,
//   Linkedin,
//   Send,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
// import { Skeleton } from "@/components/ui/skeleton";
// import { formatDate, estimateReadTime } from "@/utils/format";
// import { toast } from "sonner";
// import { Textarea } from "@/components/ui/textarea";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";

// const BlogDetails = () => {
//   const { slug } = useParams();
//   const navigate = useNavigate();
//   const { getBlogByIdOrSlug, currentBlog, loading, recentBlogs } = useBlog();
//   const [liked, setLiked] = useState(false);
//   const [bookmarked, setBookmarked] = useState(false);
//   const [commentText, setCommentText] = useState("");
//   const [comments, setComments] = useState([
//     {
//       id: 1,
//       user: {
//         name: "Sarah Johnson",
//         avatar: "/api/placeholder/30/30",
//       },
//       text: "What a fantastic article! I've been wanting to visit this destination for years.",
//       date: "2025-05-15T14:23:00Z",
//       likes: 5,
//     },
//     {
//       id: 2,
//       user: {
//         name: "Michael Chen",
//         avatar: "/api/placeholder/30/30",
//       },
//       text: "Thanks for sharing these tips. The photos are absolutely breathtaking!",
//       date: "2025-05-16T09:45:00Z",
//       likes: 3,
//     },
//   ]);

//   useEffect(() => {
//     if (slug) {
//       getBlogByIdOrSlug(slug);
//     }
//     // Reset scroll position when component mounts
//     window.scrollTo(0, 0);
//   }, [slug]);

//   const handleLike = () => {
//     setLiked(!liked);
//     toast.success(`${!liked ? "Blog added to your likes" : "Blog removed from your likes"}`);
//   };

//   const handleBookmark = () => {
//     setBookmarked(!bookmarked);
//     toast.success(`${!bookmarked ? "Blog saved to your bookmarks" : "Blog removed from your bookmarks"}`);
//   };

//   const handleShare = (platform) => {
//     const url = window.location.href;
//     const text = `Check out this amazing blog: ${currentBlog?.title}`;
    
//     let shareUrl;
//     switch (platform) {
//       case 'twitter':
//         shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
//         break;
//       case 'facebook':
//         shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
//         break;
//       case 'linkedin':
//         shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
//         break;
//       default:
//         // Copy to clipboard
//         navigator.clipboard.writeText(url);
//         toast.success("Link copied to clipboard!");
//         return;
//     }
    
//     window.open(shareUrl, '_blank', 'noopener,noreferrer');
//   };

//   const handleCommentSubmit = (e) => {
//     e.preventDefault();
//     if (commentText.trim() === "") return;
    
//     // Add new comment
//     const newComment = {
//       id: comments.length + 1,
//       user: {
//         name: "Current User",
//         avatar: "/api/placeholder/30/30",
//       },
//       text: commentText,
//       date: new Date().toISOString(),
//       likes: 0,
//     };
    
//     setComments([...comments, newComment]);
//     setCommentText("");
//     toast.success("Comment posted successfully!");
//   };

//   const handleCommentLike = (id) => {
//     const updatedComments = comments.map(comment => 
//       comment.id === id ? {...comment, likes: comment.likes + 1} : comment
//     );
//     setComments(updatedComments);
//   };

//   if (loading) {
//     return <BlogDetailsSkeleton />;
//   }

//   if (!currentBlog) {
//     return (
//       <div className="max-w-4xl mx-auto py-16 px-4">
//         <div className="text-center py-16">
//           <h2 className="text-2xl font-bold mb-4">Blog not found</h2>
//           <p className="text-muted-foreground mb-8">The blog you're looking for doesn't exist or has been removed.</p>
//           <Button 
//             onClick={() => navigate('/blogs')}
//             className="bg-orange-500 hover:bg-orange-600"
//           >
//             <ArrowLeft className="mr-2 h-4 w-4" />
//             Back to Blogs
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   // Mock recent blogs data
//   const mockRecentBlogs = recentBlogs || [
//     {
//       id: 1,
//       title: "10 Hidden Gems in Southeast Asia",
//       slug: "10-hidden-gems-southeast-asia",
//       image: "/api/placeholder/400/200",
//       createdAt: "2025-05-10T12:00:00Z",
//     },
//     {
//       id: 2,
//       title: "Ultimate Guide to Backpacking in Europe",
//       slug: "ultimate-guide-backpacking-europe",
//       image: "/api/placeholder/400/200",
//       createdAt: "2025-05-05T12:00:00Z",
//     },
//     {
//       id: 3,
//       title: "Best Street Food Around the World",
//       slug: "best-street-food-around-world",
//       image: "/api/placeholder/400/200",
//       createdAt: "2025-04-28T12:00:00Z",
//     }
//   ];

//   return (
//     <div className="max-w-7xl mx-auto py-10 px-4">
//       <div className="flex flex-col lg:flex-row gap-8">
//         {/* Main content column */}
//         <article className="flex-1">
//           {/* Back button */}
//           <Button 
//             variant="ghost" 
//             size="sm" 
//             className="mb-8 hover:bg-orange-50"
//             onClick={() => navigate('/blogs')}
//           >
//             <ArrowLeft className="mr-2 h-4 w-4" />
//             Back to blogs
//           </Button>

//           {/* Blog header */}
//           <div className="mb-8">
//             <div className="flex flex-wrap gap-2 mb-4">
//               {currentBlog.tags && currentBlog.tags.map(tag => (
//                 <Badge 
//                   key={tag} 
//                   className="bg-orange-100 text-orange-600 hover:bg-orange-200 border-none"
//                 >
//                   {tag}
//                 </Badge>
//               ))}
//             </div>
            
//             <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
//               {currentBlog.title}
//             </h1>
            
//             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
//               <div className="flex items-center gap-3">
//                 <Avatar className="h-10 w-10 ring-2 ring-orange-500/20">
//                   <AvatarImage src={currentBlog.author.avatar} />
//                   <AvatarFallback>
//                     {`${currentBlog.author.firstName.charAt(0)}${currentBlog.author.lastName.charAt(0)}`}
//                   </AvatarFallback>
//                 </Avatar>
//                 <div>
//                   <div className="font-medium">{`${currentBlog.author.firstName} ${currentBlog.author.lastName}`}</div>
//                   <div className="text-sm text-muted-foreground flex items-center gap-2">
//                     <CalendarIcon className="h-3.5 w-3.5" />
//                     <span>{formatDate(currentBlog.createdAt)}</span>
//                     <span className="mx-1">•</span>
//                     <Clock className="h-3.5 w-3.5" />
//                     <span>{estimateReadTime(currentBlog.description)} min read</span>
//                   </div>
//                 </div>
//               </div>
              
//               <div className="flex items-center gap-2">
//                 <Button 
//                   variant="outline" 
//                   size="sm" 
//                   className={`${liked ? 'text-red-500 border-red-200' : ''} hover:bg-red-50`}
//                   onClick={handleLike}
//                 >
//                   <Heart className={`h-4 w-4 mr-1.5 ${liked ? 'fill-current' : ''}`} />
//                   {liked ? 'Liked' : 'Like'}
//                 </Button>
//                 <Button 
//                   variant="outline" 
//                   size="sm" 
//                   className={`${bookmarked ? 'text-orange-500 border-orange-200' : ''} hover:bg-orange-50`}
//                   onClick={handleBookmark}
//                 >
//                   <Bookmark className={`h-4 w-4 mr-1.5 ${bookmarked ? 'fill-current' : ''}`} />
//                   {bookmarked ? 'Saved' : 'Save'}
//                 </Button>
//                 <Button 
//                   variant="outline" 
//                   size="icon" 
//                   className="hover:bg-blue-50"
//                   onClick={() => handleShare('default')}
//                 >
//                   <Share2 className="h-4 w-4" />
//                 </Button>
//               </div>
//             </div>
//           </div>

//           {/* Feature image */}
//           <div className="relative aspect-[21/9] w-full overflow-hidden rounded-xl mb-8">
//             <img
//               src={currentBlog.image}
//               alt={currentBlog.title}
//               className="object-cover w-full h-full"
//             />
//           </div>

//           {/* Blog content */}
//           <div className="prose prose-lg max-w-none mb-12">
//             <p className="text-xl text-muted-foreground leading-relaxed mb-8">
//               {currentBlog.description}
//             </p>
            
//             {/* Here is where you would render the full blog content */}
//             {/* This is a placeholder for the blog content - replace with actual content */}
//             <h2>Introduction</h2>
//             <p>
//               {currentBlog.description} Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
//               Phasellus ac magna vel augue sagittis feugiat vitae in mi. Morbi a vestibulum nisi, 
//               at tincidunt libero. Cras finibus, nulla non convallis placerat, mi risus 
//               accumsan orci, vel fringilla nisl felis et turpis.
//             </p>
            
//             <h2>The Journey Begins</h2>
//             <p>
//               Aliquam erat volutpat. Donec congue arcu eu odio facilisis efficitur. 
//               Morbi fringilla accumsan tincidunt. Nulla eget felis malesuada, rhoncus 
//               erat et, aliquet urna. Praesent dui enim, bibendum et ex sed, dignissim 
//               facilisis sapien. Nullam in odio nisl.
//             </p>
            
//             <blockquote>
//               The mountains are calling and I must go. What wild adventure awaits around the bend?
//             </blockquote>
            
//             <p>
//               Sed vehicula, mauris non eleifend laoreet, lectus dui dignissim ipsum, 
//               ac finibus lectus urna quis massa. Vivamus eu ex sit amet dolor ullamcorper 
//               fermentum ac in purus. Cras nec sem mauris.
//             </p>
            
//             <h2>Exploring the Wilderness</h2>
//             <p>
//               Curabitur vitae tellus nisl. Ut venenatis risus libero, eu feugiat dolor mollis eu. 
//               Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; 
//               Sed vel tristique ligula. Maecenas eget tellus vel nisl porta faucibus sed at libero.
//             </p>
//           </div>

//           {/* Author info */}
//           <div className="border-t border-b py-8 mb-12">
//             <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
//               <Avatar className="h-20 w-20 ring-2 ring-orange-500/20">
//                 <AvatarImage src={currentBlog.author.avatar} />
//                 <AvatarFallback className="text-xl">
//                   {`${currentBlog.author.firstName.charAt(0)}${currentBlog.author.lastName.charAt(0)}`}
//                 </AvatarFallback>
//               </Avatar>
//               <div>
//                 <h3 className="text-xl font-semibold mb-2">{`${currentBlog.author.firstName} ${currentBlog.author.lastName}`}</h3>
//                 <p className="text-muted-foreground mb-4">
//                   Travel enthusiast and adventure seeker with a passion for exploring off-the-beaten-path 
//                   destinations. Sharing stories and tips from around the globe.
//                 </p>
//                 <div className="flex gap-2">
//                   <Button variant="outline" size="sm" className="hover:bg-orange-50">
//                     <User className="h-4 w-4 mr-1.5" />
//                     View Profile
//                   </Button>
//                   <Button variant="outline" size="sm" className="hover:bg-orange-50">
//                     <MessageSquare className="h-4 w-4 mr-1.5" />
//                     Message
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Share section */}
//           <div className="mb-12">
//             <h3 className="text-lg font-medium mb-4">Share this article</h3>
//             <div className="flex gap-3">
//               <Button 
//                 variant="outline" 
//                 className="hover:bg-blue-50 hover:text-blue-500" 
//                 size="icon"
//                 onClick={() => handleShare('twitter')}
//               >
//                 <Twitter className="h-4 w-4" />
//               </Button>
//               <Button 
//                 variant="outline" 
//                 className="hover:bg-blue-700 hover:text-blue-700" 
//                 size="icon"
//                 onClick={() => handleShare('facebook')}
//               >
//                 <Facebook className="h-4 w-4" />
//               </Button>
//               <Button 
//                 variant="outline" 
//                 className="hover:bg-blue-600 hover:text-blue-600" 
//                 size="icon"
//                 onClick={() => handleShare('linkedin')}
//               >
//                 <Linkedin className="h-4 w-4" />
//               </Button>
//               <Button 
//                 variant="outline" 
//                 className="hover:bg-orange-50 hover:text-orange-500"
//                 onClick={() => handleShare('default')}
//               >
//                 <Share2 className="h-4 w-4 mr-1.5" />
//                 Copy Link
//               </Button>
//             </div>
//           </div>

//           {/* Comments Section */}
//           <div className="mb-16">
//             <h3 className="text-xl font-medium mb-6">Comments ({comments.length})</h3>
            
//             {/* Add comment form */}
//             <div className="mb-8">
//               <form onSubmit={handleCommentSubmit}>
//                 <div className="flex items-start gap-3 mb-4">
//                   <Avatar className="h-10 w-10">
//                     <AvatarImage src="/api/placeholder/40/40" />
//                     <AvatarFallback>CU</AvatarFallback>
//                   </Avatar>
//                   <div className="flex-1">
//                     <Textarea 
//                       placeholder="Share your thoughts..." 
//                       className="resize-none mb-2"
//                       value={commentText}
//                       onChange={(e) => setCommentText(e.target.value)}
//                       rows={3}
//                     />
//                     <Button 
//                       type="submit" 
//                       className="bg-orange-500 hover:bg-orange-600"
//                     >
//                       <Send className="h-4 w-4 mr-1.5" />
//                       Post Comment
//                     </Button>
//                   </div>
//                 </div>
//               </form>
//             </div>
            
//             {/* Comments list */}
//             {comments.length > 0 ? (
//               <div className="space-y-6">
//                 {comments.map((comment) => (
//                   <div key={comment.id} className="flex gap-3">
//                     <Avatar className="h-10 w-10">
//                       <AvatarImage src={comment.user.avatar} />
//                       <AvatarFallback>
//                         {comment.user.name.charAt(0)}
//                       </AvatarFallback>
//                     </Avatar>
//                     <div className="flex-1">
//                       <div className="bg-slate-50 p-4 rounded-lg mb-2">
//                         <div className="flex justify-between items-center mb-2">
//                           <h4 className="font-medium">{comment.user.name}</h4>
//                           <span className="text-xs text-muted-foreground">
//                             {formatDate(comment.date)}
//                           </span>
//                         </div>
//                         <p className="text-gray-700">{comment.text}</p>
//                       </div>
//                       <div className="flex items-center gap-4 text-sm text-muted-foreground pl-1">
//                         <button 
//                           onClick={() => handleCommentLike(comment.id)}
//                           className="flex items-center hover:text-red-500"
//                         >
//                           <Heart className="h-3.5 w-3.5 mr-1" />
//                           <span>{comment.likes > 0 ? comment.likes : "Like"}</span>
//                         </button>
//                         <button className="hover:text-gray-900">Reply</button>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <p className="text-muted-foreground text-center py-6">
//                 No comments yet. Be the first to share your thoughts!
//               </p>
//             )}
//           </div>
//         </article>

//         {/* Right sidebar with recent blogs */}
//         <aside className="w-full lg:w-80 shrink-0">
//           <div className="sticky top-8">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Recent Posts</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 {mockRecentBlogs.map(blog => (
//                   <div key={blog.id} className="group">
//                     <div 
//                       className="cursor-pointer"
//                       onClick={() => navigate(`/blogs/${blog.slug}`)}
//                     >
//                       <div className="relative aspect-[16/9] overflow-hidden rounded-md mb-2">
//                         <img 
//                           src={blog.image} 
//                           alt={blog.title}
//                           className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
//                         />
//                       </div>
//                       <h3 className="text-base font-medium group-hover:text-orange-500 transition-colors">
//                         {blog.title}
//                       </h3>
//                       <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
//                         <CalendarIcon className="h-3 w-3" />
//                         <span>{formatDate(blog.createdAt)}</span>
//                       </div>
//                     </div>
//                     <Separator className="mt-4" />
//                   </div>
//                 ))}
//               </CardContent>
//             </Card>
            
//             {/* Popular tags widget - could be added here */}
//             <Card className="mt-6">
//               <CardHeader>
//                 <CardTitle>Subscribe</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-sm text-muted-foreground mb-4">
//                   Get notified about new travel stories and tips
//                 </p>
//                 <div className="space-y-2">
//                   <input
//                     type="email"
//                     placeholder="Your email"
//                     className="w-full rounded-md border border-input px-3 py-2 text-sm"
//                   />
//                   <Button className="w-full bg-orange-500 hover:bg-orange-600">
//                     Subscribe
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </aside>
//       </div>
//     </div>
//   );
// };

// // Skeleton loader for blog details
// const BlogDetailsSkeleton = () => {
//   return (
//     <div className="max-w-7xl mx-auto py-10 px-4">
//       <div className="flex flex-col lg:flex-row gap-8">
//         <div className="flex-1">
//           <Button variant="ghost" size="sm" className="mb-8">
//             <ArrowLeft className="mr-2 h-4 w-4" />
//             Back to blogs
//           </Button>

//           <div className="mb-8">
//             <div className="flex gap-2 mb-4">
//               <Skeleton className="h-6 w-20 rounded-full" />
//               <Skeleton className="h-6 w-24 rounded-full" />
//             </div>
            
//             <Skeleton className="h-12 w-full mb-4" />
//             <Skeleton className="h-12 w-3/4 mb-6" />
            
//             <div className="flex justify-between items-center gap-4 mb-6">
//               <div className="flex items-center gap-3">
//                 <Skeleton className="h-10 w-10 rounded-full" />
//                 <div>
//                   <Skeleton className="h-5 w-32 mb-1" />
//                   <Skeleton className="h-4 w-48" />
//                 </div>
//               </div>
              
//               <div className="flex items-center gap-2">
//                 <Skeleton className="h-8 w-20" />
//                 <Skeleton className="h-8 w-20" />
//                 <Skeleton className="h-8 w-8" />
//               </div>
//             </div>
//           </div>

//           <Skeleton className="aspect-[21/9] w-full rounded-xl mb-8" />

//           <div className="space-y-4 mb-12">
//             <Skeleton className="h-8 w-1/3 mb-2" />
//             <Skeleton className="h-4 w-full" />
//             <Skeleton className="h-4 w-full" />
//             <Skeleton className="h-4 w-full" />
//             <Skeleton className="h-4 w-2/3" />
            
//             <div className="py-4">
//               <Skeleton className="h-8 w-1/3 mb-2" />
//               <Skeleton className="h-4 w-full" />
//               <Skeleton className="h-4 w-full" />
//               <Skeleton className="h-4 w-full" />
//               <Skeleton className="h-4 w-3/4" />
//             </div>
//           </div>

//           <div className="border-t border-b py-8 mb-12">
//             <div className="flex gap-6 items-start">
//               <Skeleton className="h-20 w-20 rounded-full" />
//               <div className="flex-1">
//                 <Skeleton className="h-6 w-48 mb-2" />
//                 <Skeleton className="h-4 w-full mb-1" />
//                 <Skeleton className="h-4 w-full mb-1" />
//                 <Skeleton className="h-4 w-2/3 mb-4" />
//                 <div className="flex gap-2">
//                   <Skeleton className="h-8 w-28" />
//                   <Skeleton className="h-8 w-28" />
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="mb-12">
//             <Skeleton className="h-6 w-40 mb-4" />
//             <div className="flex gap-3">
//               <Skeleton className="h-9 w-9" />
//               <Skeleton className="h-9 w-9" />
//               <Skeleton className="h-9 w-9" />
//               <Skeleton className="h-9 w-28" />
//             </div>
//           </div>
          
//           {/* Comments skeleton */}
//           <div className="mb-16">
//             <Skeleton className="h-8 w-40 mb-6" />
            
//             <div className="mb-8">
//               <div className="flex items-start gap-3">
//                 <Skeleton className="h-10 w-10 rounded-full" />
//                 <div className="flex-1">
//                   <Skeleton className="h-24 w-full mb-2" />
//                   <Skeleton className="h-9 w-32" />
//                 </div>
//               </div>
//             </div>
            
//             <div className="space-y-6">
//               {[1, 2].map(i => (
//                 <div key={i} className="flex gap-3">
//                   <Skeleton className="h-10 w-10 rounded-full" />
//                   <div className="flex-1">
//                     <Skeleton className="h-24 w-full rounded-lg mb-2" />
//                     <div className="flex gap-4 pl-1">
//                       <Skeleton className="h-4 w-12" />
//                       <Skeleton className="h-4 w-12" />
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
        
//         {/* Sidebar skeleton */}
//         <div className="w-full lg:w-80 shrink-0">
//           <div>
//             <Skeleton className="h-64 w-full rounded-lg mb-4" />
//             <Skeleton className="h-48 w-full rounded-lg" />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BlogDetails;


import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useBlog } from "@/hooks";
import {
  Clock,
  Heart,
  Share2,
  ArrowLeft,
  Bookmark,
  MessageSquare,
  User,
  Twitter,
  Facebook,
  Linkedin,
  Send,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate, estimateReadTime } from "@/utils/format";
import { toast } from "react-hot-toast";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const BlogDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { getBlogByIdOrSlug, currentBlog, loading, recentBlogs } = useBlog();
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([
    {
      id: 1,
      user: {
        name: "Sarah Johnson",
        avatar: "/api/placeholder/30/30",
      },
      text: "What a fantastic article! I've been wanting to visit this destination for years.",
      date: "2025-05-15T14:23:00Z",
      likes: 5,
    },
    {
      id: 2,
      user: {
        name: "Michael Chen",
        avatar: "/api/placeholder/30/30",
      },
      text: "Thanks for sharing these tips. The photos are absolutely breathtaking!",
      date: "2025-05-16T09:45:00Z",
      likes: 3,
    },
  ]);

  useEffect(() => {
    if (slug) {
      getBlogByIdOrSlug(slug);
    }
    // Reset scroll position when component mounts
    window.scrollTo(0, 0);
  }, [slug]);

  const handleLike = () => {
    setLiked(!liked);
    toast.success(`${!liked ? "Blog added to your likes" : "Blog removed from your likes"}`);
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    toast.success(`${!bookmarked ? "Blog saved to your bookmarks" : "Blog removed from your bookmarks"}`);
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = `Check out this amazing blog: ${currentBlog?.title}`;
    
    let shareUrl;
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      default:
        // Copy to clipboard
        navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard!");
        return;
    }
    
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCommentSubmit = () => {
    if (commentText.trim() === "") return;
    
    // Add new comment
    const newComment = {
      id: comments.length + 1,
      user: {
        name: "Current User",
        avatar: "/api/placeholder/30/30",
      },
      text: commentText,
      date: new Date().toISOString(),
      likes: 0,
    };
    
    setComments([...comments, newComment]);
    setCommentText("");
    toast.success("Comment posted successfully!");
  };

  const handleCommentLike = (id) => {
    const updatedComments = comments.map(comment => 
      comment.id === id ? {...comment, likes: comment.likes + 1} : comment
    );
    setComments(updatedComments);
  };

  if (loading) {
    return <BlogDetailsSkeleton />;
  }

  if (!currentBlog) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold mb-4">Blog not found</h2>
          <p className="text-muted-foreground mb-8">The blog you're looking for doesn't exist or has been removed.</p>
          <Button 
            onClick={() => navigate('/blogs')}
            className="bg-orange-500 hover:bg-orange-600"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blogs
          </Button>
        </div>
      </div>
    );
  }

  // Mock recent blogs data
  const mockRecentBlogs = recentBlogs || [
    {
      id: 1,
      title: "10 Hidden Gems in Southeast Asia",
      slug: "10-hidden-gems-southeast-asia",
      image: "/api/placeholder/400/200",
      createdAt: "2025-05-10T12:00:00Z",
    },
    {
      id: 2,
      title: "Ultimate Guide to Backpacking in Europe",
      slug: "ultimate-guide-backpacking-europe",
      image: "/api/placeholder/400/200",
      createdAt: "2025-05-05T12:00:00Z",
    },
    {
      id: 3,
      title: "Best Street Food Around the World",
      slug: "best-street-food-around-world",
      image: "/api/placeholder/400/200",
      createdAt: "2025-04-28T12:00:00Z",
    }
  ];

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main content column */}
        <article className="flex-1">
          {/* Back button */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="mb-8 hover:bg-orange-50"
            onClick={() => navigate('/blogs')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to blogs
          </Button>

          {/* Blog header */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              {currentBlog.tags && currentBlog.tags.map(tag => (
                <Badge 
                  key={tag} 
                  className="bg-orange-100 text-orange-600 hover:bg-orange-200 border-none"
                >
                  {tag}
                </Badge>
              ))}
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
              {currentBlog.title}
            </h1>
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 ring-2 ring-orange-500/20">
                  <AvatarImage src={currentBlog.author.avatar} />
                  <AvatarFallback>
                    {`${currentBlog.author.firstName.charAt(0)}${currentBlog.author.lastName.charAt(0)}`}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{`${currentBlog.author.firstName} ${currentBlog.author.lastName}`}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{formatDate(currentBlog.createdAt)}</span>
                    <span className="mx-1">•</span>
                    <Clock className="h-3.5 w-3.5" />
                    <span>{estimateReadTime(currentBlog.description)} min read</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={`${liked ? 'text-red-500 border-red-200' : ''} hover:bg-red-50`}
                  onClick={handleLike}
                >
                  <Heart className={`h-4 w-4 mr-1.5 ${liked ? 'fill-current' : ''}`} />
                  {liked ? 'Liked' : 'Like'}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={`${bookmarked ? 'text-orange-500 border-orange-200' : ''} hover:bg-orange-50`}
                  onClick={handleBookmark}
                >
                  <Bookmark className={`h-4 w-4 mr-1.5 ${bookmarked ? 'fill-current' : ''}`} />
                  {bookmarked ? 'Saved' : 'Save'}
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="hover:bg-blue-50"
                  onClick={() => handleShare('default')}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Feature image */}
          <div className="relative aspect-[21/9] w-full overflow-hidden rounded-xl mb-8">
            <img
              src={currentBlog.image}
              alt={currentBlog.title}
              className="object-cover w-full h-full"
            />
          </div>

          {/* Blog content */}
          <div className="prose prose-lg max-w-none mb-12">
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              {currentBlog.description}
            </p>
            
            {/* Here is where you would render the full blog content */}
            {/* This is a placeholder for the blog content - replace with actual content */}
            <h2>Introduction</h2>
            <p>
              {currentBlog.description} Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
              Phasellus ac magna vel augue sagittis feugiat vitae in mi. Morbi a vestibulum nisi, 
              at tincidunt libero. Cras finibus, nulla non convallis placerat, mi risus 
              accumsan orci, vel fringilla nisl felis et turpis.
            </p>
            
            <h2>The Journey Begins</h2>
            <p>
              Aliquam erat volutpat. Donec congue arcu eu odio facilisis efficitur. 
              Morbi fringilla accumsan tincidunt. Nulla eget felis malesuada, rhoncus 
              erat et, aliquet urna. Praesent dui enim, bibendum et ex sed, dignissim 
              facilisis sapien. Nullam in odio nisl.
            </p>
            
            <blockquote>
              The mountains are calling and I must go. What wild adventure awaits around the bend?
            </blockquote>
            
            <p>
              Sed vehicula, mauris non eleifend laoreet, lectus dui dignissim ipsum, 
              ac finibus lectus urna quis massa. Vivamus eu ex sit amet dolor ullamcorper 
              fermentum ac in purus. Cras nec sem mauris.
            </p>
            
            <h2>Exploring the Wilderness</h2>
            <p>
              Curabitur vitae tellus nisl. Ut venenatis risus libero, eu feugiat dolor mollis eu. 
              Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; 
              Sed vel tristique ligula. Maecenas eget tellus vel nisl porta faucibus sed at libero.
            </p>
          </div>

          {/* Author info */}
          <div className="border-t border-b py-8 mb-12">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              <Avatar className="h-20 w-20 ring-2 ring-orange-500/20">
                <AvatarImage src={currentBlog.author.avatar} />
                <AvatarFallback className="text-xl">
                  {`${currentBlog.author.firstName.charAt(0)}${currentBlog.author.lastName.charAt(0)}`}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold mb-2">{`${currentBlog.author.firstName} ${currentBlog.author.lastName}`}</h3>
                <p className="text-muted-foreground mb-4">
                  Travel enthusiast and adventure seeker with a passion for exploring off-the-beaten-path 
                  destinations. Sharing stories and tips from around the globe.
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="hover:bg-orange-50">
                    <User className="h-4 w-4 mr-1.5" />
                    View Profile
                  </Button>
                  <Button variant="outline" size="sm" className="hover:bg-orange-50">
                    <MessageSquare className="h-4 w-4 mr-1.5" />
                    Message
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Share section */}
          <div className="mb-12">
            <h3 className="text-lg font-medium mb-4">Share this article</h3>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="hover:bg-blue-50 hover:text-blue-500" 
                size="icon"
                onClick={() => handleShare('twitter')}
              >
                <Twitter className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                className="hover:bg-blue-700 hover:text-blue-700" 
                size="icon"
                onClick={() => handleShare('facebook')}
              >
                <Facebook className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                className="hover:bg-blue-600 hover:text-blue-600" 
                size="icon"
                onClick={() => handleShare('linkedin')}
              >
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                className="hover:bg-orange-50 hover:text-orange-500"
                onClick={() => handleShare('default')}
              >
                <Share2 className="h-4 w-4 mr-1.5" />
                Copy Link
              </Button>
            </div>
          </div>

          {/* Comments Section */}
          <div className="mb-16">
            <h3 className="text-xl font-medium mb-6">Comments ({comments.length})</h3>
            
            {/* Add comment form */}
            <div className="mb-8">
              <div className="flex items-start gap-3 mb-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/api/placeholder/40/40" />
                  <AvatarFallback>CU</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea 
                    placeholder="Share your thoughts..." 
                    className="resize-none mb-2"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    rows={3}
                  />
                  <Button 
                    onClick={handleCommentSubmit} 
                    className="bg-orange-500 hover:bg-orange-600"
                  >
                    <Send className="h-4 w-4 mr-1.5" />
                    Post Comment
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Comments list */}
            {comments.length > 0 ? (
              <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={comment.user.avatar} />
                      <AvatarFallback>
                        {comment.user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="bg-slate-50 p-4 rounded-lg mb-2">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">{comment.user.name}</h4>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(comment.date)}
                          </span>
                        </div>
                        <p className="text-gray-700">{comment.text}</p>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground pl-1">
                        <button 
                          onClick={() => handleCommentLike(comment.id)}
                          className="flex items-center hover:text-red-500"
                        >
                          <Heart className="h-3.5 w-3.5 mr-1" />
                          <span>{comment.likes > 0 ? comment.likes : "Like"}</span>
                        </button>
                        <button className="hover:text-gray-900">Reply</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-6">
                No comments yet. Be the first to share your thoughts!
              </p>
            )}
          </div>
        </article>

        {/* Right sidebar with recent blogs */}
        <aside className="w-full lg:w-80 shrink-0">
          <div className="sticky top-8">
            <Card>
              <CardHeader>
                <CardTitle>Recent Posts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockRecentBlogs.map(blog => (
                  <div key={blog.id} className="group">
                    <div 
                      className="cursor-pointer"
                      onClick={() => navigate(`/blogs/${blog.slug}`)}
                    >
                      <div className="relative aspect-[16/9] overflow-hidden rounded-md mb-2">
                        <img 
                          src={blog.image} 
                          alt={blog.title}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <h3 className="text-base font-medium group-hover:text-orange-500 transition-colors">
                        {blog.title}
                      </h3>
                      <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(blog.createdAt)}</span>
                      </div>
                    </div>
                    <Separator className="mt-4" />
                  </div>
                ))}
              </CardContent>
            </Card>
            
            {/* Popular tags widget - could be added here */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Subscribe</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Get notified about new travel stories and tips
                </p>
                <div className="space-y-2">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="w-full rounded-md border border-input px-3 py-2 text-sm"
                  />
                  <Button className="w-full bg-orange-500 hover:bg-orange-600">
                    Subscribe
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </aside>
      </div>
    </div>
  );
};

// Skeleton loader for blog details
const BlogDetailsSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <Button variant="ghost" size="sm" className="mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to blogs
          </Button>

          <div className="mb-8">
            <div className="flex gap-2 mb-4">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
            
            <Skeleton className="h-12 w-full mb-4" />
            <Skeleton className="h-12 w-3/4 mb-6" />
            
            <div className="flex justify-between items-center gap-4 mb-6">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div>
                  <Skeleton className="h-5 w-32 mb-1" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
          </div>

          <Skeleton className="aspect-[21/9] w-full rounded-xl mb-8" />

          <div className="space-y-4 mb-12">
            <Skeleton className="h-8 w-1/3 mb-2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            
            <div className="py-4">
              <Skeleton className="h-8 w-1/3 mb-2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>

          <div className="border-t border-b py-8 mb-12">
            <div className="flex gap-6 items-start">
              <Skeleton className="h-20 w-20 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-2/3 mb-4" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-28" />
                  <Skeleton className="h-8 w-28" />
                </div>
              </div>
            </div>
          </div>

          <div className="mb-12">
            <Skeleton className="h-6 w-40 mb-4" />
            <div className="flex gap-3">
              <Skeleton className="h-9 w-9" />
              <Skeleton className="h-9 w-9" />
              <Skeleton className="h-9 w-9" />
              <Skeleton className="h-9 w-28" />
            </div>
          </div>
          
          {/* Comments skeleton */}
          <div className="mb-16">
            <Skeleton className="h-8 w-40 mb-6" />
            
            <div className="mb-8">
              <div className="flex items-start gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-24 w-full mb-2" />
                  <Skeleton className="h-9 w-32" />
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              {[1, 2].map(i => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-24 w-full rounded-lg mb-2" />
                    <div className="flex gap-4 pl-1">
                      <Skeleton className="h-4 w-12" />
                      <Skeleton className="h-4 w-12" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Sidebar skeleton */}
        <div className="w-full lg:w-80 shrink-0">
          <div>
            <Skeleton className="h-64 w-full rounded-lg mb-4" />
            <Skeleton className="h-48 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;