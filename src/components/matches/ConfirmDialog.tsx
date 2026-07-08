"use client";

import { MESSAGES } from "@/constants/messages";

const M = MESSAGES;

type ConfirmDialogProps = {
  open: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  open,
  message,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        onClick={onCancel}
        aria-label={M.QUEUE_CANCEL}
      />

      <div className="relative w-full max-w-sm bg-white rounded-lg shadow-lg p-6 space-y-4">
        <p className="text-sm">{message}</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-700"
          >
            {M.LIVE_CONFIRM}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 border border-gray-300 font-semibold rounded-lg hover:bg-gray-50"
          >
            {M.QUEUE_CANCEL}
          </button>
        </div>
      </div>
    </div>
  );
}
