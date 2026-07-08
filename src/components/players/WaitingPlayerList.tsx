"use client";

import { useEffect, useState } from "react";
import type { Player } from "@/types";
import { getElapsedMinutes } from "@/lib/utils";
import { WaitingPlayerRow } from "./WaitingPlayerRow";

type WaitingPlayerListAction = {
  label: string;
  onClick: (player: Player) => void;
};

type WaitingPlayerListProps = {
  title: string;
  players: Player[];
  emptyMessage: string;
  action?: WaitingPlayerListAction;
};

export function WaitingPlayerList({
  title,
  players,
  emptyMessage,
  action,
}: WaitingPlayerListProps) {
  const [, setMinuteTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMinuteTick((tick) => tick + 1);
    }, 60_000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">{title}</h2>
      {players.length === 0 ? (
        <p className="text-sm text-gray-500">{emptyMessage}</p>
      ) : (
        <ul className="space-y-2">
          {players.map((player) => (
            <WaitingPlayerRow
              key={player.id}
              name={player.name}
              gamesPlayed={player.gamesPlayed}
              waitingMinutes={
                player.waitingSince != null
                  ? getElapsedMinutes(player.waitingSince)
                  : 0
              }
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
