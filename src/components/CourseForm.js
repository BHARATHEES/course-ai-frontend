import React, { useState } from "react";
import { TextField, Button, Card, CardContent, Typography, CircularProgress, Box, List, ListItem, ListItemButton, ListItemText, Alert, Stack } from "@mui/material";
import api from "../services/api";
import AnalysisResult from "./AnalysisResult";

export default function CourseForm({ user }) {
  const [course, setCourse] = useState("");
  const [result, setResult] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submittedCourse, setSubmittedCourse] = useState("");

  const handleSubmit = async (selectedCourse = null) => {
    const targetCourse = selectedCourse || course;
    if (!targetCourse) return;

    setLoading(true);
    setResult("");
    setSuggestions([]);
    setSubmittedCourse(targetCourse);

    try {
      // 1. Get the Analysis from API
      const res = await api.analyzeCourse(targetCourse);

      if (res.isValid) {
        setResult(res.analysis);
      } else {
        setSuggestions(res.suggestions || []);
        setResult("");
      }

      // 2. SAVE TO HISTORY DATABASE
      // Fallback: If 'user' prop isn't ready, check localStorage
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const userId = user?._id || storedUser?._id;

      if (userId && targetCourse.trim() !== "") {
        try {
          const historyRes = await fetch(`${process.env.REACT_APP_API_URL}/api/history`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: userId,
              searchQuery: targetCourse
            }),
          });

          if (historyRes.ok) {
            console.log("✅ History saved for:", targetCourse);
          } else {
            console.error("❌ History save failed. Status:", historyRes.status);
          }
        } catch (historyErr) {
          console.error("❌ Network error saving history:", historyErr);
        }
      } else {
        console.warn("⚠️ History not saved: User ID missing. Ensure you are logged in.");
      }

    } catch (err) {
      console.error("General Analysis Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setCourse("");
    setResult("");
    setSuggestions([]);
    setSubmittedCourse("");
  };

  const handleSelectSuggestion = (suggestedName) => {
    setCourse(suggestedName);
    handleSubmit(suggestedName);
  };

  return (
    <Box>
      <Card elevation={2}>
        <CardContent>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>Analyze a Course</Typography>
          <TextField
            fullWidth
            label="Enter Course Name (e.g. Data Science)"
            variant="outlined"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
          />

          <Stack direction="row" spacing={2} sx={{ mt: 3, width: "100%" }}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              sx={{ py: 1.5, fontWeight: 'bold', textTransform: 'none' }}
              onClick={() => handleSubmit()}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Generate Analysis"}
            </Button>

            <Button
              variant="contained"
              fullWidth
              size="large"
              sx={{
                py: 1.5,
                fontWeight: 'bold',
                textTransform: 'none',
                bgcolor: '#f72e2e',
                color: '#fff',
                '&:hover': { bgcolor: '#d81e31' }
              }}
              onClick={handleClear}
            >
              Clear
            </Button>
          </Stack>

          {suggestions.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Alert severity="warning">
                Course not clearly recognized. Did you mean one of these?
              </Alert>
              <List sx={{ mt: 1, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid #ddd' }}>
                {suggestions.map((item, index) => (
                  <ListItem disablePadding key={index} divider={index !== suggestions.length - 1}>
                    <ListItemButton onClick={() => handleSelectSuggestion(item)}>
                      <ListItemText primary={item} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </CardContent>
      </Card>

      {result && <AnalysisResult data={result} courseName={submittedCourse} />}
    </Box>
  );
}