import { v4 as uuidv4 } from "uuid";
import type { Session, Player, Court } from "@/types";

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
  | { type: "END_SESSION" };

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
      const organiserPlayer: Player = {
        id: uuidv4(),
        name: organiserName,
        state: "UNAVAILABLE",
        joinedAt: now,
        lastStateChangeAt: now,
      };

      // All other players start in the WAITING state,
      // ready to be picked for a match.
      const otherPlayers: Player[] = players.map((name) => ({
        id: uuidv4(),
        name,
        state: "WAITING",
        joinedAt: now,
        lastStateChangeAt: now,
      }));

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

    default:
      return state;
  }
}
