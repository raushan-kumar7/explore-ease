import { useDispatch, useSelector } from "react-redux";
import {
  getAllTours,
  getFeaturedTours,
  searchTours,
  getTourById,
  createTour,
  updateTour,
  deleteTour,
  updateTourImages,
  clearTourError,
  clearCurrentTour,
} from "@/store/slices/tourSlice";

/**
 * Custom hook for tour operations
 * @returns {Object} Tour functions and state
 */
const useTour = () => {
  const dispatch = useDispatch();
  const { tours, featuredTours, currentTour, loading, error, searchResults } = useSelector(
    (state) => state.tour
  );

  return {
    // State
    tours,
    featuredTours,
    currentTour,
    loading,
    error,
    searchResults,
    
    // Actions
    getAllTours: (params) => dispatch(getAllTours(params)),
    getFeaturedTours: () => dispatch(getFeaturedTours()),
    searchTours: (searchParams) => dispatch(searchTours(searchParams)),
    getTourById: (tourId) => dispatch(getTourById(tourId)),
    createTour: (formData) => dispatch(createTour(formData)),
    updateTour: (tourId, tourData) => dispatch(updateTour({ tourId, tourData })),
    deleteTour: (tourId) => dispatch(deleteTour(tourId)),
    updateTourImages: (tourId, formData) => dispatch(updateTourImages({ tourId, formData })),
    clearTourError: () => dispatch(clearTourError()),
    clearCurrentTour: () => dispatch(clearCurrentTour()),
  };
};

export default useTour;