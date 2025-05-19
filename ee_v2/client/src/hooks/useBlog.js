import { useDispatch, useSelector } from "react-redux";
import {
  getAllBlogs,
  searchBlogs,
  getBlogsByTag,
  getBlogByIdOrSlug,
  createBlog,
  updateBlog,
  deleteBlog,
  updateBlogImage,
  clearBlogError,
  clearCurrentBlog,
} from "@/store/slices/blogSlice";

/**
 * Custom hook for blog operations
 * @returns {Object} Blog functions and state
 */
const useBlog = () => {
  const dispatch = useDispatch();
  const { blogs, currentBlog, loading, error, searchResults, tagResults } = useSelector(
    (state) => state.blog
  );

  return {
    // State
    blogs,
    currentBlog,
    loading,
    error,
    searchResults,
    tagResults,
    
    // Actions
    getAllBlogs: (params) => dispatch(getAllBlogs(params)),
    searchBlogs: (searchParams) => dispatch(searchBlogs(searchParams)),
    getBlogsByTag: (tag, params) => dispatch(getBlogsByTag({ tag, params })),
    getBlogByIdOrSlug: (idOrSlug) => dispatch(getBlogByIdOrSlug(idOrSlug)),
    createBlog: (formData) => dispatch(createBlog(formData)),
    updateBlog: (blogId, blogData) => dispatch(updateBlog({ blogId, blogData })),
    deleteBlog: (blogId) => dispatch(deleteBlog(blogId)),
    updateBlogImage: (blogId, formData) => dispatch(updateBlogImage({ blogId, formData })),
    clearBlogError: () => dispatch(clearBlogError()),
    clearCurrentBlog: () => dispatch(clearCurrentBlog()),
  };
};

export default useBlog;