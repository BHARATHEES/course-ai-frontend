import React, { useState } from "react";
import { Container, Paper, Typography, Box, Divider, Button, TextField, Alert, Stack } from "@mui/material";
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';

export default function Profile({ user }) {
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showPassFields, setShowPassFields] = useState(false);
  const [lastChanged, setLastChanged] = useState(user?.passwordLastChanged);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
      return setMessage({ type: "error", text: "Passwords do not match!" });
    }

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/update-password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, newPassword: newPass }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: "success", text: "Password updated!" });
        setLastChanged(data.passwordLastChanged);
        const updatedUser = { ...user, passwordLastChanged: data.passwordLastChanged };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setNewPass(""); 
        setConfirmPass(""); 
        setShowPassFields(false);
      } else {
        setMessage({ type: "error", text: data.message });
      }
    } catch (err) { 
      setMessage({ type: "error", text: "Server error" }); 
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <PersonOutlineIcon sx={{ color: '#64748b' }} />
        <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b' }}>Account Settings</Typography>
      </Box>
      
      <Paper elevation={0} sx={{ p: 3, border: '1px solid #e2e8f0', borderRadius: 3 }}>
        <Stack spacing={2.5}>
          {/* Section: Profile Info */}
          <Box>
            <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>General</Typography>
            <Stack spacing={2} sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>Full Name</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b' }}>{user?.name}</Typography>
              </Box>
              <Divider />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>Username</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b' }}>@{user?.username}</Typography>
              </Box>
              <Divider />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>Email</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b' }}>{user?.email}</Typography>
              </Box>
            </Stack>
          </Box>

          {/* Section: Security */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Security</Typography>
            <Box sx={{ mt: 2, p: 2, border: '1px solid #f1f5f9', bgcolor: '#f8fafc', borderRadius: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b' }}>Password</Typography>
                  <Typography variant="caption" sx={{ color: '#94a3b8' }}>Changed: {formatDate(lastChanged)}</Typography>
                </Box>
                <Button size="small" variant="outlined" onClick={() => setShowPassFields(!showPassFields)} sx={{ textTransform: 'none', borderRadius: 1.5, fontSize: '0.75rem' }}>
                  {showPassFields ? "Cancel" : "Update"}
                </Button>
              </Box>

              {showPassFields && (
                <Box sx={{ mt: 2 }}>
                  <form onSubmit={handleChangePassword}>
                    <Stack spacing={1.5}>
                      <TextField 
                        label="New Password" 
                        type="password" 
                        size="small" 
                        fullWidth 
                        value={newPass} 
                        onChange={(e) => setNewPass(e.target.value)} 
                        sx={{ bgcolor: '#ffffff' }}
                      />
                      <TextField 
                        label="Confirm" 
                        type="password" 
                        size="small" 
                        fullWidth 
                        value={confirmPass} 
                        onChange={(e) => setConfirmPass(e.target.value)} 
                        sx={{ bgcolor: '#ffffff' }}
                      />
                      <Button fullWidth variant="contained" type="submit" size="small" sx={{ bgcolor: '#0f172a', py: 1, textTransform: 'none' }}>
                        Save Changes
                      </Button>
                    </Stack>
                  </form>
                </Box>
              )}
            </Box>
            {message.text && <Alert severity={message.type} sx={{ mt: 2, fontSize: '0.75rem', py: 0 }}>{message.text}</Alert>}
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
}