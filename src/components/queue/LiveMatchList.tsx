import type { Court, Match, Player } from "@/types";
import { MESSAGES } from "@/constants/messages";
import { getSidePlayerIds } from "@/lib/utils";

const M = MESSAGES;

type LiveMatchCardProps = {
  match: Match;
  courtName: string;
  players: Player[];
};

function getMatchTypeLabel(type: Match["type"]): string {
  return type === "SINGLES"
    ? M.QUEUE_MATCH_TYPE_SINGLES
    : M.QUEUE_MATCH_TYPE_DOUBLES;
}

function LiveMatchCard({ match, courtName, players }: LiveMatchCardProps) {
  function getPlayerName(id: string): string {
    return players.find((p) => p.id === id)?.name ?? id;
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4 space-y-3">
      <p className="text-sm font-semibold">{courtName}</p>
      <p className="text-sm text-gray-600">{getMatchTypeLabel(match.type)}</p>
      <div className="text-sm space-y-1">
        {getSidePlayerIds(match.matchSides, "A").map((id) => (
          <p key={id}>{getPlayerName(id)}</p>
        ))}
        <p className="text-gray-400 font-medium py-1">{M.QUEUE_VS}</p>
        {getSidePlayerIds(match.matchSides, "B").map((id) => (
          <p key={id}>{getPlayerName(id)}</p>
        ))}
      </div>
    </div>
  );
}

type LiveMatchListProps = {
  matches: Match[];
  courts: Court[];
  players: Player[];
};

export function LiveMatchList({ matches, courts, players }: LiveMatchListProps) {
  if (matches.length === 0) {
    return <p className="text-sm text-gray-500">{M.QUEUE_NO_LIVE_MATCHES}</p>;
  }

  return (
    <ul className="space-y-3" aria-label={M.QUEUE_LIVE_SECTION}>
      {matches.map((match) => {
        const court = courts.find((c) => c.id === match.courtId);
        return (
          <li key={match.id}>
            <LiveMatchCard
              match={match}
              courtName={court?.name ?? M.QUEUE_UNKNOWN_COURT}
              players={players}
            />
          </li>
        );
      })}
    </ul>
  );
}
