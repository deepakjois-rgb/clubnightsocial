import type { Match, Player } from "@/types";
import { MESSAGES } from "@/constants/messages";
import { QueuedMatchCard } from "./QueuedMatchCard";

const M = MESSAGES;

type QueuedMatchListProps = {
  matches: Match[];
  players: Player[];
  onDelete: (id: string) => void;
};

export function QueuedMatchList({ matches, players, onDelete }: QueuedMatchListProps) {
  if (matches.length === 0) {
    return <p className="text-sm text-gray-500">{M.QUEUE_NO_MATCHES}</p>;
  }

  return (
    <ul className="space-y-3" aria-label={M.QUEUE_PAGE_TITLE}>
      {matches.map((match) => (
        <li key={match.id}>
          <QueuedMatchCard match={match} players={players} onDelete={onDelete} />
        </li>
      ))}
    </ul>
  );
}
