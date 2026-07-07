import type { Court } from "@/types";
import { MESSAGES } from "@/constants/messages";

const M = MESSAGES;

type CourtCardProps = {
  court: Court;
};

export function CourtCard({ court }: CourtCardProps) {
  const isFree = court.state === "FREE";

  return (
    <div className="border border-gray-200 rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold">{court.name}</span>
        <span
          className={`text-xs font-semibold px-2 py-1 rounded ${
            isFree
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {isFree ? M.LIVE_COURT_STATUS_FREE : M.LIVE_COURT_STATUS_OCCUPIED}
        </span>
      </div>

      {isFree && (
        <button
          type="button"
          disabled
          className="w-full py-3 text-sm font-medium border border-gray-300 rounded-lg text-gray-400 cursor-not-allowed"
        >
          {M.LIVE_START_NEW_MATCH}
        </button>
      )}
    </div>
  );
}
