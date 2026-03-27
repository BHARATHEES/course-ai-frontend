/**
 * API Service
 * All calls attach JWT from localStorage.
 * No userId is ever sent in request bodies – the backend reads it from the token.
 */

const BASE = process.env.REACT_APP_API_URL || "http://localhost:10000";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const getToken = () => {
  try {
    return JSON.parse(localStorage.getItem("user"))?.token || "";
  } catch {
    return "";
  }
};

const authHeaders = () => ({
  "Content-Type": "application/json",
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
});

const parseError = async (res, fallback = "Request failed") => {
  try {
    const d = await res.json();
    return d.message || d.error || fallback;
  } catch {
    return `${fallback} (${res.status})`;
  }
};

const request = async (method, path, body) => {
  try {
    const res = await fetch(`${BASE}${path}`, {
      method,
      headers: authHeaders(),
      credentials: "include",
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });
    if (!res.ok) {
      const msg = await parseError(res);
      return { ok: false, error: msg, status: res.status };
    }
    const data = await res.json();
    return { ok: true, ...data };
  } catch {
    return { ok: false, error: "Network error – check your connection." };
  }
};

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const login = (identifier, password) =>
  request("POST", "/api/auth", { identifier, password });

export const googleLogin = (token) =>
  request("POST", "/api/google-auth", { token });

export const setPassword = (email, username, password) =>
  request("POST", "/api/set-password", { email, username, password });

export const updatePassword = (email, newPassword) =>
  request("PUT", "/api/update-password", { email, newPassword });

export const updateProfile = (email, name, username) =>
  request("PUT", "/api/update-profile", { email, name, username });

export const getProfileStats = () =>
  request("GET", "/api/auth/profile-stats");

export const logout = () => {
  localStorage.removeItem("user");
  return { ok: true };
};

// ─── Analysis ────────────────────────────────────────────────────────────────

export const analyzeCourse = (courseName) =>
  request("POST", "/api/analyze", { courseName });

// ─── History ─────────────────────────────────────────────────────────────────

export const getHistory = () =>
  request("GET", "/api/history");

export const saveSearch = (courseName, analysisResult = {}) =>
  request("POST", "/api/history", { courseName, analysisResult });

export const deleteHistoryItem = (id) =>
  request("DELETE", `/api/history/${id}`);

export const deleteAllHistory = () =>
  request("DELETE", "/api/history/all");

// ─── Favorites ───────────────────────────────────────────────────────────────

export const getFavorites = () =>
  request("GET", "/api/favorites");

export const addFavorite = (courseName, analysisResult = null, notes = "") =>
  request("POST", "/api/favorites", { courseName, analysisResult, notes });

export const removeFavorite = (courseName) =>
  request("DELETE", "/api/favorites", { courseName });

export const updateFavorite = (id, notes, rating) =>
  request("PUT", `/api/favorites/${id}`, { notes, rating });

export const checkFavorite = (courseName) =>
  request("GET", `/api/favorites-check?courseName=${encodeURIComponent(courseName)}`);

// ─── Trending / Analytics ────────────────────────────────────────────────────

export const getTrendingCourses = (days = 30, page = 1, limit = 20, sortBy = "searches") =>
  request("GET", `/api/trending-courses?days=${days}&page=${page}&limit=${limit}&sortBy=${sortBy}&skipCache=true`);

export const getAdminDashboard = () =>
  request("GET", "/api/admin/dashboard");

// ─── Learning Roadmap (HuggingFace AI powered) ───────────────────────────────

export const getRoadmap = (courseName) =>
  request("GET", `/api/roadmap?courseName=${encodeURIComponent(courseName)}`);

// ─── Market analysis ─────────────────────────────────────────────────────────

export const getMarketAnalysis = (courseName) =>
  request("GET", `/api/market-analysis?courseName=${encodeURIComponent(courseName)}`);

// ─── Default export (backward-compat object) ─────────────────────────────────

const api = {
  login,
  googleLogin,
  setPassword,
  updatePassword,
  updateProfile,
  getProfileStats,
  logout,
  analyzeCourse,
  getHistory,
  saveSearch,
  deleteHistoryItem,
  deleteAllHistory,
  getFavorites,
  addFavorite,
  removeFavorite,
  updateFavorite,
  checkFavorite,
  getTrendingCourses,
  getAdminDashboard,
  getRoadmap,
  getMarketAnalysis,
  // generic passthrough used in TrendingCoursesPage
  get: (path) => request("GET", path),
};

export default api;
