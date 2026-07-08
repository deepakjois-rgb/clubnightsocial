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
  WaitingPlayerList,
  StartMatchModal,
} from "@/components/live";
import { ConfirmDialog } from "@/components/matches";
import { getWaitingPlayers } from "@/services/playerService";
import {
  canEndSession,
  isActiveSession,
  isCompletedSession,
} from "@/services/sessionService";
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
  const [showEndSessionConfirm, setShowEndSessionConfirm] = useState(false);
  const [endSessionError, setEndSessionError] = useState<string | null>(null);

  useEffect(() => {
    if (!session) {
      router.replace("/session");
      return;
    }

    if (isCompletedSession(session)) {
      router.replace("/sessionsummary");
    }
  }, [session, router]);

  if (!isActiveSession(session)) {
    return null;
  }

  const activeSession = session;

  const waitingPlayers = getWaitingPlayers(activeSession);

  const unavailablePlayers = sortByName(
    activeSession.players.filter((p) => p.state === "UNAVAILABLE")
  );

  const selectedCourt = activeSession.courts.find(
    (c) => c.id === startMatchCourtId
  );

  function clearEndSessionError() {
    setEndSessionError(null);
  }

  function handleSelectMatch(matchId: string) {
    if (!startMatchCourtId) return;

    clearEndSessionError();
    dispatch({
      type: "START_MATCH",
      payload: { courtId: startMatchCourtId, matchId },
    });
    setStartMatchCourtId(null);
  }

  function handleUpdatePlayerState(playerId: string, state: PlayerState) {
    clearEndSessionError();
    dispatch({
      type: "UPDATE_PLAYER_STATE",
      payload: { playerId, state },
    });
  }

  function handleCompleteMatch(matchId: string) {
    clearEndSessionError();
    dispatch({
      type: "COMPLETE_MATCH",
      payload: { matchId },
    });
  }

  function handleAbandonMatch() {
    if (!abandonMatchId) return;

    clearEndSessionError();
    dispatch({
      type: "ABANDON_MATCH",
      payload: { matchId: abandonMatchId },
    });
    setAbandonMatchId(null);
  }

  function handleEndSessionClick() {
    if (!canEndSession(activeSession)) {
      setEndSessionError(M.LIVE_END_SESSION_LIVE_MATCHES_ERROR);
      return;
    }

    setEndSessionError(null);
    setShowEndSessionConfirm(true);
  }

  function handleConfirmEndSession() {
    dispatch({ type: "END_SESSION" });
    setShowEndSessionConfirm(false);
    router.push("/sessionsummary");
  }

  return (
    <>
      <main className="max-w-lg mx-auto px-4 py-8 space-y-8">
        <LivePageHeader
          onQueue={() => router.push("/queue")}
          onEndSession={handleEndSessionClick}
        />

        {endSessionError && (
          <p role="alert" className="text-sm text-red-600">
            {endSessionError}
          </p>
        )}

        <SessionHeader session={activeSession} />
        <CourtGrid
          courts={activeSession.courts}
          matches={activeSession.matches}
          players={activeSession.players}
          onStartMatch={(courtId) => {
            clearEndSessionError();
            setStartMatchCourtId(courtId);
          }}
          onCompleteMatch={handleCompleteMatch}
          onAbandonMatch={(matchId) => {
            clearEndSessionError();
            setAbandonMatchId(matchId);
          }}
        />

        <WaitingPlayerList
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
        session={activeSession}
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

      <ConfirmDialog
        open={showEndSessionConfirm}
        message={M.LIVE_END_SESSION_CONFIRM}
        onConfirm={handleConfirmEndSession}
        onCancel={() => setShowEndSessionConfirm(false)}
      />
    </>
  );
}
