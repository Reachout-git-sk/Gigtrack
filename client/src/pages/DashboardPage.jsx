import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EarningsDashboard from "../components/EarningsDashboard/EarningsDashboard.jsx";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function checkAuth() {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      if (!res.ok) {
        navigate("/login");
      } else {
        const data = await res.json();
        setUser(data.user);
      }
    }
    checkAuth();
  }, [navigate]);

  if (!user) return null;

  return <EarningsDashboard userId={user.id} />;
}
