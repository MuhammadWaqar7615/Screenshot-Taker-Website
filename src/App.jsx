
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Users from "./pages/UserDetail";
import Admin from "./pages/admin_panel/AllUsers";
import Department from "./pages/admin_panel/Department";
import Roles from "./pages/admin_panel/Roles";
import Projects from "./pages/admin_panel/Projects";
import Companies from "./pages/admin_panel/Companies";
import Onboarding from "./pages/admin_panel/onboarding";
import LoginForm from "./components/LoginForm";
import ProtectedRoute from "./components/ProtectedRoute";
import Skills from "./pages/admin_panel/Skills";
import Tasks from "./pages/admin_panel/Tasks";
import Screenshots from "./pages/Screenshots";


function App() {
  const router = createBrowserRouter([
    { path: "/", element: <LoginForm /> },
    { path: "/users", element: <Users /> },

    // 🔒 Site Admin routes
    {
      path: "/admin/companies",
      element: (
        <ProtectedRoute allowedRoles={["Site Admin"]}>
          <Companies />
        </ProtectedRoute>
      ),
    },
    {
      path: "/admin/allusers",
      element: (
        <ProtectedRoute allowedRoles={["Site Admin", "Company Admin"]}>
          <Admin />
        </ProtectedRoute>
      ),
    },
    {
      path: "/screenshots/:id",
      element: (
        <ProtectedRoute allowedRoles={["Site Admin", "Company Admin"]}>
          <Screenshots />
        </ProtectedRoute>
      ),
    },

    // 🔒 Company Admin routes
    {
      path: "/admin/onboarding",
      element: (
        <ProtectedRoute allowedRoles={["Company Admin"]}>
          <Onboarding />
        </ProtectedRoute>
      ),
    },
    {
      path: "/admin/department",
      element: (
        <ProtectedRoute allowedRoles={["Company Admin", "Site Admin"]}>
          <Department />
        </ProtectedRoute>
      ),
    },
    {
      path: "/admin/roles",
      element: (
        <ProtectedRoute allowedRoles={["Company Admin", "Site Admin"]}>
          <Roles />
        </ProtectedRoute>
      ),
    },
    {
      path: "/admin/projects",
      element: (
        <ProtectedRoute allowedRoles={["Company Admin", "Site Admin"]}>
          <Projects />
        </ProtectedRoute>
      ),
    },
    
    {
      path: "/admin/skills",
      element: (
        <ProtectedRoute allowedRoles={["Company Admin", "Site Admin"]}>
          <Skills />
        </ProtectedRoute>
      ),
    },

    {
      path: "/admin/tasks",
      element: (
        <ProtectedRoute allowedRoles={["Company Admin", "Site Admin"]}>
          <Tasks />
        </ProtectedRoute>
      ),
    },

  ]);

  return <RouterProvider router={router} />;
}

export default App;
