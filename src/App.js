import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import "./theme/globalThemeStyles";
import MainLayout from "./layouts/MainLayout";
import ErrorBoundary from "./components/ErrorBoundary";

// Pages
import Dashboard        from "./pages/Dashboard";
import About            from "./pages/About";
import Login            from "./pages/Login";
import Profile          from "./pages/Profile";
import HistoryPage      from "./pages/HistoryPage";
import AdminDashboard   from "./pages/AdminDashboard";
import TrendingCoursesPage from "./pages/TrendingCoursesPage";
import ComparisonPage   from "./pages/ComparisonPage";
import UserDashboard    from "./pages/UserDashboard";
import MarketInsightsPage from "./pages/MarketInsightsPage";
import RoadmapPage      from "./pages/RoadmapPage";

// ─── App ─────────────────────────────────────────────────────────────────────
function AppContent() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("user");
      if (saved) setUser(JSON.parse(saved));
    } catch {
      localStorage.removeItem("user");
    }
  }, []);

  const handleLogin = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  const isAdmin = user?.email === "bharathees.ag23@bitsathy.ac.in";

  return (
    <Router>
      <Routes>
        {/* ── Public routes ─────────────────────────────────────────────── */}
        <Route path="/login" element={
          user ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />
        } />

        {/* ── Authenticated routes (wrapped in MainLayout) ──────────────── */}
        <Route path="/*" element={
          !user
            ? <Navigate to="/login" replace />
            : (
              <MainLayout user={user} onLogout={handleLogout}>
                <Routes>
                  {/* Core */}
                  <Route path="/"         element={<Dashboard user={user} />} />
                  <Route path="/about"    element={<About />} />

                  {/* Explore */}
                  <Route path="/trending" element={<TrendingCoursesPage />} />
                  <Route path="/compare"  element={<ComparisonPage />} />
                  <Route path="/market"   element={<MarketInsightsPage />} />
                  <Route path="/roadmap"  element={<RoadmapPage />} />

                  {/* Account */}
                  <Route path="/dashboard" element={<UserDashboard user={user} />} />
                  <Route path="/history"   element={<HistoryPage />} />
                  <Route path="/profile"   element={<Profile user={user} />} />

                  {/* Admin */}
                  {isAdmin && <Route path="/admin" element={<AdminDashboard />} />}

                  {/* Catch-all */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </MainLayout>
            )
        } />
      </Routes>
    </Router>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </ThemeProvider>
  );
}
