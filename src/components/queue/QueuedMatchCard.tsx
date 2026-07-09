"use client";

import { useState } from "react";
import type { Match, Player } from "@/types";
import { MESSAGES } from "@/constants/messages";
import { ConfirmDialog } from "@/components/matches";
import { Badge, Button, Card } from "@/components/ui";
import { getPlayerStateBadgeClass, getPlayerStateLabel } from "@/lib/labels";
import { getSidePlayerIds } from "@/lib/utils";

const M = MESSAGES;

type QueuedMatchCardProps = {
  match: Match;
  players: Player[];
  onDelete: (id: string) => void;
};

function getMatchTypeLabel(type: Match["type"]): string {
  return type === "SINGLES"
    ? M.QUEUE_MATCH_TYPE_SINGLES
    : M.QUEUE_MATCH_TYPE_DOUBLES;
}

export function QueuedMatchCard({
  match,
  players,
  onDelete,
}: QueuedMatchCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const sideA = getSidePlayerIds(match.matchSides, "A");
  const sideB = getSidePlayerIds(match.matchSides, "B");

  function getPlayer(id: string): Player | undefined {
    return players.find((p) => p.id === id);
  }

  function renderPlayer(id: string) {
    const player = getPlayer(id);
    if (!player) return null;

    return (
      <div key={id} className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium">{player.name}</span>
        <Badge className={getPlayerStateBadgeClass(player.state)}>
          {getPlayerStateLabel(player.state)}
        </Badge>
      </div>
    );
  }

  return (
    <>
      <Card hoverable className="space-y-3">
        <p className="text-sm font-semibold text-court-green">
          {getMatchTypeLabel(match.type)}
        </p>

        <div className="flex rounded-[var(--radius)] bg-shuttle-lime-muted/40 border border-border overflow-hidden">
          <div className="flex-1 p-3 space-y-2">
            {sideA.map(renderPlayer)}
          </div>
          <div className="w-px bg-border shrink-0" aria-hidden="true" />
          <div className="flex-1 p-3 space-y-2">
            {sideB.map(renderPlayer)}
          </div>
        </div>

        <Button
          variant="destructive-outline"
          fullWidth
          onClick={() => setShowDeleteConfirm(true)}
          aria-label={M.QUEUE_DELETE_MATCH}
        >
          {M.QUEUE_DELETE}
        </Button>
      </Card>

      <ConfirmDialog
        open={showDeleteConfirm}
        message={M.QUEUE_DELETE_CONFIRM}
        confirmLabel={M.QUEUE_DELETE}
        destructive
        onConfirm={() => {
          onDelete(match.id);
          setShowDeleteConfirm(false);
        }}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </>
  );
}
