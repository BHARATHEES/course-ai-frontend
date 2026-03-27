import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Chip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider
} from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import SchoolIcon from "@mui/icons-material/School";
import BusinessIcon from "@mui/icons-material/Business";

/**
 * Market Insights Component
 * Displays comprehensive real-time market analysis with ML insights
 */
const MarketInsights = ({ courseName }) => {
  const [marketData, setMarketData] = useState(null);
  const [mlInsights, setMLInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  const COLORS = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#FFA07A",
    "#98D8C8",
    "#6C5CE7",
    "#A29BFE",
    "#FD79A8"
  ];

  /**
   * Fetch market analysis data
   */
  useEffect(() => {
    if (!courseName) return;

    const fetchMarketData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch market analysis with correct query parameter format
        const marketRes = await fetch(
          `http://localhost:10000/api/market-analysis?courseName=${encodeURIComponent(courseName)}`
        );
        if (!marketRes.ok) throw new Error("Failed to fetch market analysis");
        const marketJson = await marketRes.json();
        
        // Response structure: { success, marketData, insights, dataSource, confidence, ... }
        if (marketJson.success) {
          setMarketData(marketJson.marketData);
          setMLInsights(marketJson.insights || []);
        } else {
          setError(marketJson.error || "Failed to fetch market data");
        }
      } catch (err) {
        console.error("Error fetching market data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
  }, [courseName]);

  // Loading state
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Error state
  if (error) {
    return <Alert severity="error">Error loading market insights: {error}</Alert>;
  }

  if (!marketData || !mlInsights) {
    return <Typography>No market data available</Typography>;
  }

  const jobMarket = marketData.marketData?.jobMarket || {};
  const popularity = marketData.marketData?.popularity || {};
  const salary = marketData.marketData?.salary || {};
  const trends = marketData.marketData?.trends || {};
  const sentiment = mlInsights.sentimentAnalysis || {};
  const difficulty = mlInsights.difficultyAnalysis || {};
  const salaryProjection = mlInsights.salaryProjection || {};

  /**
   * Tab Panel Component
   */
  const TabPanel = ({ children, value, index }) => (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );

  /**
   * Job Market Distribution Pie Chart
   */
  const JobMarketPie = () => {
    const jobData = jobMarket.topJobTitles || [];
    return (
      <Card sx={{ mb: 3 }}>
        <CardHeader
          title="Job Titles Distribution"
          subheader="Market breakdown by job roles"
        />
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={jobData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ title, percentage }) => `${title}: ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="percentage"
              >
                {jobData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  };

  /**
   * Experience Level Distribution
   */
  const ExperienceLevelPie = () => {
    const experienceData = jobMarket.experienceLevelDemand || {};
    const data = Object.entries(experienceData).map(([key, value]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value: value
    }));

    return (
      <Card sx={{ mb: 3 }}>
        <CardHeader
          title="Experience Level Demand"
          subheader="Market demand by experience"
        />
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  };

  /**
   * Salary Trajectory Chart
   */
  const SalaryProjectionChart = () => {
    const data = salaryProjection.projections || [];
    return (
      <Card sx={{ mb: 3 }}>
        <CardHeader
          title="5-Year Salary Projection"
          subheader="Estimated career earnings growth"
        />
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value}k`} />
              <Legend />
              <Line
                type="monotone"
                dataKey="salary"
                stroke="#8884d8"
                name="Salary (k USD)"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  };

  /**
   * Salary by Region Pie Chart
   */
  const SalaryByRegion = () => {
    const regionData = salary.regionSalaryDifference || {};
    const data = Object.entries(regionData).map(([region, value]) => ({
      name: region,
      value: value
    }));

    return (
      <Card sx={{ mb: 3 }}>
        <CardHeader
          title="Salary by Region"
          subheader="Average salary differences across regions"
        />
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: $${value}k`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${value}k`} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  };

  /**
   * Difficulty Breakdown
   */
  const DifficultyBreakdown = () => {
    const diffBreakdown = difficulty.difficultyBreakdown || {};
    return (
      <Card sx={{ mb: 3 }}>
        <CardHeader
          title="Learning Difficulty Components"
          subheader={`Overall Level: ${difficulty.level}`}
        />
        <CardContent>
          {Object.entries(diffBreakdown).map(([component, score]) => (
            <Box key={component} sx={{ mb: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1
                }}
              >
                <Typography variant="body2">
                  {component.replace(/([A-Z])/g, " $1").trim()}
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  {score}/10
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={(score / 10) * 100}
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>
          ))}
        </CardContent>
      </Card>
    );
  };

  /**
   * Trending Keywords
   */
  const TrendingKeywords = () => {
    const keywords = trends.keywordTrend || [];
    return (
      <Card sx={{ mb: 3 }}>
        <CardHeader
          title="Trending Keywords"
          subheader="Search volume trends"
        />
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell>Keyword</TableCell>
                  <TableCell align="right">Search Volume</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {keywords.map((item, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{item.keyword}</TableCell>
                    <TableCell align="right">{item.volume.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    );
  };

  /**
   * Market Overview Cards
   */
  const MarketOverviewCards = () => (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {/* Demand Score */}
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent sx={{ textAlign: "center" }}>
            <BusinessIcon sx={{ fontSize: 40, color: "#45B7D1" }} />
            <Typography variant="h6" sx={{ mt: 1 }}>
              Demand Score
            </Typography>
            <Typography variant="h4" sx={{ mt: 1, fontWeight: "bold" }}>
              {jobMarket.demandScore || 0}/100
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Popularity */}
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent sx={{ textAlign: "center" }}>
            <TrendingUpIcon sx={{ fontSize: 40, color: "#FFA07A" }} />
            <Typography variant="h6" sx={{ mt: 1 }}>
              Popularity
            </Typography>
            <Typography variant="h4" sx={{ mt: 1, fontWeight: "bold" }}>
              {popularity.percentageOfSearches || 0}%
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Avg Salary */}
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent sx={{ textAlign: "center" }}>
            <AttachMoneyIcon sx={{ fontSize: 40, color: "#98D8C8" }} />
            <Typography variant="h6" sx={{ mt: 1 }}>
              Avg Salary
            </Typography>
            <Typography variant="h4" sx={{ mt: 1, fontWeight: "bold" }}>
              ${salary.midLevel?.average || 0}k
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Sentiment */}
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent sx={{ textAlign: "center" }}>
            <SchoolIcon sx={{ fontSize: 40, color: "#6C5CE7" }} />
            <Typography variant="h6" sx={{ mt: 1 }}>
              Market Sentiment
            </Typography>
            <Typography variant="h5" sx={{ mt: 1, fontWeight: "bold" }}>
              {sentiment.sentiment || "Neutral"}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  return (
    <Box sx={{ width: "100%", p: 2 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
        📊 Market Analysis: {courseName}
      </Typography>

      <MarketOverviewCards />

      <Card>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Tab label="Job Market" />
          <Tab label="Salary Analysis" />
          <Tab label="Learning Path" />
          <Tab label="Trends" />
          <Tab label="Skills & Entities" />
        </Tabs>

        {/* TAB 1: Job Market */}
        <TabPanel value={activeTab} index={0}>
          <JobMarketPie />
          <ExperienceLevelPie />
          <Card>
            <CardHeader title="Market Metrics" />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    Total Job Postings
                  </Typography>
                  <Typography variant="h6">
                    {jobMarket.totalPostings?.toLocaleString() || 0}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    Growth Rate
                  </Typography>
                  <Typography variant="h6">{jobMarket.growthRate}%</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </TabPanel>

        {/* TAB 2: Salary Analysis */}
        <TabPanel value={activeTab} index={1}>
          <SalaryProjectionChart />
          <SalaryByRegion />
          <Card>
            <CardHeader title="Salary Levels" />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Typography variant="body2" color="textSecondary">
                    Entry Level
                  </Typography>
                  <Typography variant="h6">
                    {salary.entryLevel?.salary}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="body2" color="textSecondary">
                    Mid Level
                  </Typography>
                  <Typography variant="h6">
                    {salary.midLevel?.salary}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="body2" color="textSecondary">
                    Senior Level
                  </Typography>
                  <Typography variant="h6">
                    {salary.seniorLevel?.salary}
                  </Typography>
                </Grid>
              </Grid>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body2" color="textSecondary">
                Salary Growth Potential
              </Typography>
              <Typography variant="h6">
                {salary.salaryGrowthPotential}
              </Typography>
            </CardContent>
          </Card>
        </TabPanel>

        {/* TAB 3: Learning Path */}
        <TabPanel value={activeTab} index={2}>
          <DifficultyBreakdown />
          <Card>
            <CardHeader
              title="Recommended Learning Path"
              subheader={`Estimated ${difficulty.estimatedHoursToMastery?.toFixed(0)} hours to master`}
            />
            <CardContent>
              {difficulty.recommendedLearningPath?.map((step, idx) => (
                <Box key={idx} sx={{ mb: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                  >
                    <Typography variant="body1" fontWeight="bold">
                      Step {step.step}: {step.content}
                    </Typography>
                    <Chip label={step.duration} variant="outlined" />
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>
        </TabPanel>

        {/* TAB 4: Trends */}
        <TabPanel value={activeTab} index={3}>
          <TrendingKeywords />
          <Card>
            <CardHeader title="Market Trends" />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    Trend Direction
                  </Typography>
                  <Typography variant="h6">{trends.trendDirection}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    Market Sentiment
                  </Typography>
                  <Typography variant="h6">{sentiment.sentiment}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    Future Outlook
                  </Typography>
                  <Typography variant="h6">{trends.futureOutlook}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    Investment Rating
                  </Typography>
                  <Typography variant="h6">
                    {trends.investmentRating}/5 ⭐
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </TabPanel>

        {/* TAB 5: Skills & Entities */}
        <TabPanel value={activeTab} index={4}>
          <Card sx={{ mb: 3 }}>
            <CardHeader title="Key Skills Required" />
            <CardContent>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1 }}>
                  Primary Skills
                </Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  {mlInsights.entityExtraction?.primarySkills?.map((skill, idx) => (
                    <Chip key={idx} label={skill} color="primary" />
                  ))}
                </Box>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1 }}>
                  Secondary Skills
                </Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  {mlInsights.entityExtraction?.secondarySkills?.map((skill, idx) => (
                    <Chip key={idx} label={skill} variant="outlined" />
                  ))}
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Related Courses" />
            <CardContent>
              {mlInsights.entityExtraction?.relatedCourses?.map((course, idx) => (
                <Chip
                  key={idx}
                  label={course}
                  variant="outlined"
                  sx={{ m: 0.5 }}
                />
              ))}
            </CardContent>
          </Card>
        </TabPanel>
      </Card>
    </Box>
  );
};

export default MarketInsights;
