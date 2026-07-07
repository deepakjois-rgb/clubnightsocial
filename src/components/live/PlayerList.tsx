import type { Player } from "@/types";
import { PlayerRow } from "./PlayerRow";

type PlayerListProps = {
  title: string;
  players: Player[];
  emptyMessage: string;
};

export function PlayerList({ title, players, emptyMessage }: PlayerListProps) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">{title}</h2>
      {players.length === 0 ? (
        <p className="text-sm text-gray-500">{emptyMessage}</p>
      ) : (
        <ul className="space-y-2">
          {players.map((player) => (
            <PlayerRow key={player.id} name={player.name} state={player.state} />
          ))}
        </ul>
      )}
    </section>
  );
}
