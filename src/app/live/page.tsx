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
import { ConfirmDialog } from "@/components/matches";
import type { Player, PlayerState } from "@/types";

const M = MESSAGES;

function sortByName(players: Player[]): Player[] {
  return [...players].sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
  );
}

export default function LivePage() {
  const router = useRouter();
  const { session, dispatch } = useSession();

  const [startMatchCourtId, setStartMatchCourtId] = useState<string | null>(
    null
  );
  const [abandonMatchId, setAbandonMatchId] = useState<string | null>(null);

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

  const selectedCourt = session.courts.find((c) => c.id === startMatchCourtId);

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

  function handleCompleteMatch(matchId: string) {
    dispatch({
      type: "COMPLETE_MATCH",
      payload: { matchId },
    });
  }

  function handleAbandonMatch() {
    if (!abandonMatchId) return;

    dispatch({
      type: "ABANDON_MATCH",
      payload: { matchId: abandonMatchId },
    });
    setAbandonMatchId(null);
  }

  return (
    <>
      <main className="max-w-lg mx-auto px-4 py-8 space-y-8">
        <LivePageHeader onQueue={() => router.push("/queue")} />
        <SessionHeader session={session} />
        <CourtGrid
          courts={session.courts}
          matches={session.matches}
          players={session.players}
          onStartMatch={setStartMatchCourtId}
          onCompleteMatch={handleCompleteMatch}
          onAbandonMatch={setAbandonMatchId}
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

      <StartMatchModal
        open={startMatchCourtId !== null}
        session={session}
        courtName={selectedCourt?.name ?? ""}
        onSelectMatch={handleSelectMatch}
        onClose={() => setStartMatchCourtId(null)}
      />

      <ConfirmDialog
        open={abandonMatchId !== null}
        message={M.LIVE_ABANDON_CONFIRM}
        onConfirm={handleAbandonMatch}
        onCancel={() => setAbandonMatchId(null)}
      />
    </>
  );
}
