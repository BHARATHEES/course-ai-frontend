import React, { useState } from "react";
import { Card, CardContent, Typography, Box, Tabs, Tab, Paper } from "@mui/material";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BarChartIcon from '@mui/icons-material/BarChart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import BusinessIcon from '@mui/icons-material/Business';
import WorkIcon from '@mui/icons-material/Work';
import AssignmentIcon from '@mui/icons-material/Assignment';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart,
  Area,
  AreaChart
} from "recharts";

/**
 * ChartSection Component
 * Displays course analytics and insights through various chart types
 * - Popularity trends over time
 * - Difficulty distribution
 * - Salary insights
 * - Market demand analysis
 * - Comprehensive course metrics
 */
export default function ChartSection({ courseName = "All Courses", analysisData = null }) {
  const [activeTab, setActiveTab] = useState(0);

  // Sample data - In production, this should come from the API
  const popularityTrendData = [
    { month: "Jan", searches: 120, interest: 65 },
    { month: "Feb", searches: 150, interest: 78 },
    { month: "Mar", searches: 180, interest: 85 },
    { month: "Apr", searches: 220, interest: 95 },
    { month: "May", searches: 280, interest: 110 },
    { month: "Jun", searches: 350, interest: 130 }
  ];

  const difficultyData = [
    { name: "Easy", value: 15 },
    { name: "Medium", value: 45 },
    { name: "Hard", value: 30 },
    { name: "Expert", value: 10 }
  ];

  const salaryData = [
    { experience: "Fresher", avgSalary: 35000 },
    { experience: "1-2 Years", avgSalary: 55000 },
    { experience: "3-5 Years", avgSalary: 85000 },
    { experience: "5-10 Years", avgSalary: 130000 },
    { experience: "10+ Years", avgSalary: 180000 }
  ];

  const demandData = [
    { company: "Tech Giants", growth: 95 },
    { company: "Startups", growth: 110 },
    { company: "Finance", growth: 75 },
    { company: "Healthcare", growth: 85 },
    { company: "Consulting", growth: 60 }
  ];

  const jobMarketData = [
    { month: "Jan", openings: 250, applicants: 800 },
    { month: "Feb", openings: 310, applicants: 920 },
    { month: "Mar", openings: 380, applicants: 1100 },
    { month: "Apr", openings: 420, applicants: 1250 },
    { month: "May", openings: 500, applicants: 1400 },
    { month: "Jun", openings: 580, applicants: 1550 }
  ];

  // Course metrics radar data - from actual analysis if available
  const courseMetricsData = analysisData ? [
    { 
      metric: "Popularity", 
      value: analysisData.popularityScore || 70,
      fullMark: 100 
    },
    { 
      metric: "Market Demand", 
      value: analysisData.marketDemand === "High" ? 90 : analysisData.marketDemand === "Medium" ? 60 : 30,
      fullMark: 100 
    },
    { 
      metric: "Trending", 
      value: analysisData.trendingScore || 75,
      fullMark: 100 
    },
    { 
      metric: "Salary Potential", 
      value: analysisData.salaryPotential?.experienced ? Math.min((analysisData.salaryPotential.experienced / 200) * 100, 100) : 65,
      fullMark: 100 
    },
    { 
      metric: "Career Growth", 
      value: 80,
      fullMark: 100 
    }
  ] : [];

  const COLORS = ["var(--theme-accent-primary)", "var(--theme-status-success)", "var(--theme-status-warning)", "var(--theme-status-error)"];

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const tooltipStyle = {
    backgroundColor: 'var(--theme-surface-card)',
    border: '1px solid var(--theme-border-primary)',
    borderRadius: '8px',
    color: 'var(--theme-text-primary)',
    padding: '8px 12px'
  };

  return (
    <Card id="chart-section-card" sx={{ mt: 4, borderRadius: 2, border: '1px solid var(--theme-border-primary)', boxShadow: '0 2px 8px rgba(0,0,0,0.3)', background: 'var(--theme-surface-card)' }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <BarChartIcon sx={{ color: 'var(--theme-accent-primary)', fontSize: 28 }} />
          <Typography id="chart-section-title" variant="h6" sx={{ fontWeight: 700, color: 'var(--theme-text-primary)', mb: 0 }}>
            Market Analytics {courseName !== "All Courses" && `- ${courseName}`}
          </Typography>
        </Box>

        <Paper sx={{ borderBottom: 1, borderColor: 'var(--theme-border-primary)', bgcolor: 'var(--theme-surface-card)', borderRadius: 2, border: '1px solid var(--theme-border-primary)' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{
              '& .MuiTabs-indicator': {
                backgroundColor: 'var(--theme-accent-primary)',
                height: 3
              },
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: 'var(--font-small)',
                color: 'var(--theme-text-secondary)',
                display: 'flex',
                gap: 1,
                '&.Mui-selected': {
                  color: 'var(--theme-text-primary)'
                }
              }
            }}
          >
            <Tab icon={<TrendingUpIcon sx={{ fontSize: 20 }} />} label="Popularity" iconPosition="start" />
            <Tab icon={<BarChartIcon sx={{ fontSize: 20 }} />} label="Difficulty" iconPosition="start" />
            <Tab icon={<AttachMoneyIcon sx={{ fontSize: 20 }} />} label="Salary" iconPosition="start" />
            <Tab icon={<BusinessIcon sx={{ fontSize: 20 }} />} label="Demand" iconPosition="start" />
            <Tab icon={<WorkIcon sx={{ fontSize: 20 }} />} label="Job Market" iconPosition="start" />
            {analysisData && <Tab icon={<AssignmentIcon sx={{ fontSize: 20 }} />} label="Metrics" iconPosition="start" />}
          </Tabs>
        </Paper>

        <Box sx={{ mt: 3 }}>
          {/* Popularity Trend Chart */}
          {activeTab === 0 && (
            <Box>
              <Typography id="chart-popularity-label" variant="subtitle2" sx={{ color: 'var(--theme-text-tertiary)', mb: 2, fontWeight: 600 }}>
                Search Interest Over Time (Last 6 Months)
              </Typography>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={popularityTrendData}>
                  <defs>
                    <linearGradient id="colorSearches" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--theme-accent-primary)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--theme-accent-primary)" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorInterest" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--theme-status-success)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--theme-status-success)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--theme-border-primary)" />
                  <XAxis dataKey="month" stroke="var(--theme-text-tertiary)" />
                  <YAxis stroke="var(--theme-text-tertiary)" />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="searches"
                    stroke="var(--theme-accent-primary)"
                    fillOpacity={1}
                    fill="url(#colorSearches)"
                    name="Searches"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="interest"
                    stroke="var(--theme-status-success)"
                    fillOpacity={1}
                    fill="url(#colorInterest)"
                    name="Interest"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          )}

          {/* Difficulty Distribution */}
          {activeTab === 1 && (
            <Box>
              <Typography id="chart-difficulty-label" variant="subtitle2" sx={{ color: 'var(--theme-text-tertiary)', mb: 2, fontWeight: 600 }}>
                Course Difficulty Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={difficultyData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="var(--theme-accent-primary)"
                    dataKey="value"
                  >
                    {difficultyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          )}

          {/* Salary Insights */}
          {activeTab === 2 && (
            <Box>
              <Typography id="chart-salary-label" variant="subtitle2" sx={{ color: 'var(--theme-text-tertiary)', mb: 2, fontWeight: 600 }}>
                Average Salary by Experience Level (Annual)
              </Typography>
              <ResponsiveContainer width="100%" height={350}>
                <ComposedChart data={salaryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--theme-border-primary)" />
                  <XAxis dataKey="experience" stroke="var(--theme-text-tertiary)" angle={-45} textAnchor="end" height={80} />
                  <YAxis stroke="var(--theme-text-tertiary)" />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(value) => `₹${value.toLocaleString()}`}
                  />
                  <Legend />
                  <Bar dataKey="avgSalary" fill="var(--theme-status-warning)" radius={[8, 8, 0, 0]} name="Avg Salary" />
                  <Line type="monotone" dataKey="avgSalary" stroke="var(--theme-accent-primary)" strokeWidth={2} name="Trend" />
                </ComposedChart>
              </ResponsiveContainer>
            </Box>
          )}

          {/* Market Demand */}
          {activeTab === 3 && (
            <Box>
              <Typography id="chart-demand-label" variant="subtitle2" sx={{ color: 'var(--theme-text-tertiary)', mb: 2, fontWeight: 600 }}>
                Sector-wise Demand Growth (%)
              </Typography>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={demandData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--theme-border-primary)" />
                  <XAxis type="number" stroke="var(--theme-text-tertiary)" />
                  <YAxis dataKey="company" type="category" width={100} stroke="var(--theme-text-tertiary)" />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(value) => `${value}% Growth`}
                  />
                  <Bar dataKey="growth" fill="var(--theme-status-success)" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          )}

          {/* Job Market */}
          {activeTab === 4 && (
            <Box>
              <Typography id="chart-jobmarket-label" variant="subtitle2" sx={{ color: 'var(--theme-text-tertiary)', mb: 2, fontWeight: 600 }}>
                Job Openings vs Applications (Last 6 Months)
              </Typography>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={jobMarketData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--theme-border-primary)" />
                  <XAxis dataKey="month" stroke="var(--theme-text-tertiary)" />
                  <YAxis stroke="var(--theme-text-tertiary)" />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="openings"
                    stroke="var(--theme-accent-primary)"
                    dot={{ fill: 'var(--theme-accent-primary)', r: 4 }}
                    activeDot={{ r: 6 }}
                    strokeWidth={2}
                    name="Job Openings"
                  />
                  <Line
                    type="monotone"
                    dataKey="applicants"
                    stroke="var(--theme-status-error)"
                    dot={{ fill: 'var(--theme-status-error)', r: 4 }}
                    activeDot={{ r: 6 }}
                    strokeWidth={2}
                    name="Applications"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          )}

          {/* Course Metrics - Radar Chart */}
          {activeTab === 5 && analysisData && (
            <Box>
              <Typography id="chart-metrics-label" variant="subtitle2" sx={{ color: 'var(--theme-text-tertiary)', mb: 2, fontWeight: 600 }}>
                Course Quality Metrics - {courseName}
              </Typography>
              <ResponsiveContainer width="100%" height={350}>
                <RadarChart data={courseMetricsData}>
                  <PolarGrid stroke="var(--theme-border-primary)" />
                  <PolarAngleAxis dataKey="metric" stroke="var(--theme-text-tertiary)" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="var(--theme-text-tertiary)" />
                  <Radar name="Score" dataKey="value" stroke="var(--theme-accent-primary)" fill="var(--theme-accent-primary)" fillOpacity={0.3} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(value) => `${value}/100`} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </Box>
          )}
        </Box>

        {/* Footer Note */}
        <Box id="chart-footer-note" sx={{ mt: 3, p: 2, bgcolor: 'var(--theme-surface-card)', borderRadius: 2, border: '1px solid var(--theme-border-primary)' }}>
          <Typography variant="caption" sx={{ color: 'var(--theme-accent-primary)', fontWeight: 600 }}>
            💡 Data is updated monthly based on market analysis and user interactions
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}