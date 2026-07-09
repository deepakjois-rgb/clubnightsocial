"use client";

import type { Match, Player, Session } from "@/types";
import { MESSAGES } from "@/constants/messages";
import { canStartMatch, getQueuedMatches } from "@/services/matchService";
import { Badge, Button, Card, EmptyState } from "@/components/ui";
import { getPlayerStateBadgeClass, getPlayerStateLabel } from "@/lib/labels";
import { getSidePlayerIds } from "@/lib/utils";

const M = MESSAGES;

type StartMatchModalProps = {
  open: boolean;
  session: Session;
  courtName: string;
  onSelectMatch: (matchId: string) => void;
  onClose: () => void;
  onGoToQueue?: () => void;
};

function getMatchTypeLabel(type: Match["type"]): string {
  return type === "SINGLES"
    ? M.QUEUE_MATCH_TYPE_SINGLES
    : M.QUEUE_MATCH_TYPE_DOUBLES;
}

export function StartMatchModal({
  open,
  session,
  courtName,
  onSelectMatch,
  onClose,
  onGoToQueue,
}: StartMatchModalProps) {
  if (!open) return null;

  const queuedMatches = getQueuedMatches(session);

  function getPlayer(id: string): Player | undefined {
    return session.players.find((p) => p.id === id);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="start-match-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-label={M.QUEUE_CANCEL}
      />

      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto mx-4 mb-4 sm:mb-0 bg-card rounded-t-[var(--radius-lg)] sm:rounded-[var(--radius-lg)] shadow-lg animate-sheet-in">
        <div className="sticky top-0 bg-card border-b border-border px-4 py-4">
          <h2 id="start-match-modal-title" className="text-lg font-semibold text-court-green">
            {M.LIVE_SELECT_MATCH_TITLE}
          </h2>
          <p className="text-sm text-muted mt-0.5">{courtName}</p>
        </div>

        <div className="p-4 space-y-3">
          {queuedMatches.length === 0 ? (
            <EmptyState
              title={M.LIVE_NO_QUEUED_MATCHES_TITLE}
              description={M.LIVE_NO_QUEUED_MATCHES_DESC}
              action={
                onGoToQueue
                  ? { label: M.LIVE_NO_QUEUED_MATCHES_ACTION, onClick: onGoToQueue }
                  : undefined
              }
            />
          ) : (
            queuedMatches.map((match) => {
              const canStart = canStartMatch(session, match.id);
              const sideA = getSidePlayerIds(match.matchSides, "A");
              const sideB = getSidePlayerIds(match.matchSides, "B");

              return (
                <Card key={match.id} className="space-y-3">
                  <p className="text-sm font-semibold text-court-green">
                    {getMatchTypeLabel(match.type)}
                  </p>

                  <div className="flex rounded-[var(--radius)] bg-shuttle-lime-muted/40 border border-border overflow-hidden">
                    <div className="flex-1 p-3 space-y-2">
                      {sideA.map((id) => {
                        const player = getPlayer(id);
                        if (!player) return null;
                        return (
                          <div key={id} className="flex items-center justify-between gap-1">
                            <span className="text-sm font-medium">{player.name}</span>
                            <Badge className={getPlayerStateBadgeClass(player.state)}>
                              {getPlayerStateLabel(player.state)}
                            </Badge>
                          </div>
                        );
                      })}
                    </div>
                    <div className="w-px bg-border shrink-0" aria-hidden="true" />
                    <div className="flex-1 p-3 space-y-2">
                      {sideB.map((id) => {
                        const player = getPlayer(id);
                        if (!player) return null;
                        return (
                          <div key={id} className="flex items-center justify-between gap-1">
                            <span className="text-sm font-medium">{player.name}</span>
                            <Badge className={getPlayerStateBadgeClass(player.state)}>
                              {getPlayerStateLabel(player.state)}
                            </Badge>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {!canStart && (
                    <p className="text-sm text-danger">{M.LIVE_PLAYERS_UNAVAILABLE}</p>
                  )}

                  <Button
                    variant="primary"
                    fullWidth
                    disabled={!canStart}
                    onClick={() => onSelectMatch(match.id)}
                  >
                    {M.LIVE_START_MATCH}
                  </Button>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
