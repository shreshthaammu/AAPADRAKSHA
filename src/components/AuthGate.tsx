import { FormEvent, type ReactNode, useEffect, useState } from "react";
import { Eye, EyeOff, LockKeyhole, RefreshCw, ShieldCheck } from "lucide-react";

const AUTH_SESSION_KEY = "aapadraksha_authenticated";
type GateState = "checking" | "login" | "ready" | "error";

interface AuthStatusResponse {
  protected?: boolean;
}

interface AuthGateProps {
  children: (onLogout: () => void) => ReactNode;
}

function readErrorMessage(payload: unknown, fallback: string): string {
  if (typeof payload === "object" && payload !== null && "error" in payload) {
    const error = (payload as { error?: unknown }).error;
    if (typeof error === "string" && error.trim()) return error;
  }
  return fallback;
}

export function AuthGate({ children }: AuthGateProps) {
  const [gateState, setGateState] = useState<GateState>("checking");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const checkAccessStatus = async () => {
    setGateState("checking");
    setErrorMessage("");

    try {
      const response = await fetch("/api/auth/status", { headers: { Accept: "application/json" } });
      const payload = await response.json().catch(() => ({})) as AuthStatusResponse;

      if (!response.ok) {
        throw new Error("The access service returned an unexpected response.");
      }

      if (!payload.protected) {
        sessionStorage.removeItem(AUTH_SESSION_KEY);
        setGateState("ready");
        return;
      }

      setGateState(sessionStorage.getItem(AUTH_SESSION_KEY) === "true" ? "ready" : "login");
    } catch {
      setErrorMessage("Unable to verify access protection. Check that the AAPADRAKSHA backend is running and try again.");
      setGateState("error");
    }
  };

  useEffect(() => {
    void checkAccessStatus();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!password || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ password })
      });
      const payload = await response.json().catch(() => ({}));

      if (response.ok) {
        sessionStorage.setItem(AUTH_SESSION_KEY, "true");
        setPassword("");
        setGateState("ready");
        return;
      }

      if (response.status === 401) {
        setErrorMessage("That password was not accepted. Please try again.");
      } else if (response.status === 500) {
        setErrorMessage(readErrorMessage(payload, "Private access is not configured on the server."));
      } else {
        setErrorMessage(readErrorMessage(payload, "Access could not be verified. Please try again."));
      }
    } catch {
      setErrorMessage("Unable to reach the AAPADRAKSHA backend. Check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(AUTH_SESSION_KEY);
    setPassword("");
    setErrorMessage("");
    setGateState("login");
  };

  if (gateState === "ready") {
    return <>{children(handleLogout)}</>;
  }

  const isChecking = gateState === "checking";
  const isError = gateState === "error";

  return (
    <main className="auth-gate min-h-screen bg-slate-950 text-white">
      <div className="auth-gate-grid" aria-hidden="true" />
      <div className="auth-gate-glow auth-gate-glow-red" aria-hidden="true" />
      <div className="auth-gate-glow auth-gate-glow-blue" aria-hidden="true" />

      <section className="relative z-10 flex min-h-screen items-center justify-center px-5 py-10">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center justify-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-white shadow-lg shadow-red-900/30">
              <img src="/logo.png" alt="AAPADRAKSHA logo" className="h-full w-full object-contain" />
            </div>
            <div>
              <div className="text-xl font-black tracking-[0.18em] text-white">AAPADRAKSHA</div>
              <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">Flood intelligence platform</div>
            </div>
          </div>

          <div className="auth-gate-panel rounded-2xl border border-slate-700/70 bg-slate-900/90 p-7 shadow-2xl shadow-black/40 sm:p-9">
            <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-300 ring-1 ring-red-400/20">
              {isError ? <RefreshCw className="h-6 w-6" /> : <LockKeyhole className="h-6 w-6" />}
            </div>

            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-red-300">Restricted Access</p>
            <h1 className="text-2xl font-bold tracking-tight text-white">Enter the operations portal</h1>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              This AAPADRAKSHA environment is protected. Use the authorized access password to continue.
            </p>

            {isChecking ? (
              <div className="mt-8 flex items-center gap-3 rounded-lg border border-slate-700 bg-slate-950/50 px-4 py-3 text-sm text-slate-300" role="status">
                <RefreshCw className="h-4 w-4 animate-spin text-blue-300" />
                Checking secure access status...
              </div>
            ) : isError ? (
              <div className="mt-8 space-y-4">
                <p className="rounded-lg border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm leading-5 text-amber-100" role="alert">{errorMessage}</p>
                <button type="button" onClick={() => void checkAccessStatus()} className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900">
                  <RefreshCw className="h-4 w-4" />
                  Retry access check
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                <label htmlFor="site-password" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">Access password</label>
                <div className="relative">
                  <input
                    id="site-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={event => setPassword(event.target.value)}
                    autoComplete="current-password"
                    autoFocus
                    placeholder="Enter password"
                    className="w-full rounded-lg border border-slate-600 bg-slate-950/70 px-4 py-3 pr-12 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
                    disabled={isSubmitting}
                  />
                  <button type="button" onClick={() => setShowPassword(value => !value)} className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-slate-400 transition hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-400" aria-label={showPassword ? "Hide password" : "Show password"}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {errorMessage && <p className="text-sm leading-5 text-red-300" role="alert">{errorMessage}</p>}

                <button type="submit" disabled={!password || isSubmitting} className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-red-950/40 transition hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-60">
                  {isSubmitting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                  {isSubmitting ? "Authenticating..." : "Access AAPADRAKSHA"}
                </button>
              </form>
            )}
          </div>

          <p className="mt-6 text-center text-xs text-slate-500">Authorized disaster response personnel only</p>
        </div>
      </section>
    </main>
  );
}
