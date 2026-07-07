"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/context/SessionContext";
import { MESSAGES } from "@/constants/messages";
import { CreateMatchModal, QueuedMatchList } from "@/components/queue";
import { getMatchPlayerIds, movePlayersToEnd } from "@/lib/utils";
import type { Player, QueuedMatch } from "@/types";

const M = MESSAGES;

export default function QueuePage() {
  const router = useRouter();
  const { session } = useSession();

  const [queuedMatches, setQueuedMatches] = useState<QueuedMatch[]>([]);
  const [orderedPlayers, setOrderedPlayers] = useState<Player[]>(
    () => session?.players ?? []
  );
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    if (!session) {
      router.replace("/session");
    }
  }, [session, router]);

  useEffect(() => {
    if (session) {
      setOrderedPlayers(session.players);
    }
  }, [session?.id]);

  if (!session) {
    return null;
  }

  function handleCreateMatch(match: QueuedMatch) {
    setQueuedMatches((prev) => [...prev, match]);
    setOrderedPlayers((prev) =>
      movePlayersToEnd(prev, getMatchPlayerIds(match.matchSides))
    );
    setShowCreateForm(false);
  }

  function handleDeleteMatch(id: string) {
    setQueuedMatches((prev) => prev.filter((m) => m.id !== id));
  }

  return (
    <>
      <main className="max-w-lg mx-auto px-4 py-8 pb-24 space-y-8">
        <h1 className="text-2xl font-bold">{M.QUEUE_PAGE_TITLE}</h1>

        <QueuedMatchList
          matches={queuedMatches}
          players={session.players}
          onDelete={handleDeleteMatch}
        />
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
        players={orderedPlayers}
        onSubmit={handleCreateMatch}
        onClose={() => setShowCreateForm(false)}
      />
    </>
  );
}
