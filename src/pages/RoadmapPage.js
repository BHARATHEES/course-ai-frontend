import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Stack,
  Grid,
  Divider,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import SchoolIcon from "@mui/icons-material/School";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import BookIcon from "@mui/icons-material/Book";
import AssignmentIcon from "@mui/icons-material/Assignment";
import BusinessIcon from "@mui/icons-material/Business";
import SavingsIcon from "@mui/icons-material/Savings";
import PathIcon from "@mui/icons-material/Timeline";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../services/api";

const GlassCard = styled(Paper)({
  background: "var(--theme-surface-card)",
  border: "1px solid var(--theme-border-primary)",
  borderRadius: "12px",
  boxShadow: "var(--theme-shadow)",
  transition: "all 0.3s",
  "&:hover": { boxShadow: "var(--theme-shadow-hover)" },
});

const GradientBtn = styled(Button)({
  background: "var(--theme-accent-primary)",
  color: "white",
  fontWeight: 700,
  textTransform: "none",
  borderRadius: "8px",
  padding: "10px 24px",
  "&:hover": {
    background: "var(--theme-accent-secondary)",
    transform: "translateY(-2px)",
  },
});



const MilestoneItem = styled(Box)({
  padding: "16px",
  marginBottom: "12px",
  background: "var(--theme-bg-secondary)",
  border: "2px solid var(--theme-border-primary)",
  borderRadius: "8px",
  transition: "all 0.3s",
  "&:hover": {
    borderColor: "var(--theme-accent-primary)",
    boxShadow: "0 4px 12px rgba(59, 130, 246, 0.1)",
  },
});

const ResourceBadge = styled(Chip)({
  background: "var(--theme-accent-primary)",
  color: "white",
  fontWeight: 600,
  margin: "4px",
});

