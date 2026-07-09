"use client";

import { useEffect, useState } from "react";
import type { Session } from "@/types";
import { MESSAGES } from "@/constants/messages";
import { getElapsedMinutes } from "@/lib/utils";

const M = MESSAGES;

type SessionHeaderProps = {
  session: Session;
};

export function SessionHeader({ session }: SessionHeaderProps) {
  const [elapsedMinutes, setElapsedMinutes] = useState(() =>
    getElapsedMinutes(session.startedAt)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedMinutes(getElapsedMinutes(session.startedAt));
    }, 60_000);

    return () => clearInterval(interval);
  }, [session.startedAt]);

  return (
    <section className="bg-card rounded-[var(--radius-lg)] border border-border px-4 py-3 shadow-[var(--shadow-card)]">
      <dl className="grid grid-cols-4 gap-2 text-center text-xs">
        <div>
          <dt className="text-muted">{M.LIVE_DURATION}</dt>
          <dd className="font-semibold text-foreground mt-0.5">
            {elapsedMinutes} {M.LIVE_DURATION_MINUTES}
          </dd>
        </div>
        <div>
          <dt className="text-muted">{M.LIVE_COURTS}</dt>
          <dd className="font-semibold text-foreground mt-0.5">
            {session.courts.length}
          </dd>
        </div>
        <div>
          <dt className="text-muted">{M.LIVE_PLAYERS}</dt>
          <dd className="font-semibold text-foreground mt-0.5">
            {session.players.length}
          </dd>
        </div>
        <div>
          <dt className="text-muted truncate">{M.LIVE_ORGANISER}</dt>
          <dd className="font-semibold text-foreground mt-0.5">
            {session.organiserName}
          </dd>
        </div>
      </dl>
    </section>
  );
}
