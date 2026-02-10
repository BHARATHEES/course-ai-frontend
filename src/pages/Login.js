import React, { useState, useEffect, useCallback } from "react";
import { Container, Paper, TextField, Button, Typography, Divider, Box, Alert, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

console.log("API URL:", process.env.REACT_APP_API_URL);

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  
  // Form States
  const [identifier, setIdentifier] = useState(""); 
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");     
  const [newPassword, setNewPassword] = useState("");
  
  // Flow States
  const [step, setStep] = useState("LOGIN"); 
  const [tempUser, setTempUser] = useState(null);
  const [error, setError] = useState("");

  const handleCallbackResponse = useCallback(async (response) => {
    setError("");
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/google-auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: response.credential }),
      });

      const data = await res.json();
      
      if (res.ok) {
        if (data.needsPassword) {
          setTempUser(data);
          setUsername(data.username); 
          setStep("SET_PROFILE");
        } else {
          localStorage.setItem("user", JSON.stringify(data));
          onLogin(data);
          navigate("/");
        }
      } else {
        setError(data.message || "Google Authentication failed");
      }
    } catch (err) {
      setError("Could not connect to the server.");
    }
  }, [onLogin, navigate]);

  const handleFinalizeAccount = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/set-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: tempUser.email, 
          username: username, 
          password: newPassword 
        }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(data));
        onLogin(data);
        navigate("/");
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Error finalizing account.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data));
        onLogin(data);
        navigate("/");
      } else {
        setError(data.message);
      }
    }
    catch (err) { setError("Server error or backend not running"); }
  };

  useEffect(() => {
    /* global google */
    if (window.google) {
      google.accounts.id.initialize({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        callback: handleCallbackResponse,
      });

      google.accounts.id.renderButton(
        document.getElementById("googleSignIn"),
        { theme: "outline", size: "large", width: "100%" }
      );
    }
  }, [handleCallbackResponse]);

  return (
    <Container maxWidth="xs" sx={{ mt: 10, mb: 4 }}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, 
          border: '1px solid #e2e8f0', 
          borderRadius: 4,
          bgcolor: '#ffffff'
        }}
      >
        <Stack alignItems="center" spacing={1} sx={{ mb: 3 }}>
          <Box sx={{ bgcolor: '#f1f5f9', p: 1, borderRadius: 2 }}>
            <LockOutlinedIcon sx={{ color: '#6366f1' }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b' }}>
            {step === "LOGIN" ? "Login In" : "Complete Profile"}
          </Typography>
        </Stack>
        
        {error && <Alert severity="error" sx={{ mb: 2, fontSize: '0.8rem', py: 0 }}>{error}</Alert>}

        {step === "LOGIN" ? (
          <>
            <form onSubmit={handleSubmit}>
              <TextField 
                fullWidth 
                label="Username or Email"
                size="small"
                margin="dense" 
                required 
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                sx={{ '& label': { fontSize: '0.9rem' } }}
              />
              <TextField 
                fullWidth 
                label="Password" 
                type="password" 
                size="small"
                margin="dense" 
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                sx={{ '& label': { fontSize: '0.9rem' } }}
              />
              <Button 
                fullWidth 
                variant="contained" 
                type="submit" 
                sx={{ mt: 2, bgcolor: '#4f46e5', textTransform: 'none', fontWeight: 700, py: 1 }}
              >
                Continue
              </Button>
            </form>
            <Box sx={{ my: 3 }}>
              <Divider sx={{ '& span': { fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700 } }}>
                OR
              </Divider>
            </Box>
            <div id="googleSignIn" style={{ width: '100%' }}></div>
          </>
        ) : (
          <>
            <Typography variant="caption" sx={{ color: '#64748b', mb: 2, display: 'block', textAlign: 'center' }}>
              Finalize credentials for <b>{tempUser?.email}</b>
            </Typography>

            <form onSubmit={handleFinalizeAccount}>
              <TextField 
                fullWidth 
                label="Username" 
                size="small"
                margin="dense" 
                required 
                value={username} 
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ""))} 
                helperText="Permanent unique identifier"
                FormHelperTextProps={{ sx: { fontSize: '0.65rem' } }}
              />
              <TextField 
                fullWidth 
                label="Set Password" 
                type="password" 
                size="small"
                margin="dense" 
                required 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
              />
              <Button 
                fullWidth 
                variant="contained" 
                type="submit" 
                sx={{ mt: 2, py: 1, bgcolor: '#10b981', '&:hover': { bgcolor: '#059669' }, textTransform: 'none', fontWeight: 700 }}
              >
                Create Account
              </Button>
            </form>
          </>
        )}
      </Paper>
    </Container>
  );
}