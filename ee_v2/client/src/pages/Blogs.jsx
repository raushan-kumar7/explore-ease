import React, { useEffect, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Search } from "lucide-react";
import { CardLoader } from "@/components/ui/loaders";
import { useBlog } from "@/hooks";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { BlogCard } from "@/components";

const Blogs = () => {
  const { blogs, loading, getAllBlogs } = useBlog();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    // Fetch blogs with pagination parameter
    getAllBlogs({ page: currentPage });
  }, [currentPage]);

  const blogList = Array.isArray(blogs?.blogs) ? blogs.blogs : [];
  
  // Filter blogs based on search query
  const filteredBlogs = blogList.filter(blog => 
    blog.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    blog.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (blog.tags && blog.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  // Filter blogs based on active tab
  const displayedBlogs = activeTab === "all" 
    ? filteredBlogs 
    : filteredBlogs.filter(blog => blog.tags && blog.tags.includes(activeTab));

  // Extract unique tags for tabs
  const allTags = [...new Set(blogList.flatMap(blog => blog.tags || []))];

  // Handle pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // Generate pagination links
  const renderPaginationLinks = () => {
    if (!blogs?.pagination) return null;
    
    const { currentPage, totalPages } = blogs.pagination;
    const pages = [];
    
    // Logic to show limited page numbers with ellipsis for many pages
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    
    return pages.map((page, index) => {
      if (page === '...') {
        return (
          <PaginationItem key={`ellipsis-${index}`}>
            <span className="px-4 py-2">...</span>
          </PaginationItem>
        );
      }
      return (
        <PaginationItem key={`page-${page}`}>
          <PaginationLink
            href="#"
            isActive={page === currentPage}
            className={page === currentPage ? "bg-orange-500" : "hover:text-orange-500 hover:border-orange-200"}
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(page);
            }}
          >
            {page}
          </PaginationLink>
        </PaginationItem>
      );
    });
  };

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <div className="mb-16 text-center">
        <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-xs font-medium mb-4 inline-block">
          EXPLORER'S LOG
        </span>
        <h1 className="text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
          Travel Insights & Stories
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          Discover travel tips, destination guides, and stories from explorers
          around the world.
        </p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search blogs..." 
            className="pl-10 border-orange-100 focus:border-orange-200 focus:ring-orange-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-orange-50">
            <TabsTrigger value="all">All Posts</TabsTrigger>
            {allTags.slice(0, 3).map(tag => (
              <TabsTrigger key={tag} value={tag}>{tag}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {loading ? (
          <CardLoader count={6} />
        ) : displayedBlogs.length > 0 ? (
          displayedBlogs.map((blog, index) => (
            <BlogCard key={blog._id} blog={blog} index={index} />
          ))
        ) : (
          <div className="text-center col-span-full py-12">
            <div className="mb-4 text-muted-foreground/50">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-xl font-medium mb-2">No blogs found</h3>
            <p className="text-muted-foreground">
              {searchQuery 
                ? `No results for "${searchQuery}". Try a different search term.` 
                : "No blogs available in this category yet."}
            </p>
          </div>
        )}
      </div>

      {blogs?.pagination?.totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  href="#" 
                  className="hover:text-orange-500 hover:border-orange-200"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) {
                      handlePageChange(currentPage - 1);
                    }
                  }}
                  aria-disabled={currentPage === 1}
                />
              </PaginationItem>
              
              {renderPaginationLinks()}
              
              <PaginationItem>
                <PaginationNext 
                  href="#" 
                  className="hover:text-orange-500 hover:border-orange-200"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < blogs.pagination.totalPages) {
                      handlePageChange(currentPage + 1);
                    }
                  }}
                  aria-disabled={currentPage === blogs.pagination.totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </section>
  );
};

export default Blogs;