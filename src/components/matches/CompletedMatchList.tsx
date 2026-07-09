import type { Match, Player } from "@/types";
import { MESSAGES } from "@/constants/messages";
import { Card } from "@/components/ui";
import { getSidePlayerIds } from "@/lib/utils";

const M = MESSAGES;

type CompletedMatchCardProps = {
  match: Match;
  players: Player[];
};

function getMatchTypeLabel(type: Match["type"]): string {
  return type === "SINGLES"
    ? M.QUEUE_MATCH_TYPE_SINGLES
    : M.QUEUE_MATCH_TYPE_DOUBLES;
}

export function CompletedMatchCard({ match, players }: CompletedMatchCardProps) {
  function getPlayerName(id: string): string {
    return players.find((p) => p.id === id)?.name ?? id;
  }

  return (
    <Card className="space-y-3">
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

type CompletedMatchListProps = {
  matches: Match[];
  players: Player[];
};

export function CompletedMatchList({ matches, players }: CompletedMatchListProps) {
  if (matches.length === 0) {
    return (
      <p className="text-sm text-muted text-center py-4">
        {M.QUEUE_NO_COMPLETED_MATCHES}
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {matches.map((match) => (
        <li key={match.id}>
          <CompletedMatchCard match={match} players={players} />
        </li>
      ))}
    </ul>
  );
}
