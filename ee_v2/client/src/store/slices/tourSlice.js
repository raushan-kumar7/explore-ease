import { tourService } from "@/services";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


// Initial state
const initialState = {
  tours: [],
  featuredTours: [],
  currentTour: null,
  loading: false,
  error: null,
  searchResults: [],
};

// Async thunks
export const getAllTours = createAsyncThunk(
  "tour/getAllTours",
  async (params, { rejectWithValue }) => {
    try {
      const response = await tourService.getAllTours(params);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const getFeaturedTours = createAsyncThunk(
  "tour/getFeaturedTours",
  async (_, { rejectWithValue }) => {
    try {
      const response = await tourService.getFeaturedTours();
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const searchTours = createAsyncThunk(
  "tour/searchTours",
  async (searchParams, { rejectWithValue }) => {
    try {
      const response = await tourService.searchTours(searchParams);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const getTourById = createAsyncThunk(
  "tour/getTourById",
  async (tourId, { rejectWithValue }) => {
    try {
      const response = await tourService.getTourById(tourId);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const createTour = createAsyncThunk(
  "tour/createTour",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await tourService.createTour(formData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const updateTour = createAsyncThunk(
  "tour/updateTour",
  async ({ tourId, tourData }, { rejectWithValue }) => {
    try {
      const response = await tourService.updateTour(tourId, tourData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const deleteTour = createAsyncThunk(
  "tour/deleteTour",
  async (tourId, { rejectWithValue }) => {
    try {
      await tourService.deleteTour(tourId);
      return tourId;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const updateTourImages = createAsyncThunk(
  "tour/updateTourImages",
  async ({ tourId, formData }, { rejectWithValue }) => {
    try {
      const response = await tourService.updateTourImages(tourId, formData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Tour slice
const tourSlice = createSlice({
  name: "tour",
  initialState,
  reducers: {
    clearTourError: (state) => {
      state.error = null;
    },
    clearCurrentTour: (state) => {
      state.currentTour = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all tours
      .addCase(getAllTours.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllTours.fulfilled, (state, action) => {
        state.loading = false;
        state.tours = action.payload;
      })
      .addCase(getAllTours.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get featured tours
      .addCase(getFeaturedTours.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFeaturedTours.fulfilled, (state, action) => {
        state.loading = false;
        state.featuredTours = action.payload;
      })
      .addCase(getFeaturedTours.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Search tours
      .addCase(searchTours.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchTours.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchTours.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get tour by ID
      .addCase(getTourById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTourById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTour = action.payload;
      })
      .addCase(getTourById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create tour
      .addCase(createTour.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTour.fulfilled, (state, action) => {
        state.loading = false;
        state.tours.push(action.payload);
      })
      .addCase(createTour.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update tour
      .addCase(updateTour.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTour.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTour = action.payload;
        state.tours = state.tours.map((tour) =>
          tour._id === action.payload._id ? action.payload : tour
        );
      })
      .addCase(updateTour.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete tour
      .addCase(deleteTour.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTour.fulfilled, (state, action) => {
        state.loading = false;
        state.tours = state.tours.filter((tour) => tour._id !== action.payload);
        if (state.currentTour && state.currentTour._id === action.payload) {
          state.currentTour = null;
        }
      })
      .addCase(deleteTour.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update tour images
      .addCase(updateTourImages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTourImages.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTour = action.payload;
        state.tours = state.tours.map((tour) =>
          tour._id === action.payload._id ? action.payload : tour
        );
      })
      .addCase(updateTourImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearTourError, clearCurrentTour } = tourSlice.actions;

export default tourSlice.reducer;