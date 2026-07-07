"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/context/SessionContext";
import { MESSAGES } from "@/constants/messages";
import { SessionHeader, CourtGrid, PlayerList } from "@/components/live";
import type { Player } from "@/types";

const M = MESSAGES;

function sortByName(players: Player[]): Player[] {
  return [...players].sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
  );
}

export default function LivePage() {
  const router = useRouter();
  const { session } = useSession();

  useEffect(() => {
    if (!session) {
      router.replace("/session");
    }
  }, [session, router]);

  if (!session) {
    return null;
  }

  const waitingPlayers = sortByName(
    session.players.filter((p) => p.state === "WAITING")
  );

  const unavailablePlayers = sortByName(
    session.players.filter((p) => p.state === "UNAVAILABLE")
  );

  return (
    <main className="max-w-lg mx-auto px-4 py-8 space-y-8">
      <SessionHeader session={session} />
      <CourtGrid courts={session.courts} />
      <PlayerList
        title={M.LIVE_WAITING_PLAYERS}
        players={waitingPlayers}
        emptyMessage={M.LIVE_NO_WAITING_PLAYERS}
      />
      <PlayerList
        title={M.LIVE_UNAVAILABLE_PLAYERS}
        players={unavailablePlayers}
        emptyMessage={M.LIVE_NO_UNAVAILABLE_PLAYERS}
      />
    </main>
  );
}
