import { v4 as uuidv4 } from "uuid";
import type { Session, Player, Court } from "@/types";
import {
  createQueuedMatch,
  deleteQueuedMatch,
  startMatch,
  completeMatch,
  abandonMatch,
  type CreateQueuedMatchPayload,
  type StartMatchPayload,
  type CompleteMatchPayload,
} from "@/services/matchService";
import {
  movePlayerState,
  initializePlayer,
  type UpdatePlayerStatePayload,
} from "@/services/playerService";

export type {
  CreateQueuedMatchPayload,
  StartMatchPayload,
  CompleteMatchPayload,
  UpdatePlayerStatePayload,
};

// The payload dispatched when starting a session.
// Raw form data from the Setup screen — the reducer is responsible
// for constructing the full Session object from this.
export type StartSessionPayload = {
  organiserName: string;
  numberOfCourts: number;
  players: string[];
};

// All actions that can mutate session state.
// Discriminated union — the "type" field determines which case runs.
export type SessionAction =
  | { type: "START_SESSION"; payload: StartSessionPayload }
  | { type: "END_SESSION" }
  | { type: "CREATE_QUEUED_MATCH"; payload: CreateQueuedMatchPayload }
  | { type: "DELETE_QUEUED_MATCH"; payload: { matchId: string } }
  | { type: "START_MATCH"; payload: StartMatchPayload }
  | { type: "UPDATE_PLAYER_STATE"; payload: UpdatePlayerStatePayload }
  | { type: "COMPLETE_MATCH"; payload: CompleteMatchPayload }
  | { type: "ABANDON_MATCH"; payload: { matchId: string } };

// Pure function: takes current state + action, returns next state.
// State is null when no session is active.
export function sessionReducer(
  state: Session | null,
  action: SessionAction
): Session | null {
  switch (action.type) {

    case "START_SESSION": {
      const { organiserName, numberOfCourts, players } = action.payload;
      const now = Date.now();

      // The organiser is automatically added as a player but marked
      // UNAVAILABLE — they run the session and do not join the queue.
      const organiserPlayer = initializePlayer(
        uuidv4(),
        organiserName,
        "UNAVAILABLE",
        now
      );

      const otherPlayers: Player[] = players.map((name) =>
        initializePlayer(uuidv4(), name, "WAITING", now)
      );

      // Courts are numbered sequentially (Court 1, Court 2 …).
      // All start FREE with no match assigned.
      const courts: Court[] = Array.from({ length: numberOfCourts }, (_, i) => ({
        id: uuidv4(),
        name: `Court ${i + 1}`,
        state: "FREE" as const,
        matchId: undefined,
      }));

      // Build and return the full Session object.
      // Organiser is placed first in the players array.
      return {
        id: uuidv4(),
        organiserName,
        state: "ACTIVE",
        startedAt: now,
        endedAt: undefined,
        players: [organiserPlayer, ...otherPlayers],
        courts,
        matches: [],
      };
    }

    case "END_SESSION": {
      // Guard against dispatching END_SESSION when no session exists.
      if (!state) return null;
      // Preserve all existing session data; only update status and end time.
      return {
        ...state,
        state: "COMPLETED",
        endedAt: Date.now(),
      };
    }

    case "CREATE_QUEUED_MATCH": {
      if (!state) return null;
      return createQueuedMatch(state, action.payload);
    }

    case "DELETE_QUEUED_MATCH": {
      if (!state) return null;
      return deleteQueuedMatch(state, action.payload.matchId);
    }

    case "START_MATCH": {
      if (!state) return null;
      return startMatch(state, action.payload);
    }

    case "UPDATE_PLAYER_STATE": {
      if (!state) return null;
      const { playerId, state: playerState } = action.payload;
      return movePlayerState(state, playerId, playerState);
    }

    case "COMPLETE_MATCH": {
      if (!state) return null;
      return completeMatch(state, action.payload);
    }

    case "ABANDON_MATCH": {
      if (!state) return null;
      return abandonMatch(state, action.payload.matchId);
    }

    default:
      return state;
  }
}
