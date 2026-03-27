import React, { useState, useEffect } from "react";
import {
  AppBar, Toolbar, Typography, IconButton,
  Box, Avatar, Popover, Button,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LightModeIcon     from "@mui/icons-material/LightMode";
import DarkModeIcon      from "@mui/icons-material/DarkMode";
import PersonIcon        from "@mui/icons-material/Person";
import { useTheme }      from "../context/ThemeContext";

// ─── Styled ───────────────────────────────────────────────────────────────────

const StyledBar = styled(AppBar)({
  background:   "var(--theme-surface-header)",
  borderBottom: "1px solid var(--theme-border-primary)",
  boxShadow:    "var(--theme-shadow-md)",
  position:     "fixed",
  top: 0, width: "100%", zIndex: 100,
  transition: "all var(--transition-base)",
  backdropFilter: "blur(4px)",
  backgroundColor: "rgba(255, 255, 255, 0.95)",
  "[data-theme='dark'] &": {
    backgroundColor: "rgba(15, 20, 25, 0.95)",
  }
});

const Logo = styled(Typography)({
  cursor:     "pointer",
  fontWeight: "var(--font-weight-bold)",
  fontSize:   "1.4rem",
  letterSpacing: "-0.5px",
  color:      "var(--theme-text-primary)",
  userSelect: "none",
  transition: "all var(--transition-fast)",
  "&:hover":  { 
    color: "var(--theme-accent-primary)",
    transform: "scale(1.05)",
  },
});

const IconBtn = styled(IconButton)({
  color:     "var(--theme-text-tertiary)",
  transition: "all var(--transition-fast)",
  borderRadius: "var(--radius-md)",
  "&:hover": { 
    color: "var(--theme-accent-primary)", 
    background: "rgba(59,130,246,0.1)",
    transform: "translateY(-2px)",
  },
  "&:active": {
    transform: "translateY(0)",
  }
});

// ─── Component ────────────────────────────────────────────────────────────────

export default function Header({ user }) {
  const { mode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [scrolled, setScrolled]   = useState(false);
  const [popoverEl, setPopoverEl] = useState(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <StyledBar elevation={scrolled ? 1 : 0} id="header">
      <Toolbar sx={{ justifyContent: "space-between", minHeight: "64px", px: { xs: 2, md: 3 } }}>
        {/* Logo */}
        <Logo onClick={() => navigate("/")} title="Go to home">
          COURSE<span style={{ color: "var(--theme-accent-primary)" }}>AI</span>
        </Logo>

        {/* Right controls */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          {/* Notifications */}
          <IconBtn id="notifications-btn" title="Notifications" size="medium">
            <NotificationsIcon />
          </IconBtn>

          {/* Theme toggle */}
          <IconBtn
            id="theme-toggle-btn"
            onClick={toggleTheme}
            title={`Switch to ${mode === "dark" ? "light" : "dark"} mode`}
            size="medium"
            sx={{ 
              animation: scrolled ? "none" : "rotation 20s infinite linear",
              "@keyframes rotation": {
                "0%": { transform: "rotate(0deg)" },
                "100%": { transform: "rotate(360deg)" },
              },
              "&:hover": { 
                animation: "none",
                transform: "rotate(180deg)",
              },
            }}
          >
            {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
          </IconBtn>

          {/* Profile avatar (shown when user is passed) */}
          {user && (
            <>
              <IconBtn 
                onClick={(e) => setPopoverEl(e.currentTarget)} 
                sx={{ p: 0.5, ml: 1 }}
                title="Profile menu"
              >
                <Avatar
                  src={user.picture}
                  sx={{
                    width: 38, 
                    height: 38,
                    bgcolor: "linear-gradient(135deg, var(--theme-accent-primary) 0%, var(--theme-accent-secondary) 100%)",
                    fontWeight: "var(--font-weight-semibold)",
                    fontSize: "0.9rem",
                    border: "2px solid var(--theme-border-primary)",
                    transition: "all var(--transition-fast)",
                    cursor: "pointer",
                    "&:hover": {
                      transform: "scale(1.1)",
                      borderColor: "var(--theme-accent-primary)",
                    }
                  }}
                >
                  {user.username?.charAt(0).toUpperCase()}
                </Avatar>
              </IconBtn>

              <Popover
                open={Boolean(popoverEl)}
                anchorEl={popoverEl}
                onClose={() => setPopoverEl(null)}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                PaperProps={{
                  sx: {
                    bgcolor: "var(--theme-surface-card)",
                    border: "1px solid var(--theme-border-primary)",
                    borderRadius: "var(--radius-lg)",
                    boxShadow: "var(--theme-shadow-lg)",
                    p: 2.5, 
                    minWidth: 240, 
                    mt: 1.5,
                    animation: "slideDown 0.2s ease-out",
                    "@keyframes slideDown": {
                      "0%": { opacity: 0, transform: "translateY(-10px)" },
                      "100%": { opacity: 1, transform: "translateY(0)" },
                    }
                  },
                }}
              >
                <Box sx={{ textAlign: "center" }}>
                  <Avatar
                    src={user.picture}
                    sx={{ 
                      width: 64, 
                      height: 64, 
                      mx: "auto", 
                      mb: 2,
                      bgcolor: "linear-gradient(135deg, var(--theme-accent-primary) 0%, var(--theme-accent-secondary) 100%)",
                      fontWeight: "var(--font-weight-bold)",
                      fontSize: "1.2rem",
                      boxShadow: "var(--theme-shadow-md)",
                    }}
                  >
                    {user.username?.charAt(0).toUpperCase()}
                  </Avatar>
                  <Typography sx={{ fontWeight: "var(--font-weight-semibold)", color: "var(--theme-text-primary)", mb: 0.5 }}>
                    @{user.username}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "var(--theme-text-tertiary)", mb: 2, display: "block" }}>
                    {user.email}
                  </Typography>
                  <Box sx={{ mt: 2.5, pt: 2.5, borderTop: "1px solid var(--theme-border-primary)" }}>
                    <Button
                      fullWidth
                      startIcon={<PersonIcon />}
                      size="small"
                      onClick={() => { navigate("/dashboard"); setPopoverEl(null); }}
                      sx={{ 
                        textTransform: "none", 
                        fontWeight: "var(--font-weight-semibold)",
                        color: "var(--theme-accent-primary)",
                        backgroundColor: "rgba(59,130,246,0.08)",
                        borderRadius: "var(--radius-md)",
                        transition: "all var(--transition-fast)",
                        "&:hover": {
                          backgroundColor: "rgba(59,130,246,0.15)",
                          transform: "translateY(-1px)",
                        }
                      }}
                    >
                      View Profile
                    </Button>
                  </Box>
                </Box>
              </Popover>
            </>
          )}
        </Box>
      </Toolbar>
    </StyledBar>
  );
}
