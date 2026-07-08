import { v4 as uuidv4 } from "uuid";
import type { Match, MatchSide, MatchType, Session } from "@/types";
import { getMatchPlayerIds } from "@/lib/utils";

export type CreateQueuedMatchPayload = {
  type: MatchType;
  matchSides: MatchSide[];
};

export type StartMatchPayload = {
  courtId: string;
  matchId: string;
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

export function canStartMatch(session: Session, matchId: string): boolean {
  const match = session.matches.find((m) => m.id === matchId);

  if (!match || match.state !== "QUEUED") {
    return false;
  }

  const playerIds = getMatchPlayerIds(match.matchSides);

  return playerIds.every((id) => {
    const player = session.players.find((p) => p.id === id);
    return player?.state === "WAITING";
  });
}

export function startMatch(
  session: Session,
  payload: StartMatchPayload
): Session {
  const { courtId, matchId } = payload;
  const court = session.courts.find((c) => c.id === courtId);
  const match = session.matches.find((m) => m.id === matchId);

  if (!court || court.state !== "FREE") {
    return session;
  }

  if (!match || match.state !== "QUEUED") {
    return session;
  }

  if (!canStartMatch(session, matchId)) {
    return session;
  }

  const now = Date.now();
  const playerIds = new Set(getMatchPlayerIds(match.matchSides));

  return {
    ...session,
    courts: session.courts.map((c) =>
      c.id === courtId
        ? { ...c, state: "OCCUPIED" as const, matchId }
        : c
    ),
    matches: session.matches.map((m) =>
      m.id === matchId
        ? { ...m, state: "LIVE" as const, courtId, startedAt: now }
        : m
    ),
    players: session.players.map((p) =>
      playerIds.has(p.id)
        ? { ...p, state: "PLAYING" as const, lastStateChangeAt: now }
        : p
    ),
  };
}

export function getMatchById(
  session: Session,
  matchId: string
): Match | undefined {
  return session.matches.find((m) => m.id === matchId);
}
