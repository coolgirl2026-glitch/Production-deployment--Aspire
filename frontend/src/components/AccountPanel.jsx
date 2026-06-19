export function AccountPanel({ panel, user }) {
  if (!panel) return null;

  const content = {
    profile: {
      title: "Profile Details",
      lines: [
        ["Name", user?.name || "Not available"],
        ["Email", user?.email || "Not available"],
        ["Workspace", "Shared Team Workspace"],
      ],
    },
    help: {
      title: "Help / Support",
      lines: [
        ["Support", "Share the company, tool, and error message with your admin."],
        ["Backend", "Make sure backend health is running on port 3001."],
      ],
    },
    settings: {
      title: "Settings",
      lines: [
        ["Backend URL", import.meta.env.VITE_BACKEND_URL || "http://localhost:3001"],
        ["History", "Saved generations are loaded from Supabase."],
      ],
    },
  }[panel];

  if (!content) return null;

  return (
    <section className="account-panel">
      <h2>{content.title}</h2>
      <div className="account-lines">
        {content.lines.map(([label, value]) => (
          <div key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}
