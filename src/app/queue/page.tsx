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
  const [showCreateForm, setShowCreateForm] = useState(false);

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

  const queuedMatches = getQueuedMatches(session);
  const liveMatches = getLiveMatches(session);
  const completedMatches = getCompletedMatches(session);

  function handleCreateMatch(payload: CreateQueuedMatchPayload) {
    dispatch({ type: "CREATE_QUEUED_MATCH", payload });
    setShowCreateForm(false);
  }

  function handleDeleteMatch(matchId: string) {
    dispatch({ type: "DELETE_QUEUED_MATCH", payload: { matchId } });
  }

  return (
    <>
      <main className="max-w-lg mx-auto px-4 py-8 pb-24 space-y-8">
        <QueuePageHeader onBack={() => router.push("/live")} />

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">
            {M.QUEUE_MATCH_QUEUE_SECTION} ({queuedMatches.length})
          </h2>
          <QueuedMatchList
            matches={queuedMatches}
            players={session.players}
            onDelete={handleDeleteMatch}
          />
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">
            {M.QUEUE_LIVE_SECTION} ({liveMatches.length})
          </h2>
          <LiveMatchList
            matches={liveMatches}
            courts={session.courts}
            players={session.players}
          />
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">
            {M.QUEUE_COMPLETED_SECTION} ({completedMatches.length})
          </h2>
          <CompletedMatchList
            matches={completedMatches}
            players={session.players}
          />
        </section>
      </main>

      <div className="fixed bottom-0 inset-x-0 border-t border-gray-200 bg-white px-4 py-4">
        <div className="max-w-lg mx-auto">
          <button
            type="button"
            onClick={() => setShowCreateForm(true)}
            className="w-full py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-700"
          >
            {M.QUEUE_CREATE_MATCH}
          </button>
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
