import React, { useState, useEffect } from "react";
import {
  TextField, Button, Card, CardContent,
  Typography, CircularProgress, Chip, Box, Alert, Stack,
} from "@mui/material";
import { styled }          from "@mui/material/styles";
import SearchIcon          from "@mui/icons-material/Search";
import api                 from "../services/api";
import { validateCourseName } from "../utils/validation";
import AnalysisDashboard   from "./AnalysisDashboard";

const SubmitButton = styled(Button)({
  background:    "linear-gradient(135deg, var(--theme-accent-primary) 0%, var(--theme-accent-secondary) 100%)",
  color:         "white",
  fontWeight:    "var(--font-weight-semibold)",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  padding:       "14px 36px",
  borderRadius:  "var(--radius-lg)",
  fontSize:      "0.95rem",
  transition:    "all var(--transition-base)",
  boxShadow:     "var(--theme-shadow-md)",
  "&:hover":     { 
    background: "linear-gradient(135deg, var(--theme-accent-secondary) 0%, var(--theme-accent-hover) 100%)",
    transform: "translateY(-3px)",
    boxShadow: "var(--theme-shadow-lg)",
  },
  "&:active": { transform: "translateY(-1px)" },
  "&:disabled":  { 
    background: "rgba(59,130,246,0.4)", 
    color: "rgba(255,255,255,0.7)",
    boxShadow: "none",
  },
});

const StyledInput = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    background: "var(--theme-bg-secondary)",
    borderRadius: "var(--radius-md)",
    transition: "all var(--transition-base)",
    "& fieldset":         { borderColor: "var(--theme-border-primary)", transition: "all var(--transition-base)" },
    "&:hover fieldset":   { borderColor: "var(--theme-accent-tertiary)" },
    "&.Mui-focused fieldset": {
      borderColor: "var(--theme-accent-primary)",
      boxShadow:   "0 0 0 4px rgba(59,130,246,0.1)",
    },
  },
  "& .MuiInputLabel-root":   { 
    color: "var(--theme-text-tertiary)", 
    fontWeight: "var(--font-weight-medium)",
    "&.Mui-focused": { color: "var(--theme-accent-primary)" } 
  },
  "& .MuiOutlinedInput-input": { 
    color: "var(--theme-text-primary)",
    fontSize: "1rem",
    fontWeight: "var(--font-weight-regular)",
  },
  "& .MuiOutlinedInput-input::placeholder": {
    color: "var(--theme-text-tertiary)",
    opacity: 0.7,
  },
});

export default function CourseForm({ initialCourse = "" }) {
  const [course,    setCourse]    = useState(initialCourse);
  const [result,    setResult]    = useState(null);
  const [submitted, setSubmitted] = useState("");
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");
  const [suggestions, setSuggestions] = useState([]);

  // Auto-run when URL param is set
  useEffect(() => {
    if (initialCourse?.trim()) runAnalysis(initialCourse.trim());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCourse]);

  const runAnalysis = async (name) => {
    const v = validateCourseName(name);
    if (!v.valid) { setError(v.error); return; }

    setError(""); setLoading(true); setResult(null);
    setSuggestions([]); setSubmitted(name);

    const res = await api.analyzeCourse(v.sanitized);
    setLoading(false);

    if (res.error) { setError(res.error); return; }
    setResult(res);
    if (!res.isValid) setSuggestions(res.suggestions || []);
  };

  return (
    <Box>
      <Card elevation={0} sx={{ background: "transparent", border: "none" }}>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
            <Box sx={{
              width: 40,
              height: 40,
              borderRadius: "var(--radius-md)",
              background: "linear-gradient(135deg, var(--theme-accent-primary) 0%, var(--theme-accent-secondary) 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <SearchIcon sx={{ color: "white", fontSize: 22 }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: "var(--font-weight-bold)", color: "var(--theme-text-primary)" }}>
                Analyze a Course
              </Typography>
              <Typography variant="caption" sx={{ color: "var(--theme-text-tertiary)" }}>
                Get AI-powered insights instantly
              </Typography>
            </Box>
          </Box>

          <StyledInput
            fullWidth
            label="Course Name"
            placeholder="e.g. Machine Learning, React, AWS, Python"
            value={course}
            onChange={(e) => { setCourse(e.target.value); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && !loading && runAnalysis(course)}
            error={!!error}
            helperText={error}
            sx={{ mb: 2.5 }}
            size="medium"
          />

          <SubmitButton 
            fullWidth 
            onClick={() => runAnalysis(course)} 
            disabled={loading || !course.trim()}
          >
            {loading
              ? <><CircularProgress size={18} sx={{ color: "white", mr: 1 }} /> Analyzing…</>
              : "Analyze Now"}
          </SubmitButton>

          {suggestions.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Alert 
                severity="warning" 
                sx={{ 
                  mb: 2, 
                  borderRadius: "var(--radius-lg)",
                  backgroundColor: "rgba(245, 158, 11, 0.1)",
                  borderColor: "var(--theme-status-warning)",
                  "& .MuiAlert-message": { fontWeight: "var(--font-weight-medium)" }
                }}
              >
                No exact match found — did you mean one of these?
              </Alert>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {suggestions.map((s, i) => (
                  <Chip key={i} label={s} onClick={() => { setCourse(s); runAnalysis(s); }}
                    sx={{ mb: 1, bgcolor: "var(--theme-accent-primary)", color: "white", fontWeight: 700, cursor: "pointer" }} />
                ))}
              </Stack>
            </Box>
          )}
        </CardContent>
      </Card>

      {(result || loading) && (
        <AnalysisDashboard data={result} courseName={submitted} isLoading={loading} />
      )}
    </Box>
  );
}
