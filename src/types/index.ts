export type PlayerState = "WAITING" | "PLAYING" | "UNAVAILABLE";

export type MatchState = "QUEUED" | "LIVE" | "COMPLETED" | "ABANDONED";

export type CourtState = "FREE" | "OCCUPIED";

export type SessionState = "ACTIVE" | "COMPLETED";

export type MatchType = "SINGLES" | "DOUBLES";

export type MatchSideType = "A" | "B";

export interface Session {
    id: string;
    organiserName: string;
    state: SessionState;
    players: Player[];
    matches: Match[];
    courts: Court[];
    startedAt: number;
    endedAt?: number;
  }

export type Player = {
  id: string;
  name: string;
  state: PlayerState;
  joinedAt: number;
  lastStateChangeAt: number;
  gamesPlayed: number;
  waitingSince?: number;
};

export type MatchSide = {
  side: MatchSideType;
  playerIds: string[];
};

export type Match = {
  id: string;
  type: MatchType;
  matchSides: MatchSide[];
  state: MatchState;
  courtId?: string;
  createdAt: number;
  startedAt?: number;
  endedAt?: number;
  winner?: MatchSideType;
};

export interface Court {
    id: string;
    name: string;
    state: CourtState;
    matchId?: string;
  }