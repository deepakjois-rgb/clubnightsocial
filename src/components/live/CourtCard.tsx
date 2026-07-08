import type { Court, Match, Player } from "@/types";
import { MESSAGES } from "@/constants/messages";
import { getSidePlayerIds } from "@/lib/utils";

const M = MESSAGES;

type CourtCardProps = {
  court: Court;
  match?: Match;
  players: Player[];
  onStartMatch: (courtId: string) => void;
};

function getMatchTypeLabel(type: Match["type"]): string {
  return type === "SINGLES"
    ? M.QUEUE_MATCH_TYPE_SINGLES
    : M.QUEUE_MATCH_TYPE_DOUBLES;
}

export function CourtCard({
  court,
  match,
  players,
  onStartMatch,
}: CourtCardProps) {
  const isFree = court.state === "FREE";

  function getPlayerName(id: string): string {
    return players.find((p) => p.id === id)?.name ?? id;
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold">{court.name}</span>
        <span
          className={`text-xs font-semibold px-2 py-1 rounded ${
            isFree
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {isFree ? M.LIVE_COURT_STATUS_FREE : M.LIVE_COURT_STATUS_OCCUPIED}
        </span>
      </div>

      {isFree && (
        <button
          type="button"
          onClick={() => onStartMatch(court.id)}
          className="w-full py-3 text-sm font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-700"
        >
          {M.LIVE_START_NEW_MATCH}
        </button>
      )}

      {!isFree && match && (
        <>
          <p className="text-sm font-semibold">{getMatchTypeLabel(match.type)}</p>
          <div className="text-sm space-y-1">
            {getSidePlayerIds(match.matchSides, "A").map((id) => (
              <p key={id}>{getPlayerName(id)}</p>
            ))}
            <p className="text-gray-400 font-medium py-1">{M.QUEUE_VS}</p>
            {getSidePlayerIds(match.matchSides, "B").map((id) => (
              <p key={id}>{getPlayerName(id)}</p>
            ))}
          </div>
          <button
            type="button"
            disabled
            className="w-full py-3 text-sm font-medium border border-gray-300 rounded-lg text-gray-400 cursor-not-allowed"
          >
            {M.LIVE_COMPLETE_MATCH}
          </button>
          <button
            type="button"
            disabled
            className="w-full py-3 text-sm font-medium border border-gray-300 rounded-lg text-gray-400 cursor-not-allowed"
          >
            {M.LIVE_ABANDON_MATCH}
          </button>
        </>
      )}
    </div>
  );
}
