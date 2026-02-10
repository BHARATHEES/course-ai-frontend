import React from "react";
import { Container, Typography, Box, Paper, Divider, Stack } from "@mui/material";
import PsychologyIcon from '@mui/icons-material/Psychology';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';

export default function About() {
    return (
        <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    borderRadius: 3,
                    border: '1px solid #e2e8f0',
                    bgcolor: '#ffffff'
                }}
            >
                {/* Header Section */}
                <Box sx={{ mb: 3 }}>
                    <Typography
                        variant="h5"
                        sx={{ fontWeight: 800, color: '#0f172a', mb: 0.5 }}
                    >
                        About CourseAI
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: 1 }}>
                        Academic Intelligence Platform
                    </Typography>
                </Box>

                <Divider sx={{ mb: 3 }} />

                <Typography
                    variant="body2"
                    sx={{ color: '#334155', lineHeight: 1.6, mb: 3, fontSize: '0.95rem' }}
                >
                    CourseAI is a specialized analytical tool designed to bridge the gap between academic learning and industry demand.
                    Using advanced AI models, we provide real-time insights to help you validate your educational investments.
                </Typography>

                {/* Feature List (Vertical & Compact) */}
                <Stack spacing={2.5}>
                    <Box sx={{ display: 'flex', alignItems: 'start', gap: 2 }}>
                        <PsychologyIcon sx={{ color: '#3b82f6', fontSize: 20, mt: 0.3 }} />
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1e293b' }}>
                                AI-Driven Complexity Mapping
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#64748b', display: 'block', lineHeight: 1.4 }}>
                                We break down course syllabus into difficulty levels from Beginner to Expert.
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'start', gap: 2 }}>
                        <TrendingUpIcon sx={{ color: '#10b981', fontSize: 20, mt: 0.3 }} />
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1e293b' }}>
                                Career ROI Tracking
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#64748b', display: 'block', lineHeight: 1.4 }}>
                                Analysis of market demand, hiring companies, and potential salary growth.
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'start', gap: 2 }}>
                        <WorkspacePremiumIcon sx={{ color: '#f59e0b', fontSize: 20, mt: 0.3 }} />
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1e293b' }}>
                                Industry Validation
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#64748b', display: 'block', lineHeight: 1.4 }}>
                                Verified suggestions for alternative learning paths based on current trends.
                            </Typography>
                        </Box>
                    </Box>
                </Stack>

                <Box
                    sx={{
                        mt: 4,
                        p: 2,
                        bgcolor: '#f8fafc',
                        borderRadius: 2,
                        borderLeft: '4px solid #3b82f6'
                    }}
                >
                    <Typography variant="caption" sx={{ color: '#475569', fontStyle: 'italic', display: 'block' }}>
                        "Helping learners navigate the future of education with data, not guesses."
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
}