import type { Court, Match, Player } from "@/types";
import { MESSAGES } from "@/constants/messages";
import { CourtCard } from "./CourtCard";

const M = MESSAGES;

type CourtGridProps = {
  courts: Court[];
  matches: Match[];
  players: Player[];
  onStartMatch: (courtId: string) => void;
  onCompleteMatch: (matchId: string) => void;
  onAbandonMatch: (matchId: string) => void;
};

export function CourtGrid({
  courts,
  matches,
  players,
  onStartMatch,
  onCompleteMatch,
  onAbandonMatch,
}: CourtGridProps) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">{M.LIVE_COURTS_SECTION}</h2>
      <div className="grid grid-cols-1 gap-3">
        {courts.map((court) => (
          <CourtCard
            key={court.id}
            court={court}
            match={
              court.matchId
                ? matches.find((m) => m.id === court.matchId)
                : undefined
            }
            players={players}
            onStartMatch={onStartMatch}
            onCompleteMatch={onCompleteMatch}
            onAbandonMatch={onAbandonMatch}
          />
        ))}
      </div>
    </section>
  );
}
