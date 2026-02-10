import { CardContent, Typography, Box, Paper, Divider, List, ListItem, ListItemText, Chip, Stack } from "@mui/material";

export default function AnalysisResult({ data, courseName }) {
  // 1. Safety check: ensure data exists
  if (!data) return null;

  // 2. Extract the parts from your JSON prompt structure
  const { analysis, suggestions, isValid } = data;

  if (isValid === false) {
    return (
      <Typography color="error" sx={{ p: 4 }}>
        This doesn't seem like a valid course. Try these instead: {suggestions?.join(", ")}
      </Typography>
    );
  }

  // 3. Function to turn "### Section" into a styled header and remove "**"
  const formatText = (text) => {
    if (!text) return "";
    return text.split('\n').map((line, index) => {
      if (line.startsWith('###')) {
        return (
          <Typography key={index} variant="h6" sx={{ color: '#1e293b', fontWeight: 800, mt: 3, mb: 1, borderBottom: '1px solid #e2e8f0' }}>
            {line.replace('###', '').trim()}
          </Typography>
        );
      }
      return (
        <Typography key={index} variant="body1" sx={{ mb: 1.5, color: '#334155', lineHeight: 1.7 }}>
          {line.replace(/\*\*/g, '')} {/* Removes the bold asterisks */}
        </Typography>
      );
    });
  };

  return (
    <Paper elevation={4} sx={{ mt: 4, borderRadius: 3, overflow: "hidden" }}>
      <Box sx={{ bgcolor: "primary.main", color: "white", p: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: '700' }}>
          Intelligence Report: {courseName}
        </Typography>
      </Box>

      <CardContent sx={{ p: 4, bgcolor: '#ffffff' }}>
        {/* Render the formatted Analysis string */}
        {formatText(analysis)}

        {/* Render Suggestions as interactive Chips */}
        {suggestions && (
          <Box sx={{ mt: 4, p: 3, bgcolor: '#f8fafc', borderRadius: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: '#475569' }}>
              Recommended Related Topics:
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {suggestions.map((s, i) => (
                <Chip key={i} label={s} sx={{ mb: 1, bgcolor: '#e2e8f0', fontWeight: 500 }} />
              ))}
            </Stack>
          </Box>
        )}
      </CardContent>
    </Paper>
  );
}