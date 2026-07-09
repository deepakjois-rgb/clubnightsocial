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
  onStartMatch: (courtId: string) => void;
  onCompleteMatch: (matchId: string) => void;
  onAbandonMatch: (matchId: string) => void;
};

function getMatchTypeLabel(type: Match["type"]): string {
  return type === "SINGLES"
    ? M.QUEUE_MATCH_TYPE_SINGLES
    : M.QUEUE_MATCH_TYPE_DOUBLES;
}

function CourtSurface({
  sideAIds,
  sideBIds,
  getPlayerName,
  matchType,
}: {
  sideAIds: string[];
  sideBIds: string[];
  getPlayerName: (id: string) => string;
  matchType?: Match["type"];
}) {
  return (
    <div className="relative flex rounded-[var(--radius)] bg-shuttle-lime-muted/60 border border-[var(--court-green)]/10 min-h-[7rem] overflow-hidden">
      {/* Side A */}
      <div className="flex-1 flex flex-col items-center justify-center gap-1 p-3">
        {sideAIds.map((id) => (
          <span key={id} className="text-sm font-medium text-foreground text-center">
            {getPlayerName(id)}
          </span>
        ))}
      </div>

      {/* Net */}
      <div
        className="w-px shrink-0 bg-[var(--court-green)]/25 relative"
        aria-hidden="true"
      >
        <div className="absolute inset-y-2 left-1/2 -translate-x-1/2 w-0.5 bg-[var(--court-green)]/40 rounded-full" />
      </div>

      {/* Side B */}
      <div className="flex-1 flex flex-col items-center justify-center gap-1 p-3">
        {sideBIds.map((id) => (
          <span key={id} className="text-sm font-medium text-foreground text-center">
            {getPlayerName(id)}
          </span>
        ))}
      </div>

      {matchType && (
        <span className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] font-medium text-muted uppercase tracking-wide">
          {getMatchTypeLabel(matchType)}
        </span>
      )}
    </div>
  );
}

export function CourtCard({
  court,
  match,
  players,
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
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-court-green">{court.name}</h3>
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
          <Button variant="primary" fullWidth onClick={() => onStartMatch(court.id)}>
            {M.LIVE_START_MATCH}
          </Button>
        </>
      )}

      {isLive && match && (
        <>
          <CourtSurface
            sideAIds={getSidePlayerIds(match.matchSides, "A")}
            sideBIds={getSidePlayerIds(match.matchSides, "B")}
            getPlayerName={getPlayerName}
            matchType={match.type}
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
