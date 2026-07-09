"use client";

import { MESSAGES } from "@/constants/messages";
import { Button } from "@/components/ui";

const M = MESSAGES;

type ConfirmDialogProps = {
  open: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  destructive?: boolean;
};

export function ConfirmDialog({
  open,
  message,
  onConfirm,
  onCancel,
  confirmLabel = M.LIVE_CONFIRM,
  destructive = false,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/40 transition-opacity duration-200"
        onClick={onCancel}
        aria-label={M.QUEUE_CANCEL}
      />

      <div className="relative w-full max-w-sm mx-4 mb-4 sm:mb-0 bg-card rounded-[var(--radius-lg)] shadow-lg p-6 space-y-4 animate-sheet-in">
        <p className="text-sm text-foreground leading-relaxed">{message}</p>
        <div className="flex gap-2">
          <Button
            variant={destructive ? "destructive" : "primary"}
            fullWidth
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
          <Button variant="secondary" fullWidth onClick={onCancel}>
            {M.QUEUE_CANCEL}
          </Button>
        </div>
      </div>
    </div>
  );
}
