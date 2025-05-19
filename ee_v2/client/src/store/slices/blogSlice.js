import { blogService } from "@/services";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Initial state
const initialState = {
  blogs: [],
  currentBlog: null,
  loading: false,
  error: null,
  searchResults: [],
  tagResults: [],
};

// Async thunks
export const getAllBlogs = createAsyncThunk(
  "blog/getAllBlogs",
  async (params, { rejectWithValue }) => {
    try {
      const response = await blogService.getAllBlogs(params);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const searchBlogs = createAsyncThunk(
  "blog/searchBlogs",
  async (searchParams, { rejectWithValue }) => {
    try {
      const response = await blogService.searchBlogs(searchParams);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const getBlogsByTag = createAsyncThunk(
  "blog/getBlogsByTag",
  async ({ tag, params }, { rejectWithValue }) => {
    try {
      const response = await blogService.getBlogsByTag(tag, params);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const getBlogByIdOrSlug = createAsyncThunk(
  "blog/getBlogByIdOrSlug",
  async (idOrSlug, { rejectWithValue }) => {
    try {
      const response = await blogService.getBlogByIdOrSlug(idOrSlug);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const createBlog = createAsyncThunk(
  "blog/createBlog",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await blogService.createBlog(formData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const updateBlog = createAsyncThunk(
  "blog/updateBlog",
  async ({ blogId, blogData }, { rejectWithValue }) => {
    try {
      const response = await blogService.updateBlog(blogId, blogData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const deleteBlog = createAsyncThunk(
  "blog/deleteBlog",
  async (blogId, { rejectWithValue }) => {
    try {
      await blogService.deleteBlog(blogId);
      return blogId;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const updateBlogImage = createAsyncThunk(
  "blog/updateBlogImage",
  async ({ blogId, formData }, { rejectWithValue }) => {
    try {
      const response = await blogService.updateBlogImage(blogId, formData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Blog slice
const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    clearBlogError: (state) => {
      state.error = null;
    },
    clearCurrentBlog: (state) => {
      state.currentBlog = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all blogs
      .addCase(getAllBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = action.payload;
      })
      .addCase(getAllBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Search blogs
      .addCase(searchBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get blogs by tag
      .addCase(getBlogsByTag.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBlogsByTag.fulfilled, (state, action) => {
        state.loading = false;
        state.tagResults = action.payload;
      })
      .addCase(getBlogsByTag.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get blog by ID or slug
      .addCase(getBlogByIdOrSlug.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBlogByIdOrSlug.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBlog = action.payload;
      })
      .addCase(getBlogByIdOrSlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create blog
      .addCase(createBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs.push(action.payload);
      })
      .addCase(createBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update blog
      .addCase(updateBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBlog = action.payload;
        state.blogs = state.blogs.map((blog) =>
          blog._id === action.payload._id ? action.payload : blog
        );
      })
      .addCase(updateBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete blog
      .addCase(deleteBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = state.blogs.filter((blog) => blog._id !== action.payload);
        if (state.currentBlog && state.currentBlog._id === action.payload) {
          state.currentBlog = null;
        }
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update blog image
      .addCase(updateBlogImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBlogImage.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBlog = action.payload;
        state.blogs = state.blogs.map((blog) =>
          blog._id === action.payload._id ? action.payload : blog
        );
      })
      .addCase(updateBlogImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearBlogError, clearCurrentBlog } = blogSlice.actions;

export default blogSlice.reducer;