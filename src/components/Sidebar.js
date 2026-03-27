import React, { useState } from "react";
import {
  Box, IconButton, List, ListItem, ListItemIcon,
  ListItemText, Typography, Tooltip, Button,
  Avatar, Badge, TextField, Chip,
} from "@mui/material";
import { styled }          from "@mui/material/styles";
import { useNavigate, useLocation } from "react-router-dom";
import ChevronLeftIcon     from "@mui/icons-material/ChevronLeft";
import LogoutIcon          from "@mui/icons-material/Logout";
import AnalyticsIcon       from "@mui/icons-material/Analytics";
import TrendingUpIcon      from "@mui/icons-material/TrendingUp";
import CompareArrowsIcon   from "@mui/icons-material/CompareArrows";
import BarChartIcon        from "@mui/icons-material/BarChart";
import InfoIcon            from "@mui/icons-material/Info";
import PersonIcon          from "@mui/icons-material/Person";
import SearchIcon          from "@mui/icons-material/Search";

// ─── Menu config ─────────────────────────────────────────────────────────────
const MENU = [
  {
    section: "Main",
    items: [
      { label: "Analyse",   path: "/",        icon: AnalyticsIcon,     badge: null },
      { label: "Market",    path: "/market",   icon: BarChartIcon,      badge: null },
    ],
  },
  {
    section: "Explore",
    items: [
      { label: "Trending",  path: "/trending", icon: TrendingUpIcon,   badge: null },
      { label: "Compare",   path: "/compare",  icon: CompareArrowsIcon, badge: null },
      { label: "About",     path: "/about",    icon: InfoIcon,          badge: null },
    ],
  },
  {
    section: "Account",
    items: [
      { label: "Profile",   path: "/dashboard", icon: PersonIcon,      badge: null },
    ],
  },
];

// ─── Styled ───────────────────────────────────────────────────────────────────
const Container = styled(Box)(({ $expanded }) => ({
  position: "fixed", left: 0, top: 64,
  height: "calc(100vh - 64px)",
  width: $expanded ? "260px" : "70px",
  background:   "var(--theme-surface-sidebar)",
  borderRight:  "1px solid var(--theme-border-primary)",
  zIndex: 80,
  display: "flex", flexDirection: "column",
  transition: "width 0.3s cubic-bezier(0.4,0,0.2,1)",
  overflow: "hidden",
  "&::-webkit-scrollbar": { width: "5px" },
  "&::-webkit-scrollbar-thumb": { background: "rgba(59,130,246,0.4)", borderRadius: "4px" },
}));

const Item = styled(ListItem)(({ $active, $expanded }) => ({
  margin:        $expanded ? "4px 8px" : "4px",
  borderRadius:  "10px",
  paddingLeft:   $expanded ? "14px" : "8px",
  paddingRight:  $expanded ? "14px" : "8px",
  cursor:        "pointer",
  justifyContent: $expanded ? "flex-start" : "center",
  borderLeft:    $active ? "3px solid var(--theme-accent-primary)" : "3px solid transparent",
  background:    $active ? "rgba(59,130,246,0.15)" : "transparent",
  color:         $active ? "var(--theme-accent-primary)" : "var(--theme-text-secondary)",
  transition:    "all 0.25s",
  "&:hover": {
    background: "rgba(59,130,246,0.1)",
    color: "var(--theme-accent-primary)",
    "& .MuiListItemIcon-root": { color: "var(--theme-accent-primary)" },
  },
  "& .MuiListItemIcon-root": {
    minWidth: $expanded ? "40px" : "24px",
    color: $active ? "var(--theme-accent-primary)" : "var(--theme-text-tertiary)",
    transition: "all 0.25s",
  },
}));

const SectionLabel = styled(Typography)(({ $expanded }) => ({
  fontSize: "0.68rem", fontWeight: 700,
  textTransform: "uppercase", letterSpacing: "0.5px",
  color: "var(--theme-text-tertiary)",
  padding: $expanded ? "14px 16px 6px" : "14px 4px 6px",
  display: $expanded ? "block" : "none",
}));

