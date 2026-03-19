import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import GigsPage from "./pages/GigsPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import GoalsPage from "./pages/GoalsPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/gigs" element={<GigsPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/goals" element={<GoalsPage />} />
    </Routes>
  );
}