export default function RoadmapPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const courseName = searchParams.get("course") || "";

  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedPhase, setExpandedPhase] = useState(0);

  useEffect(() => {
    if (!courseName) {
      setError("No course selected. Please go back and select a favorite course.");
      setLoading(false);
      return;
    }
    fetchRoadmap();
  }, [courseName, fetchRoadmap]);

  const fetchRoadmap = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.getRoadmap(courseName);
      if (res.ok && res.data) {
        setRoadmap(res.data);
      } else {
        setError(res.error || "Failed to generate roadmap");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!courseName || (loading && !roadmap)) {
    return (
      <Container maxWidth="lg" sx={{ my: 4 }}>
        {!courseName ? (
          <GlassCard sx={{ p: 4, textAlign: "center" }}>
            <Alert severity="warning">
              No course selected. Please go to Favorites to view the roadmap.
            </Alert>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("/dashboard?tab=2")}
              sx={{ mt: 2 }}
            >
              Back to Favorites
            </Button>
          </GlassCard>
        ) : (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        )}
      </Container>
    );
  }

  if (error && !roadmap) {
    return (
      <Container maxWidth="lg" sx={{ my: 4 }}>
        <GlassCard sx={{ p: 4 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <Button
            variant="contained"
            onClick={fetchRoadmap}
            sx={{ mr: 1 }}
          >
            Retry
          </Button>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/dashboard?tab=2")}
          >
            Back to Favorites
          </Button>
        </GlassCard>
      </Container>
    );
  }

  const data = roadmap?.data || {};

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/dashboard?tab=2")}
          sx={{ mb: 2, textTransform: "none" }}
        >
          Back to Favorites
        </Button>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: 2,
          }}
        >
          <SchoolIcon sx={{ fontSize: 40, color: "var(--theme-accent-primary)" }} />
          <div>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                color: "var(--theme-text-primary)",
                mb: 0.5,
              }}
            >
              {data.courseName || courseName} Learning Roadmap
            </Typography>
            <Typography variant="body2" sx={{ color: "var(--theme-text-secondary)" }}>
              Your complete guide from A to Z
            </Typography>
          </div>
        </Box>
      </Box>

      {/* Overview Section */}
      {data.overview && (
        <GlassCard sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            📋 Overview
          </Typography>
          <Typography variant="body2" sx={{ lineHeight: 1.8, color: "var(--theme-text-secondary)" }}>
            {data.overview}
          </Typography>

          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: "center", p: 2, bgcolor: "var(--theme-bg-secondary)", borderRadius: 1 }}>
                <CalendarTodayIcon sx={{ color: "var(--theme-accent-primary)", mb: 1 }} />
                <Typography variant="caption" sx={{ display: "block", color: "var(--theme-text-tertiary)", mb: 0.5 }}>
                  Duration
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {data.totalDurationWeeks || "12"} weeks
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: "center", p: 2, bgcolor: "var(--theme-bg-secondary)", borderRadius: 1 }}>
                <TrendingUpIcon sx={{ color: "var(--theme-accent-primary)", mb: 1 }} />
                <Typography variant="caption" sx={{ display: "block", color: "var(--theme-text-tertiary)", mb: 0.5 }}>
                  Difficulty
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {data.difficulty || "Intermediate"}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: "center", p: 2, bgcolor: "var(--theme-bg-secondary)", borderRadius: 1 }}>
                <BookIcon sx={{ color: "var(--theme-accent-primary)", mb: 1 }} />
                <Typography variant="caption" sx={{ display: "block", color: "var(--theme-text-tertiary)", mb: 0.5 }}>
                  Phases
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {data.phases?.length || "0"} phases
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: "center", p: 2, bgcolor: "var(--theme-bg-secondary)", borderRadius: 1 }}>
                <AssignmentIcon sx={{ color: "var(--theme-accent-primary)", mb: 1 }} />
                <Typography variant="caption" sx={{ display: "block", color: "var(--theme-text-tertiary)", mb: 0.5 }}>
                  Projects
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {data.phases?.reduce((acc, p) => acc + (p.projects?.length || 0), 0) || "0"}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </GlassCard>
      )}

      {/* Prerequisites */}
      {data.prerequisites && data.prerequisites.length > 0 && (
        <GlassCard sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            📚 Prerequisites
          </Typography>
          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
            {data.prerequisites.map((prereq, idx) => (
              <Chip
                key={idx}
                label={prereq}
                icon={<BookIcon />}
                sx={{
                  background: "rgba(59, 130, 246, 0.1)",
                  color: "var(--theme-accent-primary)",
                  fontWeight: 600,
                  mb: 1,
                }}
              />
            ))}
          </Stack>
        </GlassCard>
      )}

      {/* Learning Phases */}
      <GlassCard sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
          🚀 Learning Phases
        </Typography>

        {data.phases && data.phases.length > 0 ? (
          <Box>
            {data.phases.map((phase, phaseIdx) => (
              <Accordion
                key={phaseIdx}
                expanded={expandedPhase === phaseIdx}
                onChange={() =>
                  setExpandedPhase(expandedPhase === phaseIdx ? -1 : phaseIdx)
                }
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        background: "var(--theme-accent-primary)",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        mr: 2,
                      }}
                    >
                      {phase.phaseNumber}
                    </Box>
                    <div>
                      <Typography sx={{ fontWeight: 700 }}>
                        {phase.phaseName}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "var(--theme-text-tertiary)" }}
                      >
                        {phase.duration}
                      </Typography>
                    </div>
                  </Box>
                </AccordionSummary>

                <AccordionDetails sx={{ background: "var(--theme-bg-secondary)", pt: 3 }}>
                  {/* Goals */}
                  {phase.goals && phase.goals.length > 0 && (
                    <Box sx={{ mb: 3 }}>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 700, mb: 1.5 }}
                      >
                        ✅ Goals
                      </Typography>
                      <Stack spacing={1} sx={{ mb: 2 }}>
                        {phase.goals.map((goal, idx) => (
                          <Typography
                            key={idx}
                            variant="body2"
                            sx={{ pl: 2, borderLeft: "3px solid var(--theme-accent-primary)" }}
                          >
                            • {goal}
                          </Typography>
                        ))}
                      </Stack>
                    </Box>
                  )}

                  <Divider sx={{ my: 2 }} />

                  {/* Topics */}
                  {phase.topics && phase.topics.length > 0 && (
                    <Box sx={{ mb: 3 }}>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 700, mb: 1.5 }}
                      >
                        📖 Topics
                      </Typography>
                      <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", mb: 2 }}>
                        {phase.topics.map((topic, idx) => (
                          <Chip
                            key={idx}
                            label={topic}
                            size="small"
                            sx={{
                              background: "rgba(59, 130, 246, 0.15)",
                              color: "var(--theme-accent-primary)",
                            }}
                          />
                        ))}
                      </Stack>
                    </Box>
                  )}

                  <Divider sx={{ my: 2 }} />

                  {/* Resources */}
                  {phase.resources && phase.resources.length > 0 && (
                    <Box sx={{ mb: 3 }}>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 700, mb: 1.5 }}
                      >
                        🎓 Resources
                      </Typography>
                      <Stack spacing={1.5}>
                        {phase.resources.map((resource, idx) => (
                          <Card
                            key={idx}
                            sx={{
                              bgcolor: "var(--theme-surface-card)",
                              border: "1px solid var(--theme-border-primary)",
                            }}
                          >
                            <CardContent>
                              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                  {resource.title}
                                </Typography>
                                <ResourceBadge
                                  label={resource.type}
                                  size="small"
                                />
                              </Box>
                              <Typography
                                variant="caption"
                                sx={{ color: "var(--theme-text-tertiary)", display: "block", mb: 1 }}
                              >
                                Platform: {resource.platform}
                              </Typography>
                              <Box sx={{ display: "flex", gap: 2 }}>
                                <Typography variant="caption">
                                  ⏱️ {resource.estimatedHours} hours
                                </Typography>
                                <Typography variant="caption">
                                  📊 {resource.difficulty}
                                </Typography>
                              </Box>
                            </CardContent>
                          </Card>
                        ))}
                      </Stack>
                    </Box>
                  )}

                  <Divider sx={{ my: 2 }} />

                  {/* Projects */}
                  {phase.projects && phase.projects.length > 0 && (
                    <Box sx={{ mb: 3 }}>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 700, mb: 1.5 }}
                      >
                        💻 Projects
                      </Typography>
                      <Stack spacing={1}>
                        {phase.projects.map((project, idx) => (
                          <Box
                            key={idx}
                            sx={{
                              p: 2,
                              bgcolor: "var(--theme-surface-card)",
                              border: "1px solid var(--theme-border-primary)",
                              borderRadius: 1,
                            }}
                          >
                            <Typography variant="body2">🔨 {project}</Typography>
                          </Box>
                        ))}
                      </Stack>
                    </Box>
                  )}

                  <Divider sx={{ my: 2 }} />

                  {/* Key Skills */}
                  {phase.keySkills && phase.keySkills.length > 0 && (
                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 700, mb: 1.5 }}
                      >
                        🎯 Key Skills to Develop
                      </Typography>
                      <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
                        {phase.keySkills.map((skill, idx) => (
                          <Chip
                            key={idx}
                            label={skill}
                            size="small"
                            sx={{
                              background: "rgba(34, 197, 94, 0.15)",
                              color: "rgb(34, 197, 94)",
                              fontWeight: 600,
                            }}
                          />
                        ))}
                      </Stack>
                    </Box>
                  )}
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        ) : (
          <Alert severity="warning">No phases available</Alert>
        )}
      </GlassCard>

      {/* Milestones */}
      {data.milestones && data.milestones.length > 0 && (
        <GlassCard sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
            🎯 Milestones
          </Typography>
          <Stack spacing={2}>
            {data.milestones.map((milestone, idx) => (
              <MilestoneItem key={idx}>
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: "var(--theme-accent-primary)",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {milestone.week}W
                  </Box>
                  <div style={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, mb: 0.5 }}>
                      {milestone.milestone}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "var(--theme-text-tertiary)" }}
                    >
                      {milestone.expectedOutcome}
                    </Typography>
                  </div>
                </Box>
              </MilestoneItem>
            ))}
          </Stack>
        </GlassCard>
      )}

      {/* Career Path */}
      {data.careerPath && (
        <GlassCard sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
            💼 Career Path
          </Typography>

          <Grid container spacing={3}>
            {/* Job Titles */}
            {data.careerPath.jobTitles && data.careerPath.jobTitles.length > 0 && (
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 700, mb: 1.5, display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <BusinessIcon fontSize="small" /> Job Titles
                  </Typography>
                  <Stack spacing={1}>
                    {data.careerPath.jobTitles.map((title, idx) => (
                      <Chip
                        key={idx}
                        label={title}
                        icon={<BusinessIcon />}
                        sx={{
                          background: "rgba(59, 130, 246, 0.1)",
                          color: "var(--theme-accent-primary)",
                          fontWeight: 600,
                        }}
                      />
                    ))}
                  </Stack>
                </Box>
              </Grid>
            )}

            {/* Salary */}
            {data.careerPath.avgSalaryINR && (
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 700, mb: 1.5, display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <SavingsIcon fontSize="small" /> Average Salary (India)
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: "var(--theme-accent-primary)" }}>
                    {data.careerPath.avgSalaryINR}
                  </Typography>
                </Box>
              </Grid>
            )}

            {/* Demand Level */}
            {data.careerPath.demandLevel && (
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 700, mb: 1.5, display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <TrendingUpIcon fontSize="small" /> Job Market Demand
                  </Typography>
                  <Chip
                    label={data.careerPath.demandLevel}
                    sx={{
                      background:
                        data.careerPath.demandLevel === "High"
                          ? "rgba(34, 197, 94, 0.15)"
                          : "rgba(191, 144, 0, 0.15)",
                      color:
                        data.careerPath.demandLevel === "High"
                          ? "rgb(34, 197, 94)"
                          : "rgb(191, 144, 0)",
                      fontWeight: 700,
                    }}
                  />
                </Box>
              </Grid>
            )}

            {/* Top Companies */}
            {data.careerPath.topCompanies && data.careerPath.topCompanies.length > 0 && (
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 700, mb: 1.5, display: "flex", alignItems: "center", gap: 1 }}
                  >
                    🏢 Top Companies
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
                    {data.careerPath.topCompanies.map((company, idx) => (
                      <Chip
                        key={idx}
                        label={company}
                        size="small"
                        sx={{
                          background: "rgba(59, 130, 246, 0.1)",
                          color: "var(--theme-accent-primary)",
                        }}
                      />
                    ))}
                  </Stack>
                </Box>
              </Grid>
            )}
          </Grid>
        </GlassCard>
      )}

      {/* Tips & Challenges */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Tips */}
        {data.tips && data.tips.length > 0 && (
          <Grid item xs={12} md={6}>
            <GlassCard sx={{ p: 3, height: "100%" }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                💡 Tips for Success
              </Typography>
              <Stack spacing={1.5}>
                {data.tips.map((tip, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      p: 2,
                      bgcolor: "rgba(34, 197, 94, 0.1)",
                      borderRadius: 1,
                      borderLeft: "3px solid rgb(34, 197, 94)",
                    }}
                  >
                    <Typography variant="body2">{tip}</Typography>
                  </Box>
                ))}
              </Stack>
            </GlassCard>
          </Grid>
        )}

        {/* Common Challenges */}
        {data.commonChallenges && data.commonChallenges.length > 0 && (
          <Grid item xs={12} md={6}>
            <GlassCard sx={{ p: 3, height: "100%" }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                ⚠️ Common Challenges
              </Typography>
              <Stack spacing={1.5}>
                {data.commonChallenges.map((challenge, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      p: 2,
                      bgcolor: "rgba(239, 68, 68, 0.1)",
                      borderRadius: 1,
                      borderLeft: "3px solid rgb(239, 68, 68)",
                    }}
                  >
                    <Typography variant="body2">{challenge}</Typography>
                  </Box>
                ))}
              </Stack>
            </GlassCard>
          </Grid>
        )}
      </Grid>

      {/* Next Steps */}
      {data.nextSteps && data.nextSteps.length > 0 && (
        <GlassCard sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
            🚀 What's Next?
          </Typography>
          <Stack spacing={2}>
            {data.nextSteps.map((step, idx) => (
              <Box
                key={idx}
                sx={{
                  p: 2.5,
                  bgcolor: "var(--theme-bg-secondary)",
                  border: "2px solid var(--theme-accent-primary)",
                  borderRadius: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <PathIcon sx={{ color: "var(--theme-accent-primary)", fontSize: 24 }} />
                <Typography variant="body2" sx={{ flex: 1 }}>
                  {step}
                </Typography>
              </Box>
            ))}
          </Stack>
        </GlassCard>
      )}

      {/* Action Buttons */}
      <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mt: 4, mb: 4 }}>
        <GradientBtn onClick={() => navigate("/dashboard?tab=2")}>
          Back to Favorites
        </GradientBtn>
        <GradientBtn
          variant="outlined"
          onClick={fetchRoadmap}
          sx={{
            background: "transparent",
            border: "2px solid var(--theme-accent-primary)",
            color: "var(--theme-accent-primary)",
            "&:hover": { background: "rgba(59, 130, 246, 0.1)" },
          }}
        >
          Regenerate Roadmap
        </GradientBtn>
      </Box>
    </Container>
  );
}
