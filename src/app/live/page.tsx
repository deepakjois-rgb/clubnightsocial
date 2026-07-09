"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/context/SessionContext";
import { MESSAGES } from "@/constants/messages";
import {
  LivePageHeader,
  SessionHeader,
  CourtGrid,
  StartMatchModal,
} from "@/components/live";
import { ConfirmDialog } from "@/components/matches";
import { WaitingPlayerList } from "@/components/players/WaitingPlayerList";
import { PlayerList } from "@/components/players/PlayerList";
import { Button, useToast } from "@/components/ui";
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
  const { showToast } = useToast();

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
      router.replace("/summary");
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
    showToast(
      state === "UNAVAILABLE" ? M.TOAST_PLAYER_AWAY : M.TOAST_PLAYER_BACK
    );
  }

  function handleCompleteMatch(matchId: string) {
    clearEndSessionError();
    dispatch({
      type: "COMPLETE_MATCH",
      payload: { matchId },
    });
    showToast(M.TOAST_MATCH_COMPLETED);
  }

  function handleAbandonMatch() {
    if (!abandonMatchId) return;

    clearEndSessionError();
    dispatch({
      type: "ABANDON_MATCH",
      payload: { matchId: abandonMatchId },
    });
    setAbandonMatchId(null);
    showToast(M.TOAST_MATCH_ABANDONED);
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
    showToast(M.TOAST_SESSION_ENDED);
    router.push("/summary");
  }

  return (
    <>
      <main className="max-w-lg mx-auto px-4 py-6 pb-32 space-y-6">
        <LivePageHeader onQueue={() => router.push("/queue")} />

        {endSessionError && (
          <p role="alert" className="text-sm text-danger bg-danger-muted rounded-[var(--radius)] px-3 py-2">
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
          action={{
            label: M.LIVE_TAKE_BREAK,
            onClick: (player) =>
              handleUpdatePlayerState(player.id, "UNAVAILABLE"),
          }}
        />

        <PlayerList
          title={M.LIVE_UNAVAILABLE_PLAYERS}
          players={unavailablePlayers}
          emptyTitle={M.LIVE_NO_UNAVAILABLE_PLAYERS_TITLE}
          emptyDescription={M.LIVE_NO_UNAVAILABLE_PLAYERS_DESC}
          action={{
            label: M.LIVE_BACK_IN,
            onClick: (player) => handleUpdatePlayerState(player.id, "WAITING"),
          }}
        />
      </main>

      <div className="fixed bottom-0 inset-x-0 border-t border-border bg-card/95 backdrop-blur-sm px-4 py-4">
        <div className="max-w-lg mx-auto">
          <Button variant="destructive" fullWidth onClick={handleEndSessionClick}>
            {M.LIVE_END_SESSION_BUTTON}
          </Button>
        </div>
      </div>

      <StartMatchModal
        open={startMatchCourtId !== null}
        session={activeSession}
        courtName={selectedCourt?.name ?? ""}
        onSelectMatch={handleSelectMatch}
        onClose={() => setStartMatchCourtId(null)}
        onGoToQueue={() => {
          setStartMatchCourtId(null);
          router.push("/queue");
        }}
      />

      <ConfirmDialog
        open={abandonMatchId !== null}
        message={M.LIVE_ABANDON_CONFIRM}
        destructive
        onConfirm={handleAbandonMatch}
        onCancel={() => setAbandonMatchId(null)}
      />

      <ConfirmDialog
        open={showEndSessionConfirm}
        message={M.LIVE_END_SESSION_CONFIRM}
        destructive
        confirmLabel={M.LIVE_END_SESSION_BUTTON}
        onConfirm={handleConfirmEndSession}
        onCancel={() => setShowEndSessionConfirm(false)}
      />
    </>
  );
}
