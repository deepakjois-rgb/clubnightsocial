import type { Player, PlayerState } from "@/types";

type PlayerRowAction = {
  label: string;
  onClick: () => void;
};

type PlayerRowProps = {
  name: string;
  state: PlayerState;
  action?: PlayerRowAction;
};

const STATE_BADGE_STYLES: Record<PlayerState, string> = {
  WAITING: "bg-yellow-100 text-yellow-800",
  PLAYING: "bg-green-100 text-green-800",
  UNAVAILABLE: "bg-gray-100 text-gray-600",
};

export function PlayerRow({ name, state, action }: PlayerRowProps) {
  return (
    <li className="flex items-center justify-between gap-3 border border-gray-200 rounded-lg px-4 py-3">
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-sm font-medium truncate">{name}</span>
        <span
          className={`text-xs font-semibold px-2 py-1 rounded shrink-0 ${STATE_BADGE_STYLES[state]}`}
        >
          {state}
        </span>
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
