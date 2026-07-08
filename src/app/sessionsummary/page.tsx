"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/context/SessionContext";
import { MESSAGES } from "@/constants/messages";
import {
  SessionSummaryInfo,
  SessionSummaryStats,
  SessionSummaryPlayerList,
} from "@/components/summary";
import { getSessionStatistics, isCompletedSession } from "@/services/sessionService";
import { sortPlayersForSummary } from "@/services/playerService";

const M = MESSAGES;

export default function SessionSummaryPage() {
  const router = useRouter();
  const { session, dispatch } = useSession();

  useEffect(() => {
    if (!isCompletedSession(session)) {
      router.replace("/session");
    }
  }, [session, router]);

  if (!isCompletedSession(session)) {
    return null;
  }

  const statistics = getSessionStatistics(session);
  const players = sortPlayersForSummary(session.players);

  function handleStartNewSession() {
    dispatch({ type: "CLEAR_SESSION" });
    router.push("/session");
  }

  return (
    <main className="max-w-lg mx-auto px-4 py-8 space-y-8">
      <h1 className="text-2xl font-bold">{M.SUMMARY_PAGE_TITLE}</h1>

      <SessionSummaryInfo session={session} />
      <SessionSummaryStats statistics={statistics} />
      <SessionSummaryPlayerList players={players} />

      <button
        type="button"
        onClick={handleStartNewSession}
        className="w-full py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-700"
      >
        {M.SUMMARY_START_NEW_SESSION}
      </button>
    </main>
  );
}
