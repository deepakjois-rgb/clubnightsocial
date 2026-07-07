"use client";

import { useEffect, useState } from "react";
import type { Session } from "@/types";
import { MESSAGES } from "@/constants/messages";
import { getElapsedMinutes } from "@/lib/utils";

const M = MESSAGES;

type SessionHeaderProps = {
  session: Session;
};

// Top-of-page summary for the Live dashboard.
// Displays key session metadata pulled directly from SessionContext state.
export function SessionHeader({ session }: SessionHeaderProps) {
  // Duration is stored in local state so the display can update over time
  // without re-fetching or mutating the session object.
  const [elapsedMinutes, setElapsedMinutes] = useState(() =>
    getElapsedMinutes(session.startedAt)
  );

  // Recalculate elapsed minutes once per minute.
  // An immediate update on mount keeps the value accurate after navigation.
  useEffect(() => {
    setElapsedMinutes(getElapsedMinutes(session.startedAt));

    const interval = setInterval(() => {
      setElapsedMinutes(getElapsedMinutes(session.startedAt));
    }, 60_000);

    return () => clearInterval(interval);
  }, [session.startedAt]);

  return (
    <section className="space-y-3">
      <h1 className="text-2xl font-bold">{M.LIVE_PAGE_TITLE}</h1>

      {/* Two-column grid of session stats */}
      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <div>
          <dt className="text-gray-500">{M.LIVE_ORGANISER}</dt>
          <dd className="font-medium">{session.organiserName}</dd>
        </div>
        <div>
          <dt className="text-gray-500">{M.LIVE_COURTS}</dt>
          <dd className="font-medium">{session.courts.length}</dd>
        </div>
        <div>
          <dt className="text-gray-500">{M.LIVE_PLAYERS}</dt>
          <dd className="font-medium">{session.players.length}</dd>
        </div>
        <div>
          <dt className="text-gray-500">{M.LIVE_DURATION}</dt>
          <dd className="font-medium">{elapsedMinutes + " " + M.LIVE_DURATION_MINUTES}</dd>
        </div>
      </dl>
    </section>
  );
}
