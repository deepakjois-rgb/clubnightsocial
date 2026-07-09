import type { PlayerState } from "@/types";
import { MESSAGES } from "@/constants/messages";

const M = MESSAGES;

export function getPlayerStateLabel(state: PlayerState): string {
  switch (state) {
    case "WAITING":
      return M.LABEL_WAITING;
    case "PLAYING":
      return M.LABEL_ON_COURT;
    case "UNAVAILABLE":
      return M.LABEL_AWAY;
  }
}

export function getCourtStatusLabel(isFree: boolean): string {
  return isFree ? M.LABEL_FREE : M.LABEL_IN_PLAY;
}

export function getPlayerStateBadgeClass(state: PlayerState): string {
  switch (state) {
    case "WAITING":
      return "bg-[var(--waiting)] text-[var(--waiting-text)]";
    case "PLAYING":
      return "bg-[var(--playing)] text-[var(--playing-text)]";
    case "UNAVAILABLE":
      return "bg-[var(--away)] text-[var(--away-text)]";
  }
}

export function getCourtStatusBadgeClass(isFree: boolean): string {
  return isFree
    ? "bg-[var(--free)] text-[var(--free-text)]"
    : "bg-[var(--in-play)] text-[var(--in-play-text)]";
}
