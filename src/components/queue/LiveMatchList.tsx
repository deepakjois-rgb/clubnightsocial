import type { Court, Match, Player } from "@/types";
import { MESSAGES } from "@/constants/messages";
import { Card } from "@/components/ui";
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
    <Card className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-court-green">{courtName}</p>
        <span className="text-xs font-medium text-muted">
          {getMatchTypeLabel(match.type)}
        </span>
      </div>
      <div className="flex rounded-[var(--radius)] bg-shuttle-lime-muted/40 border border-border overflow-hidden text-sm">
        <div className="flex-1 p-3 space-y-1 text-center">
          {getSidePlayerIds(match.matchSides, "A").map((id) => (
            <p key={id} className="font-medium">
              {getPlayerName(id)}
            </p>
          ))}
        </div>
        <div className="w-px bg-border shrink-0" aria-hidden="true" />
        <div className="flex-1 p-3 space-y-1 text-center">
          {getSidePlayerIds(match.matchSides, "B").map((id) => (
            <p key={id} className="font-medium">
              {getPlayerName(id)}
            </p>
          ))}
        </div>
      </div>
    </Card>
  );
}

type LiveMatchListProps = {
  matches: Match[];
  courts: Court[];
  players: Player[];
};

export function LiveMatchList({ matches, courts, players }: LiveMatchListProps) {
  if (matches.length === 0) {
    return (
      <p className="text-sm text-muted text-center py-4">{M.QUEUE_NO_LIVE_MATCHES}</p>
    );
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
