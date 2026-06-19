import { useState } from "react";
import { LockKeyhole, Mail, Search, User } from "lucide-react";

export function LoginPage({ onLogin, onSignup, error }) {
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setPassword("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      if (mode === "signup") {
        await onSignup({ name, email, password });
      } else {
        await onLogin({ email, password });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="login-screen">
      <section className="login-panel">
        <div className="login-brand">
          <div className="login-mark">
            <Search size={22} />
          </div>
          <div>
            <strong>Sales Research Copilot</strong>
            <span>Shared Team Workspace</span>
          </div>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div>
            <h1>{mode === "signup" ? "Create your account" : "Sign in"}</h1>
            <p>
              {mode === "signup"
                ? "Create an account to join the shared team workspace."
                : "Sign in with your account to access the shared team workspace."}
            </p>
          </div>

          {mode === "signup" && (
            <label className="login-field">
              <span>Full Name</span>
              <div>
                <User size={17} />
                <input
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Jane Doe"
                  required
                  type="text"
                  value={name}
                />
              </div>
            </label>
          )}

          <label className="login-field">
            <span>Email ID</span>
            <div>
              <Mail size={17} />
              <input
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@company.com"
                required
                type="email"
                value={email}
              />
            </div>
          </label>

          <label className="login-field">
            <span>Password</span>
            <div>
              <LockKeyhole size={17} />
              <input
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                required
                minLength={mode === "signup" ? 6 : undefined}
                type="password"
                value={password}
              />
            </div>
          </label>

          {error && <p className="login-notice">{error}</p>}

          <button className="login-button" type="submit" disabled={submitting}>
            {submitting ? "Please wait..." : mode === "signup" ? "Create account" : "Sign in"}
          </button>

          <button
            type="button"
            className="forgot-button"
            style={{ alignSelf: "center" }}
            onClick={() => switchMode(mode === "signup" ? "login" : "signup")}
          >
            {mode === "signup" ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
          </button>
        </form>
      </section>
    </main>
  );
}
