import React, { useState } from "react";
import {
  Container, Paper, Typography, Box, Button, Stack,
  TextField, Chip, Alert, CircularProgress, Grid,
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Tabs, Tab, IconButton,
} from "@mui/material";
import { styled }           from "@mui/material/styles";
import AddIcon              from "@mui/icons-material/Add";
import ArrowBackIcon        from "@mui/icons-material/ArrowBack";
import EmojiEventsIcon      from "@mui/icons-material/EmojiEvents";
import CompareArrowsIcon    from "@mui/icons-material/CompareArrows";
import TableChartIcon       from "@mui/icons-material/TableChart";
import BarChartIcon         from "@mui/icons-material/BarChart";
import { useNavigate }      from "react-router-dom";
import {
  BarChart, Bar, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import api from "../services/api";

const GradientBtn = styled(Button)({
  background: "var(--theme-accent-primary)", color: "white", fontWeight: 700,
  textTransform: "uppercase", borderRadius: "20px",
  "&:hover": { background: "var(--theme-accent-secondary)", transform: "translateY(-2px)" },
});

const StyledInput = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    background: "var(--theme-bg-secondary)", borderRadius: "8px",
    "& fieldset": { borderColor: "var(--theme-border-primary)" },
    "&:hover fieldset": { borderColor: "var(--theme-accent-primary)" },
    "&.Mui-focused fieldset": { borderColor: "var(--theme-accent-primary)" },
  },
  "& .MuiInputLabel-root": { color: "var(--theme-text-tertiary)", "&.Mui-focused": { color: "var(--theme-accent-primary)" } },
  "& .MuiOutlinedInput-input": { color: "var(--theme-text-primary)" },
});

const GlassCard = styled(Paper)({
  background: "var(--theme-surface-card)", border: "1px solid var(--theme-border-primary)",
  borderRadius: "10px", boxShadow: "var(--theme-shadow)",
});

const tooltipStyle = {
  backgroundColor: "var(--theme-surface-card)", border: "1px solid var(--theme-border-primary)",
  borderRadius: "8px", color: "var(--theme-text-primary)",
};

// Score heuristic based on analysis text + structured fields
const scoreResult = (data) => {
  if (!data) return 0;
  let s = 50;
  const t = ((data.analysis?.summary || data.analysis || "") + "").toLowerCase();
  if (data.analysis?.marketDemand === "High")         s += 20;
  else if (data.analysis?.marketDemand === "Moderate") s += 10;
  if (data.analysis?.popularityScore) s += Math.min(20, data.analysis.popularityScore / 5);
  if (t.includes("high demand") || t.includes("popular")) s += 8;
  if (t.includes("abundant") || t.includes("many jobs")) s += 7;
  if (data.analysis?.learningDifficulty === "Advanced") s -= 3;
  return Math.min(100, Math.max(10, Math.round(s)));
};

