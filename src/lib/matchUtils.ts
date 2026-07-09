import type { Match } from "@/types";
import type { CreateQueuedMatchPayload } from "@/services/matchService";
import { getMatchPlayerIds } from "@/lib/utils";

export function matchPayloadEquals(
  match: Match,
  payload: CreateQueuedMatchPayload
): boolean {
  if (match.type !== payload.type) return false;

  const matchIds = getMatchPlayerIds(match.matchSides).sort().join(",");
  const payloadIds = getMatchPlayerIds(payload.matchSides).sort().join(",");
  return matchIds === payloadIds;
}
