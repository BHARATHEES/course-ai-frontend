import React, { useState } from "react";
import { Box }     from "@mui/material";
import { styled }  from "@mui/material/styles";
import Header      from "../components/Header";
import Sidebar     from "../components/Sidebar";

const SIDEBAR_EXPANDED  = "260px";
const SIDEBAR_COLLAPSED = "70px";

const Root = styled(Box)({
  display:         "flex",
  flexDirection:   "column",
  minHeight:       "100vh",
  background:      "var(--theme-bg-primary)",
  color:           "var(--theme-text-primary)",
  transition:      "background-color 0.3s",
});

const Content = styled(Box)(({ $sidebarWidth }) => ({
  marginTop:   "64px",
  marginLeft:  $sidebarWidth,
  flex:        1,
  padding:     "24px",
  transition:  "margin-left 0.3s cubic-bezier(0.4,0,0.2,1)",
  minHeight:   "calc(100vh - 64px)",
  background:  "var(--theme-bg-primary)",
  "@media (max-width: 768px)": {
    marginLeft: 0,
    padding:    "16px",
  },
}));

export default function MainLayout({ user, onLogout, children }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <Root>
      <Header user={user} />
      <Sidebar
        user={user}
        onLogout={onLogout}
        expanded={expanded}
        onToggle={() => setExpanded((v) => !v)}
      />
      <Content $sidebarWidth={expanded ? SIDEBAR_EXPANDED : SIDEBAR_COLLAPSED}>
        {children}
      </Content>
    </Root>
  );
}
