import type { Player } from "@/types";
import { MESSAGES } from "@/constants/messages";

const M = MESSAGES;

type SessionSummaryPlayerRowProps = {
  name: string;
  gamesPlayed: number;
};

function SessionSummaryPlayerRow({
  name,
  gamesPlayed,
}: SessionSummaryPlayerRowProps) {
  return (
    <li className="flex items-center justify-between gap-3 border border-gray-200 rounded-lg px-4 py-3">
      <span className="text-sm font-medium truncate">{name}</span>
      <span className="text-sm text-gray-600 shrink-0">
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
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">{M.SUMMARY_PLAYER_SUMMARY}</h2>
      <ul className="space-y-2">
        {players.map((player) => (
          <SessionSummaryPlayerRow
            key={player.id}
            name={player.name}
            gamesPlayed={player.gamesPlayed}
          />
        ))}
      </ul>
    </section>
  );
}
