// import React, { useState } from "react";
// import { TextField, Button, Card, CardContent, Typography } from "@mui/material";
// import api from "../services/api";


// export default function CourseForm() {
// const [course, setCourse] = useState("");

// changing this fjvjevj;
// const handleSubmit = async () => {
// if (!course) return;


// const res = await api.analyzeCourse(course);
// alert("API Response: " + JSON.stringify(res));
// };


// return (
// <Card className="mt-4">
// <CardContent>
// <Typography variant="h5">Analyze a Course</Typography>


// <TextField
// fullWidth
// label="Course Name"
// className="mt-3"
// value={course}
// onChange={(e) => setCourse(e.target.value)}
// />


// <Button variant="contained" color="primary" className="mt-3" onClick={handleSubmit}>
// Analyze
// </Button>
// </CardContent>
// </Card>
// );
// }

///new code 
import React from "react";
import { Container, Typography, Box, Button, Paper, Alert, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CourseForm from "../components/CourseForm";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

export default function Dashboard({ user }) {
  const navigate = useNavigate();

  const isAdmin = user?.email === "bharathees.ag23@bitsathy.ac.in";

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      {!user ? (
        /* GUEST VIEW: Compact & Focused Landing */
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, md: 5 },
            textAlign: 'center',
            bgcolor: '#ffffff',
            borderRadius: 4,
            border: '1px solid #e2e8f0'
          }}
        >
          <AutoAwesomeIcon sx={{ fontSize: 40, color: '#3b82f6', mb: 2 }} />
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', mb: 1.5, letterSpacing: '-0.02em' }}>
            Master the Market with AI
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b', mb: 4, maxWidth: '550px', mx: 'auto', lineHeight: 1.6 }}>
            Get real-time insights into course popularity, complexity, and career scope using our advanced AI analyzer.
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              variant="contained"
              onClick={() => navigate("/login")}
              sx={{ px: 3, py: 1, borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
            >
              Get Started
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate("/about")}
              sx={{ px: 3, py: 1, borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
            >
              Learn More
            </Button>
          </Stack>
        </Paper>
      ) : (
        /* LOGGED IN VIEW: Clean & Intentional */
        <Box sx={{ maxWidth: '700px', mx: 'auto' }}>
          {/* OWNER ACCESS BANNER: Sleeker & Smaller */}
          {isAdmin && (
            <Alert
              severity="info"
              variant="outlined"
              icon={<AdminPanelSettingsIcon fontSize="small" />}
              action={
                <Button color="inherit" size="small" onClick={() => navigate("/admin")} sx={{ fontWeight: 700, fontSize: '0.7rem' }}>
                  ADMIN PANEL
                </Button>
              }
              sx={{ mb: 3, borderRadius: 3, py: 0, '& .MuiAlert-message': { fontSize: '0.8rem' } }}
            >
              Administrator Mode Enabled.
            </Alert>
          )}

          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#1e293b', mb: 0.5 }}>
              Course Intelligence
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b' }}>
              Welcome back, <strong>{user.name}</strong>. What should we analyze today?
            </Typography>
          </Box>

          <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
            <CourseForm user={user} />
          </Paper>
        </Box>
      )}
    </Container>
  );
}