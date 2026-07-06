"use client";

import { useReducer } from "react";
import { SessionContext } from "./SessionContext";
import { sessionReducer } from "@/reducers/sessionReducer";

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, dispatch] = useReducer(sessionReducer, null);

  return (
    <SessionContext.Provider value={{ session, dispatch }}>
      {children}
    </SessionContext.Provider>
  );
}
