import React from "react";
import {
  CardContent, Typography, Box, Paper, Chip, Stack,
} from "@mui/material";
import BarChartIcon    from "@mui/icons-material/BarChart";
import LightbulbIcon   from "@mui/icons-material/Lightbulb";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CachedIcon      from "@mui/icons-material/Cached";
import InfoIcon        from "@mui/icons-material/Info";
import ChartSection    from "./ChartSection";

// ─── Source badge config ──────────────────────────────────────────────────────
const getBadge = (source, isCached) => {
  if (source === "demo") return {
    icon: <InfoIcon fontSize="small" />, label: "Sample Data",
    desc: "Demo data for demonstration purposes.",
    bg: "rgba(245,158,11,0.12)", border: "#f59e0b", text: "#f59e0b",
    chip: null,
  };
  if (isCached || source === "cache") return {
    icon: <CachedIcon fontSize="small" />, label: "Cached Result",
    desc: "Recently analysed — served from cache for speed.",
    bg: "rgba(59,130,246,0.12)", border: "#3b82f6", text: "#3b82f6",
    chip: { label: "⚡ Cached", bg: "rgba(59,130,246,0.2)", color: "#3b82f6" },
  };
  return {
    icon: <AutoAwesomeIcon fontSize="small" />, label: "Real-Time AI Insights",
    desc: "Generated live using advanced AI with real market data.",
    bg: "rgba(16,185,129,0.12)", border: "#10b981", text: "#10b981",
    chip: { label: "🔥 Live", bg: "rgba(16,185,129,0.2)", color: "#10b981" },
  };
};

// ─── Text formatter (bold + headers) ─────────────────────────────────────────
const formatText = (text) => {
  if (!text) return null;
  const str   = typeof text === "string" ? text : String(text);
  const lines = str.replace(/\\n/g, "\n").split("\n").filter((l) => l.trim());

  return lines.map((line, i) => {
    const t = line.trim();
    if (t.startsWith("###")) return (
      <Typography key={i} variant="h6" sx={{
        color: "var(--theme-text-primary)", fontWeight: 800, mt: 2.5, mb: 1,
        pb: 1, borderBottom: "2px solid var(--theme-accent-primary)",
      }}>
        {t.replace(/^#+\s*/, "")}
      </Typography>
    );

    const parts = t.split(/(\*\*[^*]+\*\*)/g);
    return (
      <Typography key={i} variant="body1" sx={{ mb: 1.2, color: "var(--theme-text-tertiary)", lineHeight: 1.8 }}>
        {parts.map((p, j) =>
          p.startsWith("**") && p.endsWith("**")
            ? <strong key={j} style={{ color: "var(--theme-accent-secondary)", fontWeight: 700 }}>{p.replace(/\*\*/g, "")}</strong>
            : p
        )}
      </Typography>
    );
  });
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function AnalysisResult({ data, courseName }) {
  if (!data) return null;

  let parsed = data;
  if (typeof data === "string") {
    try { parsed = JSON.parse(data); }
    catch { parsed = { analysis: data, isValid: true }; }
  }

  const { analysis = "", suggestions = [], source = "unknown", isCached = false } = parsed;
  if (parsed.isValid === false) return null;

  const badge = getBadge(source, isCached);

  return (
    <Box>
      {/* Source banner */}
      <Box sx={{
        mt: 2, mb: 3, p: 2.5, borderRadius: 2,
        background: badge.bg, border: `2px solid ${badge.border}`,
        display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap",
        boxShadow: `0 4px 12px ${badge.border}30`,
        animation: (!isCached && source !== "demo") ? "pulse 2s infinite" : "none",
        "@keyframes pulse": { "0%,100%": { opacity: 1 }, "50%": { opacity: 0.75 } },
      }}>
        <Box sx={{ fontSize: "24px", color: badge.text }}>{badge.icon}</Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: badge.text, fontSize: "0.95rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            {badge.label}
          </Typography>
          <Typography variant="body2" sx={{ color: badge.text, opacity: 0.85, mt: "4px" }}>
            {badge.desc}
          </Typography>
        </Box>
        {badge.chip && (
          <Chip label={badge.chip.label}
            sx={{ background: badge.chip.bg, color: badge.chip.color, fontWeight: 700, border: `1.5px solid ${badge.chip.color}`, fontSize: "0.78rem" }} />
        )}
      </Box>

      {/* Main paper */}
      <Paper elevation={4} sx={{ borderRadius: 2, overflow: "hidden", border: "1px solid var(--theme-border-primary)" }}>
        {/* Header */}
        <Box sx={{ background: "var(--theme-surface-card)", p: 3, borderBottom: "1px solid var(--theme-border-primary)" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
            <BarChartIcon sx={{ color: "var(--theme-accent-primary)", fontSize: 28 }} />
            <Typography variant="h5" sx={{ fontWeight: 700, color: "var(--theme-text-primary)" }}>
              Intelligence Report: {courseName}
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: "var(--theme-text-tertiary)" }}>
            AI-Driven Course Analysis &amp; Insights
          </Typography>
        </Box>

        {/* Content */}
        <CardContent sx={{ p: 4, bgcolor: "var(--theme-bg-primary)" }}>
          <Box sx={{ mb: 4 }}>
            {typeof analysis === "object" ? (
              <Box>
                {analysis.summary && (
                  <Typography variant="body1" sx={{ mb: 2, color: "var(--theme-text-secondary)", lineHeight: 1.8 }}>
                    {analysis.summary}
                  </Typography>
                )}
                {analysis.marketDemand && (
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Market Demand:</strong> {analysis.marketDemand}
                  </Typography>
                )}
                {analysis.learningDifficulty && (
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Difficulty:</strong> {analysis.learningDifficulty}
                  </Typography>
                )}
                {analysis.estimatedLearningTime && (
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    <strong>Estimated Time:</strong> {analysis.estimatedLearningTime}
                  </Typography>
                )}
              </Box>
            ) : (
              formatText(analysis)
            )}
          </Box>

          {/* Suggestions */}
          {suggestions?.length > 0 && (
            <Box sx={{ mt: 4, p: 3, bgcolor: "var(--theme-surface-card)", borderRadius: 2,
              border: "1px solid var(--theme-border-primary)", borderLeft: "4px solid var(--theme-accent-primary)" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
                <LightbulbIcon sx={{ color: "var(--theme-accent-primary)", fontSize: 24 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "var(--theme-accent-primary)" }}>
                  Recommended Related Topics:
                </Typography>
              </Box>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {suggestions.map((s, i) => (
                  <Chip key={i} label={typeof s === "string" ? s : s?.text || String(s)}
                    sx={{ mb: 1, bgcolor: "rgba(59,130,246,0.12)", color: "var(--theme-accent-secondary)",
                      fontWeight: 500, border: "1px solid var(--theme-border-primary)" }} />
                ))}
              </Stack>
            </Box>
          )}
        </CardContent>
      </Paper>

      {/* Charts */}
      <Box sx={{ mt: 4 }}>
        <ChartSection courseName={courseName} analysisData={typeof analysis === "object" ? analysis : null} />
      </Box>
    </Box>
  );
}
