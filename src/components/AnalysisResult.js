import { CardContent, Typography, Box, Paper, Divider } from "@mui/material";

export default function AnalysisResult({ data, courseName }) {
  if (!data || data.trim() === "") return null;

  // Split the text into sections based on the numbering (e.g., 1., 2., 3.)
  // We also remove the ### and ** here for a clean look
  const cleanData = data.replace(/###\s?/g, "").replace(/\*\*/g, "");

  return (
    <Paper elevation={4} sx={{ mt: 4, borderRadius: 3, overflow: "hidden", border: '1px solid #e0e0e0' }}>
      <Box sx={{ bgcolor: "primary.main", color: "white", p: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: '600' }}>
          Course Intelligence Report: {courseName}
        </Typography>
      </Box>
      <Divider />
      <CardContent sx={{ p: 4, bgcolor: '#fafafa' }}>
        <Typography
          variant="body1"
          component="div" // Necessary when containing block elements
          sx={{
            whiteSpace: "pre-wrap",
            lineHeight: 1.8,
            fontSize: '1.05rem',
            color: "#334155",
            fontFamily: "'Inter', 'Roboto', sans-serif",
            // This CSS targets the numbers (1., 2., etc) to make them look like headers
            '& b, & strong': {
              display: 'block',
              color: '#1e293b',
              fontSize: '1.3rem',
              mt: 3,
              mb: 1,
              borderBottom: '2px solid #e2e8f0'
            },
          }}
        >
          {cleanData}
        </Typography>
      </CardContent>
    </Paper>
  );
}