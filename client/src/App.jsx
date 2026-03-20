import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import GigsPage from "./pages/GigsPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import GoalsPage from "./pages/GoalsPage.jsx";

export default function App() {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } finally {
        setAuthChecked(true);
      }
    }
    checkSession();
  }, []);

  function handleLogout() {
    setUser(null);
  }

  function handleLogin(loggedInUser) {
    setUser(loggedInUser);
  }

  // Don't render anything until we know if user is logged in
  if (!authChecked) return null;

  return (
    <>
      <Navbar user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected routes — redirect to /login if not logged in */}
        <Route
          path="/gigs"
          element={user ? <GigsPage user={user} /> : <Navigate to="/login" />}
        />
        <Route
          path="/dashboard"
          element={
            user ? <DashboardPage user={user} /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/goals"
          element={user ? <GoalsPage user={user} /> : <Navigate to="/login" />}
        />
      </Routes>
    </>
  );
}
