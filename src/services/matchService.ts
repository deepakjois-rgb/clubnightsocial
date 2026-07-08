import { v4 as uuidv4 } from "uuid";
import type { Match, MatchSide, MatchType, Session } from "@/types";

export type CreateQueuedMatchPayload = {
  type: MatchType;
  matchSides: MatchSide[];
};

export function createQueuedMatch(
  session: Session,
  payload: CreateQueuedMatchPayload
): Session {
  const match: Match = {
    id: uuidv4(),
    type: payload.type,
    matchSides: payload.matchSides,
    state: "QUEUED",
    createdAt: Date.now(),
  };

  return {
    ...session,
    matches: [...session.matches, match],
  };
}

export function deleteQueuedMatch(
  session: Session,
  matchId: string
): Session {
  const match = session.matches.find((m) => m.id === matchId);

  if (!match || match.state !== "QUEUED") {
    return session;
  }

  return {
    ...session,
    matches: session.matches.filter((m) => m.id !== matchId),
  };
}

export function getQueuedMatches(session: Session): Match[] {
  return session.matches.filter((m) => m.state === "QUEUED");
}
