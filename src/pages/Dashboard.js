import React from "react";
import { Container, Typography, Box, Paper, Stack, Button, Alert } from "@mui/material";
import { styled }           from "@mui/material/styles";
import { useNavigate, useSearchParams } from "react-router-dom";
import AutoAwesomeIcon      from "@mui/icons-material/AutoAwesome";
import AnalyticsIcon        from "@mui/icons-material/Analytics";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import TrendingUpIcon       from "@mui/icons-material/TrendingUp";
import CourseForm           from "../components/CourseForm";

const GlassCard = styled(Paper)({
  background:   "var(--theme-surface-card)",
  border:       "1px solid var(--theme-border-primary)",
  borderRadius: "var(--radius-lg)",
  boxShadow:    "var(--theme-shadow-md)",
  transition:   "all var(--transition-base)",
  "&:hover":    { 
    boxShadow: "var(--theme-shadow-lg)",
    transform: "translateY(-4px)",
    borderColor: "var(--theme-border-secondary)"
  },
});

const PremiumCard = styled(Paper)({
  background: "linear-gradient(135deg, var(--theme-accent-primary) 0%, var(--theme-accent-secondary) 100%)",
  border: "none",
  borderRadius: "var(--radius-lg)",
  boxShadow: "var(--theme-shadow-lg)",
  transition: "all var(--transition-base)",
  color: "white",
  "&:hover": { 
    boxShadow: "var(--theme-shadow-hover)",
    transform: "translateY(-4px)",
  },
});

const FeatureBox = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "var(--space-lg)",
  padding: "var(--space-lg)",
  borderRadius: "var(--radius-md)",
  background: "var(--theme-bg-secondary)",
  border: "1px solid var(--theme-border-primary)",
  transition: "all var(--transition-base)",
  "&:hover": {
    background: "var(--theme-bg-tertiary)",
    borderColor: "var(--theme-accent-primary)",
  },
});

export default function Dashboard({ user }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialCourse  = searchParams.get("course") || "";
  const isAdmin        = user?.email === "bharathees.ag23@bitsathy.ac.in";

  // ── Guest view ──────────────────────────────────────────────────────────────
  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Hero section */}
        <PremiumCard sx={{ p: { xs: 4, md: 6 }, mb: 6, textAlign: "center" }}>
          <Box sx={{
            bgcolor: "rgba(255,255,255,0.2)", 
            backdropFilter: "blur(10px)",
            borderRadius: "50%",
            width: 80, 
            height: 80, 
            display: "flex", 
            alignItems: "center",
            justifyContent: "center", 
            mx: "auto", 
            mb: 3,
            border: "2px solid rgba(255,255,255,0.3)",
          }}>
            <AutoAwesomeIcon sx={{ fontSize: 40, color: "white" }} />
          </Box>
          <Typography variant="h3" sx={{ fontWeight: 700, color: "white", mb: 2 }}>
            Master Course Intelligence
          </Typography>
          <Typography variant="h6" sx={{ color: "rgba(255,255,255,0.9)", mb: 4, lineHeight: 1.8, fontWeight: 400 }}>
            Get real-time AI-powered insights into course popularity, difficulty, salary potential, and career scope.
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
            <Button 
              variant="contained" 
              onClick={() => navigate("/login")}
              sx={{
                bgcolor: "white",
                color: "var(--theme-accent-primary)",
                fontWeight: "var(--font-weight-semibold)",
                padding: "12px 32px",
                borRadius: "var(--radius-md)",
                fontSize: "16px",
                "&:hover": { bgcolor: "rgba(255,255,255,0.9)", transform: "translateY(-2px)" },
              }}
            >
              Get Started
            </Button>
            <Button 
              variant="outlined"
              onClick={() => navigate("/about")}
              sx={{
                color: "white",
                borderColor: "white",
                fontWeight: "var(--font-weight-semibold)",
                padding: "12px 32px",
                borderRadius: "var(--radius-md)",
                fontSize: "16px",
                "&:hover": { bgcolor: "rgba(255,255,255,0.1)", borderColor: "white" },
              }}
            >
              Learn More
            </Button>
          </Stack>
        </PremiumCard>

        {/* Features grid */}
        <Box sx={{ 
          display: "grid", 
          gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
          gap: "var(--space-lg)",
        }}>
          <FeatureBox>
            <AnalyticsIcon sx={{ fontSize: 40, color: "var(--theme-accent-primary)" }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: "var(--font-weight-semibold)", mb: 0.5 }}>Real-Time Analytics</Typography>
              <Typography variant="body2" sx={{ color: "var(--theme-text-secondary)" }}>Live market data and trends</Typography>
            </Box>
          </FeatureBox>
          <FeatureBox>
            <TrendingUpIcon sx={{ fontSize: 40, color: "var(--theme-status-success)" }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: "var(--font-weight-semibold)", mb: 0.5 }}>Career Insights</Typography>
              <Typography variant="body2" sx={{ color: "var(--theme-text-secondary)" }}>Salary & job trends</Typography>
            </Box>
          </FeatureBox>
          <FeatureBox>
            <AutoAwesomeIcon sx={{ fontSize: 40, color: "var(--theme-status-warning)" }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: "var(--font-weight-semibold)", mb: 0.5 }}>AI-Powered</Typography>
              <Typography variant="body2" sx={{ color: "var(--theme-text-secondary)" }}>Advanced predictions</Typography>
            </Box>
          </FeatureBox>
        </Box>
      </Container>
    );
  }

  // ── Authenticated view ──────────────────────────────────────────────────────
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Admin banner */}
      {isAdmin && (
        <Alert
          severity="info" 
          variant="outlined"
          icon={<AdminPanelSettingsIcon fontSize="small" />}
          action={
            <Button 
              size="small" 
              onClick={() => navigate("/admin")}
              sx={{ fontWeight: "var(--font-weight-semibold)", textTransform: "uppercase", fontSize: "0.75rem" }}
            >
              Admin Panel
            </Button>
          }
          sx={{ 
            mb: 4, 
            borderRadius: "var(--radius-lg)", 
            bgcolor: "var(--theme-surface-card)",
            borderColor: "var(--theme-accent-primary)",
            "& .MuiAlert-message": { fontWeight: 500 },
          }}
        >
          🔐 Administrator mode enabled
        </Alert>
      )}

      {/* Page title section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
          <Box sx={{
            width: 48,
            height: 48,
            borderRadius: "var(--radius-lg)",
            background: "linear-gradient(135deg, var(--theme-accent-primary) 0%, var(--theme-accent-secondary) 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "var(--theme-shadow-md)",
          }}>
            <AnalyticsIcon sx={{ fontSize: 24, color: "white" }} />
          </Box>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: "var(--font-weight-bold)", color: "var(--theme-text-primary)" }}>
              Course Intelligence
            </Typography>
            <Typography variant="caption" sx={{ color: "var(--theme-text-secondary)" }}>
              Advanced AI-powered market analysis
            </Typography>
          </Box>
        </Box>
        <Typography variant="body1" sx={{ color: "var(--theme-text-secondary)", ml: 7 }}>
          Welcome back, <span style={{ fontWeight: "var(--font-weight-semibold)", color: "var(--theme-accent-primary)" }}>{user.name}</span>.
          What course shall we analyse today?
        </Typography>
      </Box>

      {/* Analysis form */}
      <GlassCard sx={{ p: { xs: 3, md: 4 } }}>
        <CourseForm initialCourse={initialCourse} />
      </GlassCard>
    </Container>
  );
}
