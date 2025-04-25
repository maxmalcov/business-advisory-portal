
import { Route } from "react-router-dom";
import HR from "@/pages/HR";
import NewEmployee from "@/pages/HR/NewEmployee";
import Termination from "@/pages/HR/Termination";
import WorkHours from "@/pages/HR/WorkHours";
import { ProtectedRoute } from "./ProtectedRoute";

export const HRRoutes = (
  <>
    <Route path="hr" element={
      <ProtectedRoute requiredRole="client">
        <HR />
      </ProtectedRoute>
    } />
    <Route path="hr/new-employee" element={
      <ProtectedRoute requiredRole="client">
        <NewEmployee />
      </ProtectedRoute>
    } />
    <Route path="hr/termination" element={
      <ProtectedRoute requiredRole="client">
        <Termination />
      </ProtectedRoute>
    } />
    <Route path="hr/work-hours" element={
      <ProtectedRoute requiredRole="client">
        <WorkHours />
      </ProtectedRoute>
    } />
  </>
);
