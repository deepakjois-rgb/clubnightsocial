import { ACTIVE_SESSION_STORAGE_KEY } from "@/constants/index";
import type {
  Court,
  CourtState,
  Match,
  MatchSide,
  MatchSideType,
  MatchState,
  MatchType,
  Player,
  PlayerState,
  Session,
  SessionState,
} from "@/types";

const SESSION_STATES: readonly SessionState[] = ["ACTIVE", "COMPLETED"];
const PLAYER_STATES: readonly PlayerState[] = [
  "WAITING",
  "PLAYING",
  "UNAVAILABLE",
];
const MATCH_STATES: readonly MatchState[] = [
  "QUEUED",
  "LIVE",
  "COMPLETED",
  "ABANDONED",
];
const COURT_STATES: readonly CourtState[] = ["FREE", "OCCUPIED"];
const MATCH_TYPES: readonly MatchType[] = ["SINGLES", "DOUBLES"];
const MATCH_SIDE_TYPES: readonly MatchSideType[] = ["A", "B"];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isEnumValue<T extends string>(
  value: unknown,
  allowed: readonly T[]
): value is T {
  return isString(value) && allowed.includes(value as T);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(isString);
}

function parseMatchSide(value: unknown): MatchSide | null {
  if (!isRecord(value)) return null;
  if (!isEnumValue(value.side, MATCH_SIDE_TYPES)) return null;
  if (!isStringArray(value.playerIds)) return null;

  return {
    side: value.side,
    playerIds: value.playerIds,
  };
}

function parsePlayer(value: unknown): Player | null {
  if (!isRecord(value)) return null;
  if (!isString(value.id) || !isString(value.name)) return null;
  if (!isEnumValue(value.state, PLAYER_STATES)) return null;
  if (!isNumber(value.joinedAt) || !isNumber(value.lastStateChangeAt)) return null;
  if (!isNumber(value.gamesPlayed) || value.gamesPlayed < 0) return null;

  const player: Player = {
    id: value.id,
    name: value.name,
    state: value.state,
    joinedAt: value.joinedAt,
    lastStateChangeAt: value.lastStateChangeAt,
    gamesPlayed: value.gamesPlayed,
  };

  if (value.waitingSince !== undefined) {
    if (!isNumber(value.waitingSince)) return null;
    player.waitingSince = value.waitingSince;
  }

  return player;
}

function parseMatch(value: unknown): Match | null {
  if (!isRecord(value)) return null;
  if (!isString(value.id)) return null;
  if (!isEnumValue(value.type, MATCH_TYPES)) return null;
  if (!isEnumValue(value.state, MATCH_STATES)) return null;
  if (!isNumber(value.createdAt)) return null;
  if (!Array.isArray(value.matchSides)) return null;

  const matchSides = value.matchSides.map(parseMatchSide);
  if (matchSides.some((side) => side === null)) return null;

  const match: Match = {
    id: value.id,
    type: value.type,
    matchSides: matchSides as MatchSide[],
    state: value.state,
    createdAt: value.createdAt,
  };

  if (value.courtId !== undefined) {
    if (!isString(value.courtId)) return null;
    match.courtId = value.courtId;
  }

  if (value.startedAt !== undefined) {
    if (!isNumber(value.startedAt)) return null;
    match.startedAt = value.startedAt;
  }

  if (value.endedAt !== undefined) {
    if (!isNumber(value.endedAt)) return null;
    match.endedAt = value.endedAt;
  }

  if (value.winner !== undefined) {
    if (!isEnumValue(value.winner, MATCH_SIDE_TYPES)) return null;
    match.winner = value.winner;
  }

  return match;
}

function parseCourt(value: unknown): Court | null {
  if (!isRecord(value)) return null;
  if (!isString(value.id) || !isString(value.name)) return null;
  if (!isEnumValue(value.state, COURT_STATES)) return null;

  const court: Court = {
    id: value.id,
    name: value.name,
    state: value.state,
  };

  if (value.matchId !== undefined) {
    if (!isString(value.matchId)) return null;
    court.matchId = value.matchId;
  }

  return court;
}

function parseSession(value: unknown): Session | null {
  if (!isRecord(value)) return null;
  if (!isString(value.id) || !isString(value.organiserName)) return null;
  if (!isEnumValue(value.state, SESSION_STATES)) return null;
  if (!isNumber(value.startedAt)) return null;
  if (!Array.isArray(value.players) || !Array.isArray(value.matches)) return null;
  if (!Array.isArray(value.courts)) return null;

  const players = value.players.map(parsePlayer);
  if (players.some((player) => player === null)) return null;

  const matches = value.matches.map(parseMatch);
  if (matches.some((match) => match === null)) return null;

  const courts = value.courts.map(parseCourt);
  if (courts.some((court) => court === null)) return null;

  const session: Session = {
    id: value.id,
    organiserName: value.organiserName,
    state: value.state,
    startedAt: value.startedAt,
    players: players as Player[],
    matches: matches as Match[],
    courts: courts as Court[],
  };

  if (value.endedAt !== undefined) {
    if (!isNumber(value.endedAt)) return null;
    session.endedAt = value.endedAt;
  }

  return session;
}

export function saveSession(session: Session): void {
  if (typeof window === "undefined") return;
  if (session.state !== "ACTIVE") return;

  try {
    localStorage.setItem(
      ACTIVE_SESSION_STORAGE_KEY,
      JSON.stringify(session)
    );
  } catch {
    clearSession();
  }
}

export function loadSession(): Session | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(ACTIVE_SESSION_STORAGE_KEY);
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);
    const session = parseSession(parsed);

    if (!session || session.state !== "ACTIVE") {
      clearSession();
      return null;
    }

    return session;
  } catch {
    clearSession();
    return null;
  }
}

export function clearSession(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(ACTIVE_SESSION_STORAGE_KEY);
  } catch {
    // Ignore storage errors when clearing.
  }
}
