"use client";

import type { Player } from "@/types";
import { MatchComposer } from "@/components/matches/MatchComposer";
import type { CreateQueuedMatchPayload } from "@/services/matchService";

type CreateMatchFormProps = {
  players: Player[];
  onSubmit: (payload: CreateQueuedMatchPayload) => void;
  onCancel: () => void;
};

export function CreateMatchForm({
  players,
  onSubmit,
  onCancel,
}: CreateMatchFormProps) {
  return (
    <MatchComposer
      players={players}
      mode="queue"
      onAddToQueue={onSubmit}
      onCancel={onCancel}
    />
  );
}
