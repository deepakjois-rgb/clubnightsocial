import type { Player, PlayerState } from "@/types";

type PlayerRowProps = {
  name: string;
  state: PlayerState;
};

const STATE_BADGE_STYLES: Record<PlayerState, string> = {
  WAITING: "bg-yellow-100 text-yellow-800",
  PLAYING: "bg-green-100 text-green-800",
  UNAVAILABLE: "bg-gray-100 text-gray-600",
};

export function PlayerRow({ name, state }: PlayerRowProps) {
  return (
    <li className="flex items-center justify-between border border-gray-200 rounded-lg px-4 py-3">
      <span className="text-sm font-medium">{name}</span>
      <span
        className={`text-xs font-semibold px-2 py-1 rounded ${STATE_BADGE_STYLES[state]}`}
      >
        {state}
      </span>
    </li>
  );
}
