"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/context/SessionContext";
import { MESSAGES } from "@/constants/messages";
import {
  LivePageHeader,
  SessionHeader,
  CourtGrid,
  PlayerList,
  StartMatchModal,
} from "@/components/live";
import type { Player, PlayerState } from "@/types";

const M = MESSAGES;

function sortByName(players: Player[]): Player[] {
  return [...players].sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
  );
}

// Primary operational screen during an active club night.
// Displays session stats, courts, and player pools; starts queued matches on free courts.
export default function LivePage() {
  const router = useRouter();
  const { session, dispatch } = useSession();

  // When set, the Start Match modal is open for this court.
  // null means no court is currently selecting a queued match.
  const [startMatchCourtId, setStartMatchCourtId] = useState<string | null>(
    null
  );

  // Redirect to session setup if there is no active session.
  useEffect(() => {
    if (!session) {
      router.replace("/session");
    }
  }, [session, router]);

  if (!session) {
    return null;
  }

  // Player lists are derived from session state and sorted alphabetically.
  // Wait-time ordering will be added in a later task.
  const waitingPlayers = sortByName(
    session.players.filter((p) => p.state === "WAITING")
  );

  const unavailablePlayers = sortByName(
    session.players.filter((p) => p.state === "UNAVAILABLE")
  );

  const selectedCourt = session.courts.find((c) => c.id === startMatchCourtId);

  // Dispatches START_MATCH to move a queued match onto the selected court.
  // Business logic lives in matchService; the reducer delegates to it.
  function handleSelectMatch(matchId: string) {
    if (!startMatchCourtId) return;

    dispatch({
      type: "START_MATCH",
      payload: { courtId: startMatchCourtId, matchId },
    });
    setStartMatchCourtId(null);
  }

  function handleUpdatePlayerState(playerId: string, state: PlayerState) {
    dispatch({
      type: "UPDATE_PLAYER_STATE",
      payload: { playerId, state },
    });
  }

  return (
    <>
      <main className="max-w-lg mx-auto px-4 py-8 space-y-8">
        {/* Navigation: Queue and End Session (End Session disabled for now) */}
        <LivePageHeader onQueue={() => router.push("/queue")} />

        {/* Session metadata: organiser, court count, player count, duration */}
        <SessionHeader session={session} />

        {/* Courts — free courts can start a queued match; occupied courts show live match */}
        <CourtGrid
          courts={session.courts}
          matches={session.matches}
          players={session.players}
          onStartMatch={setStartMatchCourtId}
        />

        <PlayerList
          title={M.LIVE_WAITING_PLAYERS}
          players={waitingPlayers}
          emptyMessage={M.LIVE_NO_WAITING_PLAYERS}
          action={{
            label: M.LIVE_MAKE_UNAVAILABLE,
            onClick: (player) =>
              handleUpdatePlayerState(player.id, "UNAVAILABLE"),
          }}
        />
        <PlayerList
          title={M.LIVE_UNAVAILABLE_PLAYERS}
          players={unavailablePlayers}
          emptyMessage={M.LIVE_NO_UNAVAILABLE_PLAYERS}
          action={{
            label: M.LIVE_MOVE_TO_WAITING,
            onClick: (player) => handleUpdatePlayerState(player.id, "WAITING"),
          }}
        />
      </main>

      {/* Modal for picking a queued match when Start New Match is tapped on a free court */}
      <StartMatchModal
        open={startMatchCourtId !== null}
        session={session}
        courtName={selectedCourt?.name ?? ""}
        onSelectMatch={handleSelectMatch}
        onClose={() => setStartMatchCourtId(null)}
      />
    </>
  );
}
