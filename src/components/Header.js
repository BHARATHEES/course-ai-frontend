import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Box, Avatar, Divider, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Header({ user, onLogout }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  return (
    <AppBar
      position="sticky"
      elevation={scrolled ? 2 : 0}
      sx={{
        bgcolor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        borderBottom: scrolled ? 'none' : '1px solid #f1f5f9',
        color: '#1e293b',
        transition: 'all 0.2s ease-in-out'
      }}
    >
      <Container maxWidth="lg">
        {/* Reduced minHeight to 56px for a slimmer "breath" */}
        <Toolbar variant="dense" sx={{ justifyContent: 'space-between', px: { xs: 0 }, minHeight: '56px' }}>

          {/* Logo - Reduced font size */}
          <Typography
            variant="subtitle1"
            sx={{ cursor: 'pointer', fontWeight: 900, color: '#4f46e5', letterSpacing: '-0.8px', fontSize: '1.1rem' }}
            onClick={() => navigate("/")}
          >
            COURSE<span style={{ color: '#0f172a' }}>AI</span>
          </Typography>

          {/* Navigation - Tighter gap */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.2 }}>
            <Button
              size="small"
              onClick={() => navigate("/")}
              sx={{ fontWeight: 600, color: '#475569', textTransform: 'none', fontSize: '0.85rem' }}
            >
              Dashboard
            </Button>
            <Button
              size="small"
              onClick={() => navigate("/about")}
              sx={{ fontWeight: 600, color: '#475569', textTransform: 'none', fontSize: '0.85rem' }}
            >
              About
            </Button>

            {user ? (
              <>
                {/* Reduced Avatar Size to 28px */}
                <IconButton onClick={handleMenuOpen} sx={{ ml: 0.5, p: 0.3 }}>
                  <Avatar
                    src={user?.picture}
                    alt={user?.username}
                    sx={{ width: 28, height: 28, fontSize: '0.75rem', bgcolor: '#6366f1', fontWeight: 700 }}
                  >
                    {user?.username?.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  disableScrollLock
                  sx={{ mt: 1 }}
                  PaperProps={{
                    sx: {
                      width: 180,
                      borderRadius: 2,
                      border: '1px solid #f1f5f9',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                    }
                  }}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                  <Box sx={{ px: 2, py: 1 }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#1e293b', display: 'block' }}>
                      {user.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.65rem' }}>
                      @{user.username}
                    </Typography>
                  </Box>
                  <Divider />
                  <MenuItem onClick={() => { navigate("/profile"); handleMenuClose(); }} sx={{ fontSize: '0.8rem' }}>
                    Settings
                  </MenuItem>
                  <MenuItem onClick={() => { navigate("/history"); handleMenuClose(); }} sx={{ fontSize: '0.8rem' }}>
                    History
                  </MenuItem>
                  <Divider />
                  <MenuItem
                    onClick={() => { handleMenuClose(); onLogout(); }}
                    sx={{ color: '#ef4444', fontWeight: 700, fontSize: '0.8rem' }}
                  >
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                variant="contained"
                size="small"
                onClick={() => navigate("/login")}
                sx={{
                  bgcolor: '#0f172a',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  px: 2,
                  ml: 1,
                  borderRadius: 1,
                  height: '32px' // Explicit height for a compact look
                }}
              >
                Sign In
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}