"use client";

import type { Match, MatchSideType, Player } from "@/types";
import { MESSAGES } from "@/constants/messages";
import { getSidePlayerIds } from "@/lib/utils";

const M = MESSAGES;

type WinnerSelectorProps = {
  open: boolean;
  match: Match | null;
  players: Player[];
  onSelectWinner: (winner: MatchSideType) => void;
  onClose: () => void;
  title?: string;
};

function getPlayerName(players: Player[], id: string): string {
  return players.find((p) => p.id === id)?.name ?? id;
}

function getSideLabel(
  match: Match,
  side: MatchSideType,
  players: Player[]
): string {
  if (match.type === "SINGLES") {
    const playerId = getSidePlayerIds(match.matchSides, side)[0];
    return playerId ? getPlayerName(players, playerId) : side;
  }

  return side === "A" ? M.LIVE_SIDE_1 : M.LIVE_SIDE_2;
}

export function WinnerSelector({
  open,
  match,
  players,
  onSelectWinner,
  onClose,
  title = M.LIVE_SELECT_WINNER_TITLE,
}: WinnerSelectorProps) {
  if (!open || !match) return null;

  const sideAIds = getSidePlayerIds(match.matchSides, "A");
  const sideBIds = getSidePlayerIds(match.matchSides, "B");

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="winner-selector-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-label={M.QUEUE_CANCEL}
      />

      <div className="relative w-full max-w-lg mx-4 mb-4 sm:mb-0 bg-white rounded-lg shadow-lg p-4 space-y-4">
        <h2 id="winner-selector-title" className="text-lg font-semibold">
          {title}
        </h2>

        <div className="space-y-3">
          <button
            type="button"
            onClick={() => onSelectWinner("A")}
            className="w-full text-left border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
          >
            <p className="text-sm font-semibold">
              {getSideLabel(match, "A", players)}
            </p>
            {match.type === "DOUBLES" && (
              <div className="text-sm text-gray-600 mt-1 space-y-1">
                {sideAIds.map((id) => (
                  <p key={id}>{getPlayerName(players, id)}</p>
                ))}
              </div>
            )}
          </button>

          <button
            type="button"
            onClick={() => onSelectWinner("B")}
            className="w-full text-left border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
          >
            <p className="text-sm font-semibold">
              {getSideLabel(match, "B", players)}
            </p>
            {match.type === "DOUBLES" && (
              <div className="text-sm text-gray-600 mt-1 space-y-1">
                {sideBIds.map((id) => (
                  <p key={id}>{getPlayerName(players, id)}</p>
                ))}
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
