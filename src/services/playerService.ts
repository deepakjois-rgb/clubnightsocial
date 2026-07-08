import type { Player, PlayerState, Session } from "@/types";

export type UpdatePlayerStatePayload = {
  playerId: string;
  state: PlayerState;
};

const ALLOWED_TRANSITIONS: Record<
  PlayerState,
  readonly PlayerState[]
> = {
  WAITING: ["UNAVAILABLE"],
  UNAVAILABLE: ["WAITING"],
  PLAYING: [],
};

export function canMovePlayerState(
  currentState: PlayerState,
  targetState: PlayerState
): boolean {
  return ALLOWED_TRANSITIONS[currentState].includes(targetState);
}

export function applyPlayerStateChange(
  player: Player,
  targetState: PlayerState,
  now: number
): Player {
  const updated: Player = {
    ...player,
    state: targetState,
    lastStateChangeAt: now,
  };

  if (targetState === "WAITING") {
    return { ...updated, waitingSince: now };
  }

  return { ...updated, waitingSince: undefined };
}

export function initializePlayer(
  id: string,
  name: string,
  state: PlayerState,
  now: number
): Player {
  return applyPlayerStateChange(
    {
      id,
      name,
      state,
      joinedAt: now,
      lastStateChangeAt: now,
      gamesPlayed: 0,
    },
    state,
    now
  );
}

export function sortWaitingPlayers(players: Player[]): Player[] {
  return [...players].sort((a, b) => {
    const aWaitingSince = a.waitingSince ?? Number.MAX_SAFE_INTEGER;
    const bWaitingSince = b.waitingSince ?? Number.MAX_SAFE_INTEGER;

    if (aWaitingSince !== bWaitingSince) {
      return aWaitingSince - bWaitingSince;
    }

    return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
  });
}

export function getWaitingPlayers(session: Session): Player[] {
  return sortWaitingPlayers(
    session.players.filter((player) => player.state === "WAITING")
  );
}

export function sortPlayersForSummary(players: Player[]): Player[] {
  return [...players].sort((a, b) => {
    if (a.gamesPlayed !== b.gamesPlayed) {
      return b.gamesPlayed - a.gamesPlayed;
    }

    return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
  });
}

export function movePlayerState(
  session: Session,
  playerId: string,
  targetState: PlayerState
): Session {
  const player = session.players.find((p) => p.id === playerId);

  if (!player || !canMovePlayerState(player.state, targetState)) {
    return session;
  }

  const now = Date.now();

  return {
    ...session,
    players: session.players.map((p) =>
      p.id === playerId ? applyPlayerStateChange(p, targetState, now) : p
    ),
  };
}
