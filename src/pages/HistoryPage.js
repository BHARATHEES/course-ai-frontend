import React, { useState, useEffect } from "react";
import { Container, Paper, Typography, Box, Divider, List, ListItem, ListItemText, IconButton, CircularProgress, Button, Stack } from "@mui/material";
import HistoryIcon from '@mui/icons-material/History';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import { useNavigate } from "react-router-dom";

export default function HistoryPage({ user }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const userId = user?._id || storedUser?._id;

      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/history/${userId}`);
        const data = await res.json();
        if (res.ok) setHistory(data);
      } catch (err) {
        console.error("Failed to fetch history");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [user]);

  const handleDelete = async (historyId) => {
    if (!window.confirm("Remove this item from your history?")) return;
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/history/${historyId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setHistory(prev => prev.filter(item => item._id !== historyId));
      }
    } catch (err) {
      console.error("Delete failed");
    }
  };

  const handleClearAll = async () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const userId = user?._id || storedUser?._id;
    if (!window.confirm("Clear entire search history? This cannot be undone.")) return;
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/history/all/${userId}`, {
        method: 'DELETE',
      });
      if (res.ok) setHistory([]);
    } catch (err) {
      console.error("Clear all failed", err);
    }
  };

  const formatHistoryTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();
    const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (isToday) return `Today, ${timeStr}`;
    if (isYesterday) return `Yesterday, ${timeStr}`;
    return `${date.toLocaleDateString('en-GB')} • ${timeStr}`;
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
      <CircularProgress size={30} thickness={5} />
    </Box>
  );

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <IconButton onClick={() => navigate(-1)} size="small" sx={{ bgcolor: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <ArrowBackIcon fontSize="small" />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b' }}>History</Typography>
        </Stack>

        {history.length > 0 && (
          <Button
            size="small"
            color="error"
            startIcon={<DeleteSweepIcon sx={{ fontSize: 18 }} />}
            onClick={handleClearAll}
            sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.75rem' }}
          >
            Clear All
          </Button>
        )}
      </Box>

      <Paper elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
        {history.length > 0 ? (
          <List disablePadding>
            {history.map((item, index) => (
              <React.Fragment key={item._id}>
                <ListItem
                  sx={{ py: 1.5, px: 2.5, '&:hover': { bgcolor: '#f8fafc' } }}
                  secondaryAction={
                    <IconButton edge="end" size="small" onClick={() => handleDelete(item._id)} sx={{ color: '#cbd5e1', '&:hover': { color: '#ef4444' } }}>
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  }
                >
                  <HistoryIcon sx={{ mr: 2, color: '#94a3b8', fontSize: 20 }} />
                  <ListItemText
                    primary={item.searchQuery}
                    primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}
                    secondary={formatHistoryTime(item.timestamp)}
                    secondaryTypographyProps={{ fontSize: '0.75rem', color: '#94a3b8' }}
                  />
                </ListItem>
                {index < history.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Box sx={{ p: 6, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>No searches found</Typography>
            <Typography variant="caption" sx={{ color: '#94a3b8' }}>Analyze a course to see it here.</Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
}