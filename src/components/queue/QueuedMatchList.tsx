import type { Match, Player } from "@/types";
import { MESSAGES } from "@/constants/messages";
import { EmptyState } from "@/components/ui";
import { QueuedMatchCard } from "./QueuedMatchCard";

const M = MESSAGES;

type QueuedMatchListProps = {
  matches: Match[];
  players: Player[];
  onDelete: (id: string) => void;
  onCreateMatch?: () => void;
};

export function QueuedMatchList({
  matches,
  players,
  onDelete,
  onCreateMatch,
}: QueuedMatchListProps) {
  if (matches.length === 0) {
    return (
      <EmptyState
        title={M.QUEUE_NO_MATCHES_TITLE}
        description={M.QUEUE_NO_MATCHES_DESC}
        action={
          onCreateMatch
            ? { label: M.QUEUE_CREATE_MATCH, onClick: onCreateMatch }
            : undefined
        }
      />
    );
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
