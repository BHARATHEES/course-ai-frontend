import { CardContent, Typography, Box, Paper, Chip, Stack } from "@mui/material";

export default function AnalysisResult({ data, courseName }) {
  // 1. Safety check: ensure data exists
  if (!data) return null;

  // 2. Parse the data - handle both direct JSON and stringified JSON
  let parsedData = data;
  if (typeof data === 'string') {
    try {
      parsedData = JSON.parse(data);
    } catch (e) {
      parsedData = {
        analysis: data,
        isValid: true,
        suggestions: []
      };
    }
  }
  else 
  {
    parsedData = data;
  }

  const { analysis = "", suggestions = [], isValid = true } = parsedData;

  // 3. Handle invalid courses
  if (isValid === false) {
    return null;
  }

  // 4. Function to parse and format the analysis text
  const formatText = (text) => {
    if (!text) return "";
    
    // Handle both actual newlines and escaped \n characters
    const lines = text
      .replace(/\\n/g, '\n')
      .split('\n')
      .filter(line => line.trim() !== '');

    return lines.map((line, index) => {
      const trimmedLine = line.trim();

      // Section headers (### format)
      if (trimmedLine.startsWith('###')) {
        return (
          <Typography
            key={index}
            variant="h6"
            sx={{
              color: '#1e293b',
              fontWeight: 800,
              mt: 2.5,
              mb: 1,
              paddingBottom: 1,
              borderBottom: '2px solid #3b82f6'
            }}
          >
            {trimmedLine.replace(/^#+\s*/, '').trim()}
          </Typography>
        );
      }

      // Bold text (** format)
      const formatBold = (str) => {
        return str.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <strong key={i} style={{ color: '#1e293b', fontWeight: 700 }}>
                {part.replace(/\*\*/g, '')}
              </strong>
            );
          }
          return part;
        });
      };

      return (
        <Typography
          key={index}
          variant="body1"
          sx={{
            mb: 1.2,
            color: '#334155',
            lineHeight: 1.8,
            fontSize: '0.95rem'
          }}
        >
          {formatBold(trimmedLine)}
        </Typography>
      );
    });
  };

  return (
    <Paper elevation={4} sx={{ mt: 4, borderRadius: 3, overflow: "hidden" }}>
      {/* Header */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        color: "white", 
        p: 3 
      }}>
        <Typography variant="h5" sx={{ fontWeight: '700', letterSpacing: 0.5 }}>
          📊 Intelligence Report: {courseName}
        </Typography>
        <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.9 }}>
          AI-Driven Course Analysis & Insights
        </Typography>
      </Box>

      {/* Content */}
      <CardContent sx={{ p: 4, bgcolor: '#ffffff' }}>
        {/* Analysis Section */}
        <Box sx={{ mb: 4 }}>
          {formatText(analysis)}
        </Box>
      </CardContent>
    </Paper>
  );
}