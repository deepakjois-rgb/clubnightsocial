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
import { Button } from "@/components/ui";
import { getSessionStatistics, isCompletedSession } from "@/services/sessionService";
import { sortPlayersForSummary } from "@/services/playerService";

const M = MESSAGES;

export default function SummaryPage() {
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
      <h1 className="text-2xl font-bold text-court-green tracking-tight">
        {M.SUMMARY_PAGE_TITLE}
      </h1>

      <SessionSummaryInfo session={session} />
      <SessionSummaryStats statistics={statistics} />
      <SessionSummaryPlayerList players={players} />

      <Button variant="primary" fullWidth onClick={handleStartNewSession}>
        {M.SUMMARY_START_NEW_SESSION}
      </Button>
    </main>
  );
}
