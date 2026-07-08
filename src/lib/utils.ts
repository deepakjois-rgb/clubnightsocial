import type { MatchSide, MatchSideType, MatchType, Player } from "@/types";

export function getElapsedMinutes(startedAt: number): number {
  return Math.floor((Date.now() - startedAt) / 60_000);
}

export function getDurationMinutes(start: number, end: number): number {
  return Math.floor((end - start) / 60_000);
}

export function formatTimestamp(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getRequiredPlayerCount(type: MatchType): number {
  return type === "SINGLES" ? 2 : 4;
}

// Assign selected players to sides A and B based on selection order.
// Singles: 1st player → A, 2nd → B
// Doubles: 1st & 2nd → A, 3rd & 4th → B
export function buildMatchSides(
  selectedPlayerIds: string[],
  type: MatchType
): MatchSide[] {
  if (type === "SINGLES") {
    return [
      { side: "A", playerIds: selectedPlayerIds.slice(0, 1) },
      { side: "B", playerIds: selectedPlayerIds.slice(1, 2) },
    ];
  }

  return [
    { side: "A", playerIds: selectedPlayerIds.slice(0, 2) },
    { side: "B", playerIds: selectedPlayerIds.slice(2, 4) },
  ];
}

export function getSidePlayerIds(
  matchSides: MatchSide[],
  side: MatchSideType
): string[] {
  return matchSides.find((s) => s.side === side)?.playerIds ?? [];
}

export function getMatchPlayerIds(matchSides: MatchSide[]): string[] {
  return matchSides.flatMap((s) => s.playerIds);
}

export function movePlayersToEnd(
  players: Player[],
  playerIdsToMove: string[]
): Player[] {
  const idsToMove = new Set(playerIdsToMove);
  const remaining = players.filter((p) => !idsToMove.has(p.id));
  const moved = playerIdsToMove
    .map((id) => players.find((p) => p.id === id))
    .filter((p): p is Player => p != null);
  return [...remaining, ...moved];
}
