import React, { useState, useEffect } from "react";
import {
  Container, Paper, Typography, Box, Button, Stack,
  Grid, Divider, TextField, Alert, CircularProgress,
  IconButton, Tabs, Tab, Dialog, DialogTitle, DialogContent,
  DialogActions, List, ListItem, ListItemText,
} from "@mui/material";
import { styled }          from "@mui/material/styles";
import EditIcon            from "@mui/icons-material/Edit";
import SaveIcon            from "@mui/icons-material/Save";
import CancelIcon          from "@mui/icons-material/Cancel";
import HistoryIcon         from "@mui/icons-material/History";
import FavoriteIcon        from "@mui/icons-material/Favorite";
import FavoriteBorderIcon  from "@mui/icons-material/FavoriteBorder";
import DeleteIcon          from "@mui/icons-material/Delete";
import ArrowBackIcon       from "@mui/icons-material/ArrowBack";
import PersonIcon          from "@mui/icons-material/Person";
import AssignmentIcon      from "@mui/icons-material/Assignment";
import { useNavigate }     from "react-router-dom";
import api                 from "../services/api";

// ─── Styled ───────────────────────────────────────────────────────────────────
const GradientBtn = styled(Button)({
  background:    "var(--theme-accent-primary)",
  color:         "white",
  fontWeight:    700,
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  borderRadius:  "25px",
  "&:hover":     { background: "var(--theme-accent-secondary)", transform: "translateY(-2px)" },
});

const GlassCard = styled(Paper)({
  background:   "var(--theme-surface-card)",
  border:       "1px solid var(--theme-border-primary)",
  borderRadius: "12px",
  boxShadow:    "var(--theme-shadow)",
  transition:   "all 0.3s",
  "&:hover":    { borderColor: "var(--theme-accent-primary)", boxShadow: "var(--theme-shadow-hover)" },
});

const StyledInput = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    background: "var(--theme-bg-secondary)", borderRadius: "8px",
    "& fieldset":         { borderColor: "var(--theme-border-primary)" },
    "&:hover fieldset":   { borderColor: "var(--theme-accent-primary)" },
    "&.Mui-focused fieldset": { borderColor: "var(--theme-accent-primary)" },
  },
  "& .MuiInputLabel-root":     { color: "var(--theme-text-tertiary)", "&.Mui-focused": { color: "var(--theme-accent-primary)" } },
  "& .MuiOutlinedInput-input": { color: "var(--theme-text-primary)" },
});

