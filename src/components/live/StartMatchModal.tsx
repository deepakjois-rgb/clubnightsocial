"use client";

import type { Match, Player, Session } from "@/types";
import { MESSAGES } from "@/constants/messages";
import { canStartMatch, getQueuedMatches } from "@/services/matchService";
import { getSidePlayerIds } from "@/lib/utils";

const M = MESSAGES;

type StartMatchModalProps = {
  open: boolean;
  session: Session;
  courtName: string;
  onSelectMatch: (matchId: string) => void;
  onClose: () => void;
};

function getMatchTypeLabel(type: Match["type"]): string {
  return type === "SINGLES"
    ? M.QUEUE_MATCH_TYPE_SINGLES
    : M.QUEUE_MATCH_TYPE_DOUBLES;
}

export function StartMatchModal({
  open,
  session,
  courtName,
  onSelectMatch,
  onClose,
}: StartMatchModalProps) {
  if (!open) return null;

  const queuedMatches = getQueuedMatches(session);

  function getPlayerName(players: Player[], id: string): string {
    return players.find((p) => p.id === id)?.name ?? id;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="start-match-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-label={M.QUEUE_CANCEL}
      />

      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto mx-4 mb-4 sm:mb-0 bg-white rounded-lg shadow-lg">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3">
          <h2 id="start-match-modal-title" className="text-lg font-semibold">
            {M.LIVE_SELECT_MATCH_TITLE}
          </h2>
          <p className="text-sm text-gray-500">{courtName}</p>
        </div>

        <div className="p-4 space-y-3">
          {queuedMatches.length === 0 ? (
            <p className="text-sm text-gray-500">{M.LIVE_NO_QUEUED_MATCHES}</p>
          ) : (
            queuedMatches.map((match) => {
              const canStart = canStartMatch(session, match.id);
              const sideA = getSidePlayerIds(match.matchSides, "A");
              const sideB = getSidePlayerIds(match.matchSides, "B");

              return (
                <div
                  key={match.id}
                  className="border border-gray-200 rounded-lg p-4 space-y-2"
                >
                  <p className="text-sm font-semibold">
                    {getMatchTypeLabel(match.type)}
                  </p>
                  <div className="text-sm space-y-1">
                    {sideA.map((id) => (
                      <p key={id}>{getPlayerName(session.players, id)}</p>
                    ))}
                    <p className="text-gray-400 font-medium py-1">{M.QUEUE_VS}</p>
                    {sideB.map((id) => (
                      <p key={id}>{getPlayerName(session.players, id)}</p>
                    ))}
                  </div>

                  {!canStart && (
                    <p className="text-sm text-red-600">
                      {M.LIVE_PLAYERS_UNAVAILABLE}
                    </p>
                  )}

                  <button
                    type="button"
                    disabled={!canStart}
                    onClick={() => onSelectMatch(match.id)}
                    className="w-full py-3 text-sm font-medium bg-gray-900 text-white rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-700"
                  >
                    {M.LIVE_START_NEW_MATCH}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