export default function ComparisonPage() {
  const [input,     setInput]     = useState("");
  const [courseList,setCourseList]= useState([]);
  const [results,   setResults]   = useState({});
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");
  const [done,      setDone]      = useState(false);
  const [tabIdx,    setTabIdx]    = useState(0);
  const navigate = useNavigate();

  const addCourse = () => {
    if (!input.trim())              { setError("Enter a course name"); return; }
    if (input.trim().length < 2)    { setError("Name too short"); return; }
    if (courseList.length >= 5)     { setError("Maximum 5 courses"); return; }
    if (courseList.includes(input.trim())) { setError("Already added"); return; }
    setCourseList([...courseList, input.trim()]);
    setInput(""); setError("");
  };

  const analyseAll = async () => {
    if (courseList.length < 2) { setError("Add at least 2 courses"); return; }
    setLoading(true); setError("");
    
    try {
      // Try new enhanced comparison API first
      const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:10000";
      const response = await fetch(`${BASE_URL}/api/compare-courses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache"
        },
        body: JSON.stringify({ courses: courseList })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Use enhanced comparison data
          const enhancedResults = {};
          for (const course of courseList) {
            const lower = course.toLowerCase();
            enhancedResults[course] = {
              analysis: {
                summary: data.data.comparison?.courses?.[lower]?.definition || "Course analysis",
                marketDemand: data.data.insights?.[lower]?.demand?.demandScore > 85 ? "High" : "Moderate",
                trendingScore: data.data.insights?.[lower]?.trends?.trendingScore || 70,
                salaryPotential: {
                  beginner: Math.round((data.data.insights?.[lower]?.salary?.averageBeginnerINR || 600000) / 100000),
                  experienced: Math.round((data.data.insights?.[lower]?.salary?.averageExperiencedINR || 1200000) / 100000)
                },
                learningDifficulty: data.data.comparison?.courses?.[lower]?.difficultyLevel || "Intermediate",
                jobRoles: data.data.comparison?.courses?.[lower]?.topJobRoles || [],
                skills: data.data.comparison?.courses?.[lower]?.keySkills || [],
                popularityScore: data.data.rankings?.find(r => r.name === lower)?.score || 75
              },
              enhanced: true,
              fullData: data.data
            };
          }
          setResults(enhancedResults);
          setDone(true);
          setLoading(false);
          return;
        }
      }
    } catch (err) {
      console.warn("Enhanced comparison API failed, falling back to basic analysis");
    }

    // Fallback to basic analysis
    const res = {};
    for (const name of courseList) {
      const r = await api.analyzeCourse(name);
      res[name] = r.error ? null : r;
    }
    setResults(res); setDone(true); setLoading(false);
  };

  const ranking = Object.entries(results)
    .filter(([, v]) => v)
    .map(([name, data]) => ({ name, data, score: scoreResult(data) }))
    .sort((a, b) => b.score - a.score);

  const chartData = ranking.map((r) => ({
    name: r.name.length > 14 ? r.name.slice(0, 14) + "…" : r.name,
    score:    r.score,
    demand:   r.data.analysis?.marketDemand === "High" ? 90 : r.data.analysis?.marketDemand === "Moderate" ? 60 : 35,
    trending: r.data.analysis?.trendingScore || 70,
  }));

  const radarData = ranking[0] ? [
    { metric: "Overall",   value: ranking[0].score },
    { metric: "Demand",    value: ranking[0].data.analysis?.marketDemand === "High" ? 90 : 60 },
    { metric: "Trending",  value: ranking[0].data.analysis?.trendingScore || 70 },
    { metric: "Salary",    value: Math.min(100, ((ranking[0].data.analysis?.salaryPotential?.experienced || 80) / 200) * 100) },
    { metric: "Growth",    value: 80 },
  ] : [];

  return (
    <Container maxWidth="lg" sx={{ mt: 3, mb: 4 }}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
        <IconButton onClick={() => navigate("/")}
          sx={{ bgcolor: "rgba(59,130,246,0.1)", border: "1px solid var(--theme-border-primary)", color: "var(--theme-accent-primary)" }}>
          <ArrowBackIcon />
        </IconButton>
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CompareArrowsIcon sx={{ color: "var(--theme-accent-primary)", fontSize: 26 }} />
            <Typography variant="h5" sx={{ fontWeight: 700, color: "var(--theme-text-primary)" }}>
              Course Comparison
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: "var(--theme-text-secondary)" }}>
            Add 2–5 courses and compare them side by side
          </Typography>
        </Box>
      </Box>

      {!done ? (
        /* ── INPUT ── */
        <GlassCard sx={{ p: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "var(--theme-text-primary)", mb: 3 }}>
            Step 1: Add courses (min 2, max 5)
          </Typography>

          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            <StyledInput fullWidth label="Course Name"
              placeholder="e.g. Python, Machine Learning"
              value={input} onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCourse()}
              error={!!error} helperText={error} />
            <GradientBtn startIcon={<AddIcon />} onClick={addCourse} sx={{ px: 3, whiteSpace: "nowrap" }}>
              Add
            </GradientBtn>
          </Box>

          {courseList.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, color: "var(--theme-text-secondary)", mb: 1.5 }}>
                Added ({courseList.length}/5):
              </Typography>
              <Stack direction="row" flexWrap="wrap" gap={1.5} useFlexGap>
                {courseList.map((c, i) => (
                  <Chip key={i} label={`${i + 1}. ${c}`}
                    onDelete={() => setCourseList(courseList.filter((_, j) => j !== i))}
                    sx={{ bgcolor: "rgba(59,130,246,0.1)", color: "var(--theme-accent-primary)", fontWeight: 600 }} />
                ))}
              </Stack>
            </Box>
          )}

          <GradientBtn fullWidth onClick={analyseAll}
            disabled={loading || courseList.length < 2}
            sx={{ py: 2, fontSize: "1rem", fontWeight: 800 }}
            startIcon={loading ? <CircularProgress size={22} color="inherit" /> : <EmojiEventsIcon />}>
            {loading ? "Analysing…" : "Analyse All Courses"}
          </GradientBtn>

          {courseList.length === 1 && (
            <Alert severity="info" sx={{ mt: 2 }}>Add at least 1 more course to compare.</Alert>
          )}
        </GlassCard>
      ) : (
        /* ── RESULTS ── */
        <Box>
          {/* Rankings */}
          <GlassCard sx={{ p: 3, mb: 4 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <EmojiEventsIcon sx={{ color: "var(--theme-accent-primary)", fontSize: 26 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: "var(--theme-text-primary)" }}>
                  Rankings
                </Typography>
              </Box>
              <GradientBtn size="small" onClick={() => { setDone(false); setCourseList([]); setResults({}); }}>
                New Comparison
              </GradientBtn>
            </Box>
            <Grid container spacing={2}>
              {ranking.map((item, idx) => (
                <Grid item xs={12} sm={6} md={4} key={item.name}>
                  <Box sx={{
                    p: 3, borderRadius: "10px",
                    bgcolor: idx === 0 ? "rgba(16,185,129,0.08)" : "var(--theme-bg-secondary)",
                    border: `1.5px solid ${idx === 0 ? "#10b981" : "var(--theme-border-primary)"}`,
                    position: "relative",
                  }}>
                    {idx === 0 && (
                      <Box sx={{ position: "absolute", top: -12, right: 16,
                        bgcolor: "#f59e0b", color: "white", px: 2, py: 0.5,
                        borderRadius: "20px", fontWeight: 700, fontSize: "0.7rem" }}>
                        ⭐ BEST
                      </Box>
                    )}
                    <Typography variant="h6" sx={{ fontWeight: 700, mt: idx === 0 ? 1 : 0,
                      color: idx === 0 ? "#10b981" : "var(--theme-accent-primary)" }}>
                      #{idx + 1} {item.name}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: "var(--theme-text-secondary)" }}>Score</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700, fontSize: "1.1rem",
                          color: idx === 0 ? "#10b981" : "var(--theme-accent-primary)" }}>
                          {item.score}%
                        </Typography>
                      </Box>
                      <Box sx={{ height: 8, bgcolor: "var(--theme-bg-primary)", borderRadius: 4, overflow: "hidden" }}>
                        <Box sx={{ height: "100%", width: `${item.score}%`,
                          bgcolor: idx === 0 ? "#10b981" : "var(--theme-accent-primary)", transition: "width 0.5s" }} />
                      </Box>
                    </Box>
                    {item.data.analysis?.marketDemand && (
                      <Typography variant="caption" sx={{ color: "var(--theme-text-tertiary)", display: "block", mt: 1 }}>
                        Demand: {item.data.analysis.marketDemand}
                      </Typography>
                    )}
                  </Box>
                </Grid>
              ))}
            </Grid>
          </GlassCard>

          {/* Charts */}
          <GlassCard sx={{ p: 3, mb: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
              <BarChartIcon sx={{ color: "var(--theme-accent-primary)", fontSize: 26 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: "var(--theme-text-primary)" }}>Visual Comparison</Typography>
            </Box>
            <Tabs value={tabIdx} onChange={(_, v) => setTabIdx(v)}
              sx={{ mb: 3, "& .MuiTabs-indicator": { bgcolor: "var(--theme-accent-primary)" },
                "& .MuiTab-root": { textTransform: "none", fontWeight: 600, color: "var(--theme-text-secondary)", "&.Mui-selected": { color: "var(--theme-text-primary)" } } }}>
              <Tab label="Score Comparison" />
              <Tab label="Metrics Radar" />
            </Tabs>

            {tabIdx === 0 && (
              <ResponsiveContainer width="100%" height={380}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--theme-border-primary)" />
                  <XAxis dataKey="name" stroke="var(--theme-text-tertiary)" />
                  <YAxis stroke="var(--theme-text-tertiary)" domain={[0, 100]} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend />
                  <Bar dataKey="score"    name="Overall Score" fill="var(--theme-accent-primary)" radius={[6,6,0,0]} />
                  <Bar dataKey="demand"   name="Market Demand" fill="#10b981" radius={[6,6,0,0]} />
                  <Bar dataKey="trending" name="Trending"      fill="#f59e0b" radius={[6,6,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
            {tabIdx === 1 && radarData.length > 0 && (
              <ResponsiveContainer width="100%" height={380}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="var(--theme-border-primary)" />
                  <PolarAngleAxis dataKey="metric" stroke="var(--theme-text-tertiary)" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="var(--theme-text-tertiary)" />
                  <Radar name={ranking[0]?.name} dataKey="value"
                    stroke="var(--theme-accent-primary)" fill="var(--theme-accent-primary)" fillOpacity={0.3} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v) => `${v}/100`} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            )}
          </GlassCard>

          {/* Detail table */}
          <GlassCard sx={{ p: 3, overflowX: "auto" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
              <TableChartIcon sx={{ color: "var(--theme-accent-primary)", fontSize: 26 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: "var(--theme-text-primary)" }}>Detailed Comparison</Typography>
            </Box>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: "var(--theme-bg-secondary)" }}>
                  <TableCell sx={{ fontWeight: 700, color: "var(--theme-accent-primary)", width: 160 }}>Feature</TableCell>
                  {ranking.map((r) => (
                    <TableCell key={r.name} align="center" sx={{ fontWeight: 700, color: "var(--theme-accent-primary)" }}>
                      {r.name}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {[
                  { label: "Difficulty",   key: (d) => d?.analysis?.learningDifficulty || "Intermediate" },
                  { label: "Market Demand",key: (d) => d?.analysis?.marketDemand || "Moderate" },
                  { label: "Learning Time",key: (d) => d?.analysis?.estimatedLearningTime || "3–6 months" },
                  { label: "Salary (entry)",key:(d) => d?.analysis?.salaryPotential?.entryLevel ? `$${d.analysis.salaryPotential.entryLevel}k` : "—" },
                  { label: "Salary (exp)", key: (d) => d?.analysis?.salaryPotential?.experienced ? `$${d.analysis.salaryPotential.experienced}k` : "—" },
                ].map(({ label, key }) => (
                  <TableRow key={label} sx={{ "&:nth-of-type(odd)": { bgcolor: "var(--theme-bg-secondary)" } }}>
                    <TableCell sx={{ fontWeight: 700, color: "var(--theme-accent-primary)", borderRight: "1px solid var(--theme-border-primary)" }}>
                      {label}
                    </TableCell>
                    {ranking.map((r) => (
                      <TableCell key={r.name} align="center" sx={{ fontWeight: 600, color: "var(--theme-text-primary)" }}>
                        {key(r.data)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </GlassCard>

          {/* Course Definitions Section */}
          {ranking.some(r => r.data?.enhanced) && (
            <GlassCard sx={{ p: 4, mt: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: "var(--theme-text-primary)", mb: 3, fontSize: "1.1rem" }}>
                📚 Course Definitions & Details
              </Typography>
              <Grid container spacing={3}>
                {ranking.map((item) => {
                  const fullData = item.data?.fullData;
                  const comparisonData = fullData?.comparison?.courses?.[item.name.toLowerCase()];
                  const insights = fullData?.insights?.[item.name.toLowerCase()];
                  
                  return (
                    <Grid item xs={12} key={item.name}>
                      <Paper elevation={0} sx={{ p: 3, bgcolor: "var(--theme-bg-secondary)", border: "1px solid var(--theme-border-primary)", borderRadius: "10px" }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: "var(--theme-accent-primary)", mb: 2, fontSize: "1rem" }}>
                          {item.score === ranking[0].score ? "🏆 " : ""} {item.name.toUpperCase()}
                          {item.score === ranking[0].score && <span style={{ color: "#10b981" }}> (BEST CHOICE)</span>}
                        </Typography>
                        
                        {/* Definition */}
                        {comparisonData?.definition && (
                          <Box sx={{ mb: 2.5 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "var(--theme-text-primary)", mb: 0.8 }}>
                              📖 What is {item.name}?
                            </Typography>
                            <Typography variant="body2" sx={{ color: "var(--theme-text-secondary)", lineHeight: 1.6 }}>
                              {comparisonData.definition}
                            </Typography>
                          </Box>
                        )}
                        
                        <Grid container spacing={2}>
                          {/* Difficulty */}
                          {comparisonData?.difficultyLevel && (
                            <Grid item xs={12} sm={6} md={4}>
                              <Box>
                                <Typography variant="caption" sx={{ fontWeight: 700, color: "var(--theme-text-tertiary)", display: "block", mb: 0.5 }}>
                                  📊 DIFFICULTY LEVEL
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 700, color: "var(--theme-accent-primary)" }}>
                                  {comparisonData.difficultyLevel}
                                </Typography>
                              </Box>
                            </Grid>
                          )}
                          
                          {/* Time Investment */}
                          {comparisonData?.timeInvestment && (
                            <Grid item xs={12} sm={6} md={4}>
                              <Box>
                                <Typography variant="caption" sx={{ fontWeight: 700, color: "var(--theme-text-tertiary)", display: "block", mb: 0.5 }}>
                                  ⏱️ TIME INVESTMENT
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 700, color: "var(--theme-accent-primary)" }}>
                                  {comparisonData.timeInvestment}
                                </Typography>
                              </Box>
                            </Grid>
                          )}
                          
                          {/* Industry Adoption */}
                          {comparisonData?.industryAdoption && (
                            <Grid item xs={12} sm={6} md={4}>
                              <Box>
                                <Typography variant="caption" sx={{ fontWeight: 700, color: "var(--theme-text-tertiary)", display: "block", mb: 0.5 }}>
                                  🌐 INDUSTRY ADOPTION
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 700, color: "var(--theme-accent-primary)" }}>
                                  {comparisonData.industryAdoption}%
                                </Typography>
                              </Box>
                            </Grid>
                          )}
                          
                          {/* Salary Range */}
                          {comparisonData?.salaryRange && (
                            <Grid item xs={12} sm={6} md={4}>
                              <Box>
                                <Typography variant="caption" sx={{ fontWeight: 700, color: "var(--theme-text-tertiary)", display: "block", mb: 0.5 }}>
                                  💰 SALARY RANGE (ANNUAL)
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 700, color: "var(--theme-accent-primary)" }}>
                                  {comparisonData.salaryRange}
                                </Typography>
                              </Box>
                            </Grid>
                          )}
                          
                          {/* Career Prospects */}
                          {comparisonData?.careerProspects && (
                            <Grid item xs={12} sm={6} md={4}>
                              <Box>
                                <Typography variant="caption" sx={{ fontWeight: 700, color: "var(--theme-text-tertiary)", display: "block", mb: 0.5 }}>
                                  📈 CAREER PROSPECTS
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 700, color: "var(--theme-accent-primary)" }}>
                                  {comparisonData.careerProspects}
                                </Typography>
                              </Box>
                            </Grid>
                          )}
                          
                          {/* Future Relevance */}
                          {comparisonData?.futureRelevance && (
                            <Grid item xs={12} sm={6} md={4}>
                              <Box>
                                <Typography variant="caption" sx={{ fontWeight: 700, color: "var(--theme-text-tertiary)", display: "block", mb: 0.5 }}>
                                  🚀 FUTURE RELEVANCE
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 700, color: "var(--theme-accent-primary)" }}>
                                  {comparisonData.futureRelevance}
                                </Typography>
                              </Box>
                            </Grid>
                          )}
                        </Grid>
                        
                        {/* Top Job Roles */}
                        {comparisonData?.topJobRoles && comparisonData.topJobRoles.length > 0 && (
                          <Box sx={{ mt: 2.5 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "var(--theme-text-primary)", mb: 1 }}>
                              💼 Top Job Roles
                            </Typography>
                            <Stack direction="row" flexWrap="wrap" gap={1}>
                              {comparisonData.topJobRoles.map((role) => (
                                <Chip key={role} label={role} size="small" 
                                  sx={{ bgcolor: "rgba(59,130,246,0.1)", color: "var(--theme-accent-primary)", fontWeight: 600 }} />
                              ))}
                            </Stack>
                          </Box>
                        )}
                        
                        {/* Key Skills */}
                        {comparisonData?.keySkills && comparisonData.keySkills.length > 0 && (
                          <Box sx={{ mt: 2.5 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "var(--theme-text-primary)", mb: 1 }}>
                              🛠️ Key Skills Required
                            </Typography>
                            <Stack direction="row" flexWrap="wrap" gap={1}>
                              {comparisonData.keySkills.map((skill) => (
                                <Chip key={skill} label={skill} size="small" variant="outlined"
                                  sx={{ borderColor: "var(--theme-border-primary)", color: "var(--theme-text-secondary)" }} />
                              ))}
                            </Stack>
                          </Box>
                        )}
                      </Paper>
                    </Grid>
                  );
                })}
              </Grid>
            </GlassCard>
          )}

          {/* Recommendation Section */}
          {ranking.length > 0 && (
            <GlassCard sx={{ p: 4, mt: 4, bgcolor: "linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(59,130,246,0.1) 100%)", border: "2px solid #10b981" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
                <EmojiEventsIcon sx={{ color: "#10b981", fontSize: 28 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: "#10b981" }}>
                  🎯 Recommendation
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: "var(--theme-text-primary)", fontWeight: 600, mb: 2 }}>
                ✅ <strong>{ranking[0].name.toUpperCase()}</strong> is the best choice for your career growth (Score: {ranking[0].score}/100)
              </Typography>
              <Typography variant="body2" sx={{ color: "var(--theme-text-secondary)", lineHeight: 1.7 }}>
                Based on market demand, trending metrics, salary potential, and growth opportunities, {ranking[0].name} stands out as the most recommended course. 
                It offers {ranking[0].data?.fullData?.comparison?.courses?.[ranking[0].name.toLowerCase()]?.careerProspects?.toLowerCase() || "excellent opportunities"} in the current job market with strong career prospects and good earning potential.
              </Typography>
            </GlassCard>
          )}
        </Box>
      )}
    </Container>
  );
}
