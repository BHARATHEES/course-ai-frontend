import React, { useState, useEffect, useCallback } from "react";
import {
  Container, Paper, Typography, Box, TextField,
  Button, Divider, Alert, Stack,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useNavigate }  from "react-router-dom";
import api              from "../services/api";
import { validateLoginFields, validateSetPasswordFields } from "../utils/validation";

export default function Login({ onLogin }) {
  const navigate = useNavigate();

  // shared
  const [error, setError] = useState("");

  // login step
  const [identifier, setIdentifier] = useState("");
  const [password,   setPassword]   = useState("");

  // set-profile step (Google OAuth)
  const [step,       setStep]       = useState("LOGIN"); // "LOGIN" | "SET_PROFILE"
  const [tempUser,   setTempUser]   = useState(null);
  const [username,   setUsername]   = useState("");
  const [newPass,    setNewPass]    = useState("");

  // ── Google callback ────────────────────────────────────────────────────────
  const handleGoogle = useCallback(async (response) => {
    setError("");
    const res = await api.googleLogin(response.credential);
    if (res.error) { setError(res.error); return; }
    if (res.needsPassword) {
      setTempUser(res);
      setUsername(res.username || "");
      setStep("SET_PROFILE");
    } else {
      onLogin(res);
      navigate("/");
    }
  }, [onLogin, navigate]);

  useEffect(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        callback: handleGoogle,
      });
      window.google.accounts.id.renderButton(
        document.getElementById("googleSignIn"),
        { theme: "outline", size: "large", width: "100%" }
      );
    }
  }, [handleGoogle]);

  // ── Standard login ─────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const v = validateLoginFields(identifier, password);
    if (!v.valid) { setError(Object.values(v.errors)[0]); return; }

    const res = await api.login(identifier, password);
    if (res.error) { setError(res.error); return; }
    onLogin(res);
    navigate("/");
  };

  // ── Finalize Google account ────────────────────────────────────────────────
  const handleFinalize = async (e) => {
    e.preventDefault();
    setError("");
    const v = validateSetPasswordFields(username, newPass);
    if (!v.valid) { setError(Object.values(v.errors)[0]); return; }

    const res = await api.setPassword(tempUser.email, username, newPass);
    if (res.error) { setError(res.error); return; }
    onLogin(res);
    navigate("/");
  };

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      color: "var(--theme-text-primary)",
      "& fieldset":         { borderColor: "var(--theme-border-primary)" },
      "&:hover fieldset":   { borderColor: "var(--theme-accent-primary)" },
      "&.Mui-focused fieldset": { borderColor: "var(--theme-accent-primary)" },
    },
    "& label": { color: "var(--theme-text-secondary)", "&.Mui-focused": { color: "var(--theme-accent-primary)" } },
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8, mb: 4 }}>
      <Paper elevation={0} sx={{
        p: 3, border: "1px solid var(--theme-border-primary)",
        borderRadius: "12px", bgcolor: "var(--theme-surface-card)",
      }}>
        <Stack alignItems="center" spacing={1} sx={{ mb: 3 }}>
          <Box sx={{ bgcolor: "rgba(59,130,246,0.15)", p: 1, borderRadius: "8px" }}>
            <LockOutlinedIcon sx={{ color: "var(--theme-accent-primary)" }} />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: "var(--theme-text-primary)" }}>
            {step === "LOGIN" ? "Sign In" : "Complete Profile"}
          </Typography>
        </Stack>

        {error && (
          <Alert severity="error" sx={{ mb: 2, fontSize: "0.85rem" }}>{error}</Alert>
        )}

        {step === "LOGIN" ? (
          <>
            <form onSubmit={handleSubmit}>
              <TextField fullWidth label="Username or Email" size="small" margin="dense"
                value={identifier} onChange={(e) => setIdentifier(e.target.value)} sx={inputSx} />
              <TextField fullWidth label="Password" type="password" size="small" margin="dense"
                value={password} onChange={(e) => setPassword(e.target.value)} sx={inputSx} />
              <Button fullWidth variant="contained" type="submit" sx={{
                mt: 2, py: 1.2, bgcolor: "var(--theme-accent-primary)",
                "&:hover": { bgcolor: "var(--theme-accent-secondary)" },
                textTransform: "none", fontWeight: 700,
              }}>
                Continue
              </Button>
            </form>
            <Divider sx={{ my: 3, "& span": { color: "var(--theme-text-tertiary)", fontSize: "0.8rem" } }}>
              OR
            </Divider>
            <div id="googleSignIn" style={{ width: "100%" }} />
          </>
        ) : (
          <>
            <Typography variant="body2" sx={{ color: "var(--theme-text-secondary)", mb: 2, textAlign: "center" }}>
              Set credentials for <strong style={{ color: "var(--theme-text-primary)" }}>{tempUser?.email}</strong>
            </Typography>
            <form onSubmit={handleFinalize}>
              <TextField fullWidth label="Username" size="small" margin="dense"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, ""))}
                helperText="Permanent unique identifier" sx={inputSx} />
              <TextField fullWidth label="Set Password" type="password" size="small" margin="dense"
                value={newPass} onChange={(e) => setNewPass(e.target.value)} sx={inputSx} />
              <Button fullWidth variant="contained" type="submit" sx={{
                mt: 2, py: 1.2, bgcolor: "var(--theme-status-success)",
                "&:hover": { opacity: 0.85 }, textTransform: "none", fontWeight: 700,
              }}>
                Create Account
              </Button>
            </form>
          </>
        )}
      </Paper>
    </Container>
  );
}
