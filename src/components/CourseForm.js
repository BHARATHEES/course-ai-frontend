import React, { useState } from "react";
import { TextField, Button, Card, CardContent, Typography, CircularProgress,Chip, Box, Alert, Stack } from "@mui/material";
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

      // ✅ FIX: Set the WHOLE response object so AnalysisResult can read all properties
      setResult(res); 

      if (!res.isValid) {
        setSuggestions(res.suggestions || []);
      }

      // 2. SAVE TO HISTORY DATABASE
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const userId = user?._id || storedUser?._id;

      // Only save to history if user is logged in AND the course is valid
      if (userId && res.isValid) {
        try {
          await fetch(`${process.env.REACT_APP_API_URL}/api/history`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: userId,
              searchQuery: targetCourse
            }),
          });
          console.log("✅ History saved");
        } catch (historyErr) {
          console.error("❌ History save failed:", historyErr);
        }
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
    <Alert 
      severity="warning" 
      sx={{ borderRadius: 2, fontWeight: 500, mb: 2 }}
    >
      Course not clearly recognized. Did you mean one of these?
    </Alert>
    
    <Stack 
      direction="row" 
      spacing={1} 
      flexWrap="wrap" 
      useFlexGap 
      sx={{ p: 1 }}
    >
      {suggestions.map((item, index) => (
        <Chip 
          key={index} 
          label={item}
          onClick={() => handleSelectSuggestion(item)} // This makes it interactive
          sx={{ 
            mb: 1, 
            bgcolor: '#fff7ed', // Light orange/warning theme
            color: '#9a3412',
            fontWeight: 600,
            border: '1px solid #fed7aa',
            cursor: 'pointer',
            '&:hover': {
              bgcolor: '#ffedd5',
              transform: 'translateY(-2px)',
              transition: 'all 0.2s'
            }
          }} 
        />
      ))}
    </Stack>
  </Box>
)}
        </CardContent>
      </Card>

      {result && <AnalysisResult data={result} courseName={submittedCourse} />}
    </Box>
  );
}