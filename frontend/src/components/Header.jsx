import { CircleHelp, Settings, User, Zap } from "lucide-react";
import { useState } from "react";
import { AgentToggle } from "./AgentToggle.jsx";
import { AGENTS } from "../data/agents.js";

export function Header({ agent, onAgentChange, user, onOpenAccountPanel, onLogout }) {
  const activeAgent = AGENTS[agent];
  const [menuOpen, setMenuOpen] = useState(false);
  const displayName = user?.name || user?.email || "Account";
  const initial = (user?.name || user?.email || "?").trim().charAt(0).toUpperCase();

  const openPanel = (panel) => {
    onOpenAccountPanel(panel);
    setMenuOpen(false);
  };

  return (
    <header className="topbar">
      <div className="brand">
        <div className="brand-mark">
          <Zap size={17} />
        </div>
        <div>
          <strong>Sales Research Copilot</strong>
          <span>{activeAgent.tagline}</span>
        </div>
      </div>

      <AgentToggle agent={agent} onChange={onAgentChange} />

      <div className="user-menu">
        <button className="user-pill" onClick={() => setMenuOpen((open) => !open)} type="button">
          <span>{initial}</span>
          {displayName}
        </button>

        {menuOpen && (
          <div className="user-dropdown">
            <button onClick={() => openPanel("profile")} type="button">
              <User size={15} />
              Profile Details
            </button>
            <button onClick={onLogout} type="button">Sign out</button>
          </div>
        )}
      </div>
    </header>
  );
}
