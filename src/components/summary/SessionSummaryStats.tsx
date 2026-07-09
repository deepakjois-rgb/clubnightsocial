import type { SessionStatistics } from "@/services/sessionService";
import { MESSAGES } from "@/constants/messages";
import { Card } from "@/components/ui";

const M = MESSAGES;

type SessionSummaryStatsProps = {
  statistics: SessionStatistics;
};

export function SessionSummaryStats({ statistics }: SessionSummaryStatsProps) {
  return (
    <Card>
      <h2 className="text-lg font-semibold text-foreground mb-4">
        {M.SUMMARY_SESSION_STATISTICS}
      </h2>
      <dl className="grid grid-cols-2 gap-4 text-sm">
        <div className="bg-surface rounded-[var(--radius)] p-3 text-center">
          <dt className="text-muted text-xs">{M.SUMMARY_PLAYERS}</dt>
          <dd className="text-2xl font-bold text-court-green mt-1">
            {statistics.playerCount}
          </dd>
        </div>
        <div className="bg-surface rounded-[var(--radius)] p-3 text-center">
          <dt className="text-muted text-xs">{M.SUMMARY_COURTS}</dt>
          <dd className="text-2xl font-bold text-court-green mt-1">
            {statistics.courtCount}
          </dd>
        </div>
        <div className="bg-surface rounded-[var(--radius)] p-3 text-center">
          <dt className="text-muted text-xs">{M.SUMMARY_COMPLETED_MATCHES}</dt>
          <dd className="text-2xl font-bold text-court-green mt-1">
            {statistics.completedMatchCount}
          </dd>
        </div>
        <div className="bg-surface rounded-[var(--radius)] p-3 text-center">
          <dt className="text-muted text-xs">{M.SUMMARY_ABANDONED_MATCHES}</dt>
          <dd className="text-2xl font-bold text-court-green mt-1">
            {statistics.abandonedMatchCount}
          </dd>
        </div>
      </dl>
    </Card>
  );
}
