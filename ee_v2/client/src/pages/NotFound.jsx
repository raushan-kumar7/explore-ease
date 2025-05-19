import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Ghost, Home, ArrowLeft, RefreshCw } from 'lucide-react';
import { images } from '@/assets';

const NotFound = () => {
  const [gifIndex, setGifIndex] = useState(0);
  
  // Array of 404 themed GIFs - using placeholder image API since we can't use external images
  const gifs = [
    images.error_404,
    "/api/placeholder/400/300",
    "/api/placeholder/400/300"
  ];
  
  // Cycle through different GIFs when button is clicked
  const cycleGif = () => {
    setGifIndex((prevIndex) => (prevIndex + 1) % gifs.length);
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900">
      <Card className="w-full max-w-md border-slate-200 dark:border-slate-700 shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Ghost className="h-16 w-16 text-slate-400" />
          </div>
          <CardTitle className="text-3xl font-bold">4️⃣0️⃣4️⃣</CardTitle>
          <CardDescription className="text-xl mt-2">Oops! Page Not Found 🔍</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="relative overflow-hidden rounded-lg">
            <img 
              src={gifs[gifIndex]} 
              alt="404 error animation" 
              className="w-full h-48 object-cover"
            />
            <Button 
              variant="outline" 
              size="icon" 
              className="absolute bottom-2 right-2 bg-white dark:bg-slate-800 opacity-80 hover:opacity-100"
              onClick={cycleGif}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            The page you're looking for has gone on vacation 🏝️ or never existed in the first place! 👻
          </p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 justify-center">
          <Button className="w-full sm:w-auto" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back 👈
          </Button>
          <Button className="w-full sm:w-auto" variant="outline" onClick={() => window.location.href = '/'}>
            <Home className="mr-2 h-4 w-4" />
            Return Home 🏠
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default NotFound;