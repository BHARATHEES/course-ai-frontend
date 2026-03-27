import React from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Alert,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import VerifiedIcon from "@mui/icons-material/Verified";

/**
 * Real-Time Data Display Component
 * Shows actual API data with source attribution and freshness indicators
 */
export default function RealTimeDataDisplay({ marketData }) {
  if (!marketData) return null;

  const { apiData, dataSource, confidenceScore, lastUpdated } = marketData;
  const lastUpdatedTime = new Date(lastUpdated);
  const minutesAgo = Math.floor((Date.now() - lastUpdatedTime) / 60000);

  const formatTime = () => {
    if (minutesAgo < 1) return "Just now";
    if (minutesAgo < 60) return `${minutesAgo} min ago`;
    const hoursAgo = Math.floor(minutesAgo / 60);
    if (hoursAgo < 24) return `${hoursAgo}h ago`;
    return lastUpdatedTime.toLocaleDateString();
  };

  return (
    <Box sx={{ mt: 4 }}>
      {/* Data Freshness & Confidence */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          border: "1px solid var(--theme-border-primary)",
          borderRadius: "12px",
          bgcolor: "var(--theme-surface-card)",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <RefreshIcon
              sx={{
                fontSize: "1.2rem",
                color: "var(--theme-accent-primary)",
                animation: minutesAgo < 5 ? "spin 2s linear infinite" : "none",
              }}
            />
            <Box>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 700, color: "var(--theme-text-primary)" }}
              >
                Real-Time Data
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "var(--theme-text-tertiary)" }}
              >
                Last updated {formatTime()}
              </Typography>
            </Box>
          </Box>
          <Tooltip title={`Data accuracy from ${dataSource.length} live API sources`}>
            <Box sx={{ textAlign: "right" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, justifyContent: "flex-end", mb: 0.5 }}>
                <VerifiedIcon sx={{ fontSize: "1rem", color: "var(--theme-accent-primary)" }} />
                <Typography variant="body2" sx={{ fontWeight: 700, color: "var(--theme-text-primary)" }}>
                  {confidenceScore}% Confidence
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={confidenceScore}
                sx={{
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: "var(--theme-bg-secondary)",
                  "& .MuiLinearProgress-bar": {
                    background:
                      confidenceScore > 75
                        ? "#10b981"
                        : confidenceScore > 50
                        ? "#f59e0b"
                        : "#ef4444",
                  },
                }}
              />
            </Box>
          </Tooltip>
        </Box>

        {/* Data Sources */}
        <Box sx={{ mt: 2 }}>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              textTransform: "uppercase",
              color: "var(--theme-text-tertiary)",
              display: "block",
              mb: 1,
            }}
          >
            📊 Active Data Sources
          </Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {dataSource.map((source, idx) => (
              <Chip
                key={idx}
                label={source}
                size="small"
                sx={{
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  bgcolor: "var(--theme-accent-primary)",
                  color: "white",
                }}
              />
            ))}
          </Box>
        </Box>
      </Paper>

      {/* Job Market Real Data (Adzuna) */}
      {apiData?.adzuna && (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            border: "1px solid var(--theme-border-primary)",
            borderRadius: "12px",
            bgcolor: "var(--theme-surface-card)",
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, color: "var(--theme-text-primary)", mb: 2 }}
          >
            💼 Job Market Real-Time Data (Adzuna)
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: "var(--theme-text-tertiary)",
                    fontWeight: 700,
                    textTransform: "uppercase",
                  }}
                >
                  Open Positions
                </Typography>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 800, color: "var(--theme-accent-primary)", mt: 0.5 }}
                >
                  {apiData.adzuna.jobCount.toLocaleString()}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: "var(--theme-text-tertiary)",
                    fontWeight: 700,
                    textTransform: "uppercase",
                  }}
                >
                  Average Salary
                </Typography>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 800, color: "var(--theme-accent-primary)", mt: 0.5 }}
                >
                  ${apiData.adzuna?.avgSalary?.toLocaleString() || "N/A"}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: "var(--theme-text-tertiary)",
                    fontWeight: 700,
                    textTransform: "uppercase",
                  }}
                >
                  Top Locations
                </Typography>
                <Box sx={{ mt: 0.5, display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                  {(apiData.adzuna.topLocations || []).slice(0, 3).map((loc, i) => (
                    <Chip key={i} label={loc} size="small" variant="outlined" />
                  ))}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Course Platform Data (Coursera) */}
      {apiData?.coursera && (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            border: "1px solid var(--theme-border-primary)",
            borderRadius: "12px",
            bgcolor: "var(--theme-surface-card)",
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, color: "var(--theme-text-primary)", mb: 2 }}
          >
            🎓 Course Data (Coursera)
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: "var(--theme-text-tertiary)",
                    fontWeight: 700,
                    textTransform: "uppercase",
                  }}
                >
                  Matching Courses
                </Typography>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 800, color: "var(--theme-accent-primary)", mt: 0.5 }}
                >
                  {apiData.coursera?.courseCount || "0"}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: "var(--theme-text-tertiary)",
                    fontWeight: 700,
                    textTransform: "uppercase",
                  }}
                >
                  Total Enrollments
                </Typography>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 800, color: "var(--theme-accent-primary)", mt: 0.5 }}
                >
                  {apiData.coursera?.totalEnrollments?.toLocaleString() || "0"}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Top Courses Table */}
          {apiData.coursera?.topCourses && apiData.coursera.topCourses.length > 0 && (
            <TableContainer sx={{ mt: 2, border: "1px solid var(--theme-border-primary)" }}>
              <Table size="small">
                <TableHead sx={{ bgcolor: "var(--theme-bg-secondary)" }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Course</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Partner</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>Duration</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {apiData.coursera.topCourses.map((course, i) => (
                    <TableRow key={i}>
                      <TableCell sx={{ color: "var(--theme-text-primary)" }}>
                        {course.title}
                      </TableCell>
                      <TableCell sx={{ color: "var(--theme-text-secondary)" }}>
                        {course.partner}
                      </TableCell>
                      <TableCell align="right" sx={{ color: "var(--theme-text-secondary)" }}>
                        {course.duration}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      )}

      {/* GitHub Trending */}
      {apiData?.github && (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            border: "1px solid var(--theme-border-primary)",
            borderRadius: "12px",
            bgcolor: "var(--theme-surface-card)",
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, color: "var(--theme-text-primary)", mb: 2 }}
          >
            🔥 Trending on GitHub
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "var(--theme-text-secondary)", mb: 2 }}
          >
            Most popular repositories matching this skill
          </Typography>
          {apiData.github.topRepos?.map((repo, i) => (
            <Paper
              key={i}
              sx={{
                p: 2,
                mb: 1,
                bgcolor: "var(--theme-bg-secondary)",
                border: "1px solid var(--theme-border-primary)",
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                <Box>
                  <Typography
                    sx={{ fontWeight: 700, color: "var(--theme-accent-primary)" }}
                  >
                    {repo.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "var(--theme-text-tertiary)" }}>
                    {repo.description}
                  </Typography>
                </Box>
                <Chip label={`⭐ ${(repo.stars / 1000).toFixed(1)}K`} />
              </Box>
            </Paper>
          ))}
        </Paper>
      )}

      {/* Fallback Alert */}
      {(!apiData || Object.values(apiData).every(v => !v)) && (
        <Alert severity="info" sx={{ mb: 3 }}>
          📡 Real-time data is loading. We're using <strong>free APIs only</strong>: Adzuna (job market),
          Coursera (courses), and GitHub (trending repos). No paid subscriptions needed! 🎉
        </Alert>
      )}
    </Box>
  );
}
