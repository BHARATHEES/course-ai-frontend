import React, { useState, useEffect } from "react";
import {
  Container, Typography, Box, Paper, Grid, Card,
  Chip, Divider, Skeleton,
} from "@mui/material";
import BarChartIcon  from "@mui/icons-material/BarChart";
import PeopleIcon    from "@mui/icons-material/People";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import api           from "../services/api";

export default function AdminDashboard() {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAdminDashboard().then((res) => {
      if (!res.error) setData(res);
      setLoading(false);
    });
  }, []);

  const dash    = data?.dashboard;
  const summary = dash?.summary;

  const StatCard = ({ icon, label, value, color }) => (
    <Card elevation={0} sx={{ p: 3, border: "1px solid var(--theme-border-primary)", borderRadius: "12px", bgcolor: "var(--theme-surface-card)" }}>
      {loading ? <Skeleton variant="text" width="80%" /> : (
        <>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            {icon}
          </Box>
          <Typography variant="caption" sx={{ color: "var(--theme-text-secondary)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>
            {label}
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 800, color, mt: 1 }}>
            {value}
          </Typography>
        </>
      )}
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 1.5 }}>
        <BarChartIcon sx={{ color: "var(--theme-accent-primary)", fontSize: 32 }} />
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: "var(--theme-text-primary)" }}>
            Admin Dashboard
          </Typography>
          <Typography variant="body2" sx={{ color: "var(--theme-text-secondary)" }}>
            System-wide analytics
          </Typography>
        </Box>
      </Box>

      {/* Key metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard icon={<PeopleIcon sx={{ color: "var(--theme-accent-primary)", fontSize: 28 }} />}
            label="Total Users" value={summary?.totalUsers ?? 0} color="var(--theme-accent-primary)" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard icon={<TrendingUpIcon sx={{ color: "var(--theme-accent-secondary)", fontSize: 28 }} />}
            label="Total Analyses" value={summary?.totalAnalyses ?? 0} color="var(--theme-accent-secondary)" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard icon={<BarChartIcon sx={{ color: "var(--theme-status-success)", fontSize: 28 }} />}
            label="Active Users (30d)" value={summary?.activeUsers ?? 0} color="var(--theme-status-success)" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard icon={<span style={{ fontSize: 24 }}>💾</span>}
            label="Cache Savings" value={dash?.cacheStatistics?.estimatedSavings ?? "$0.00"} color="var(--theme-status-warning)" />
        </Grid>
      </Grid>

      <Divider sx={{ my: 4, borderColor: "var(--theme-border-primary)" }} />

      {/* Trending courses */}
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700, color: "var(--theme-text-primary)", mb: 2.5 }}>
          🔥 Top Trending Courses (Last 7 Days)
        </Typography>
        <Paper elevation={0} sx={{ p: 3, border: "1px solid var(--theme-border-primary)", borderRadius: "12px", bgcolor: "var(--theme-surface-card)" }}>
          {loading ? (
            <>{[1,2,3].map((i) => <Skeleton key={i} variant="text" sx={{ mb: 1.5 }} />)}</>
          ) : dash?.trendingCoursesLastWeek?.length > 0 ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {dash.trendingCoursesLastWeek.map((course, idx) => (
                <Box key={idx} sx={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  p: 2, bgcolor: "var(--theme-bg-secondary)", borderRadius: "8px",
                  border: "1px solid var(--theme-border-primary)",
                  "&:hover": { bgcolor: "rgba(59,130,246,0.08)" },
                }}>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 700, color: "var(--theme-text-primary)" }}>
                      {idx + 1}. {course.courseName}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "var(--theme-text-secondary)" }}>
                      {course.recentSearches} searches this week
                    </Typography>
                  </Box>
                  <Chip label={`${course.recentSearches} searches`}
                    sx={{ bgcolor: "rgba(16,185,129,0.15)", color: "#10b981", fontWeight: 700 }} />
                </Box>
              ))}
            </Box>
          ) : (
            <Typography variant="body2" sx={{ color: "var(--theme-text-secondary)", textAlign: "center", py: 3 }}>
              No trending data yet.
            </Typography>
          )}
        </Paper>
      </Box>
    </Container>
  );
}
