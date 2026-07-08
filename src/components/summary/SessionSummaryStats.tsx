import type { SessionStatistics } from "@/services/sessionService";
import { MESSAGES } from "@/constants/messages";

const M = MESSAGES;

type SessionSummaryStatsProps = {
  statistics: SessionStatistics;
};

export function SessionSummaryStats({ statistics }: SessionSummaryStatsProps) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">{M.SUMMARY_SESSION_STATISTICS}</h2>
      <dl className="space-y-2 text-sm">
        <div className="flex gap-2">
          <dt className="font-medium w-40">{M.SUMMARY_PLAYERS}</dt>
          <dd>{statistics.playerCount}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="font-medium w-40">{M.SUMMARY_COMPLETED_MATCHES}</dt>
          <dd>{statistics.completedMatchCount}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="font-medium w-40">{M.SUMMARY_ABANDONED_MATCHES}</dt>
          <dd>{statistics.abandonedMatchCount}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="font-medium w-40">{M.SUMMARY_COURTS}</dt>
          <dd>{statistics.courtCount}</dd>
        </div>
      </dl>
    </section>
  );
}
