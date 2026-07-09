import type { Session } from "@/types";
import { MESSAGES } from "@/constants/messages";
import { Card } from "@/components/ui";
import { formatTimestamp, getDurationMinutes } from "@/lib/utils";

const M = MESSAGES;

type SessionSummaryInfoProps = {
  session: Session;
};

export function SessionSummaryInfo({ session }: SessionSummaryInfoProps) {
  const durationMinutes =
    session.endedAt != null
      ? getDurationMinutes(session.startedAt, session.endedAt)
      : 0;

  return (
    <Card>
      <h2 className="text-lg font-semibold text-foreground mb-4">
        {M.SUMMARY_SESSION_INFORMATION}
      </h2>
      <dl className="space-y-3 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-muted">{M.SUMMARY_ORGANISER}</dt>
          <dd className="font-medium text-right">{session.organiserName}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted">{M.SUMMARY_START_TIME}</dt>
          <dd className="font-medium">{formatTimestamp(session.startedAt)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted">{M.SUMMARY_END_TIME}</dt>
          <dd className="font-medium">
            {session.endedAt != null ? formatTimestamp(session.endedAt) : "—"}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted">{M.SUMMARY_DURATION}</dt>
          <dd className="font-medium">
            {durationMinutes} {M.LIVE_DURATION_MINUTES}
          </dd>
        </div>
      </dl>
    </Card>
  );
}
