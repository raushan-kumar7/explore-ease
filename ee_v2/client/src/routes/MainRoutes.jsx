import { BlogDetails, TourDetails } from "@/components";
import { AdminLayout, MainLayout, UserLayout } from "@/layouts";
import { About, Blogs, Contact, Home, NotFound, Signin, Signup, Tours } from "@/pages";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

const MainRoutes = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* General Routes */}
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="auth">
          <Route path="signup" element={<Signup/>} />
          <Route path="signin" element={<Signin/>} />
        </Route>
        <Route path="/about" element={<About/>} />
        <Route path="/contact" element={<Contact/>} />
        <Route path="/tours" element={<Tours/>} />
        <Route path="/tours/:slugOrId" element={<TourDetails/>}/>
        <Route path="/blogs" element={<Blogs/>} />
        <Route path="/blogs/:slug" element={<BlogDetails/>}/>
      </Route>

      {/* User Routes */}
      <Route path="user-dashboard" element={<UserLayout />}>
        <Route index element={<div>User Dashboard</div>} />
      </Route>

      {/* Admin Routes */}
      <Route path="admin-dashboard" element={<AdminLayout />}>
        <Route index element={<div>Admin Dashboard</div>} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </>
  )
);

export default MainRoutes;