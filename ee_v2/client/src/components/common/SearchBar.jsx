import { useState } from 'react';
import { Search, MapPin, Users } from 'lucide-react';
// import { useDispatch } from 'react-redux';
// import { searchTour } from '@/stores/slice/TourSlice';

const SearchBar = () => {
  const [location, setLocation] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [maxGroupSize, setMaxGroupSize] = useState('');
  // const dispatch = useDispatch(); // Fixed typo: dispath → dispatch

  const handleSearch = (e) => {
    e.preventDefault();
    
    // Fixed parameter passing: should be an object
    // dispatch(searchTour({
    //   destination: searchQuery, // Added proper property name
    //   location, 
    //   groupSize: maxGroupSize // Added proper property name
    // }));

    // console.log('Searching:', {
    //   searchQuery,
    //   location,
    //   maxGroupSize
    // });
   
    // // Reset form
    // setSearchQuery('');
    // setLocation('');
    // setMaxGroupSize('');
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-8 py-8">
      <form
        onSubmit={handleSearch}
        className="bg-white p-4 rounded-lg shadow-lg flex flex-col md:flex-row gap-4 items-center"
      >
        {/* Search Input */}
        <div className="flex items-center gap-2 flex-1 w-full border-b md:border-b-0 md:border-r border-yellow-400 pb-4 md:pb-0 md:pr-4">
          <Search className="w-5 h-5 text-icons" />
          <input
            type="text"
            placeholder="Search destinations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full outline-none text-gray-700 placeholder-gray-400"
          />
        </div>

        {/* Location Input */}
        <div className="flex items-center gap-2 flex-1 w-full border-b md:border-b-0 md:border-r border-yellow-400 pb-4 md:pb-0 md:pr-4">
          <MapPin className="w-5 h-5 text-icons" />
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full outline-none text-gray-700 placeholder-gray-400"
          />
        </div>

        {/* Max Group Size Input */}
        <div className="flex items-center gap-2 flex-1 w-full border-b md:border-b-0 md:border-r border-yellow-400 pb-4 md:pb-0 md:pr-4">
          <Users className="w-5 h-5 text-icons" />
          <input
            type="number"
            min="1"
            placeholder="Max group size"
            value={maxGroupSize}
            onChange={(e) => setMaxGroupSize(e.target.value)}
            className="w-full outline-none text-gray-700 placeholder-gray-400"
          />
        </div>

        {/* Search Button */}
        <button
          type="submit"
          className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-2 rounded-lg transition-colors duration-300 w-full md:w-auto cursor-pointer"
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
