"use client";

import type { Player, Session } from "@/types";
import { MESSAGES } from "@/constants/messages";
import { MatchComposer } from "@/components/matches/MatchComposer";
import { canStartMatch, getQueuedMatches } from "@/services/matchService";
import { getSidePlayerIds } from "@/lib/utils";
import type { CreateQueuedMatchPayload } from "@/services/matchService";

const M = MESSAGES;

type CourtActionSheetProps = {
  open: boolean;
  session: Session;
  courtName: string;
  onSelectMatch: (matchId: string) => void;
  onAddToQueue: (payload: CreateQueuedMatchPayload) => void;
  onStartNow: (payload: CreateQueuedMatchPayload) => void;
  onClose: () => void;
};

function formatSideNames(
  ids: string[],
  getPlayer: (id: string) => Player | undefined
): string {
  return ids.map((id) => getPlayer(id)?.name ?? id).join(" & ");
}

function QueuedMatchPicker({
  session,
  onSelectMatch,
}: {
  session: Session;
  onSelectMatch: (matchId: string) => void;
}) {
  const queuedMatches = getQueuedMatches(session).sort((a, b) => {
    const aStart = canStartMatch(session, a.id) ? 0 : 1;
    const bStart = canStartMatch(session, b.id) ? 0 : 1;
    if (aStart !== bStart) return aStart - bStart;
    return a.createdAt - b.createdAt;
  });

  function getPlayer(id: string) {
    return session.players.find((p) => p.id === id);
  }

  return (
    <ul className="rounded-[var(--radius)] border border-border overflow-hidden divide-y divide-border">
      {queuedMatches.map((match, index) => {
        const canStart = canStartMatch(session, match.id);
        const sideA = formatSideNames(
          getSidePlayerIds(match.matchSides, "A"),
          getPlayer
        );
        const sideB = formatSideNames(
          getSidePlayerIds(match.matchSides, "B"),
          getPlayer
        );
        const isNextUp = canStart && index === 0;

        return (
          <li key={match.id}>
            <button
              type="button"
              disabled={!canStart}
              onClick={() => onSelectMatch(match.id)}
              aria-label={`${M.LIVE_START_MATCH}: ${sideA} vs ${sideB}`}
              className={`w-full flex items-center gap-2 px-3 py-2.5 text-left text-sm transition-colors ${
                canStart
                  ? "hover:bg-shuttle-lime-muted/50 active:bg-shuttle-lime-muted/70"
                  : "opacity-60 cursor-not-allowed"
              } ${isNextUp ? "bg-shuttle-lime-muted/30" : "bg-card"}`}
            >
              {isNextUp && (
                <span
                  className="w-1 self-stretch rounded-full bg-court-green shrink-0"
                  aria-hidden="true"
                />
              )}

              <span className="flex-1 min-w-0 flex items-center gap-1.5">
                <span className="truncate font-medium">{sideA}</span>
                <span className="text-muted shrink-0 text-xs">vs</span>
                <span className="truncate font-medium">{sideB}</span>
              </span>

              {isNextUp && (
                <span className="text-[10px] font-medium text-court-green uppercase tracking-wide shrink-0">
                  {M.LIVE_NEXT_UP}
                </span>
              )}

              {!canStart && (
                <span className="text-xs text-danger shrink-0">
                  {M.LIVE_QUEUE_UNAVAILABLE_SHORT}
                </span>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export function CourtActionSheet({
  open,
  session,
  courtName,
  onSelectMatch,
  onAddToQueue,
  onStartNow,
  onClose,
}: CourtActionSheetProps) {
  if (!open) return null;

  const queuedMatches = getQueuedMatches(session);
  const hasQueue = queuedMatches.length > 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="court-action-sheet-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-label={M.QUEUE_CANCEL}
      />

      <div className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto mx-4 mb-4 sm:mb-0 bg-card rounded-t-[var(--radius-lg)] sm:rounded-[var(--radius-lg)] shadow-lg animate-sheet-in">
        <div className="sticky top-0 z-10 bg-card border-b border-border px-4 py-3">
          <h2
            id="court-action-sheet-title"
            className="text-lg font-semibold text-court-green"
          >
            {courtName}
          </h2>
          <p className="text-sm text-muted mt-0.5">
            {M.LIVE_COURT_ACTION_SUBTITLE}
          </p>
        </div>

        <div className="p-4 space-y-5">
          {hasQueue && (
            <section className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground">
                {M.LIVE_FROM_QUEUE_SECTION} ({queuedMatches.length})
              </h3>
              <p className="text-xs text-muted">{M.LIVE_QUEUE_TAP_TO_START}</p>
              <QueuedMatchPicker
                session={session}
                onSelectMatch={onSelectMatch}
              />
            </section>
          )}

          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">
              {M.LIVE_CREATE_NEW_SECTION}
            </h3>
            <MatchComposer
              players={session.players}
              mode="court"
              courtName={courtName}
              onAddToQueue={onAddToQueue}
              onStartNow={onStartNow}
            />
          </section>
        </div>
      </div>
    </div>
  );
}
