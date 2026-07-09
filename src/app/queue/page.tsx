"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/context/SessionContext";
import { MESSAGES } from "@/constants/messages";
import {
  CreateMatchModal,
  LiveMatchList,
  QueuedMatchList,
  QueuePageHeader,
} from "@/components/queue";
import { CompletedMatchList } from "@/components/matches";
import { Button, useToast } from "@/components/ui";
import {
  getCompletedMatches,
  getLiveMatches,
  getQueuedMatches,
} from "@/services/matchService";
import {
  isActiveSession,
  isCompletedSession,
} from "@/services/sessionService";
import type { CreateQueuedMatchPayload } from "@/services/matchService";

const M = MESSAGES;

export default function QueuePage() {
  const router = useRouter();
  const { session, dispatch } = useSession();
  const { showToast } = useToast();
  const [showCreateForm, setShowCreateForm] = useState(false);

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

  const queuedMatches = getQueuedMatches(session);
  const liveMatches = getLiveMatches(session);
  const completedMatches = getCompletedMatches(session);

  function handleCreateMatch(payload: CreateQueuedMatchPayload) {
    dispatch({ type: "CREATE_QUEUED_MATCH", payload });
    setShowCreateForm(false);
    showToast(M.TOAST_MATCH_QUEUED);
  }

  function handleDeleteMatch(matchId: string) {
    dispatch({ type: "DELETE_QUEUED_MATCH", payload: { matchId } });
  }

  return (
    <>
      <main className="max-w-lg mx-auto px-4 py-6 pb-28 space-y-6">
        <QueuePageHeader onBack={() => router.push("/live")} />

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            {M.QUEUE_MATCH_QUEUE_SECTION} ({queuedMatches.length})
          </h2>
          <QueuedMatchList
            matches={queuedMatches}
            players={session.players}
            onDelete={handleDeleteMatch}
            onCreateMatch={() => setShowCreateForm(true)}
          />
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            {M.QUEUE_LIVE_SECTION} ({liveMatches.length})
          </h2>
          <LiveMatchList
            matches={liveMatches}
            courts={session.courts}
            players={session.players}
          />
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            {M.QUEUE_COMPLETED_SECTION} ({completedMatches.length})
          </h2>
          <CompletedMatchList
            matches={completedMatches}
            players={session.players}
          />
        </section>
      </main>

      <div className="fixed bottom-0 inset-x-0 border-t border-border bg-card/95 backdrop-blur-sm px-4 py-4">
        <div className="max-w-lg mx-auto">
          <Button variant="primary" fullWidth onClick={() => setShowCreateForm(true)}>
            {M.QUEUE_CREATE_MATCH}
          </Button>
        </div>
      </div>

      <CreateMatchModal
        open={showCreateForm}
        players={session.players}
        onSubmit={handleCreateMatch}
        onClose={() => setShowCreateForm(false)}
      />
    </>
  );
}
