"use client";

import { useEffect, useState } from "react";
import type { Player } from "@/types";
import { MESSAGES } from "@/constants/messages";
import { EmptyState } from "@/components/ui";
import { getElapsedMinutes } from "@/lib/utils";
import { WaitingPlayerRow } from "./WaitingPlayerRow";

const M = MESSAGES;

type WaitingPlayerListAction = {
  label: string;
  onClick: (player: Player) => void;
};

type WaitingPlayerListProps = {
  title: string;
  players: Player[];
  action?: WaitingPlayerListAction;
};

export function WaitingPlayerList({
  title,
  players,
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
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      {players.length === 0 ? (
        <EmptyState
          title={M.LIVE_NO_WAITING_PLAYERS_TITLE}
          description={M.LIVE_NO_WAITING_PLAYERS_DESC}
        />
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
