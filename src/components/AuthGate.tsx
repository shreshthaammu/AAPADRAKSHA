import type { ReactNode } from "react";

interface AuthGateProps {
  children: (onLogout: () => void) => ReactNode;
}

export function AuthGate({ children }: AuthGateProps) {
  return <>{children(() => undefined)}</>;
}
