const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";

function getHeaders(token) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

export async function callCopilot(agent, tool, values, token = null, forceRefresh = false) {
  const forceNewWebSearch = values.forceNewWebSearch ?? forceRefresh;
  const response = await fetch(`${BACKEND_URL}/api/generate`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify({ agent, tool, values, forceRefresh, forceNewWebSearch }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || `Server error: ${response.status}`);
  }

  return response.json();
}

export async function signupUser({ name, email, password }) {
  const response = await fetch(`${BACKEND_URL}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || `Signup failed: ${response.status}`);
  }

  return response.json();
}

export async function loginUser({ email, password }) {
  const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || `Login failed: ${response.status}`);
  }

  return response.json();
}

export async function fetchCurrentUser(token) {
  const response = await fetch(`${BACKEND_URL}/api/auth/me`, {
    method: "GET",
    headers: getHeaders(token),
  });

  if (!response.ok) {
    throw new Error("Session expired");
  }

  return response.json();
}

export async function fetchHistory(token, tool = null, agent = null) {
  let url = `${BACKEND_URL}/api/history`;
  const params = [];
  if (tool) params.push(`tool=${encodeURIComponent(tool)}`);
  if (agent) params.push(`agent=${encodeURIComponent(agent)}`);
  if (params.length > 0) {
    url += `?${params.join("&")}`;
  }
  const response = await fetch(url, {
    method: "GET",
    headers: getHeaders(token),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || `History failed: ${response.status}`);
  }

  return response.json();
}

export async function auditGeneration(company, website, inputs, outputData, token = null) {
  const response = await fetch(`${BACKEND_URL}/api/audit-generation`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify({ company, website, inputs, outputData }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || `Audit failed: ${response.status}`);
  }

  return response.json();
}

// Silently records that the current user opened a Recents item.
// Fire-and-forget — errors are intentionally swallowed so they
// never disrupt the main open flow.
export async function touchAnalysisAccess(token, analysisId) {
  if (!analysisId) return;
  try {
    await fetch(`${BACKEND_URL}/api/history/${analysisId}/touch`, {
      method: "PATCH",
      headers: getHeaders(token),
    });
  } catch (_) {
    // Non-critical — don't propagate
  }
}
