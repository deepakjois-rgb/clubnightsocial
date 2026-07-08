import type { Player } from "@/types";
import { PlayerRow } from "./PlayerRow";

type PlayerListAction = {
  label: string;
  onClick: (player: Player) => void;
};

type PlayerListProps = {
  title: string;
  players: Player[];
  emptyMessage: string;
  action?: PlayerListAction;
};

export function PlayerList({
  title,
  players,
  emptyMessage,
  action,
}: PlayerListProps) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">{title}</h2>
      {players.length === 0 ? (
        <p className="text-sm text-gray-500">{emptyMessage}</p>
      ) : (
        <ul className="space-y-2">
          {players.map((player) => (
            <PlayerRow
              key={player.id}
              name={player.name}
              state={player.state}
              action={
                action
                  ? {
                      label: action.label,
                      onClick: () => action.onClick(player),
                    }
                  : undefined
              }
            />
          ))}
        </ul>
      )}
    </section>
  );
}
