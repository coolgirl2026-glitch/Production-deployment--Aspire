import { useState, useEffect } from "react";
import { Clock3, FileText, ChevronDown, ChevronUp, User as UserIcon, Eye, PencilLine } from "lucide-react";
import { OutputPanel } from "./OutputPanel.jsx";

const AGENT_LABELS = {
  aspire: "Aspire",
  thriving: "Thriving Workplace",
  Aspire: "Aspire",
  "Thriving Workplace": "Thriving Workplace"
};

const TOOL_LABELS = {
  intelligence: "Sales Intelligence",
  icp: "ICP Qualifier",
  discovery: "Discovery Prep",
  outreach: "Outreach Generator",
  execution: "Deal Execution",
  proposal: "Proposal Intelligence",
  "opportunity-discovery": "Opportunity Discovery"
};

function HistoryItem({ item, onOpen }) {
  const [expanded, setExpanded] = useState(false);
  const [showInputDetails, setShowInputDetails] = useState(false);

  // Determine if this item was accessed by someone other than the creator,
  // or accessed after it was created (used to show the "modified/viewed" indicator)
  const wasAccessedByOther =
    item.last_accessed_by_name &&
    item.last_accessed_by_name !== item.created_by_name;

  return (
    <div style={{ display: "flex", flexDirection: "column", border: "1px solid #dbe4ef", borderRadius: "8px", padding: "14px", backgroundColor: "#ffffff" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
        <div 
          style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer", flex: 1 }} 
          onClick={() => setExpanded(!expanded)}
        >
          <span className="history-icon" style={{ backgroundColor: expanded ? "#eef5ff" : "#edf2f7", color: "#1f6feb", display: "grid", width: "36px", height: "36px", placeItems: "center", borderRadius: "8px" }}>
            <FileText size={17} />
          </span>
          <span className="history-content" style={{ display: "flex", flexDirection: "column", textAlign: "left" }}>
            <strong style={{ color: "#173f7a", fontSize: "14px" }}>{item.company_name}</strong>
            <small style={{ color: "#687a8d", fontSize: "12px", marginTop: "4px" }}>
              {(AGENT_LABELS[item.agent] || item.agent)} / {(TOOL_LABELS[item.tool_type] || item.tool_type || TOOL_LABELS[item.tool] || item.tool)} / {formatDate(item.created_at)}
            </small>

            {/* ── User tracking row ── */}
            <span style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "6px", marginTop: "6px" }}>
              {item.created_by_name && (
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: "4px",
                  backgroundColor: "#eff6ff", color: "#1d4ed8",
                  border: "1px solid #bfdbfe", borderRadius: "4px",
                  padding: "2px 7px", fontSize: "11px", fontWeight: "500",
                }}>
                  <UserIcon size={11} />
                  Created by {item.created_by_name}
                </span>
              )}
              {item.last_accessed_by_name && (
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: "4px",
                  backgroundColor: "#f0fdf4", color: "#15803d",
                  border: "1px solid #bbf7d0", borderRadius: "4px",
                  padding: "2px 7px", fontSize: "11px", fontWeight: "500",
                }}>
                  <Eye size={11} />
                  Last accessed by {item.last_accessed_by_name}
                  {item.last_accessed_at && (
                    <span style={{ color: "#86efac", fontWeight: "400" }}>
                      &nbsp;· {formatDate(item.last_accessed_at)}
                    </span>
                  )}
                </span>
              )}
              {wasAccessedByOther && (
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: "4px",
                  backgroundColor: "#fefce8", color: "#a16207",
                  border: "1px solid #fde68a", borderRadius: "4px",
                  padding: "2px 7px", fontSize: "11px", fontWeight: "500",
                }}>
                  <PencilLine size={11} />
                  Modified
                </span>
              )}
            </span>
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            onClick={() => onOpen(item)}
            className="secondary-button"
            style={{ padding: "6px 10px", fontSize: "11px", minHeight: "28px" }}
            type="button"
          >
            Open
          </button>
          <button
            onClick={() => setExpanded(!expanded)}
            style={{ background: "none", border: "none", color: "#687a8d", cursor: "pointer", display: "flex", alignItems: "center" }}
            type="button"
          >
            {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
      </div>

      {expanded && (
        <div style={{ marginTop: "14px", width: "100%" }}>
          <div className="flex items-center justify-between p-3 bg-slate-900 border border-slate-800 rounded-t-lg text-xs text-slate-300" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#0f172a", border: "1px solid #1e293b", padding: "10px 12px", borderTopLeftRadius: "6px", borderTopRightRadius: "6px" }}>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-400" style={{ color: "#94a3b8", fontWeight: "600", fontSize: "12px" }}>🔍 Inspected Search Profile Context</span>
            </div>
            <button 
              onClick={() => setShowInputDetails(!showInputDetails)} 
              className="p-1 hover:bg-slate-800 rounded transition-colors duration-200"
              style={{ backgroundColor: "transparent", border: "none", color: "#cbd5e1", cursor: "pointer", fontSize: "12px" }}
              type="button"
            >
              {showInputDetails ? '▲ Hide Inputs' : '▼ View Inputs'}
            </button>
          </div>
          
          {showInputDetails && (
            <div style={{ backgroundColor: "#1e293b", color: "#f1f5f9", padding: "12px", border: "1px solid #1e293b", borderTop: "none", fontSize: "12px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: "6px 12px" }}>
                {Object.entries(item.input_values || {}).map(([key, val]) => (
                  <div key={key} style={{ display: "contents" }}>
                    <span style={{ fontWeight: "700", textTransform: "capitalize", color: "#94a3b8" }}>{key.replace(/([A-Z])/g, ' $1')}:</span>
                    <span style={{ overflowWrap: "anywhere" }}>{String(val)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginTop: "12px", padding: "14px", border: "1px solid #dbe4ef", borderRadius: "6px", backgroundColor: "#f8fafc" }}>
            <OutputPanel toolId={item.tool} data={item.output} />
          </div>
        </div>
      )}
    </div>
  );
}

export function HistoryPanel({ history, loading, error, onRefresh, onOpen, onClose }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredHistory = (history || []).filter((item) =>
    item.company_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Reset currentPage back to 1 when history (different tool/agent list) or searchQuery changes
  useEffect(() => {
    setCurrentPage(1);
  }, [history, searchQuery]);

  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredHistory.slice(indexOfFirstItem, indexOfLastItem);
  return (
    <section className="history-panel">
      {onClose && (
        <button 
          onClick={onClose} 
          type="button"
          style={{
            background: "none",
            border: "none",
            color: "#1f6feb",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            padding: 0,
            marginBottom: "16px",
          }}
        >
          ← Back to Tool
        </button>
      )}
      
      <div className="history-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "16px", marginBottom: "16px" }}>
        <div>
          <h1 style={{ margin: 0 }}>Recents</h1>
          <p style={{ margin: "4px 0 0" }}>Open previous AI generations saved for this user.</p>
        </div>
        <div>
          <button className="secondary-button" onClick={onRefresh} type="button">
            Refresh
          </button>
        </div>
      </div>

      {!loading && !error && history.length > 0 && (
        <div style={{ marginBottom: "16px" }}>
          <input
            type="text"
            placeholder="Search by company name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 14px",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              backgroundColor: "var(--card-bg)",
              color: "var(--text)",
              outline: "none",
            }}
          />
        </div>
      )}

      {loading && <div className="history-empty">Loading saved generations...</div>}
      {error && <div className="history-error">{error}</div>}

      {!loading && !error && history.length === 0 && (
        <div className="history-empty">
          <Clock3 size={22} />
          <span>No saved generations yet.</span>
        </div>
      )}

      {!loading && !error && history.length > 0 && filteredHistory.length === 0 && (
        <div className="history-empty">
          <span>No matching companies found.</span>
        </div>
      )}

      {!loading && !error && filteredHistory.length > 0 && (
        <>
          <div className="history-list" style={{ display: "grid", gap: "12px" }}>
            {currentItems.map((item) => (
              <HistoryItem key={item.id} item={item} onOpen={onOpen} />
            ))}
          </div>

          <div className="pagination-controls" style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "20px",
            paddingTop: "16px",
            borderTop: "1px solid #dbe4ef"
          }}>
            <button
              className="secondary-button"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              type="button"
              style={{ minHeight: "36px", padding: "0 16px", opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? "not-allowed" : "pointer" }}
            >
              Previous
            </button>
            <span style={{ fontSize: "13px", color: "#687a8d", fontWeight: "600" }}>
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="secondary-button"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              type="button"
              style={{ minHeight: "36px", padding: "0 16px", opacity: (currentPage === totalPages || totalPages === 0) ? 0.5 : 1, cursor: (currentPage === totalPages || totalPages === 0) ? "not-allowed" : "pointer" }}
            >
              Next
            </button>
          </div>
        </>
      )}
    </section>
  );
}

function formatDate(value) {
  if (!value) return "Unknown date";
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

