import { useState, useEffect } from "react";
import { AccountPanel } from "./components/AccountPanel.jsx";
import { Header } from "./components/Header.jsx";
import { HistoryPanel } from "./components/HistoryPanel.jsx";
import { Sidebar } from "./components/Sidebar.jsx";
import { InputForm } from "./components/InputForm.jsx";
import { LoginPage } from "./components/LoginPage.jsx";
import { OutputPanel } from "./components/OutputPanel.jsx";
import { EmptyState } from "./components/EmptyState.jsx";
import { AGENTS } from "./data/agents.js";
import { callCopilot, fetchHistory, loginUser, signupUser, fetchCurrentUser, auditGeneration, touchAnalysisAccess } from "./api.js";

const TOKEN_STORAGE_KEY = "sales-copilot-token";

export default function App() {
  const [token, setToken] = useState(() => window.localStorage.getItem(TOKEN_STORAGE_KEY));
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const isAuthenticated = Boolean(token && user);
  const [activeView, setActiveView] = useState("tool");
  const [agent, setAgent] = useState("Aspire");
  const [activeTool, setActiveTool] = useState("intelligence");
  const [formValues, setFormValues] = useState({ linkedinUrl: "" });
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState(null);
  const [error, setError] = useState(null);
  const [loginError, setLoginError] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState(null);
  const [accountPanel, setAccountPanel] = useState(null);
  const [isGuest, setIsGuest] = useState(false);
  const [auditResult, setAuditResult] = useState(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditError, setAuditError] = useState(null);
  const [lastSubmittedValues, setLastSubmittedValues] = useState({ linkedinUrl: "" });

  // Restore the session on load (this is the "continuous authentication"
  // piece): if a token was saved from a previous visit, validate it against
  // the backend instead of forcing the person to sign in again.
  useEffect(() => {
    if (!token) {
      setAuthChecked(true);
      return;
    }
    fetchCurrentUser(token)
      .then((result) => setUser(result.user))
      .catch(() => {
        window.localStorage.removeItem(TOKEN_STORAGE_KEY);
        setToken(null);
        setUser(null);
      })
      .finally(() => setAuthChecked(true));
  }, []);

  useEffect(() => {
    if (token && user) {
      loadHistory();
    }
  }, [token, user, activeTool, agent]);

  const getNormalizedAgentKey = (key) => {
    if (!key) return "Aspire";
    if (key.toLowerCase() === "aspire") return "Aspire";
    if (key.toLowerCase() === "thriving" || key.toLowerCase() === "thriving workplace") return "Thriving Workplace";
    return key;
  };

  const activeAgent = AGENTS[getNormalizedAgentKey(agent)] || AGENTS["Aspire"];

  const handleAgentChange = (nextAgent) => {
    setAgent(getNormalizedAgentKey(nextAgent));
    setOutput(null);
    setAuditResult(null);
    setAuditError(null);
    setError(null);
  };

  const handleToolChange = (toolId) => {
    setActiveView("tool");
    setActiveTool(toolId);
    setOutput(null);
    setAuditResult(null);
    setAuditError(null);
    setError(null);
    setAccountPanel(null);
  };

  const handleSubmit = async (values, forceRefresh = false) => {
    setLoading(true);
    setOutput(null);
    setAuditResult(null);
    setAuditError(null);
    setError(null);
    setLastSubmittedValues(values);

    try {
      const result = await callCopilot(agent, activeTool, values, token, forceRefresh);
      setOutput(result.output ?? result);
      const canonicalName = result.canonicalCompany || values.company;
      if (result.canonicalCompany) {
        setFormValues((prev) => ({ ...prev, company: result.canonicalCompany }));
      }
      if (result.analysisId) {
        const newHistoryItem = {
          id: result.analysisId,
          company_name: canonicalName || "Untitled company",
          agent: agent,
          tool_type: activeTool,
          tool: activeTool,
          input_values: { ...values, company: canonicalName },
          output: result.output ?? result,
          created_at: new Date().toISOString(),
          created_by_name: user?.name || null,
          last_accessed_by_name: null,
          last_accessed_at: null,
        };
        setHistory((prev) => [newHistoryItem, ...prev]);
      }
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRunFactualAudit = async () => {
    setIsAuditing(true);
    setAuditError(null);
    setAuditResult(null);
    try {
      const data = await auditGeneration(
        lastSubmittedValues.company,
        lastSubmittedValues.website,
        lastSubmittedValues,
        output,
        token
      );
      if (data.success) {
        setAuditResult({ ...data.audit, webResearchUsed: data.webResearchUsed });
      } else {
        setAuditError("Audit failed — please try again.");
      }
    } catch (e) {
      console.error(e);
      setAuditError(e.message || "Audit failed — please try again.");
    } finally {
      setIsAuditing(false);
    }
  };

  const handleLogin = async (credentials) => {
    setLoginError(null);
    try {
      const result = await loginUser(credentials);
      window.localStorage.setItem(TOKEN_STORAGE_KEY, result.token);
      setToken(result.token);
      setUser(result.user);
    } catch (err) {
      setLoginError(err.message || "Login failed. Please try again.");
    }
  };

  const handleSignup = async (details) => {
    setLoginError(null);
    try {
      const result = await signupUser(details);
      window.localStorage.setItem(TOKEN_STORAGE_KEY, result.token);
      setToken(result.token);
      setUser(result.user);
    } catch (err) {
      setLoginError(err.message || "Signup failed. Please try again.");
    }
  };

  const loadHistory = async ({ silent = false } = {}) => {
    if (!token) return;
    if (!silent) {
      setHistoryLoading(true);
      setHistoryError(null);
    }

    try {
      const result = await fetchHistory(token, activeTool, agent);
      const mappedAnalyses = (result.analyses || []).map((item) => ({
        id: item.id,
        company_name: item.companies?.name || item.input_values?.company || "Untitled company",
        agent: item.agent,
        tool_type: item.tool,
        tool: item.tool,
        input_values: item.input_values,
        output: item.output,
        created_at: item.created_at,
        created_by_name: item.created_by_name || null,
        last_accessed_by_name: item.last_accessed_by_name || null,
        last_accessed_at: item.last_accessed_at || null,
      }));
      setHistory(mappedAnalyses);
    } catch (err) {
      setHistoryError(err.message || "Unable to load recents.");
    } finally {
      if (!silent) setHistoryLoading(false);
    }
  };

  const handleHistoryClick = () => {
    setActiveView("history");
    setOutput(null);
    setAuditResult(null);
    setError(null);
    setAccountPanel(null);
    loadHistory();
  };

  const handleOpenHistoryItem = (item) => {
    setActiveView("tool");
    setActiveTool(item.tool);
    setAgent(getNormalizedAgentKey(item.agent));
    setOutput(item.output);
    setFormValues(item.input_values || {});
    setLastSubmittedValues(item.input_values || {});
    setAuditResult(null);
    setAuditError(null);
    setError(null);
    setAccountPanel(null);
    // Fire-and-forget: record that the current user opened this item
    if (item.id) {
      touchAnalysisAccess(token, item.id);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
    setUser(null);
    setOutput(null);
    setAuditResult(null);
    setHistory([]);
    setAccountPanel(null);
  };

  if (!authChecked) {
    return (
      <main className="login-screen">
        <p style={{ color: "rgba(255,255,255,0.7)" }}>Loading…</p>
      </main>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} onSignup={handleSignup} error={loginError} />;
  }

  return (
    <div className="app-shell">
      <Header
        agent={agent}
        onAgentChange={handleAgentChange}
        onLogout={handleLogout}
        onOpenAccountPanel={setAccountPanel}
        user={user}
      />

      <div className="workspace">
        <Sidebar
          activeTool={activeTool}
          activeView={activeView}
          onHistoryClick={handleHistoryClick}
          onToolChange={handleToolChange}
        />

        <main className="main-panel">
          <AccountPanel panel={accountPanel} user={user} />

          <section className="agent-banner">
            <span className="agent-dot" />
            <span>{activeAgent.name} Agent active</span>
            <span className="agent-banner-subtitle">{activeAgent.tagline}</span>
          </section>

          {activeView === "history" ? (
            <HistoryPanel
              error={historyError}
              history={history}
              loading={historyLoading}
              onOpen={handleOpenHistoryItem}
              onRefresh={() => loadHistory()}
              onClose={() => setActiveView("tool")}
            />
          ) : (
            <>
              <section className={output || loading ? "work-grid has-output" : "work-grid"}>
                <div className="panel">
                  <InputForm
                    key={`${activeTool}-${agent}`}
                    toolId={activeTool}
                    agent={agent}
                    loading={loading}
                    onSubmit={handleSubmit}
                    values={formValues}
                    onChange={setFormValues}
                    onShowHistory={() => {
                      setActiveView("history");
                      loadHistory();
                    }}
                  />
                </div>

                {loading && (
                  <div className="panel output-loading">
                    <div className="spinner" />
                    <p>Generating intelligence report...</p>
                  </div>
                )}

                {output && !loading && (
                  <div className="output-panel">
                    <div className="output-header">
                      <p>AI Output</p>
                      <span>{activeAgent.name} Agent</span>
                    </div>

                    <div style={{ marginBottom: "16px", padding: "16px", backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
                        <div>
                          <h4 style={{ margin: 0, fontSize: "14px", fontWeight: "600", color: "#f1f5f9" }}>🔍 AI Truth & Factual Grounding Monitor</h4>
                          <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#94a3b8" }}>Run a forensic audit to verify if this intelligence is grounded in real company data.</p>
                        </div>
                        <button 
                          onClick={handleRunFactualAudit} 
                          disabled={isAuditing}
                          style={{
                            padding: "8px 16px",
                            backgroundColor: isAuditing ? "#3730a3" : "#4f46e5",
                            color: "#ffffff",
                            fontWeight: "500",
                            fontSize: "12px",
                            borderRadius: "8px",
                            cursor: isAuditing ? "not-allowed" : "pointer",
                            transition: "all 0.2s",
                            border: "none"
                          }}
                        >
                          {isAuditing ? '⏳ Auditing Data...' : '🛡️ Verify Accuracy'}
                        </button>
                      </div>

                      {auditError && (
                        <div style={{ marginTop: "12px", color: "#f87171", fontSize: "12px", fontWeight: "500" }}>
                          ❌ {auditError}
                        </div>
                      )}

                      {auditResult && (
                        <div style={{ marginTop: "16px" }}>
                          {!auditResult.webResearchUsed && (
                            <div style={{
                              background: "#7f1d1d",
                              border: "1px solid #f87171",
                              color: "#fecaca",
                              padding: "10px 16px",
                              borderRadius: "6px",
                              fontSize: "12px",
                              fontWeight: "600",
                              marginBottom: "12px"
                            }}>
                              ⚠️ Audit ran without web research — score may not reflect real-world accuracy.
                            </div>
                          )}

                          <div style={{ paddingTop: "16px", borderTop: "1px solid #1e293b", display: "grid", gridTemplateColumns: "1.2fr 2.8fr", gap: "16px" }}>
                            <div style={{ borderRight: "1px solid #1e293b", paddingRight: "16px" }}>
                              <div style={{ marginBottom: "12px" }}>
                                <span style={{ fontSize: "11px", color: "#94a3b8", display: "block" }}>Confidence Score</span>
                                <span style={{
                                  fontSize: "24px",
                                  fontWeight: "bold",
                                  display: "block",
                                  marginTop: "2px",
                                  color: auditResult.confidenceScore >= 85 ? '#34d399' : auditResult.confidenceScore >= 70 ? '#fbbf24' : '#f87171'
                                }}>
                                  {auditResult.confidenceScore}%
                                </span>
                              </div>
                              <div style={{ marginBottom: "8px" }}>
                                <span style={{ fontSize: "10px", color: "#64748b", display: "block" }}>Entity Factual Accuracy</span>
                                <span style={{ fontSize: "13px", fontWeight: "600", color: "#cbd5e1" }}>{auditResult.entityAccuracyScore ?? auditResult.confidenceScore}%</span>
                              </div>
                              <div style={{ marginBottom: "8px" }}>
                                <span style={{ fontSize: "10px", color: "#64748b", display: "block" }}>Sales Relevance</span>
                                <span style={{ fontSize: "13px", fontWeight: "600", color: "#cbd5e1" }}>{auditResult.salesRelevanceScore ?? auditResult.confidenceScore}%</span>
                              </div>
                              <span style={{ fontSize: "12px", display: "block", marginTop: "8px", color: "#94a3b8", fontWeight: "600" }}>{auditResult.status}</span>
                              
                              <div style={{ marginTop: "12px", fontSize: "10px", color: "#64748b", lineHeight: "1.3" }}>
                                <strong>Legend:</strong><br />
                                • ≥ 85%: Safe to use.<br />
                                • 70–84%: Review details.<br />
                                • &lt; 70%: Review before presenting.
                              </div>
                            </div>
                            <div>
                              <p style={{ margin: 0, fontSize: "12px", color: "#cbd5e1", lineHeight: "1.6", fontStyle: "italic" }}>"{auditResult.verdictText}"</p>
                              <ul style={{ listStyleType: "disc", paddingLeft: "16px", marginTop: "8px", display: "flex", flexDirection: "column", gap: "4px" }}>
                                {auditResult.findings && auditResult.findings.map((item, idx) => (
                                  <li key={idx} style={{ fontSize: "12px", color: "#94a3b8", lineHeight: "1.5" }}>{item}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <OutputPanel toolId={activeTool} data={output} />
                  </div>
                )}
              </section>

              {!output && !loading && !error && <EmptyState />}
              {error && !loading && (
                <section className={error.includes("No data saved") ? "warning-banner" : "error-state"}>
                  {error.includes("No data saved") ? (
                    <div style={{ background: "#fffbeb", border: "1px solid #fef3c7", color: "#b45309", padding: "16px", borderRadius: "8px", fontWeight: "600", display: "flex", alignItems: "center", gap: "10px", margin: "16px 0" }}>
                      <span>⚠️ No data saved before for this company. Please run a Live Search first.</span>
                    </div>
                  ) : (
                    <>
                      <strong>Generation Failed</strong>
                      <p>{error}</p>
                    </>
                  )}
                </section>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
