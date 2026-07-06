"use client";

import { createContext, useContext } from "react";
import type { Session } from "@/types";
import type { SessionAction } from "@/reducers/sessionReducer";

export type SessionContextValue = {
  session: Session | null;
  dispatch: React.Dispatch<SessionAction>;
};

export const SessionContext = createContext<SessionContextValue | null>(null);

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return ctx;
}
