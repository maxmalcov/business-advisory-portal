
import { Route } from "react-router-dom";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import NotFound from "@/pages/NotFound";
import Profile from "@/pages/Profile";
import { ProtectedRoute } from "./ProtectedRoute";

export const PublicRoutes = (
  <>
    <Route index element={<Home />} />
    <Route path="login" element={<Login />} />
    <Route path="register" element={<Register />} />
    <Route path="profile" element={
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    } />
    <Route path="*" element={<NotFound />} />
  </>
);
