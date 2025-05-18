import { AdminLayout, MainLayout, UserLayout } from "@/layouts";
import { About, Home, NotFound, Signin, Signup } from "@/pages";
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
        <Route path="/contact" element={<div>Contact</div>} />
        <Route path="/tours" element={<div>Tours</div>} />
        <Route path="/blogs" element={<div>Blog</div>} />
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