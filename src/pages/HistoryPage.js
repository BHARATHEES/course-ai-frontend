import React, { useState, useEffect } from "react";
import {
  Container, Paper, Typography, Box, Divider,
  List, ListItem, ListItemText, IconButton,
  CircularProgress, Button, Stack, Dialog,
  DialogContent, DialogTitle, Alert,
} from "@mui/material";
import HistoryIcon      from "@mui/icons-material/History";
import ArrowBackIcon    from "@mui/icons-material/ArrowBack";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DeleteSweepIcon  from "@mui/icons-material/DeleteSweep";
import CloseIcon        from "@mui/icons-material/Close";
import { useNavigate }  from "react-router-dom";
import AnalysisResult   from "../components/AnalysisResult";
import api              from "../services/api";

export default function HistoryPage() {
  const [history,  setHistory]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [selected, setSelected] = useState(null);
  const [msgType,  setMsgType]  = useState("");
  const [msgText,  setMsgText]  = useState("");
  const navigate = useNavigate();

  useEffect(() => { fetchHistory(); }, []);

  const fetchHistory = async () => {
    setLoading(true);
    const res = await api.getHistory();
    if (!res.error) setHistory(res.data || []);
    setLoading(false);
  };

  const flash = (type, text) => {
    setMsgType(type); setMsgText(text);
    setTimeout(() => setMsgText(""), 3000);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this item?")) return;
    const res = await api.deleteHistoryItem(id);
    if (!res.error) setHistory((h) => h.filter((x) => x._id !== id));
    else flash("error", res.error);
  };

  const handleClearAll = async () => {
    if (!window.confirm("Clear all history? This cannot be undone.")) return;
    const res = await api.deleteAllHistory();
    if (!res.error) { setHistory([]); flash("success", "History cleared."); }
    else flash("error", res.error);
  };

  const fmt = (ds) => {
    const d = new Date(ds), now = new Date();
    const time = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    if (d.toDateString() === now.toDateString()) return `Today, ${time}`;
    const yest = new Date(); yest.setDate(now.getDate() - 1);
    if (d.toDateString() === yest.toDateString()) return `Yesterday, ${time}`;
    return `${d.toLocaleDateString("en-GB")} · ${time}`;
  };

  if (loading) return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
      <CircularProgress size={30} />
    </Box>
  );

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2.5 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <IconButton size="small" onClick={() => navigate(-1)}
            sx={{ bgcolor: "var(--theme-bg-secondary)", border: "1px solid var(--theme-border-primary)" }}>
            <ArrowBackIcon fontSize="small" />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 800, color: "var(--theme-text-primary)" }}>
            History
          </Typography>
        </Stack>
        {history.length > 0 && (
          <Button size="small" color="error"
            startIcon={<DeleteSweepIcon />} onClick={handleClearAll}
            sx={{ textTransform: "none", fontWeight: 700 }}>
            Clear All
          </Button>
        )}
      </Box>

      {msgText && <Alert severity={msgType || "info"} sx={{ mb: 2 }}>{msgText}</Alert>}

      <Paper elevation={0} sx={{
        border: "1px solid var(--theme-border-primary)",
        borderRadius: 3, overflow: "hidden",
        bgcolor: "var(--theme-surface-card)",
      }}>
        {history.length > 0 ? (
          <List disablePadding>
            {history.map((item, idx) => (
              <React.Fragment key={item._id}>
                <ListItem
                  onClick={() => item.analysisResult && setSelected(item)}
                  sx={{
                    py: 1.5, px: 2.5,
                    cursor: item.analysisResult ? "pointer" : "default",
                    "&:hover": { bgcolor: "var(--theme-bg-secondary)" },
                  }}
                  secondaryAction={
                    <IconButton edge="end" size="small"
                      onClick={(e) => { e.stopPropagation(); handleDelete(item._id); }}
                      sx={{ color: "var(--theme-text-tertiary)", "&:hover": { color: "var(--theme-status-error)" } }}>
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  }
                >
                  <HistoryIcon sx={{ mr: 2, color: "var(--theme-text-secondary)", fontSize: 20 }} />
                  <ListItemText
                    primary={item.courseName}
                    primaryTypographyProps={{ fontWeight: 600, color: "var(--theme-text-primary)" }}
                    secondary={
                      <>
                        <span style={{ fontSize: "0.75rem", color: "var(--theme-text-tertiary)" }}>
                          {fmt(item.createdAt)}
                        </span>
                        {item.analysisResult && (
                          <span style={{ display: "block", fontSize: "0.7rem", color: "var(--theme-accent-primary)" }}>
                            ✓ Analysis saved — click to view
                          </span>
                        )}
                      </>
                    }
                  />
                </ListItem>
                {idx < history.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Box sx={{ p: 6, textAlign: "center" }}>
            <Typography variant="body2" sx={{ color: "var(--theme-text-secondary)", fontWeight: 600 }}>
              No history yet
            </Typography>
            <Typography variant="caption" sx={{ color: "var(--theme-text-tertiary)" }}>
              Analyse a course to see it here.
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Detail modal */}
      <Dialog open={Boolean(selected)} onClose={() => setSelected(null)}
        fullWidth maxWidth="md"
        PaperProps={{ sx: { borderRadius: 3, maxHeight: "90vh", bgcolor: "var(--theme-surface-card)" } }}>
        {selected && (
          <>
            <DialogTitle sx={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              borderBottom: "1px solid var(--theme-border-primary)",
            }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: "var(--theme-text-primary)" }}>
                {selected.courseName}
              </Typography>
              <IconButton size="small" onClick={() => setSelected(null)}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 3 }}>
              <AnalysisResult data={selected.analysisResult} courseName={selected.courseName} />
            </DialogContent>
          </>
        )}
      </Dialog>
    </Container>
  );
}
