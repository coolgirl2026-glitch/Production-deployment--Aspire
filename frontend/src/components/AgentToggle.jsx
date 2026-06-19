import { AGENTS } from "../data/agents.js";

export function AgentToggle({ agent, onChange }) {
  return (
    <div className="agent-toggle" aria-label="Choose agent">
      {Object.values(AGENTS).map((item) => (
        <button
          key={item.id}
          className={agent === item.id ? "active" : ""}
          onClick={() => onChange(item.id)}
          type="button"
        >
          {item.name}
        </button>
      ))}
    </div>
  );
}
