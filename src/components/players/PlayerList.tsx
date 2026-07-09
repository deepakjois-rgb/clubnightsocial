import type { Player } from "@/types";
import { EmptyState } from "@/components/ui";
import { PlayerRow } from "./PlayerRow";

type PlayerListAction = {
  label: string;
  onClick: (player: Player) => void;
};

type PlayerListProps = {
  title: string;
  players: Player[];
  emptyTitle: string;
  emptyDescription: string;
  action?: PlayerListAction;
};

export function PlayerList({
  title,
  players,
  emptyTitle,
  emptyDescription,
  action,
}: PlayerListProps) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      {players.length === 0 ? (
        <EmptyState title={emptyTitle} description={emptyDescription} />
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
