import type { Player } from "@/types";
import { MESSAGES } from "@/constants/messages";
import { Card } from "@/components/ui";

const M = MESSAGES;

type SessionSummaryPlayerRowProps = {
  name: string;
  gamesPlayed: number;
  rank: number;
};

function SessionSummaryPlayerRow({
  name,
  gamesPlayed,
  rank,
}: SessionSummaryPlayerRowProps) {
  return (
    <li className="flex items-center justify-between gap-3 bg-surface rounded-[var(--radius)] px-4 py-3">
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-xs font-bold text-muted w-5 shrink-0">{rank}</span>
        <span className="text-sm font-medium truncate">{name}</span>
      </div>
      <span className="text-sm text-muted shrink-0">
        {M.LIVE_GAMES_PLAYED} {gamesPlayed}
      </span>
    </li>
  );
}

type SessionSummaryPlayerListProps = {
  players: Player[];
};

export function SessionSummaryPlayerList({
  players,
}: SessionSummaryPlayerListProps) {
  return (
    <Card>
      <h2 className="text-lg font-semibold text-foreground mb-4">
        {M.SUMMARY_PLAYER_SUMMARY}
      </h2>
      <ul className="space-y-2">
        {players.map((player, index) => (
          <SessionSummaryPlayerRow
            key={player.id}
            rank={index + 1}
            name={player.name}
            gamesPlayed={player.gamesPlayed}
          />
        ))}
      </ul>
    </Card>
  );
}
