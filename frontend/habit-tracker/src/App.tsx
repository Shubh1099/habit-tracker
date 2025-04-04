import { Routes, Route } from "react-router-dom";



// Import Pages (adjust paths if needed)
import DashboardPage from "./pages/DashBoard";
import LoginPage from "./pages/LoginPage"; // We will create this
import RegisterPage from "./pages/RegisterPage"; // We will create this

// Import Components
import ProtectedRoute from "./components/ProtectedRoutes";
import NavBar from "./components/NavBar"; // We will create this

function App() {
  // --- Keep Theme logic here at the top level ---

  // Main layout container can still be here
  return (
    // BrowserRouter might be in main.tsx already, if so, remove it from here
    <>
      <NavBar />
      <div className="container mx-auto max-w-4xl mt-8 px-4 font-sans">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Route */}
          <Route path="/" element={<ProtectedRoute />}>
            {/* Child route rendered by Outlet in ProtectedRoute */}
            <Route index element={<DashboardPage />} />
            {/* Add other protected routes inside here later if needed */}
            {/* <Route path="profile" element={<ProfilePage />} /> */}
          </Route>

          {/* Optional: Add a 404 Not Found Route */}
          {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Routes>
      </div>
  </>
  );
}

export default App;