// ─── Component ────────────────────────────────────────────────────────────────
export default function Sidebar({ user, onLogout, expanded, onToggle }) {
  const navigate  = useNavigate();
  const location  = useLocation();
  const [search, setSearch] = useState("");

  const nav = (path) => { navigate(path); setSearch(""); };

  const filtered = MENU.map((s) => ({
    ...s,
    items: s.items.filter((i) =>
      i.label.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((s) => s.items.length > 0);

  return (
    <Container $expanded={expanded} id="sidebar">
      {/* Header: avatar + collapse button */}
      {user && (
        <Box sx={{
          display: "flex", alignItems: "center",
          justifyContent: expanded ? "space-between" : "center",
          p: "12px", borderBottom: "1px solid var(--theme-border-primary)",
          background: "var(--theme-bg-secondary)", flexShrink: 0,
        }}>
          <Tooltip title={expanded ? "" : "Expand"} placement="right" arrow>
            <Box onClick={!expanded ? onToggle : undefined}
              sx={{ display: "flex", alignItems: "center", gap: 1.5, cursor: expanded ? "default" : "pointer" }}>
              <Badge overlap="circular" variant="dot"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                sx={{ "& .MuiBadge-badge": { bgcolor: "var(--theme-status-success)" } }}>
                <Avatar sx={{ bgcolor: "var(--theme-accent-primary)", width: 38, height: 38, fontWeight: 700 }}>
                  {user.username?.charAt(0).toUpperCase()}
                </Avatar>
              </Badge>
              {expanded && (
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 700, fontSize: "0.88rem", color: "var(--theme-text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    @{user.username}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "var(--theme-text-tertiary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}>
                    {user.email}
                  </Typography>
                </Box>
              )}
            </Box>
          </Tooltip>

          {expanded && (
            <IconButton size="small" onClick={onToggle}
              sx={{ color: "var(--theme-accent-primary)", "&:hover": { transform: "rotate(-90deg)", transition: "transform 0.3s" } }}>
              <ChevronLeftIcon />
            </IconButton>
          )}
        </Box>
      )}

      {/* Search – only when expanded */}
      {expanded && user && (
        <Box sx={{ px: 2, py: 1.5 }}>
          <TextField
            fullWidth size="small" placeholder="Search menu…"
            value={search} onChange={(e) => setSearch(e.target.value)}
            variant="outlined"
            InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1, color: "var(--theme-text-tertiary)", fontSize: "1rem" }} /> }}
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "var(--theme-text-primary)",
                background: "rgba(59,130,246,0.08)",
                "& fieldset": { borderColor: "rgba(59,130,246,0.25)" },
                "&:hover fieldset": { borderColor: "var(--theme-accent-primary)" },
              },
            }}
          />
        </Box>
      )}

      {/* Menu */}
      <Box sx={{ flex: 1, overflowY: "auto", overflowX: "hidden", pb: 2 }}>
        <List sx={{ p: 0 }}>
          {filtered.map((sec) => (
            <Box key={sec.section}>
              <SectionLabel $expanded={expanded}>{sec.section}</SectionLabel>
              {sec.items.map((item) => {
                const Icon   = item.icon;
                const active = location.pathname === item.path;
                return (
                  <Tooltip key={item.path} title={!expanded ? item.label : ""} placement="right" arrow>
                    <Item $active={active} $expanded={expanded} onClick={() => nav(item.path)}
                      id={`sidebar-${item.label.toLowerCase()}`}>
                      <ListItemIcon><Icon fontSize="small" /></ListItemIcon>
                      {expanded && (
                        <>
                          <ListItemText
                            primary={item.label}
                            primaryTypographyProps={{ fontWeight: active ? 700 : 500, fontSize: "0.9rem" }}
                          />
                          {item.badge && (
                            <Chip label={item.badge} size="small"
                              sx={{ height: 18, fontSize: "0.6rem", fontWeight: 700,
                                bgcolor: "#ef4444", color: "white", ml: 1 }} />
                          )}
                        </>
                      )}
                    </Item>
                  </Tooltip>
                );
              })}
            </Box>
          ))}
        </List>
      </Box>

      {/* Logout */}
      {user && (
        <Box sx={{ p: 1.5, borderTop: "1px solid var(--theme-border-primary)", background: "var(--theme-bg-secondary)", flexShrink: 0 }}>
          <Tooltip title={!expanded ? "Sign Out" : ""} placement="right" arrow>
            <Button
              id="sidebar-logout-btn"
              onClick={onLogout}
              fullWidth={expanded}
              startIcon={expanded ? <LogoutIcon /> : undefined}
              sx={{
                bgcolor: "var(--theme-status-error)", color: "white",
                fontWeight: 700, textTransform: expanded ? "uppercase" : "none",
                fontSize: "0.75rem", borderRadius: "8px",
                minWidth: expanded ? "auto" : "44px",
                px: expanded ? 2 : 1.5,
                "&:hover": { bgcolor: "#dc2626", transform: "translateY(-1px)" },
              }}
            >
              {expanded ? "Sign Out" : <LogoutIcon fontSize="small" />}
            </Button>
          </Tooltip>
        </Box>
      )}
    </Container>
  );
}
