import type { Session } from "@/types";
import { getAbandonedMatches, getCompletedMatches, getLiveMatches } from "@/services/matchService";

export type SessionStatistics = {
  playerCount: number;
  completedMatchCount: number;
  abandonedMatchCount: number;
  courtCount: number;
};

export function canEndSession(session: Session): boolean {
  return getLiveMatches(session).length === 0;
}

export function endSession(session: Session): Session {
  if (!canEndSession(session)) {
    return session;
  }

  return {
    ...session,
    state: "COMPLETED",
    endedAt: Date.now(),
  };
}

export function isActiveSession(session: Session | null): session is Session {
  return session?.state === "ACTIVE";
}

export function isCompletedSession(session: Session | null): session is Session {
  return session?.state === "COMPLETED";
}

export function getSessionStatistics(session: Session): SessionStatistics {
  return {
    playerCount: session.players.length,
    completedMatchCount: getCompletedMatches(session).length,
    abandonedMatchCount: getAbandonedMatches(session).length,
    courtCount: session.courts.length,
  };
}
