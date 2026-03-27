import React, { useState, useEffect } from "react";
import {
  Container, Paper, Typography, Box, CircularProgress,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, Button, Stack, Alert, TextField, InputAdornment,
  Pagination, Select, MenuItem, FormControl, Grid, IconButton,
} from "@mui/material";
import ArrowBackIcon          from "@mui/icons-material/ArrowBack";
import TrendingUpIcon         from "@mui/icons-material/TrendingUp";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import ArrowUpwardIcon        from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon      from "@mui/icons-material/ArrowDownward";
import RemoveIcon             from "@mui/icons-material/Remove";
import SearchIcon             from "@mui/icons-material/Search";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const RANK_COLORS = ["#ef4444", "#f59e0b", "#f59e0b", "var(--theme-accent-primary)"];
const RANK_LABELS = ["Blazing", "Hot", "Trending", "Growing"];

export default function TrendingCoursesPage() {
  const [courses,     setCourses]     = useState([]);
  const [filtered,    setFiltered]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [isSample,    setIsSample]    = useState(false);
  const [days,        setDays]        = useState(30);
  const [sortBy,      setSortBy]      = useState("searches");
  const [search,      setSearch]      = useState("");
  const [page,        setPage]        = useState(1);
  const [totalPages,  setTotalPages]  = useState(1);
  const navigate = useNavigate();

  useEffect(() => { fetchPage(1); }, [days, sortBy]); // eslint-disable-line
  useEffect(() => {
    if (!search.trim()) { setFiltered(courses); return; }
    setFiltered(courses.filter((c) => c.courseName.toLowerCase().includes(search.toLowerCase())));
  }, [search, courses]);

  const fetchPage = async (p) => {
    setLoading(true);
    const res = await api.getTrendingCourses(days, p, 10, sortBy);
    if (!res.error) {
      setCourses(res.data || []);
      setFiltered(res.data || []);
      setIsSample(res.isSampleData || false);
      setTotalPages(res.pagination?.pages || 1);
      setPage(p);
    }
    setLoading(false);
  };

  const fmt = (ds) => new Date(ds).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

  const growthColor = (pct) => pct > 0 ? "#10b981" : pct < 0 ? "#ef4444" : "#6b7280";

  if (loading) return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
      <CircularProgress />
    </Box>
  );

  const chartData = filtered.slice(0, 8).map((c) => ({
    name: c.courseName.length > 12 ? c.courseName.slice(0, 12) + "…" : c.courseName,
    searches: c.searchCount,
  }));

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
        <IconButton size="small" onClick={() => navigate("/")}
          sx={{ bgcolor: "var(--theme-bg-secondary)", border: "1px solid var(--theme-border-primary)" }}>
          <ArrowBackIcon fontSize="small" />
        </IconButton>
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <TrendingUpIcon sx={{ color: "var(--theme-accent-primary)", fontSize: 26 }} />
            <Typography variant="h5" sx={{ fontWeight: 700, color: "var(--theme-text-primary)" }}>
              Trending Courses
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ color: "var(--theme-text-secondary)" }}>
            Most analysed courses in the last {days} days
          </Typography>
        </Box>
      </Box>

      {/* Controls */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={8}>
          <Paper elevation={0} sx={{ p: 2, bgcolor: "var(--theme-bg-secondary)", borderRadius: 2, border: "1px solid var(--theme-border-primary)" }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: "var(--theme-text-secondary)", mb: 1.5 }}>
              Time Range
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {[
                { v: 7, label: "7 Days" },
                { v: 30, label: "30 Days" },
                { v: 90, label: "90 Days" },
                { v: 365, label: "All Time" },
              ].map(({ v, label }) => (
                <Button key={v} size="small"
                  variant={days === v ? "contained" : "outlined"}
                  onClick={() => setDays(v)}
                  sx={{ textTransform: "none", fontWeight: 600 }}>
                  {label}
                </Button>
              ))}
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper elevation={0} sx={{ p: 2, bgcolor: "var(--theme-bg-secondary)", borderRadius: 2, border: "1px solid var(--theme-border-primary)" }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: "var(--theme-text-secondary)", mb: 1.5 }}>
              Sort by
            </Typography>
            <FormControl fullWidth size="small">
              <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <MenuItem value="searches">Most Searches</MenuItem>
                <MenuItem value="name">Name</MenuItem>
                <MenuItem value="date">Recently Searched</MenuItem>
              </Select>
            </FormControl>
          </Paper>
        </Grid>
      </Grid>

      {/* Search */}
      <TextField fullWidth placeholder="Search courses…" value={search}
        onChange={(e) => setSearch(e.target.value)} size="small"
        sx={{ mb: 3, bgcolor: "var(--theme-bg-primary)" }}
        InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: "var(--theme-text-secondary)" }} /></InputAdornment> }}
      />

      {/* Sample data notice */}
      {isSample && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Showing sample data. Analyse real courses to see actual trending data.
        </Alert>
      )}

      {/* Bar chart */}
      {chartData.length > 0 && (
        <Paper elevation={0} sx={{ p: 3, mb: 4, bgcolor: "var(--theme-bg-secondary)", borderRadius: 3, border: "1px solid var(--theme-border-primary)" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
            🔥 Search Volume — Top 8
          </Typography>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--theme-border-primary)" />
              <XAxis dataKey="name" stroke="var(--theme-text-secondary)" />
              <YAxis stroke="var(--theme-text-secondary)" />
              <Tooltip contentStyle={{ bgcolor: "var(--theme-bg-primary)", borderRadius: 8 }} />
              <Bar dataKey="searches" fill="var(--theme-accent-primary)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      )}

      {/* Table */}
      {filtered.length > 0 ? (
        <>
          <TableContainer component={Paper} elevation={0}
            sx={{ border: "1px solid var(--theme-border-primary)", borderRadius: 3 }}>
            <Table size="small">
              <TableHead sx={{ bgcolor: "var(--theme-bg-secondary)" }}>
                <TableRow>
                  {["Rank", "Course", "Difficulty", "Rating", "Searches", "Growth", "Last Searched", ""].map((h) => (
                    <TableCell key={h} sx={{ fontWeight: 700, color: "var(--theme-text-secondary)" }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((course, idx) => (
                  <TableRow key={course.courseName} hover>
                    <TableCell>
                      <Box sx={{
                        width: 30, height: 30, borderRadius: "50%",
                        bgcolor: RANK_COLORS[Math.min(idx, 3)],
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "white", fontWeight: 700, fontSize: "0.8rem",
                      }}>
                        {course.rank || idx + 1}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>{course.courseName}</Typography>
                      <Chip icon={<LocalFireDepartmentIcon />} label={RANK_LABELS[Math.min(idx, 3)]} size="small"
                        sx={{ mt: 0.5, height: 20, fontSize: "0.65rem",
                          bgcolor: `${RANK_COLORS[Math.min(idx, 3)]}20`,
                          color: RANK_COLORS[Math.min(idx, 3)] }} />
                    </TableCell>
                    <TableCell>
                      <Chip label={course.difficulty || "N/A"} size="small" variant="outlined"
                        sx={{ fontWeight: 600,
                          borderColor: course.difficulty === "Advanced" ? "#ef4444"
                            : course.difficulty === "Intermediate" ? "#f59e0b" : "#10b981" }} />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#f59e0b" }}>⭐ {course.rating || "—"}</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>{course.searchCount || 0}</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        {course.growthDirection === "up"     && <ArrowUpwardIcon sx={{ fontSize: "1rem", color: growthColor(course.growthPercent) }} />}
                        {course.growthDirection === "down"   && <ArrowDownwardIcon sx={{ fontSize: "1rem", color: growthColor(course.growthPercent) }} />}
                        {course.growthDirection === "stable" && <RemoveIcon sx={{ fontSize: "1rem", color: growthColor(0) }} />}
                        <Typography variant="body2" sx={{ fontWeight: 700, color: growthColor(course.growthPercent ?? 0) }}>
                          {course.growthPercent ?? 0}%
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" sx={{ color: "var(--theme-text-tertiary)" }}>
                        {fmt(course.lastSearched)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Button size="small" variant="contained"
                        onClick={() => navigate(`/?course=${encodeURIComponent(course.courseName)}`)}
                        sx={{ textTransform: "none", fontWeight: 600, fontSize: "0.75rem" }}>
                        Analyse
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Pagination count={totalPages} page={page}
              onChange={(_, v) => fetchPage(v)}
              color="primary" variant="outlined" shape="rounded" />
          </Box>
        </>
      ) : (
        <Alert severity="info">
          {search ? `No courses matching "${search}"` : "No trending data yet. Analyse a course to get started!"}
        </Alert>
      )}
    </Container>
  );
}
