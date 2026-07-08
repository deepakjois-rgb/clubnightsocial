"use client";

import { useEffect, useLayoutEffect, useReducer } from "react";
import { SessionContext } from "./SessionContext";
import { sessionReducer } from "@/reducers/sessionReducer";
import {
  clearSession,
  loadSession,
  saveSession,
} from "@/services/sessionPersistenceService";

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, dispatch] = useReducer(sessionReducer, null);

  useLayoutEffect(() => {
    const savedSession = loadSession();
    if (savedSession) {
      dispatch({ type: "RESTORE_SESSION", payload: savedSession });
    }
  }, []);

  useEffect(() => {
    if (session?.state === "ACTIVE") {
      saveSession(session);
      return;
    }

    clearSession();
  }, [session]);

  return (
    <SessionContext.Provider value={{ session, dispatch }}>
      {children}
    </SessionContext.Provider>
  );
}
