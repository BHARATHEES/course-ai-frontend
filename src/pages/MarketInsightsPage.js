import React, { useState, useEffect } from "react";
import {
  Container, Typography, Box, Paper, TextField, Button,
  Alert, Grid, LinearProgress, Chip, Stack, Divider,
} from "@mui/material";
import { useLocation }  from "react-router-dom";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, LineChart, Line,
  XAxis, YAxis, CartesianGrid, BarChart, Bar,
} from "recharts";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#ec4899"];

const PieCard = ({ title, data }) => (
  <Paper elevation={0} sx={{ p: 4, border: "2px solid var(--theme-border-primary)", borderRadius: "16px", bgcolor: "var(--theme-surface-card)", mb: 3 }}>
    <Typography variant="h6" sx={{ fontWeight: 800, color: "var(--theme-text-primary)", mb: 3, fontSize: "1.2rem" }}>{title}</Typography>
    {data.length === 0
      ? <Typography variant="body2" sx={{ color: "var(--theme-text-tertiary)" }}>No data</Typography>
      : (
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" outerRadius={110} dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              labelLine={false}>
              {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip formatter={(v) => `${(+v).toFixed(1)}%`}
              contentStyle={{ bgcolor: "var(--theme-bg-primary)", borderRadius: 8, fontSize: "13px", fontWeight: 700 }} />
            <Legend wrapperStyle={{ fontSize: "13px", fontWeight: 600 }} />
          </PieChart>
        </ResponsiveContainer>
      )}
  </Paper>
);

export default function MarketInsightsPage() {
  const [course,             setCourse]             = useState("");
  const [marketData,         setMarketData]         = useState(null);
  const [historicalData,     setHistoricalData]     = useState(null);
  const [loading,            setLoading]            = useState(false);
  const [error,              setError]              = useState("");
  const [activeTab,          setActiveTab]          = useState("overview");
  const [dataSource,         setDataSource]         = useState("");
  const [lastUpdated,        setLastUpdated]        = useState(null);
  const location = useLocation();

  // Auto-search from URL param
  useEffect(() => {
    const p = new URLSearchParams(location.search).get("course");
    if (p) { setCourse(p); doFetch(p); }
  }, [location]); // eslint-disable-line

  const doFetch = async (name) => {
    setLoading(true); 
    setError("");
    setMarketData(null);
    setHistoricalData(null);
    
    const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:10000";
    
    try {
      // Fetch market insights (from database with HF API fallback)
      const res = await fetch(`${BASE_URL}/api/market-insights?courseName=${encodeURIComponent(name)}`, {
        headers: { "Cache-Control": "no-cache" }
      });
      
      // Handle 304 Not Modified by re-fetching without cache
      if (res.status === 304) {
        const retryRes = await fetch(`${BASE_URL}/api/market-insights?courseName=${encodeURIComponent(name)}&_t=${Date.now()}`, {
          headers: { "Cache-Control": "no-cache" }
        });
        if (!retryRes.ok) {
          throw new Error(`Failed to fetch data: ${retryRes.statusText}`);
        }
        const data = await retryRes.json();
        setMarketData(data.marketData);
        setDataSource(data.dataSource || "HuggingFace AI");
        setLastUpdated(data.lastUpdated);
      } else if (!res.ok) {
        throw new Error(`Failed to fetch data: ${res.statusText}`);
      } else {
        const data = await res.json();
        
        if (!data.success) {
          throw new Error(data.message || "No data available for this course");
        }
        
        if (data.marketData) {
          setMarketData(data.marketData);
          setDataSource(data.dataSource || "HuggingFace AI");
          setLastUpdated(data.lastUpdated);
        }
      }
      
      // Fetch historical data (database only)
      try {
        const histRes = await fetch(`${BASE_URL}/api/market-insights/historical?courseName=${encodeURIComponent(name)}`, {
          headers: { "Cache-Control": "no-cache" }
        });
        if (histRes.ok) {
          const histData = await histRes.json();
          if (histData.success && histData.historicalGrowth) {
            setHistoricalData(histData);
          }
        }
      } catch (histErr) {
        console.log("Historical data not available");
      }
    } catch (err) {
      console.error("Error:", err);
      setError(err.message || "Failed to load market insights. Please try again.");
      setMarketData(null);
    }
    
    setLoading(false);
  };

  const handleSearch = (e) => { 
    e.preventDefault(); 
    if (course.trim()) doFetch(course.trim()); 
  };

  const fmt = (v) => new Intl.NumberFormat("en-US", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(v || 0);

  // Geographical distribution data
  const regionData = marketData?.geographicalDistribution ? [
    { name: "India", value: marketData.geographicalDistribution.india || 0 },
    { name: "N. America", value: marketData.geographicalDistribution.northAmerica || 0 },
    { name: "Europe", value: marketData.geographicalDistribution.europe || 0 },
    { name: "Asia Pacific", value: marketData.geographicalDistribution.asiaPacific || 0 },
    { name: "Other", value: marketData.geographicalDistribution.other || 0 },
  ].filter(d => d.value > 0) : [];

  // Job role distribution data
  const roleData = marketData?.jobRoleDistribution ? [
    { name: "Entry Level", value: marketData.jobRoleDistribution.entrylevel || 0 },
    { name: "Mid Level", value: marketData.jobRoleDistribution.midLevel || 0 },
    { name: "Senior Level", value: marketData.jobRoleDistribution.seniorLevel || 0 },
    { name: "Leadership", value: marketData.jobRoleDistribution.leadership || 0 },
  ].filter(d => d.value > 0) : [];

  // Transform historical growth data for charts
  const historicalChartData = historicalData?.historicalGrowth ? [
    {
      year: "Year 1",
      demand: historicalData.historicalGrowth.year1?.demandScore || 0,
      salary: Math.round((historicalData.historicalGrowth.year1?.salaryINR || 0) / 100000),
      jobs: Math.round((historicalData.historicalGrowth.year1?.openPositions || 0) / 1000),
      trending: historicalData.historicalGrowth.year1?.trendingScore || 0,
    },
    {
      year: "Year 2",
      demand: historicalData.historicalGrowth.year2?.demandScore || 0,
      salary: Math.round((historicalData.historicalGrowth.year2?.salaryINR || 0) / 100000),
      jobs: Math.round((historicalData.historicalGrowth.year2?.openPositions || 0) / 1000),
      trending: historicalData.historicalGrowth.year2?.trendingScore || 0,
    },
    {
      year: "Year 3",
      demand: historicalData.historicalGrowth.year3?.demandScore || 0,
      salary: Math.round((historicalData.historicalGrowth.year3?.salaryINR || 0) / 100000),
      jobs: Math.round((historicalData.historicalGrowth.year3?.openPositions || 0) / 1000),
      trending: historicalData.historicalGrowth.year3?.trendingScore || 0,
    },
    {
      year: "Year 4",
      demand: historicalData.historicalGrowth.year4?.demandScore || 0,
      salary: Math.round((historicalData.historicalGrowth.year4?.salaryINR || 0) / 100000),
      jobs: Math.round((historicalData.historicalGrowth.year4?.openPositions || 0) / 1000),
      trending: historicalData.historicalGrowth.year4?.trendingScore || 0,
    },
    {
      year: "Year 5",
      demand: historicalData.historicalGrowth.year5?.demandScore || 0,
      salary: Math.round((historicalData.historicalGrowth.year5?.salaryINR || 0) / 100000),
      jobs: Math.round((historicalData.historicalGrowth.year5?.openPositions || 0) / 1000),
      trending: historicalData.historicalGrowth.year5?.trendingScore || 0,
    },
  ] : [];

  const tabs = ["overview", "growth", "composition", "ml insights", "sentiment"];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Search */}
      <Paper elevation={0} sx={{ p: 5, mb: 4, border: "2px solid var(--theme-border-primary)", borderRadius: "16px", bgcolor: "var(--theme-surface-card)" }}>
        <Typography variant="h4" sx={{ fontWeight: 900, color: "var(--theme-text-primary)", mb: 1, fontSize: "2rem" }}>
          🎯 Market Insights
        </Typography>
        <Typography variant="body1" sx={{ color: "var(--theme-text-secondary)", mb: 4, fontSize: "1.05rem" }}>
          Real-time market analysis, salary data, and ML-powered predictions.
        </Typography>
        <Box component="form" onSubmit={handleSearch} sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <TextField fullWidth size="medium" placeholder="Enter course name…"
            value={course} onChange={(e) => setCourse(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                fontSize: "1.05rem",
                color: "var(--theme-text-primary)",
                "& fieldset": { borderColor: "var(--theme-border-primary)", borderWidth: "2px" },
                "&:hover fieldset": { borderColor: "var(--theme-accent-primary)" },
              },
            }} />
          <Button type="submit" variant="contained" disabled={loading}
            sx={{ px: 5, py: 1.5, textTransform: "none", fontWeight: 800, fontSize: "1rem", bgcolor: "var(--theme-accent-primary)", whiteSpace: "nowrap" }}>
            {loading ? "Analysing…" : "Analyse"}
          </Button>
        </Box>
        {error && <Alert severity="error" sx={{ mt: 3, fontSize: "0.95rem", fontWeight: 600 }}>{error}</Alert>}
      </Paper>

      {marketData && (
        <>
          <Paper elevation={0} sx={{ p: 4, mb: 4, border: "2px solid #0ea5e9", borderRadius: "16px", bgcolor: "rgba(6, 182, 212, 0.08)" }}>
            <Stack direction="row" spacing={3} alignItems="center" sx={{textAlign: "center", justifyContent: "center", flexWrap: "wrap" }}>
              <Typography variant="h6" sx={{ color: "#0ea5e9", fontWeight: 800, fontSize: "1rem" }}>
                📊 <strong>Data Source:</strong> {dataSource || "HuggingFace AI"}
              </Typography>
              {lastUpdated && (
                <Typography variant="h6" sx={{ color: "var(--theme-text-secondary)", fontWeight: 800, fontSize: "1rem" }}>
                  📅 <strong>Last Updated:</strong> {new Date(lastUpdated).toLocaleDateString()}
                </Typography>
              )}
            </Stack>
          </Paper>

          {/* Metric summary cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {[
              { emoji: "📈", label: "Trending Score",   value: `${marketData.trends?.trendingScore?.toFixed(1) ?? 0}/100` },
              { emoji: "💼", label: "Demand Score",  value: `${marketData.demand?.demandScore?.toFixed(1) ?? 0}/100` },
              { emoji: "💰", label: "Beginner Salary",    value: fmt(marketData.salary?.averageBeginnerINR) },
              { emoji: "⭐", label: "Experienced Salary", value: fmt(marketData.salary?.averageExperiencedINR) },
            ].map(({ emoji, label, value }) => (
              <Grid item xs={12} sm={6} md={3} key={label}>
                <Paper elevation={0} sx={{ p: 4, textAlign: "center", border: "2px solid var(--theme-border-primary)", borderRadius: "16px", bgcolor: "var(--theme-surface-card)", transition: "all 0.3s", "&:hover": { borderColor: "var(--theme-accent-primary)", boxShadow: "0 8px 24px rgba(59,130,246,0.15)" } }}>
                  <Typography sx={{ fontSize: "2.5rem", mb: 1 }}>{emoji}</Typography>
                  <Typography variant="caption" sx={{ color: "var(--theme-text-tertiary)", fontWeight: 700, textTransform: "uppercase", display: "block", fontSize: "0.75rem", letterSpacing: "0.5px" }}>
                    {label}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 900, color: "var(--theme-accent-primary)", mt: 1.5, fontSize: "1.75rem", lineHeight: 1.2 }}>{value}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Additional metrics */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={0} sx={{ p: 4, textAlign: "center", border: "2px solid var(--theme-border-primary)", borderRadius: "16px", bgcolor: "var(--theme-surface-card)" }}>
                <Typography sx={{ fontSize: "2.5rem", mb: 1 }}>💼</Typography>
                <Typography variant="caption" sx={{ color: "var(--theme-text-tertiary)", fontWeight: 700, textTransform: "uppercase", display: "block", fontSize: "0.75rem" }}>
                  Open Positions
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 900, color: "var(--theme-accent-primary)", mt: 1.5, fontSize: "1.75rem" }}>{marketData.demand?.openPositions?.toLocaleString() ?? "—"}</Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={0} sx={{ p: 4, textAlign: "center", border: "2px solid var(--theme-border-primary)", borderRadius: "16px", bgcolor: "var(--theme-surface-card)" }}>
                <Typography sx={{ fontSize: "2.5rem", mb: 1 }}>📊</Typography>
                <Typography variant="caption" sx={{ color: "var(--theme-text-tertiary)", fontWeight: 700, textTransform: "uppercase", display: "block", fontSize: "0.75rem" }}>
                  Job Trend
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 900, color: "var(--theme-accent-primary)", mt: 1.5, fontSize: "1.75rem" }}>{marketData.trends?.jobTrendDirection ?? "—"}</Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={0} sx={{ p: 4, textAlign: "center", border: "2px solid var(--theme-border-primary)", borderRadius: "16px", bgcolor: "var(--theme-surface-card)" }}>
                <Typography sx={{ fontSize: "2.5rem", mb: 1 }}>📈</Typography>
                <Typography variant="caption" sx={{ color: "var(--theme-text-tertiary)", fontWeight: 700, textTransform: "uppercase", display: "block", fontSize: "0.75rem" }}>
                  YoY Growth
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 900, color: "var(--theme-accent-primary)", mt: 1.5, fontSize: "1.75rem" }}>{marketData.trends?.yoyGrowth?.toFixed(1) ?? "—"}%</Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={0} sx={{ p: 4, textAlign: "center", border: "2px solid var(--theme-border-primary)", borderRadius: "16px", bgcolor: "var(--theme-surface-card)" }}>
                <Typography sx={{ fontSize: "2.5rem", mb: 1 }}>🔮</Typography>
                <Typography variant="caption" sx={{ color: "var(--theme-text-tertiary)", fontWeight: 700, textTransform: "uppercase", display: "block", fontSize: "0.75rem" }}>
                  6 Month Outlook
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 900, color: "var(--theme-accent-primary)", mt: 1.5, fontSize: "1.75rem" }}>{marketData.demand?.futureOutlook6Months ?? "—"}</Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Tab bar */}
          <Stack direction="row" spacing={1} sx={{ mb: 4, flexWrap: "wrap", gap: 1.5 }}>
            {tabs.map((t) => (
              <Chip key={t} label={t.charAt(0).toUpperCase() + t.slice(1)}
                onClick={() => setActiveTab(t)}
                variant={activeTab === t ? "filled" : "outlined"}
                sx={{
                  fontWeight: 800, textTransform: "capitalize", cursor: "pointer", fontSize: "0.95rem", py: 3, px: 1.5,
                  ...(activeTab === t ? { bgcolor: "var(--theme-accent-primary)", color: "white", boxShadow: "0 4px 12px rgba(59,130,246,0.3)" } : { color: "var(--theme-text-secondary)", border: "2px solid var(--theme-border-primary)" }),
                }} />
            ))}
          </Stack>

          {/* Tab content */}
          {activeTab === "overview" && (
            <Paper elevation={0} sx={{ p: 5, border: "2px solid var(--theme-border-primary)", borderRadius: "16px", bgcolor: "var(--theme-surface-card)" }}>
              <Grid container spacing={5}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: "var(--theme-text-primary)", mb: 3, fontSize: "1.2rem" }}>🏢 Top Companies Hiring</Typography>
                  <Stack direction="column" gap={2}>
                    {(marketData.topCompanies || []).slice(0, 5).map((company) => (
                      <Chip key={company} label={company} size="medium" variant="outlined" sx={{ justifyContent: "flex-start", fontSize: "1rem", py: 3, fontWeight: 700 }} />
                    ))}
                    {(!marketData.topCompanies || marketData.topCompanies.length === 0) && (
                      <Typography variant="body2" sx={{ color: "var(--theme-text-tertiary)" }}>No companies data</Typography>
                    )}
                  </Stack>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: "var(--theme-text-primary)", mb: 3, fontSize: "1.2rem" }}>🏭 Top Industries</Typography>
                  <Stack direction="column" gap={2}>
                    {(marketData.topIndustries || []).slice(0, 5).map((industry) => (
                      <Chip key={industry} label={industry} size="medium" variant="outlined" sx={{ justifyContent: "flex-start", fontSize: "1rem", py: 3, fontWeight: 700 }} />
                    ))}
                    {(!marketData.topIndustries || marketData.topIndustries.length === 0) && (
                      <Typography variant="body2" sx={{ color: "var(--theme-text-tertiary)" }}>No industries data</Typography>
                    )}
                  </Stack>
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ borderColor: "var(--theme-border-primary)", borderWidth: "2px", mb: 3 }} />
                  <Typography variant="h6" sx={{ fontWeight: 800, color: "var(--theme-text-primary)", mb: 3, fontSize: "1.2rem" }}>🎯 Related Skills to Learn</Typography>
                  <Stack direction="row" flexWrap="wrap" gap={2}>
                    {(marketData.relatedSkills || []).map((skill) => (
                      <Chip key={skill} label={skill} size="medium" sx={{ bgcolor: "rgba(59,130,246,0.15)", color: "var(--theme-accent-primary)", fontWeight: 800, fontSize: "0.95rem", py: 2.5 }} />
                    ))}
                    {(!marketData.relatedSkills || marketData.relatedSkills.length === 0) && (
                      <Typography variant="body2" sx={{ color: "var(--theme-text-tertiary)" }}>No skills data</Typography>
                    )}
                  </Stack>
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ borderColor: "var(--theme-border-primary)", borderWidth: "2px", mb: 3 }} />
                  <Typography variant="h6" sx={{ fontWeight: 800, color: "var(--theme-text-primary)", mb: 3, fontSize: "1.2rem" }}>📋 Additional Metrics</Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ p: 4, bgcolor: "var(--theme-bg-primary)", borderRadius: "12px", border: "2px solid var(--theme-border-primary)" }}>
                        <Typography variant="caption" sx={{ color: "var(--theme-text-tertiary)", fontWeight: 800, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>Salary Growth (%)</Typography>
                        <Typography variant="h4" sx={{ fontWeight: 900, color: "var(--theme-accent-primary)", mt: 1, fontSize: "2rem" }}>{marketData.salary?.salaryGrowthPercent?.toFixed(1) ?? "—"}%</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ p: 4, bgcolor: "var(--theme-bg-primary)", borderRadius: "12px", border: "2px solid var(--theme-border-primary)" }}>
                        <Typography variant="caption" sx={{ color: "var(--theme-text-tertiary)", fontWeight: 800, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>Community Engagement</Typography>
                        <Typography variant="h4" sx={{ fontWeight: 900, color: "var(--theme-accent-primary)", mt: 1, fontSize: "2rem" }}>{marketData.communitySentiment?.communityEngagement?.toFixed(1) ?? "—"}/100</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          )}

          {activeTab === "growth" && historicalData && (
            <Box>
              {/* Growth Metrics Cards */}
              <Paper elevation={0} sx={{ p: 4, border: "2px solid var(--theme-border-primary)", borderRadius: "16px", bgcolor: "var(--theme-surface-card)", mb: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 800, color: "var(--theme-text-primary)", mb: 4 }}>📊 5-Year Growth Metrics</Typography>
                <Grid container spacing={3}>
                  {[
                    { label: "Demand Growth", value: historicalData.growthMetrics?.demandGrowth5Year || 0, icon: "📈" },
                    { label: "Salary Growth", value: historicalData.growthMetrics?.salaryGrowth5Year || 0, icon: "💰" },
                    { label: "Jobs Growth", value: historicalData.growthMetrics?.jobsGrowth5Year || 0, icon: "💼" },
                    { label: "Trending Growth", value: historicalData.growthMetrics?.trendingGrowth5Year || 0, icon: "⭐" },
                  ].map(({ label, value, icon }) => (
                    <Grid item xs={12} sm={6} md={3} key={label}>
                      <Paper elevation={0} sx={{ p: 3, textAlign: "center", border: "2px solid var(--theme-border-primary)", borderRadius: "14px", bgcolor: "var(--theme-bg-primary)" }}>
                        <Typography sx={{ fontSize: "2.2rem", mb: 1 }}>{icon}</Typography>
                        <Typography variant="caption" sx={{ color: "var(--theme-text-tertiary)", fontWeight: 700, textTransform: "uppercase", display: "block", fontSize: "0.8rem" }}>{label}</Typography>
                        <Typography variant="h4" sx={{ fontWeight: 900, color: "var(--theme-accent-primary)", mt: 1.5, fontSize: "2rem" }}>{value.toFixed(1)}%</Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Paper>

              {/* Historical Charts */}
              <Grid container spacing={4}>
                {/* Demand Growth Chart */}
                <Grid item xs={12} md={6}>
                  <Paper elevation={0} sx={{ p: 4, border: "2px solid var(--theme-border-primary)", borderRadius: "16px", bgcolor: "var(--theme-surface-card)" }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>📈 5-Year Demand Growth</Typography>
                    <ResponsiveContainer width="100%" height={340}>
                      <LineChart data={historicalChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--theme-border-primary)" />
                        <XAxis dataKey="year" stroke="var(--theme-text-tertiary)" style={{ fontSize: "13px", fontWeight: 600 }} />
                        <YAxis stroke="var(--theme-text-tertiary)" domain={[0, 100]} style={{ fontSize: "13px", fontWeight: 600 }} />
                        <Tooltip contentStyle={{ bgcolor: "var(--theme-bg-primary)", borderRadius: 8, fontSize: "13px", fontWeight: 700 }} />
                        <Line type="monotone" dataKey="demand" stroke="#3b82f6" strokeWidth={4} dot={{ fill: "#3b82f6", r: 6 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </Paper>
                </Grid>

                {/* Salary Growth Chart */}
                <Grid item xs={12} md={6}>
                  <Paper elevation={0} sx={{ p: 4, border: "2px solid var(--theme-border-primary)", borderRadius: "16px", bgcolor: "var(--theme-surface-card)" }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>💰 5-Year Salary Growth (in ₹ Lakhs)</Typography>
                    <ResponsiveContainer width="100%" height={340}>
                      <LineChart data={historicalChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--theme-border-primary)" />
                        <XAxis dataKey="year" stroke="var(--theme-text-tertiary)" style={{ fontSize: "13px", fontWeight: 600 }} />
                        <YAxis stroke="var(--theme-text-tertiary)" style={{ fontSize: "13px", fontWeight: 600 }} />
                        <Tooltip contentStyle={{ bgcolor: "var(--theme-bg-primary)", borderRadius: 8, fontSize: "13px", fontWeight: 700 }} />
                        <Line type="monotone" dataKey="salary" stroke="#10b981" strokeWidth={4} dot={{ fill: "#10b981", r: 6 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </Paper>
                </Grid>

                {/* Jobs Growth Chart */}
                <Grid item xs={12} md={6}>
                  <Paper elevation={0} sx={{ p: 4, border: "2px solid var(--theme-border-primary)", borderRadius: "16px", bgcolor: "var(--theme-surface-card)" }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>💼 5-Year Job Openings Growth</Typography>
                    <ResponsiveContainer width="100%" height={340}>
                      <BarChart data={historicalChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--theme-border-primary)" />
                        <XAxis dataKey="year" stroke="var(--theme-text-tertiary)" style={{ fontSize: "13px", fontWeight: 600 }} />
                        <YAxis stroke="var(--theme-text-tertiary)" style={{ fontSize: "13px", fontWeight: 600 }} />
                        <Tooltip contentStyle={{ bgcolor: "var(--theme-bg-primary)", borderRadius: 8, fontSize: "13px", fontWeight: 700 }} />
                        <Bar dataKey="jobs" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </Paper>
                </Grid>

                {/* Trending Score Chart */}
                <Grid item xs={12} md={6}>
                  <Paper elevation={0} sx={{ p: 4, border: "2px solid var(--theme-border-primary)", borderRadius: "16px", bgcolor: "var(--theme-surface-card)" }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>⭐ 5-Year Trending Score</Typography>
                    <ResponsiveContainer width="100%" height={340}>
                      <LineChart data={historicalChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--theme-border-primary)" />
                        <XAxis dataKey="year" stroke="var(--theme-text-tertiary)" style={{ fontSize: "13px", fontWeight: 600 }} />
                        <YAxis stroke="var(--theme-text-tertiary)" domain={[0, 100]} style={{ fontSize: "13px", fontWeight: 600 }} />
                        <Tooltip contentStyle={{ bgcolor: "var(--theme-bg-primary)", borderRadius: 8, fontSize: "13px", fontWeight: 700 }} />
                        <Line type="monotone" dataKey="trending" stroke="#8b5cf6" strokeWidth={4} dot={{ fill: "#8b5cf6", r: 6 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          )}

          {activeTab === "growth" && !historicalData && (
            <Paper elevation={0} sx={{ p: 4, textAlign: "center", border: "1px solid var(--theme-border-primary)", borderRadius: "12px", bgcolor: "var(--theme-surface-card)" }}>
              <Typography variant="h6" sx={{ color: "var(--theme-text-secondary)", mb: 2 }}>
                📊 Historical Growth Data
              </Typography>
              <Typography variant="body1" sx={{ color: "var(--theme-text-tertiary)" }}>
                No historical growth data available for this course yet. Historical data is generated and stored in our database from real market analysis. Please check back later or search for a different course.
              </Typography>
            </Paper>
          )}

          {activeTab === "composition" && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}><PieCard title="Geographic Distribution" data={regionData} /></Grid>
              <Grid item xs={12} md={6}><PieCard title="Job Role Distribution"   data={roleData}   /></Grid>
            </Grid>
          )}

          {activeTab === "ml insights" && (
            <Paper elevation={0} sx={{ p: 4, border: "2px solid var(--theme-border-primary)", borderRadius: "16px", bgcolor: "var(--theme-surface-card)" }}>
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 4, fontSize: "1.5rem" }}>🤖 ML Predictions & Analysis</Typography>
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 3, fontSize: "1.1rem" }}>Demand Forecasting</Typography>
                  {[
                    { label: "Predicted Demand (6 months)", value: marketData.mlPredictions?.predictedDemand6Months || 0 },
                    { label: "Recommendation Score", value: marketData.mlPredictions?.recommendationScore || 0 },
                  ].map(({ label, value }) => (
                    <Box key={label} sx={{ mb: 4 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1.05rem" }}>{label}</Typography>
                        <Typography variant="h5" sx={{ fontWeight: 900, color: "var(--theme-accent-primary)", fontSize: "1.5rem" }}>{value.toFixed(1)}/100</Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={value}
                        sx={{ height: 12, borderRadius: 6, bgcolor: "var(--theme-bg-secondary)",
                          "& .MuiLinearProgress-bar": { bgcolor: "var(--theme-accent-primary)", borderRadius: 6 } }} />
                    </Box>
                  ))}
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ p: 4, bgcolor: "var(--theme-bg-primary)", borderRadius: "12px", border: "2px solid var(--theme-border-primary)" }}>
                    <Typography variant="caption" sx={{ color: "var(--theme-text-tertiary)", fontWeight: 800, display: "block", textTransform: "uppercase", fontSize: "0.85rem", letterSpacing: "0.5px" }}>Deprecation Risk</Typography>
                    <Typography variant="h3" sx={{ fontWeight: 900, color: "var(--theme-accent-primary)", mt: 2, fontSize: "2.5rem" }}>{marketData.mlPredictions?.deprecationRisk?.toFixed(1) ?? "—"}/100</Typography>
                    <Typography variant="subtitle2" sx={{ color: "var(--theme-text-secondary)", display: "block", mt: 1, fontWeight: 700 }}>
                      {marketData.mlPredictions?.deprecationRisk > 50 ? "⚠️ High risk" : "✅ Low risk"}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ p: 4, bgcolor: "var(--theme-bg-primary)", borderRadius: "12px", border: "2px solid var(--theme-border-primary)" }}>
                    <Typography variant="caption" sx={{ color: "var(--theme-text-tertiary)", fontWeight: 800, display: "block", textTransform: "uppercase", fontSize: "0.85rem", letterSpacing: "0.5px" }}>Career Path Alignment</Typography>
                    <Typography variant="h3" sx={{ fontWeight: 900, color: "var(--theme-accent-primary)", mt: 2, fontSize: "2.5rem" }}>{marketData.mlPredictions?.careerPathAlignment?.toFixed(1) ?? "—"}/100</Typography>
                    <Typography variant="subtitle2" sx={{ color: "var(--theme-text-secondary)", display: "block", mt: 1, fontWeight: 700 }}>Career viability score</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          )}

          {activeTab === "sentiment" && (
            <Paper elevation={0} sx={{ p: 5, border: "2px solid var(--theme-border-primary)", borderRadius: "16px", bgcolor: "var(--theme-surface-card)" }}>
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 4, fontSize: "1.5rem" }}>💬 Community Sentiment Analysis</Typography>
              <Box sx={{ textAlign: "center", mb: 5, p: 4, bgcolor: "var(--theme-bg-primary)", borderRadius: "14px", border: "2px solid var(--theme-border-primary)" }}>
                <Typography variant="h2" sx={{ fontWeight: 900, color: "var(--theme-accent-primary)", fontSize: "4rem", lineHeight: 1 }}>
                  {(marketData.communitySentiment?.sentimentScore || 0).toFixed(1)}%
                </Typography>
                <Typography variant="h5" sx={{ color: "var(--theme-text-secondary)", mt: 2, fontWeight: 700 }}>
                  {marketData.communitySentiment?.overallSentiment || "Neutral"} Sentiment
                </Typography>
              </Box>
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={6}>
                  <Box sx={{ p: 4, bgcolor: "rgba(16,185,129,0.1)", borderRadius: "12px", textAlign: "center", border: "2px solid rgba(16,185,129,0.3)" }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: "#10b981", fontSize: "3rem", mb: 1 }}>👍</Typography>
                    <Typography variant="subtitle1" sx={{ display: "block", fontWeight: 800, color: "#10b981", fontSize: "1rem" }}>Positive Mentions</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 900, color: "#10b981", mt: 1 }}>+</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ p: 4, bgcolor: "rgba(239,68,68,0.1)", borderRadius: "12px", textAlign: "center", border: "2px solid rgba(239,68,68,0.3)" }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: "#ef4444", fontSize: "3rem", mb: 1 }}>👎</Typography>
                    <Typography variant="subtitle1" sx={{ display: "block", fontWeight: 800, color: "#ef4444", fontSize: "1rem" }}>Negative Mentions</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 900, color: "#ef4444", mt: 1 }}>−</Typography>
                  </Box>
                </Grid>
              </Grid>
              <Box sx={{ p: 4, bgcolor: "var(--theme-bg-primary)", borderRadius: "12px", mb: 2, border: "2px solid var(--theme-border-primary)" }}>
                <Typography variant="h6" sx={{ display: "block", color: "var(--theme-text-tertiary)", fontWeight: 800, mb: 3, fontSize: "0.95rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>Community Engagement</Typography>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1rem" }}>Engagement Score</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 900, color: "var(--theme-accent-primary)", fontSize: "1.5rem" }}>{marketData.communitySentiment?.communityEngagement?.toFixed(1) ?? "—"}/100</Typography>
                </Box>
                <LinearProgress variant="determinate" value={marketData.communitySentiment?.communityEngagement || 0}
                  sx={{ height: 10, borderRadius: 5, bgcolor: "var(--theme-border-primary)",
                    "& .MuiLinearProgress-bar": { bgcolor: "var(--theme-accent-primary)", borderRadius: 5 } }} />
              </Box>
            </Paper>
          )}
        </>
      )}

      {!marketData && !loading && (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h6" sx={{ color: "var(--theme-text-tertiary)" }}>
            🔍 Enter a course name above to see market insights
          </Typography>
        </Box>
      )}
    </Container>
  );
}
