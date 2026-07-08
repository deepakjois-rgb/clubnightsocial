import type { Session } from "@/types";
import { MESSAGES } from "@/constants/messages";
import {
  formatTimestamp,
  getDurationMinutes,
} from "@/lib/utils";

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
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">{M.SUMMARY_SESSION_INFORMATION}</h2>
      <dl className="space-y-2 text-sm">
        <div className="flex gap-2">
          <dt className="font-medium w-32">{M.SUMMARY_ORGANISER}</dt>
          <dd>{session.organiserName}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="font-medium w-32">{M.SUMMARY_START_TIME}</dt>
          <dd>{formatTimestamp(session.startedAt)}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="font-medium w-32">{M.SUMMARY_END_TIME}</dt>
          <dd>
            {session.endedAt != null
              ? formatTimestamp(session.endedAt)
              : "—"}
          </dd>
        </div>
        <div className="flex gap-2">
          <dt className="font-medium w-32">{M.SUMMARY_DURATION}</dt>
          <dd>
            {durationMinutes} {M.LIVE_DURATION_MINUTES}
          </dd>
        </div>
      </dl>
    </section>
  );
}
