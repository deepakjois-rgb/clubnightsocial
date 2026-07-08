import type { PlayerState, Session } from "@/types";

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
      p.id === playerId
        ? { ...p, state: targetState, lastStateChangeAt: now }
        : p
    ),
  };
}
