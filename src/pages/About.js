import React, { useState } from "react";
import { Container, Typography, Box, Paper, Divider, Stack, Accordion, AccordionSummary, AccordionDetails, Chip, Grid, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import PsychologyIcon      from "@mui/icons-material/Psychology";
import TrendingUpIcon      from "@mui/icons-material/TrendingUp";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import TimelineIcon from "@mui/icons-material/Timeline";
import MapIcon from "@mui/icons-material/Map";
import HistoryIcon from "@mui/icons-material/History";

const GlassCard = styled(Paper)({
  background: "var(--theme-surface-card)",
  border: "1px solid var(--theme-border-primary)",
  borderRadius: "12px",
  boxShadow: "var(--theme-shadow)",
  transition: "all 0.3s",
  "&:hover": { boxShadow: "var(--theme-shadow-hover)" },
});

const StepBox = styled(Box)({
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

const FeatureTag = styled(Chip)({
  background: "rgba(59, 130, 246, 0.1)",
  color: "var(--theme-accent-primary)",
  fontWeight: 600,
  margin: "4px",
});

export default function About() {
  const [expandedFeature, setExpandedFeature] = useState(0);

  const features = [
    {
      icon: <PsychologyIcon sx={{ color: "var(--theme-accent-primary)", fontSize: 20, mt: 0.3 }} />,
      title: "AI-Driven Complexity Mapping",
      desc:  "We break down any course into difficulty tiers from Beginner to Expert using advanced AI models.",
    },
    {
      icon: <TrendingUpIcon sx={{ color: "var(--theme-status-success)", fontSize: 20, mt: 0.3 }} />,
      title: "Career ROI Tracking",
      desc:  "Analysis of market demand, hiring companies, and salary growth potential for every course.",
    },
    {
      icon: <WorkspacePremiumIcon sx={{ color: "var(--theme-status-warning)", fontSize: 20, mt: 0.3 }} />,
      title: "Industry Validation",
      desc:  "Verified suggestions for alternative learning paths based on current market trends.",
    },
  ];

  const userGuide = [
    {
      title: "🔍 Analyzing Courses",
      icon: <SearchIcon />,
      steps: [
        "Go to the Dashboard (Home page)",
        "Enter any course name (e.g., 'React', 'Python', 'Machine Learning')",
        "Click the 'Analyze Course' button",
        "View instant AI-powered insights including:",
        "  • Course difficulty level",
        "  • Estimated learning time",
        "  • Market demand and salary potential",
        "  • Student reviews and sentiment analysis",
        "  • Alternative learning paths"
      ],
      time: "⏱️ 2-3 minutes per analysis"
    },
    {
      title: "❤️ Managing Favorites",
      icon: <FavoriteBorderIcon />,
      steps: [
        "Go to Dashboard → Favorites tab",
        "Click 'Add Favorite Course' to save courses you're interested in",
        "Enter the course name and click Add",
        "View all your saved courses with ratings and notes",
        "Click 'Edit' to add personal notes or ratings (1-5 stars)",
        "Click 'Delete' to remove a course from favorites",
        "Each favorite course shows three action buttons:",
        "  • Edit: Add notes and rate the course",
        "  • Analyse: Get market insights for that course",
        "  • Roadmap: View complete A-to-Z learning path"
      ],
      time: "⏱️ Quick access feature"
    },
    {
      title: "🗺️ Learning Roadmaps",
      icon: <MapIcon />,
      steps: [
        "Only available for Favorite courses",
        "Go to Dashboard → Favorites tab",
        "Click the '🗺️ Roadmap' button on any favorite course",
        "Explore your complete learning journey with:",
        "  • Prerequisites you need before starting",
        "  • 3-4 structured learning phases",
        "  • Recommended resources (videos, books, courses)",
        "  • Hands-on projects to build",
        "  • Weekly milestones to track progress",
        "  • Career paths and job opportunities",
        "  • Tips for success and common challenges",
        "Click the 'Regenerate Roadmap' button for fresh insights"
      ],
      time: "⏱️ Comprehensive planning tool"
    },
    {
      title: "📊 Compare Courses",
      icon: <CompareArrowsIcon />,
      steps: [
        "Go to Explore → Compare section",
        "Enter two course names you want to compare",
        "Click 'Compare Courses'",
        "Get side-by-side analysis including:",
        "  • Difficulty comparison",
        "  • Salary potential difference",
        "  • Market demand levels",
        "  • Career growth paths",
        "  • Which one is better for your goals",
        "Use this to make informed learning decisions"
      ],
      time: "⏱️ Decision-making tool"
    },
    {
      title: "📈 Market Insights",
      icon: <TimelineIcon />,
      steps: [
        "Go to Explore → Market Insights",
        "Enter a course name to analyze",
        "View comprehensive market data:",
        "  • Current market demand score",
        "  • Salary trends and growth",
        "  • Top hiring companies",
        "  • Job opportunities by location",
        "  • Industry sentiment and reviews",
        "  • Future demand predictions",
        "Perfect for validating career choices"
      ],
      time: "⏱️ Market research tool"
    },
    {
      title: "📚 Search History",
      icon: <HistoryIcon />,
      steps: [
        "Go to Dashboard → History tab",
        "All your previous course analyses are automatically saved",
        "Click any course to re-analyze it quickly",
        "Delete individual searches to clean up",
        "Use 'Delete All' to clear entire history",
        "Great for tracking your research journey"
      ],
      time: "⏱️ Quick reference"
    },
    {
      title: "🔥 Trending Courses",
      icon: <TrendingUpIcon />,
      steps: [
        "Go to Explore → Trending section",
        "See the most searched and popular courses",
        "Filter by different time periods",
        "Discover what others are learning",
        "Click any course to get instant analysis",
        "Perfect for discovering trending skills"
      ],
      time: "⏱️ Discovery tool"
    },
    {
      title: "👤 Profile & Settings",
      icon: <WorkspacePremiumIcon />,
      steps: [
        "Go to Profile or Account section",
        "Update your profile information",
        "Change your password securely",
        "View your learning statistics",
        "See your total searches and favorites",
        "Keep your account information current"
      ],
      time: "⏱️ Account management"
    }
  ];

  const tips = [
    "💡 Start by searching for courses you're interested in to gather market data",
    "💡 Save interesting courses to Favorites for easy access later",
    "💡 Use the Roadmap feature to plan your complete learning journey before starting",
    "💡 Compare similar courses to choose the best fit for your goals",
    "💡 Check Market Insights to understand job demand for your target skill",
    "💡 Add notes and ratings to your favorite courses to remember your thoughts",
    "💡 Review the Trending section regularly to stay updated with industry trends",
    "💡 Use historical searches to refresh your analysis with latest data"
  ];

  return (
    <Container maxWidth="md" sx={{ my: 4 }}>
      {/* About Section */}
      <GlassCard sx={{ p: 4, mb: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: "var(--theme-text-primary)", mb: 0.5 }}>
            About CourseAI
          </Typography>
          <Typography variant="caption" sx={{ color: "var(--theme-text-tertiary)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Academic Intelligence Platform
          </Typography>
        </Box>

        <Divider sx={{ mb: 3, borderColor: "var(--theme-border-primary)" }} />

        <Typography variant="body1" sx={{ color: "var(--theme-text-secondary)", lineHeight: 1.7, mb: 3 }}>
          CourseAI bridges the gap between academic learning and industry demand.
          Using advanced AI, we provide real-time insights to help you validate educational investments
          before you make them.
        </Typography>

        <Stack spacing={3}>
          {features.map(({ icon, title, desc }) => (
            <Box key={title} sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
              {icon}
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "var(--theme-text-primary)" }}>
                  {title}
                </Typography>
                <Typography variant="caption" sx={{ color: "var(--theme-text-tertiary)", lineHeight: 1.5, display: "block" }}>
                  {desc}
                </Typography>
              </Box>
            </Box>
          ))}
        </Stack>

        <Box sx={{
          mt: 4, p: 2, bgcolor: "var(--theme-bg-secondary)", borderRadius: "8px",
          border: "1px solid var(--theme-border-primary)",
          borderLeft: "4px solid var(--theme-accent-primary)",
        }}>
          <Typography variant="caption" sx={{ color: "var(--theme-accent-primary)", fontStyle: "italic" }}>
            "Helping learners navigate the future of education with data, not guesses."
          </Typography>
        </Box>
      </GlassCard>

      {/* User Manual Section */}
      <GlassCard sx={{ p: 4, mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: "var(--theme-text-primary)", mb: 1 }}>
          📖 Easy User Manual
        </Typography>
        <Typography variant="body2" sx={{ color: "var(--theme-text-secondary)", mb: 3 }}>
          Learn how to use CourseAI to make smart learning decisions
        </Typography>

        <Divider sx={{ mb: 3, borderColor: "var(--theme-border-primary)" }} />

        {/* User Guide Accordions */}
        {userGuide.map((guide, idx) => (
          <Accordion
            key={idx}
            expanded={expandedFeature === idx}
            onChange={() => setExpandedFeature(expandedFeature === idx ? -1 : idx)}
            sx={{
              background: "var(--theme-bg-secondary)",
              border: "1px solid var(--theme-border-primary)",
              borderRadius: "8px",
              marginBottom: "12px",
              "&:before": { display: "none" },
              transition: "all 0.3s",
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: "var(--theme-accent-primary)" }} />}
              sx={{
                padding: "16px",
                "&:hover": {
                  backgroundColor: "rgba(59, 130, 246, 0.05)",
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, flex: 1 }}>
                <Box sx={{ color: "var(--theme-accent-primary)", fontSize: 24 }}>
                  {guide.icon}
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 700, color: "var(--theme-text-primary)" }}>
                    {guide.title}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "var(--theme-text-tertiary)" }}>
                    {guide.time}
                  </Typography>
                </Box>
              </Box>
            </AccordionSummary>

            <AccordionDetails sx={{ pt: 0, paddingTop: "8px" }}>
              <Stack spacing={1.5}>
                {guide.steps.map((step, stepIdx) => (
                  <Box key={stepIdx} sx={{ display: "flex", gap: 2 }}>
                    <Box
                      sx={{
                        minWidth: 24,
                        height: 24,
                        borderRadius: "50%",
                        background: "var(--theme-accent-primary)",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: "12px",
                        flexShrink: 0,
                        marginTop: "2px",
                      }}
                    >
                      {step.startsWith("•") || step.startsWith("  •") ? "✓" : stepIdx + 1}
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: step.startsWith("•") || step.startsWith("  •")
                          ? "var(--theme-text-tertiary)"
                          : "var(--theme-text-secondary)",
                        paddingLeft: step.startsWith("  •") ? "12px" : "0",
                      }}
                    >
                      {step.replace(/^[\s•]+/, "")}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </AccordionDetails>
          </Accordion>
        ))}
      </GlassCard>

      {/* Pro Tips */}
      <GlassCard sx={{ p: 4, mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: "var(--theme-text-primary)", mb: 3 }}>
          💡 Pro Tips for Best Results
        </Typography>

        <Grid container spacing={2}>
          {tips.map((tip, idx) => (
            <Grid item xs={12} sm={6} key={idx}>
              <StepBox>
                <Typography variant="body2" sx={{ color: "var(--theme-text-secondary)", lineHeight: 1.6 }}>
                  {tip}
                </Typography>
              </StepBox>
            </Grid>
          ))}
        </Grid>
      </GlassCard>

      {/* Features Overview */}
      <GlassCard sx={{ p: 4, mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: "var(--theme-text-primary)", mb: 3 }}>
          🎯 Key Features
        </Typography>

        <Stack spacing={2}>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: "var(--theme-text-primary)" }}>
              Dashboard
            </Typography>
            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", mb: 2 }}>
              <FeatureTag label="Course Analysis" />
              <FeatureTag label="Real-time Insights" />
              <FeatureTag label="Market Data" />
            </Stack>
            <Typography variant="body2" sx={{ color: "var(--theme-text-secondary)" }}>
              Quick course analysis with AI-powered market insights and difficulty assessment
            </Typography>
          </Box>

          <Divider sx={{ my: 1 }} />

          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: "var(--theme-text-primary)" }}>
              Favorites & Roadmap
            </Typography>
            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", mb: 2 }}>
              <FeatureTag label="Save Courses" />
              <FeatureTag label="Learning Paths" />
              <FeatureTag label="Progress Tracking" />
            </Stack>
            <Typography variant="body2" sx={{ color: "var(--theme-text-secondary)" }}>
              Save your favorite courses and get personalized A-to-Z learning roadmaps with milestones
            </Typography>
          </Box>

          <Divider sx={{ my: 1 }} />

          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: "var(--theme-text-primary)" }}>
              Explore & Compare
            </Typography>
            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", mb: 2 }}>
              <FeatureTag label="Course Comparison" />
              <FeatureTag label="Market Trends" />
              <FeatureTag label="Trending Skills" />
            </Stack>
            <Typography variant="body2" sx={{ color: "var(--theme-text-secondary)" }}>
              Compare courses, analyze market trends, and discover trending skills in your industry
            </Typography>
          </Box>
        </Stack>
      </GlassCard>

      {/* Get Started Section */}
      <GlassCard sx={{ p: 4, textAlign: "center", background: "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)" }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: "var(--theme-text-primary)", mb: 2 }}>
          Ready to Get Started?
        </Typography>
        <Typography variant="body2" sx={{ color: "var(--theme-text-secondary)", mb: 3 }}>
          Head to the Dashboard and search for your first course to get instant AI-powered insights
        </Typography>
        <Button
          variant="contained"
          href="/"
          sx={{
            background: "var(--theme-accent-primary)",
            color: "white",
            fontWeight: 700,
            textTransform: "none",
            borderRadius: "8px",
            padding: "10px 32px",
            "&:hover": {
              background: "var(--theme-accent-secondary)",
              transform: "translateY(-2px)",
            }
          }}
        >
          Go to Dashboard
        </Button>
      </GlassCard>
    </Container>
  );
}
