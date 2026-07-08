import { MESSAGES } from "@/constants/messages";

const M = MESSAGES;

type WaitingPlayerRowAction = {
  label: string;
  onClick: () => void;
};

type WaitingPlayerRowProps = {
  name: string;
  gamesPlayed: number;
  waitingMinutes: number;
  action?: WaitingPlayerRowAction;
};

export function WaitingPlayerRow({
  name,
  gamesPlayed,
  waitingMinutes,
  action,
}: WaitingPlayerRowProps) {
  return (
    <li className="flex items-center justify-between gap-3 border border-gray-200 rounded-lg px-4 py-3">
      <div className="min-w-0 space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium truncate">{name}</span>
          <span className="text-xs font-semibold px-2 py-1 rounded shrink-0 bg-yellow-100 text-yellow-800">
            WAITING
          </span>
        </div>
        <p className="text-xs text-gray-500">
          {M.LIVE_GAMES_PLAYED} {gamesPlayed}
        </p>
        <p className="text-xs text-gray-500">
          {M.LIVE_WAITING_TIME} {waitingMinutes} {M.LIVE_DURATION_MINUTES}
        </p>
      </div>
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="text-sm font-medium text-gray-700 border border-gray-300 rounded-lg px-3 py-2 shrink-0 hover:bg-gray-50"
        >
          {action.label}
        </button>
      )}
    </li>
  );
}
