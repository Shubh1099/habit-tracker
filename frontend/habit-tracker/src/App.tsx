import { Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/DashBoard";
import LoginPage from "./pages/LoginPage"; // We will create this
import RegisterPage from "./pages/RegisterPage"; // We will create this
import ProtectedRoute from "./components/ProtectedRoutes";
import NavBar from "./components/NavBar"; // We will create this

function App() {
  return (
    <>
      <NavBar />
      <div className="container mx-auto max-w-4xl mt-8 px-4 font-sans">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<ProtectedRoute />}>
            <Route index element={<DashboardPage />} />
          </Route>
        </Routes>
      </div>
    </>
  );
}

export default App;
