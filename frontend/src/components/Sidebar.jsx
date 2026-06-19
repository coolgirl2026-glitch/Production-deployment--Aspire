import { TOOLS } from "../data/tools.js";
import { Clock3 } from "lucide-react";

export function Sidebar({ activeTool, activeView, onToolChange, onHistoryClick }) {
  return (
    <aside className="sidebar">
      <p className="eyebrow">Tools</p>
      {TOOLS.map((tool) => {
        const Icon = tool.icon;
        const active = activeTool === tool.id;

        return (
          <button
            key={tool.id}
            className={active ? "tool-button active" : "tool-button"}
            onClick={() => onToolChange(tool.id)}
            type="button"
          >
            <span className="tool-icon">
              <Icon size={18} />
            </span>
            <span>
              <strong>{tool.label}</strong>
              <small>{tool.sublabel}</small>
            </span>
          </button>
        );
      })}
    </aside>
  );
}
