import type { Session } from "@/types";

export type SessionAction =
  | { type: "START_SESSION"; payload: Session }
  | { type: "END_SESSION" };

export function sessionReducer(
  state: Session | null,
  action: SessionAction
): Session | null {
  switch (action.type) {
    case "START_SESSION":
      return action.payload;
    case "END_SESSION":
      return null;
    default:
      return state;
  }
}
