import { useState } from "react";
import { ClipboardCheck, FileText, Target, Check, Copy } from "lucide-react";
import { CopyButton } from "./CopyButton.jsx";
import { ScoreBar } from "./ScoreBar.jsx";

export function OutputPanel({ toolId, data }) {
  let displayData = data;

  if (toolId === "intelligence" && data.sections) {
    const rawSections = data.sections || [];
    let pitchAngle = null;
    let positioning = null;
    const filteredSections = [];

    for (const section of rawSections) {
      if (section.title === "Recommended Pitch Angle") {
        pitchAngle = section.text || "";
      } else if (section.title === "Recommended Positioning") {
        positioning = section.text || "";
      } else if (section.title === "Recommended Next Action" || section.title.includes("Next Action")) {
        // completely remove this section
      } else {
        filteredSections.push(section);
      }
    }

    if (positioning || pitchAngle) {
      const combinedText = [
        positioning ? `Recommended Positioning:\n${positioning}` : "",
        pitchAngle ? `Recommended Pitch Angle:\n${pitchAngle}` : "",
      ].filter(Boolean).join("\n\n");

      // Insert at index 2 (third position) where pitch angle/positioning sits.
      filteredSections.splice(2, 0, {
        title: "Recommended Positioning & Pitch Angle",
        icon: "🎯",
        text: combinedText,
      });
    }

    displayData = { ...data, sections: filteredSections };
  }

  if (toolId === "opportunity-discovery" || toolId === "icp") {
    return (
      <div className="output-stack">
        <div className="fit-card">
          <Target size={22} />
          <div>
            <strong>{displayData.fitLevel}</strong>
            <span>Overall prospect assessment</span>
          </div>
        </div>

        <div className="output-card">
          <p className="section-label">Fit Scores</p>
          <ScoreBar label="Aspire Fit" score={displayData.aspireScore} />
          <ScoreBar label="Thriving Fit" score={displayData.thrivingScore} />
        </div>

        <div className="metric-grid">
          <Metric label="Urgency" value={displayData.urgency} />
          <Metric label="Budget Readiness" value={displayData.budget} />
        </div>

        <TextCard title="Recommendation" text={displayData.recommendation} highlighted />
        <TextCard title="Reasoning" text={displayData.reasoning} />

        {displayData.sections && displayData.sections.map((section) => (
          <article className="output-card" key={section.title}>
            <div className="card-title-row">
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {section.icon ? (
                  <span style={{ fontSize: "1.1rem", lineHeight: 1 }}>{section.icon}</span>
                ) : (
                  <FileText size={17} />
                )}
                <strong>{section.title}</strong>
              </div>
              {section.copyable && <CopyButton text={section.text} />}
            </div>

            {section.items ? (
              <ul>
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : (
              <p className="preline">{section.text}</p>
            )}
          </article>
        ))}
      </div>
    );
  }

  if (toolId === "outreach") {
    return (
      <div className="output-stack">
        {displayData.messages.map((message) => (
          <article className="output-card" key={message.channel}>
            <div className="card-title-row">
              <div>
                <ClipboardCheck size={17} />
                <strong>{message.channel}</strong>
              </div>
              <CopyButton text={message.content} />
            </div>
            {message.subject && <p className="subject-line">Subject: {message.subject}</p>}
            <p className="preline">{message.content}</p>
          </article>
        ))}
      </div>
    );
  }

  return (
    <div className="output-stack">
      {toolId === "proposal" && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: "rgba(255, 255, 255, 0.05)", borderRadius: "8px", border: "1px solid rgba(255, 255, 255, 0.1)", marginBottom: "16px" }}>
          <span style={{ fontWeight: "600", fontSize: "0.95rem" }}>📄 Proposal Framework</span>
          <ProposalCopyButton data={displayData} />
        </div>
      )}

      {toolId === "intelligence" && displayData.specialNote && (
        <TextCard title="Special Note" text={displayData.specialNote} highlighted />
      )}

      {displayData.sections.map((section) => (
        <article className="output-card" key={section.title}>
          <div className="card-title-row">
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {section.icon ? (
                <span style={{ fontSize: "1.1rem", lineHeight: 1 }}>{section.icon}</span>
              ) : (
                <FileText size={17} />
              )}
              <strong>{section.title}</strong>
            </div>
            {(section.copyable || toolId === "proposal") && <CopyButton text={section.text} />}
          </div>

          {section.items ? (
            <ul>
              {section.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="preline">{section.text}</p>
          )}
        </article>
      ))}

      {toolId === "execution" && displayData.objectionIntelligence && (
        <article className="output-card highlighted" style={{ borderColor: "#1f6feb", borderWidth: "1.5px", marginBottom: "16px", padding: "18px" }}>
          <p className="section-label" style={{ color: "#1f6feb", fontSize: "0.85rem", fontWeight: "800", letterSpacing: "0.08em", marginBottom: "8px" }}>
            ⚡ Objection Intelligence Breakdown
          </p>
          
          <div style={{ marginBottom: "16px", paddingBottom: "14px", borderBottom: "1px dashed #d5deea" }}>
            <span style={{ fontSize: "11px", color: "#687a8d", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.05em" }}>Actual Concern</span>
            <div style={{ fontSize: "1.1rem", fontWeight: "800", color: "#10233f", marginTop: "4px" }}>
              {displayData.objectionIntelligence.actualConcern}
            </div>
            {displayData.objectionIntelligence.phraseHeard && (
              <div style={{ fontSize: "0.8rem", color: "#687a8d", marginTop: "4px", fontStyle: "italic" }}>
                Objection heard: "{displayData.objectionIntelligence.phraseHeard}"
              </div>
            )}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px" }}>
            <div style={{ background: "#ffffff", padding: "12px", borderRadius: "8px", border: "1px solid #d5deea" }}>
              <span style={{ fontSize: "11px", color: "#ef4444", fontWeight: "800", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>🔄 Reframe</span>
              <p style={{ margin: 0, fontSize: "12.5px", lineHeight: "1.5", color: "#34516b" }}>{displayData.objectionIntelligence.matrix?.reframe}</p>
            </div>
            <div style={{ background: "#ffffff", padding: "12px", borderRadius: "8px", border: "1px solid #d5deea" }}>
              <span style={{ fontSize: "11px", color: "#1f6feb", fontWeight: "800", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>📊 Proof</span>
              <p style={{ margin: 0, fontSize: "12.5px", lineHeight: "1.5", color: "#34516b" }}>{displayData.objectionIntelligence.matrix?.proof}</p>
            </div>
            <div style={{ background: "#ffffff", padding: "12px", borderRadius: "8px", border: "1px solid #d5deea" }}>
              <span style={{ fontSize: "11px", color: "#22c55e", fontWeight: "800", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>📚 Story</span>
              <p style={{ margin: 0, fontSize: "12.5px", lineHeight: "1.5", color: "#34516b" }}>{displayData.objectionIntelligence.matrix?.story}</p>
            </div>
            <div style={{ background: "#ffffff", padding: "12px", borderRadius: "8px", border: "1px solid #d5deea" }}>
              <span style={{ fontSize: "11px", color: "#7c3aed", fontWeight: "800", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>❓ Question</span>
              <p style={{ margin: 0, fontSize: "12.5px", lineHeight: "1.5", color: "#34516b" }}>{displayData.objectionIntelligence.matrix?.question}</p>
            </div>
          </div>
        </article>
      )}

      {toolId === "execution" && displayData.nextBestAction && (
        <article className="output-card highlighted" style={{ borderColor: "var(--primary)", borderWidth: "2px" }}>
          <p className="section-label" style={{ color: "var(--primary)", fontSize: "1rem", fontWeight: "700" }}>
            🎯 Next-Best-Action Guidance
          </p>
          <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
              <span style={{ color: "#ef4444", fontWeight: "bold" }}>DO NOT DO:</span>
              <span style={{ color: "var(--text-muted)" }}>{displayData.nextBestAction.doNotDo}</span>
            </div>
            <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
              <span style={{ color: "#22c55e", fontWeight: "bold" }}>INSTEAD DO:</span>
              <span style={{ fontWeight: "600" }}>{displayData.nextBestAction.insteadDo}</span>
            </div>
          </div>
        </article>
      )}
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function TextCard({ title, text, highlighted = false }) {
  return (
    <article className={highlighted ? "output-card highlighted" : "output-card"}>
      <p className="section-label">{title}</p>
      <p>{text}</p>
    </article>
  );
}

function ProposalCopyButton({ data }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const text = (data.sections || [])
      .map((section) => `### ${section.title}\n\n${section.text || ""}`)
      .join("\n\n");
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <button className="copy-button" onClick={handleCopy} type="button">
      {copied ? <Check size={14} /> : <Copy size={14} />}
      {copied ? "Copied Proposal!" : "Copy Full Proposal"}
    </button>
  );
}
