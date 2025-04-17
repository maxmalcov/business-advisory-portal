
import { Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import PublicRoutes from "./PublicRoutes";
import ClientRoutes from "./ClientRoutes";
import AdminRoutes from "./AdminRoutes";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <PublicRoutes />
        <ClientRoutes />
        <AdminRoutes />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
