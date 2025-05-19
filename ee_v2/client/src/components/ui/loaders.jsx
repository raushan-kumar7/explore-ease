import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

/**
 * Full page loader with Explore Ease branding
 */
export const PageLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] w-full">
      <div className="relative">
        <Loader2 className="h-12 w-12 text-orange-500 animate-spin mb-4" />
        <div className="absolute inset-0 bg-white/30 blur-sm rounded-full" />
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mt-4">Loading your adventure...</h3>
      <p className="text-gray-500 text-center max-w-sm mt-2">
        Explore the World, Unwind with Ease
      </p>
    </div>
  );
};

/**
 * Content loader for smaller sections
 */
export const ContentLoader = ({ message = "Loading content..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-8 w-full">
      <Loader2 className="h-8 w-8 text-orange-500 animate-spin mb-3" />
      <p className="text-gray-600 text-sm mt-2">{message}</p>
    </div>
  );
};

/**
 * Card loader for tour cards and other card-based content
 */
export const CardLoader = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array(count)
        .fill(0)
        .map((_, index) => (
          <div
            key={index}
            className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow animate-pulse"
          >
            {/* Image placeholder */}
            <div className="h-48 bg-gray-200" />
            
            {/* Content placeholders */}
            <div className="p-6 space-y-4">
              <div className="flex justify-between">
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-4 bg-gray-200 rounded w-1/4" />
              </div>
              <div className="h-6 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
              
              {/* Footer placeholder */}
              <div className="flex justify-between items-center pt-4">
                <div className="h-6 bg-gray-200 rounded w-1/3" />
                <div className="h-10 bg-gray-200 rounded-full w-1/3" />
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

/**
 * Inline loader for buttons and small UI elements
 */
export const InlineLoader = ({ size = "sm", className = "" }) => {
  const sizeClasses = {
    xs: "h-3 w-3",
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6"
  };
  
  return (
    <Loader2 className={`animate-spin ${sizeClasses[size]} ${className}`} />
  );
};

/**
 * Skeleton loader for text
 */
export const TextSkeleton = ({ lines = 3, className = "" }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array(lines).fill(0).map((_, i) => (
        <div 
          key={i} 
          className={`h-4 bg-gray-200 rounded animate-pulse ${i === lines-1 ? 'w-4/6' : 'w-full'}`} 
        />
      ))}
    </div>
  );
};

/**
 * Generic error component for displaying errors with retry capability
 */
export const ErrorDisplay = ({ 
  error, 
  onRetry, 
  title = "Something went wrong", 
  showRetry = true 
}) => {
  return (
    <Alert variant="destructive" className="my-4 border-red-200 bg-red-50">
      <AlertCircle className="h-5 w-5" />
      <AlertTitle className="text-red-800">{title}</AlertTitle>
      <AlertDescription className="text-red-700">
        {error?.message || "An error occurred while loading the content."}
      </AlertDescription>
      {showRetry && onRetry && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRetry} 
          className="mt-3 border-red-300 hover:bg-red-100 text-red-700 flex items-center gap-1.5"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Try Again
        </Button>
      )}
    </Alert>
  );
};

/**
 * Empty state component for when no results are found
 */
export const EmptyState = ({ 
  title = "No results found", 
  description = "Try adjusting your search or filters to find what you're looking for.",
  icon,
  action
}) => {
  const Icon = icon || AlertCircle;
  
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-4">
      <div className="bg-orange-100 p-3 rounded-full mb-4">
        <Icon className="h-6 w-6 text-orange-500" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
      <p className="text-gray-500 max-w-md mb-6">{description}</p>
      {action}
    </div>
  );
};

// Export a small loader that can be used inline with text
export const LoadingDots = () => {
  return (
    <span className="inline-flex">
      <span className="animate-ping rounded-full h-1.5 w-1.5 bg-orange-600 mx-0.5"></span>
      <span className="animate-ping rounded-full h-1.5 w-1.5 bg-orange-600 mx-0.5" style={{ animationDelay: "0.2s" }}></span>
      <span className="animate-ping rounded-full h-1.5 w-1.5 bg-orange-600 mx-0.5" style={{ animationDelay: "0.4s" }}></span>
    </span>
  );
};