import { MESSAGES } from "@/constants/messages";

const M = MESSAGES;

type MatchControlsProps = {
  onComplete: () => void;
  onAbandon: () => void;
};

export function MatchControls({ onComplete, onAbandon }: MatchControlsProps) {
  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={onComplete}
        className="w-full py-3 text-sm font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-700"
      >
        {M.LIVE_COMPLETE_MATCH}
      </button>
      <button
        type="button"
        onClick={onAbandon}
        className="w-full py-3 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50"
      >
        {M.LIVE_ABANDON_MATCH}
      </button>
    </div>
  );
}
