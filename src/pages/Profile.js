import React, { useState, useEffect } from "react";
import {
  Container, Paper, Typography, Box, Divider, Button,
  TextField, Alert, Stack, Card, Grid, Skeleton,
} from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ArrowBackIcon     from "@mui/icons-material/ArrowBack";
import SearchIcon        from "@mui/icons-material/Search";
import TrendingUpIcon    from "@mui/icons-material/TrendingUp";
import { useNavigate }   from "react-router-dom";
import api               from "../services/api";

const inputSx = {
  "& .MuiOutlinedInput-root": {
    background: "var(--theme-bg-primary)",
    color:      "var(--theme-text-primary)",
    "& fieldset":         { borderColor: "var(--theme-border-primary)" },
    "&:hover fieldset":   { borderColor: "var(--theme-accent-primary)" },
    "&.Mui-focused fieldset": { borderColor: "var(--theme-accent-primary)" },
  },
  "& label": { color: "var(--theme-text-secondary)", "&.Mui-focused": { color: "var(--theme-accent-primary)" } },
};

export default function Profile({ user }) {
  const navigate = useNavigate();
  const [newPass,      setNewPass]      = useState("");
  const [confirmPass,  setConfirmPass]  = useState("");
  const [showFields,   setShowFields]   = useState(false);
  const [lastChanged,  setLastChanged]  = useState(user?.passwordLastChanged);
  const [message,      setMessage]      = useState({ type: "", text: "" });
  const [stats,        setStats]        = useState(null);
  const [loading,      setLoading]      = useState(true);

  useEffect(() => {
    api.getProfileStats().then((res) => {
      if (!res.error) setStats(res.stats);
      setLoading(false);
    });
  }, []);

  const flash = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 4000);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPass !== confirmPass) { flash("error", "Passwords do not match"); return; }
    if (newPass.length < 6) { flash("error", "Password must be at least 6 characters"); return; }

    const res = await api.updatePassword(user.email, newPass);
    if (!res.error) {
      flash("success", "Password updated successfully.");
      setLastChanged(res.passwordLastChanged);
      const updated = { ...user, passwordLastChanged: res.passwordLastChanged };
      localStorage.setItem("user", JSON.stringify(updated));
      setNewPass(""); setConfirmPass(""); setShowFields(false);
    } else {
      flash("error", res.error);
    }
  };

  const fmt = (ds) => ds
    ? new Date(ds).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    : "Never";

  return (
    <Container maxWidth="sm" sx={{ my: 3, mb: 4 }}>
      <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
        <Button onClick={() => navigate("/dashboard")}
          startIcon={<ArrowBackIcon />}
          sx={{ textTransform: "none", color: "var(--theme-accent-primary)", fontWeight: 600 }}>
          Back
        </Button>
      </Box>

      <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}>
        <PersonOutlineIcon sx={{ color: "var(--theme-text-secondary)" }} />
        <Typography variant="h5" sx={{ fontWeight: 700, color: "var(--theme-text-primary)" }}>
          Account Settings
        </Typography>
      </Box>

      {/* Stats cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6}>
          <Card elevation={0} sx={{ p: 2, border: "1px solid var(--theme-border-primary)", borderRadius: "10px", bgcolor: "var(--theme-surface-card)" }}>
            {loading ? <Skeleton variant="text" width="60%" /> : (
              <>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                  <SearchIcon sx={{ color: "var(--theme-accent-primary)" }} />
                </Box>
                <Typography variant="caption" sx={{ color: "var(--theme-text-secondary)", fontWeight: 600, textTransform: "uppercase" }}>
                  Total Searches
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: "var(--theme-accent-primary)" }}>
                  {stats?.totalSearches ?? 0}
                </Typography>
              </>
            )}
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card elevation={0} sx={{ p: 2, border: "1px solid var(--theme-border-primary)", borderRadius: "10px", bgcolor: "var(--theme-surface-card)" }}>
            {loading ? <Skeleton variant="text" width="60%" /> : (
              <>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                  <TrendingUpIcon sx={{ color: "var(--theme-accent-secondary)" }} />
                </Box>
                <Typography variant="caption" sx={{ color: "var(--theme-text-secondary)", fontWeight: 600, textTransform: "uppercase" }}>
                  Member Since
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: "var(--theme-text-primary)", mt: 0.5 }}>
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short" })
                    : "—"}
                </Typography>
              </>
            )}
          </Card>
        </Grid>
      </Grid>

      {/* Profile info + password */}
      <Paper elevation={0} sx={{ p: 3, border: "1px solid var(--theme-border-primary)", borderRadius: "10px", bgcolor: "var(--theme-surface-card)" }}>
        <Stack spacing={2.5}>
          {/* General */}
          <Box>
            <Typography variant="caption" sx={{ color: "var(--theme-text-tertiary)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              General
            </Typography>
            <Stack spacing={2} sx={{ mt: 1.5 }}>
              {[
                { label: "Full Name", value: user?.name },
                { label: "Username",  value: `@${user?.username}` },
                { label: "Email",     value: user?.email },
              ].map(({ label, value }) => (
                <Box key={label}>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="body2" sx={{ color: "var(--theme-text-secondary)" }}>{label}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: "var(--theme-text-primary)" }}>{value}</Typography>
                  </Box>
                  <Divider sx={{ mt: 1.5, borderColor: "var(--theme-border-primary)" }} />
                </Box>
              ))}
            </Stack>
          </Box>

          {/* Security */}
          <Box>
            <Typography variant="caption" sx={{ color: "var(--theme-text-tertiary)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Security
            </Typography>
            <Box sx={{ mt: 1.5, p: 2, border: "1px solid var(--theme-border-primary)", bgcolor: "var(--theme-bg-secondary)", borderRadius: "8px" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "var(--theme-text-primary)" }}>
                    Password
                  </Typography>
                  <Typography variant="caption" sx={{ color: "var(--theme-text-tertiary)" }}>
                    Last changed: {fmt(lastChanged)}
                  </Typography>
                </Box>
                <Button size="small" variant="outlined" onClick={() => setShowFields(!showFields)}
                  sx={{ textTransform: "none", borderRadius: "6px" }}>
                  {showFields ? "Cancel" : "Update"}
                </Button>
              </Box>

              {showFields && (
                <Box sx={{ mt: 2 }}>
                  <form onSubmit={handleChangePassword}>
                    <Stack spacing={1.5}>
                      <TextField label="New Password" type="password" size="small" fullWidth
                        value={newPass} onChange={(e) => setNewPass(e.target.value)} sx={inputSx} />
                      <TextField label="Confirm" type="password" size="small" fullWidth
                        value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} sx={inputSx} />
                      <Button fullWidth variant="contained" type="submit" size="small" sx={{
                        bgcolor: "var(--theme-accent-primary)", color: "white", py: 1,
                        textTransform: "none", "&:hover": { bgcolor: "var(--theme-accent-secondary)" },
                      }}>
                        Save Changes
                      </Button>
                    </Stack>
                  </form>
                </Box>
              )}
            </Box>
          </Box>
        </Stack>

        {message.text && (
          <Alert severity={message.type || "info"} sx={{ mt: 2, fontSize: "0.85rem" }}>
            {message.text}
          </Alert>
        )}
      </Paper>
    </Container>
  );
}
