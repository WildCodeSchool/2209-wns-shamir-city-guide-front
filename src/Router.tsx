import {
  BrowserRouter,
  Routes,
  Route,
  Outlet
} from "react-router-dom";

// components
import Nav from "./components/nav/Nav";

// pages/common
import Home from "./pages/common/home/Home";
import Login from "./pages/common/login/Login";

// pages/errors
import NotFound from "./pages/errors/notFound/NotFound";

// pages/private
import Dashboard from "./pages/private/dashboard/Dashboard";
import AllTags from "./pages/private/superAdmin/tag/AllTags";
import AllTypes from "./pages/private/superAdmin/type/AllTypes";
import AllCircuits from "./pages/private/cityAdmin/circuit/AllCircuits";
import AllCategories from "./pages/private/superAdmin/category/AllCategories";
import AllCities from "./pages/private/superAdmin/city/AllCities";

// utils
import ProtectedRoutes from "./utils/ProtectedRoutes";
import { UserRoles } from "./utils/constants";

const AdminNavLayout = () => (
  <div>
    <Nav /> 
    <Outlet /> 
  </div>
)


const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Common routes */}
        {/* requires not to be connected */}
        {/* If user is connected we don't want he can access to this routes so we redirect him on the admin dashboard page */}
        <Route element={<ProtectedRoutes requiredRoles={[]} />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />  
        </Route>
        
        <Route element={<AdminNavLayout />} >
          {/* Super admin routes */}
          <Route element={<ProtectedRoutes requiredRoles={[UserRoles.SUPER_ADMIN, UserRoles.CITY_ADMIN]} />}>
            <Route path="/private/dashboard" element={<Dashboard />} />
            <Route path="/private/tags" element={<AllTags />} />
            <Route path="/private/types" element={<AllTypes />} />
            <Route path="/private/categories" element={<AllCategories />} />
            <Route path="/private/cities" element={<AllCities />} />

          </Route>

          {/* City admin routes */}
          <Route element={<ProtectedRoutes requiredRoles={[UserRoles.CITY_ADMIN]} />}>
            <Route path="/private/circuits" element={<AllCircuits />} />
          </Route>
        </Route>

        <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default Router;