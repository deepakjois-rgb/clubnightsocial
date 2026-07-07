import type { Player, QueuedMatch } from "@/types";
import { MESSAGES } from "@/constants/messages";
import { getSidePlayerIds } from "@/lib/utils";

const M = MESSAGES;

type QueuedMatchCardProps = {
  match: QueuedMatch;
  players: Player[];
  onDelete: (id: string) => void;
};

function getMatchTypeLabel(type: QueuedMatch["type"]): string {
  return type === "SINGLES" ? M.QUEUE_MATCH_TYPE_SINGLES : M.QUEUE_MATCH_TYPE_DOUBLES;
}

export function QueuedMatchCard({ match, players, onDelete }: QueuedMatchCardProps) {
  const sideA = getSidePlayerIds(match.matchSides, "A");
  const sideB = getSidePlayerIds(match.matchSides, "B");

  function getPlayerName(id: string): string {
    return players.find((p) => p.id === id)?.name ?? id;
  }

  const typeLabel = getMatchTypeLabel(match.type);

  return (
    <div className="border border-gray-200 rounded-lg p-4 space-y-3">
      <p className="text-sm font-semibold">{typeLabel}</p>

      <div className="text-sm space-y-1">
        {sideA.map((id) => (
          <p key={id}>{getPlayerName(id)}</p>
        ))}
        <p className="text-gray-400 font-medium py-1">{M.QUEUE_VS}</p>
        {sideB.map((id) => (
          <p key={id}>{getPlayerName(id)}</p>
        ))}
      </div>

      <button
        type="button"
        onClick={() => {
          if (window.confirm(M.QUEUE_DELETE_CONFIRM)) {
            onDelete(match.id);
          }
        }}
        className="w-full py-3 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50"
        aria-label={M.QUEUE_DELETE_MATCH}
      >
        {M.QUEUE_DELETE}
      </button>
    </div>
  );
}
