import type { Court, Match, Player } from "@/types";
import { MESSAGES } from "@/constants/messages";
import { MatchControls } from "@/components/matches/MatchControls";
import { Badge, Button, Card } from "@/components/ui";
import { getCourtStatusBadgeClass, getCourtStatusLabel } from "@/lib/labels";
import { getSidePlayerIds } from "@/lib/utils";

const M = MESSAGES;

type CourtCardProps = {
  court: Court;
  match?: Match;
  players: Player[];
  queuedMatchCount?: number;
  onStartMatch: (courtId: string) => void;
  onCompleteMatch: (matchId: string) => void;
  onAbandonMatch: (matchId: string) => void;
};

function CourtSurface({
  sideAIds,
  sideBIds,
  getPlayerName,
  compact = false,
}: {
  sideAIds: string[];
  sideBIds: string[];
  getPlayerName: (id: string) => string;
  compact?: boolean;
}) {
  const isEmpty = sideAIds.length === 0 && sideBIds.length === 0;

  return (
    <div
      className={`relative flex rounded-[var(--radius)] bg-shuttle-lime-muted/60 border border-[var(--court-green)]/10 overflow-hidden ${
        isEmpty ? "min-h-[3.5rem]" : compact ? "min-h-[4.5rem]" : "min-h-[5.5rem]"
      }`}
    >
      <div className="flex-1 flex flex-col items-center justify-center gap-0.5 p-2">
        {sideAIds.map((id) => (
          <span
            key={id}
            className="text-sm font-medium text-foreground text-center leading-tight"
          >
            {getPlayerName(id)}
          </span>
        ))}
      </div>

      <div
        className="w-px shrink-0 bg-[var(--court-green)]/25 relative"
        aria-hidden="true"
      >
        <div className="absolute inset-y-2 left-1/2 -translate-x-1/2 w-0.5 bg-[var(--court-green)]/40 rounded-full" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-0.5 p-2">
        {sideBIds.map((id) => (
          <span
            key={id}
            className="text-sm font-medium text-foreground text-center leading-tight"
          >
            {getPlayerName(id)}
          </span>
        ))}
      </div>
    </div>
  );
}

export function CourtCard({
  court,
  match,
  players,
  queuedMatchCount = 0,
  onStartMatch,
  onCompleteMatch,
  onAbandonMatch,
}: CourtCardProps) {
  const isFree = court.state === "FREE";
  const isLive = match?.state === "LIVE";

  function getPlayerName(id: string): string {
    return players.find((p) => p.id === id)?.name ?? id;
  }

  return (
    <Card className="space-y-3 !p-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-court-green">{court.name}</h3>
        <Badge className={getCourtStatusBadgeClass(isFree)}>
          {getCourtStatusLabel(isFree)}
        </Badge>
      </div>

      {isFree && (
        <>
          <CourtSurface
            sideAIds={[]}
            sideBIds={[]}
            getPlayerName={getPlayerName}
          />
  
          <Button
            variant="primary"
            fullWidth
            className="py-2.5"
            onClick={() => onStartMatch(court.id)}
          >
            {M.LIVE_START_MATCH.replace(
                  "{n}",
                  String(queuedMatchCount)
                )}
          </Button>
        </>
      )}

      {isLive && match && (
        <>
          <CourtSurface
            sideAIds={getSidePlayerIds(match.matchSides, "A")}
            sideBIds={getSidePlayerIds(match.matchSides, "B")}
            getPlayerName={getPlayerName}
            compact
          />
          <MatchControls
            onComplete={() => onCompleteMatch(match.id)}
            onAbandon={() => onAbandonMatch(match.id)}
          />
        </>
      )}
    </Card>
  );
}