// ─── Component ────────────────────────────────────────────────────────────────
export default function UserDashboard({ user }) {
  const [tab,       setTab]       = useState(0);
  const [editMode,  setEditMode]  = useState(false);
  const [editName,  setEditName]  = useState(user?.name || "");
  const [msg,       setMsg]       = useState({ type: "", text: "" });
  const [history,   setHistory]   = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [hLoading,  setHLoading]  = useState(false);
  const [fLoading,  setFLoading]  = useState(false);
  const [addFavDlg, setAddFavDlg] = useState(false);
  const [newFavName,setNewFavName]= useState("");
  const [editFav,   setEditFav]   = useState(null);
  const [favNotes,  setFavNotes]  = useState("");
  const [favRating, setFavRating] = useState(0);
  const navigate = useNavigate();

  const flash = (type, text) => {
    setMsg({ type, text });
    setTimeout(() => setMsg({ type: "", text: "" }), 3500);
  };

  // ── Fetch on tab change ────────────────────────────────────────────────────
  useEffect(() => {
    if (tab === 1 && !history.length) fetchHistory();
    if (tab === 2 && !favorites.length) fetchFavorites();
    if (tab === 3) { fetchHistory(); fetchFavorites(); }
  }, [tab]); // eslint-disable-line

  const fetchHistory = async () => {
    setHLoading(true);
    const res = await api.getHistory();
    if (!res.error) setHistory(res.data || []);
    setHLoading(false);
  };

  const fetchFavorites = async () => {
    setFLoading(true);
    const res = await api.getFavorites();
    if (!res.error) setFavorites(res.data || []);
    setFLoading(false);
  };

  // ── Profile ────────────────────────────────────────────────────────────────
  const handleSaveProfile = async () => {
    const res = await api.updateProfile(user.email, editName, user.username);
    if (!res.error) {
      const updated = { ...user, name: editName };
      localStorage.setItem("user", JSON.stringify(updated));
      flash("success", "Profile updated.");
      setEditMode(false);
    } else {
      flash("error", res.error);
    }
  };

  // ── Favorites ──────────────────────────────────────────────────────────────
  const handleAddFav = async () => {
    if (!newFavName.trim()) return;
    const res = await api.addFavorite(newFavName.trim());
    if (!res.error) {
      setFavorites((f) => [res.data, ...f]);
      setNewFavName(""); setAddFavDlg(false);
      flash("success", "Added to favorites.");
    } else flash("error", res.error);
  };

  const handleRemoveFav = async (id, courseName) => {
    if (!window.confirm("Remove from favorites?")) return;
    const res = await api.removeFavorite(courseName);
    if (!res.error) {
      setFavorites((f) => f.filter((x) => x._id !== id));
      flash("success", "Removed from favorites.");
    } else flash("error", res.error);
  };

  const handleUpdateFav = async () => {
    const res = await api.updateFavorite(editFav._id, favNotes, favRating);
    if (!res.error) {
      setFavorites((f) => f.map((x) => x._id === editFav._id ? res.data : x));
      setEditFav(null);
      flash("success", "Updated.");
    } else flash("error", res.error);
  };

  const openEditFav = (fav) => { setEditFav(fav); setFavNotes(fav.notes || ""); setFavRating(fav.rating || 0); };

  // ── History ────────────────────────────────────────────────────────────────
  const handleDeleteHistory = async (id) => {
    if (!window.confirm("Delete?")) return;
    const res = await api.deleteHistoryItem(id);
    if (!res.error) setHistory((h) => h.filter((x) => x._id !== id));
  };

  const fmt = (ds) => new Date(ds).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Page title */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
        <IconButton onClick={() => navigate("/")}
          sx={{ bgcolor: "rgba(59,130,246,0.1)", border: "1px solid var(--theme-border-primary)", color: "var(--theme-accent-primary)" }}>
          <ArrowBackIcon />
        </IconButton>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: "var(--theme-text-primary)" }}>
            My Dashboard
          </Typography>
          <Typography variant="body2" sx={{ color: "var(--theme-text-secondary)" }}>
            Profile · History · Favorites
          </Typography>
        </Box>
      </Box>

      {msg.text && <Alert severity={msg.type || "info"} sx={{ mb: 3 }}>{msg.text}</Alert>}

      {/* Tabs */}
      <GlassCard sx={{ mb: 4 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)}
          sx={{
            "& .MuiTabs-indicator": { bgcolor: "var(--theme-accent-primary)", height: 3 },
            "& .MuiTab-root": { textTransform: "none", fontWeight: 600, color: "var(--theme-text-tertiary)",
              "&.Mui-selected": { color: "var(--theme-text-primary)" } },
          }}>
          <Tab label="Profile"   icon={<PersonIcon sx={{ fontSize: 18 }} />} iconPosition="start" />
          <Tab label="History"   icon={<HistoryIcon sx={{ fontSize: 18 }} />} iconPosition="start" />
          <Tab label="Favorites" icon={<FavoriteBorderIcon sx={{ fontSize: 18 }} />} iconPosition="start" />
          <Tab label="Insights"  icon={<AssignmentIcon sx={{ fontSize: 18 }} />} iconPosition="start" />
        </Tabs>
      </GlassCard>

      {/* ── TAB 0: Profile ─────────────────────────────────────────────────── */}
      {tab === 0 && (
        <GlassCard sx={{ p: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "var(--theme-text-primary)" }}>
              Profile Information
            </Typography>
            {!editMode && (
              <GradientBtn startIcon={<EditIcon />} onClick={() => setEditMode(true)} size="small" sx={{ borderRadius: "20px", px: 3 }}>
                Edit
              </GradientBtn>
            )}
          </Box>
          <Divider sx={{ mb: 3, borderColor: "var(--theme-border-primary)" }} />

          <Stack spacing={3}>
            <Box>
              <Typography variant="caption" sx={{ color: "var(--theme-text-tertiary)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Full Name
              </Typography>
              {editMode
                ? <StyledInput fullWidth size="small" value={editName} onChange={(e) => setEditName(e.target.value)} sx={{ mt: 1 }} />
                : <Typography variant="h6" sx={{ color: "var(--theme-text-primary)", mt: 0.5 }}>{user?.name}</Typography>}
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: "var(--theme-text-tertiary)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Username
              </Typography>
              <Typography variant="body1" sx={{ color: "var(--theme-accent-primary)", mt: 0.5 }}>@{user?.username}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: "var(--theme-text-tertiary)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Email
              </Typography>
              <Typography variant="body1" sx={{ color: "var(--theme-text-secondary)", mt: 0.5 }}>{user?.email}</Typography>
            </Box>

            {editMode && (
              <Stack direction="row" spacing={2}>
                <GradientBtn startIcon={<SaveIcon />} onClick={handleSaveProfile} sx={{ flex: 1 }}>Save</GradientBtn>
                <Button variant="outlined" startIcon={<CancelIcon />} onClick={() => setEditMode(false)}
                  sx={{ flex: 1, borderRadius: "25px", fontWeight: 700, borderColor: "var(--theme-accent-primary)", color: "var(--theme-accent-primary)" }}>
                  Cancel
                </Button>
              </Stack>
            )}
          </Stack>

          <Divider sx={{ my: 3, borderColor: "var(--theme-border-primary)" }} />
          <GradientBtn fullWidth onClick={() => navigate("/profile")} sx={{ borderRadius: "25px", py: 1.5 }}>
            🔐 Change Password
          </GradientBtn>
        </GlassCard>
      )}

      {/* ── TAB 1: History ─────────────────────────────────────────────────── */}
      {tab === 1 && (
        <GlassCard>
          {hLoading
            ? <Box sx={{ p: 6, textAlign: "center" }}><CircularProgress /></Box>
            : history.length > 0
              ? (
                <List disablePadding>
                  {history.map((item, idx) => (
                    <React.Fragment key={item._id}>
                      <ListItem sx={{ py: 2, px: 3 }}
                        secondaryAction={
                          <IconButton size="small" onClick={() => handleDeleteHistory(item._id)}
                            sx={{ color: "var(--theme-text-tertiary)", "&:hover": { color: "var(--theme-status-error)" } }}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        }>
                        <HistoryIcon sx={{ mr: 2, color: "var(--theme-text-secondary)" }} />
                        <ListItemText
                          primary={item.courseName}
                          primaryTypographyProps={{ fontWeight: 600, color: "var(--theme-text-primary)" }}
                          secondary={fmt(item.createdAt)}
                          secondaryTypographyProps={{ color: "var(--theme-text-tertiary)", fontSize: "0.75rem" }}
                        />
                      </ListItem>
                      {idx < history.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              )
              : <Box sx={{ p: 6, textAlign: "center" }}>
                  <HistoryIcon sx={{ fontSize: 48, color: "var(--theme-text-tertiary)", opacity: 0.4 }} />
                  <Typography sx={{ color: "var(--theme-text-secondary)", mt: 1 }}>No search history yet.</Typography>
                </Box>
          }
        </GlassCard>
      )}

      {/* ── TAB 2: Favorites ───────────────────────────────────────────────── */}
      {tab === 2 && (
        <Box>
          <GradientBtn fullWidth startIcon={<FavoriteBorderIcon />} onClick={() => setAddFavDlg(true)} sx={{ mb: 3 }}>
            Add Favorite Course
          </GradientBtn>

          {fLoading
            ? <Box sx={{ textAlign: "center" }}><CircularProgress /></Box>
            : favorites.length > 0
              ? (
                <Grid container spacing={3}>
                  {favorites.map((fav) => (
                    <Grid item xs={12} md={6} key={fav._id}>
                      <GlassCard sx={{ p: 3 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <FavoriteIcon sx={{ color: "#ef4444", fontSize: 20 }} />
                            <Typography sx={{ fontWeight: 700, color: "var(--theme-text-primary)" }}>
                              {fav.courseName}
                            </Typography>
                          </Box>
                          <IconButton size="small" onClick={() => handleRemoveFav(fav._id, fav.courseName)}
                            sx={{ color: "#ef4444" }}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                        {fav.rating > 0 && (
                          <Typography sx={{ color: "#f59e0b", fontSize: "0.85rem", mb: 1 }}>
                            {"⭐".repeat(fav.rating)} {fav.rating}/5
                          </Typography>
                        )}
                        {fav.notes && (
                          <Typography variant="body2" sx={{ color: "var(--theme-text-secondary)", mb: 2 }}>
                            {fav.notes}
                          </Typography>
                        )}
                        <Stack direction="row" spacing={1}>
                          <Button size="small" variant="outlined" onClick={() => openEditFav(fav)}
                            sx={{ flex: 1, textTransform: "none", fontWeight: 600 }}>Edit</Button>
                          <Button size="small" variant="contained" onClick={() => navigate(`/?course=${encodeURIComponent(fav.courseName)}`)}
                            sx={{ flex: 1, textTransform: "none", fontWeight: 600 }}>🔍 Analyse</Button>
                          <Button size="small" variant="contained" onClick={() => navigate(`/roadmap?course=${encodeURIComponent(fav.courseName)}`)}
                            sx={{ flex: 1, textTransform: "none", fontWeight: 600, background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", "&:hover": { transform: "translateY(-2px)" } }}>🗺️ Roadmap</Button>
                        </Stack>
                      </GlassCard>
                    </Grid>
                  ))}
                </Grid>
              )
              : (
                <GlassCard sx={{ p: 6, textAlign: "center" }}>
                  <FavoriteBorderIcon sx={{ fontSize: 56, color: "var(--theme-text-tertiary)", opacity: 0.4 }} />
                  <Typography sx={{ color: "var(--theme-text-secondary)", mt: 1 }}>No favorites yet.</Typography>
                  <GradientBtn onClick={() => setAddFavDlg(true)} sx={{ mt: 2 }}>Add Your First</GradientBtn>
                </GlassCard>
              )
          }
        </Box>
      )}

      {/* ── TAB 3: Insights ────────────────────────────────────────────────── */}
      {tab === 3 && (
        <Grid container spacing={3}>
          {[
            { label: "Total Searches",    value: history.length,   color: "var(--theme-accent-primary)" },
            { label: "Favorite Courses",  value: favorites.length, color: "#ef4444" },
            { label: "Avg Fav Rating",    value: favorites.some((f) => f.rating) ? (favorites.reduce((s, f) => s + (f.rating || 0), 0) / favorites.filter((f) => f.rating).length).toFixed(1) : "—", color: "#f59e0b" },
            { label: "Last Analysed",     value: history[0]?.courseName || "—", color: "#10b981", small: true },
          ].map(({ label, value, color, small }) => (
            <Grid item xs={12} sm={6} md={3} key={label}>
              <GlassCard sx={{ p: 3, textAlign: "center" }}>
                <Typography variant="caption" sx={{ color: "var(--theme-text-tertiary)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  {label}
                </Typography>
                <Typography sx={{ fontSize: small ? "1rem" : "2rem", fontWeight: 800, color, mt: 1 }}>
                  {value}
                </Typography>
              </GlassCard>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Add Favorite Dialog */}
      <Dialog open={addFavDlg} onClose={() => setAddFavDlg(false)} fullWidth maxWidth="xs"
        PaperProps={{ sx: { bgcolor: "var(--theme-surface-card)", borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>❤️ Add Favorite Course</DialogTitle>
        <DialogContent>
          <StyledInput fullWidth label="Course Name" value={newFavName}
            onChange={(e) => setNewFavName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddFav()}
            autoFocus sx={{ mt: 1 }} />
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setAddFavDlg(false)} sx={{ textTransform: "none", fontWeight: 600 }}>Cancel</Button>
          <GradientBtn onClick={handleAddFav}>Add</GradientBtn>
        </DialogActions>
      </Dialog>

      {/* Edit Favorite Dialog */}
      <Dialog open={Boolean(editFav)} onClose={() => setEditFav(null)} fullWidth maxWidth="xs"
        PaperProps={{ sx: { bgcolor: "var(--theme-surface-card)", borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>✏️ Edit: {editFav?.courseName}</DialogTitle>
        <DialogContent>
          <StyledInput fullWidth label="Notes" multiline rows={3} value={favNotes}
            onChange={(e) => setFavNotes(e.target.value)} sx={{ mt: 1, mb: 2 }} />
          <Typography variant="body2" sx={{ fontWeight: 700, mb: 1, color: "var(--theme-text-secondary)" }}>Rating</Typography>
          <Stack direction="row" spacing={1}>
            {[1, 2, 3, 4, 5].map((n) => (
              <Button key={n} size="small" onClick={() => setFavRating(n)}
                variant={favRating === n ? "contained" : "outlined"}
                sx={{ minWidth: 40, fontWeight: 700 }}>
                {n}⭐
              </Button>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setEditFav(null)} sx={{ textTransform: "none", fontWeight: 600 }}>Cancel</Button>
          <GradientBtn onClick={handleUpdateFav}>Save</GradientBtn>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
