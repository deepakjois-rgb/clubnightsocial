import { v4 as uuidv4 } from "uuid";
import type {
  Match,
  MatchSide,
  MatchSideType,
  MatchType,
  Session,
} from "@/types";
import { getMatchPlayerIds } from "@/lib/utils";

export type CreateQueuedMatchPayload = {
  type: MatchType;
  matchSides: MatchSide[];
};

export type StartMatchPayload = {
  courtId: string;
  matchId: string;
};

export type CompleteMatchPayload = {
  matchId: string;
  winner: MatchSideType;
};

export type UpdateMatchWinnerPayload = {
  matchId: string;
  winner: MatchSideType;
};

function releaseCourtAndPlayers(
  session: Session,
  match: Match,
  incrementGamesPlayed: boolean
): Session {
  const now = Date.now();
  const participantIds = new Set(getMatchPlayerIds(match.matchSides));
  const courtId = match.courtId;

  return {
    ...session,
    courts: courtId
      ? session.courts.map((c) =>
          c.id === courtId
            ? { ...c, state: "FREE" as const, matchId: undefined }
            : c
        )
      : session.courts,
    players: session.players.map((p) => {
      if (!participantIds.has(p.id)) {
        return p;
      }

      return {
        ...p,
        state: "WAITING" as const,
        lastStateChangeAt: now,
        gamesPlayed: incrementGamesPlayed ? p.gamesPlayed + 1 : p.gamesPlayed,
      };
    }),
  };
}

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

export function getCompletedMatches(session: Session): Match[] {
  return session.matches.filter((m) => m.state === "COMPLETED");
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

export function completeMatch(
  session: Session,
  payload: CompleteMatchPayload
): Session {
  const match = session.matches.find((m) => m.id === payload.matchId);

  if (!match || match.state !== "LIVE") {
    return session;
  }

  const now = Date.now();

  const updatedMatch: Match = {
    ...match,
    state: "COMPLETED",
    winner: payload.winner,
    endedAt: now,
  };

  const withCompletedMatch: Session = {
    ...session,
    matches: session.matches.map((m) =>
      m.id === payload.matchId ? updatedMatch : m
    ),
  };

  return releaseCourtAndPlayers(withCompletedMatch, updatedMatch, true);
}

export function abandonMatch(session: Session, matchId: string): Session {
  const match = session.matches.find((m) => m.id === matchId);

  if (!match || match.state !== "LIVE") {
    return session;
  }

  const now = Date.now();

  const updatedMatch: Match = {
    ...match,
    state: "ABANDONED",
    winner: undefined,
    endedAt: now,
  };

  const withAbandonedMatch: Session = {
    ...session,
    matches: session.matches.map((m) =>
      m.id === matchId ? updatedMatch : m
    ),
  };

  return releaseCourtAndPlayers(withAbandonedMatch, updatedMatch, false);
}

export function updateMatchWinner(
  session: Session,
  payload: UpdateMatchWinnerPayload
): Session {
  const match = session.matches.find((m) => m.id === payload.matchId);

  if (!match || match.state !== "COMPLETED") {
    return session;
  }

  return {
    ...session,
    matches: session.matches.map((m) =>
      m.id === payload.matchId ? { ...m, winner: payload.winner } : m
    ),
  };
}

export function getMatchById(
  session: Session,
  matchId: string
): Match | undefined {
  return session.matches.find((m) => m.id === matchId);
}
