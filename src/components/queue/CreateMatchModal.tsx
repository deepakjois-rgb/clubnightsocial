"use client";

import type { Player } from "@/types";
import { MESSAGES } from "@/constants/messages";
import { CreateMatchForm } from "./CreateMatchForm";
import type { CreateQueuedMatchPayload } from "@/services/matchService";

const M = MESSAGES;

type CreateMatchModalProps = {
  open: boolean;
  players: Player[];
  onSubmit: (payload: CreateQueuedMatchPayload) => void;
  onClose: () => void;
};

export function CreateMatchModal({
  open,
  players,
  onSubmit,
  onClose,
}: CreateMatchModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-match-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-label={M.QUEUE_CANCEL}
      />

      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto mx-4 mb-4 sm:mb-0 bg-card rounded-t-[var(--radius-lg)] sm:rounded-[var(--radius-lg)] shadow-lg animate-sheet-in">
        <div className="sticky top-0 bg-card border-b border-border px-4 py-4">
          <h2
            id="create-match-modal-title"
            className="text-lg font-semibold text-court-green"
          >
            {M.QUEUE_CREATE_MATCH_MODAL_TITLE}
          </h2>
        </div>

        <div className="p-4">
          <CreateMatchForm
            players={players}
            onSubmit={onSubmit}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
}
