import type { Court } from "@/types";
import { MESSAGES } from "@/constants/messages";
import { CourtCard } from "./CourtCard";

const M = MESSAGES;

type CourtGridProps = {
  courts: Court[];
};

export function CourtGrid({ courts }: CourtGridProps) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">{M.LIVE_COURTS_SECTION}</h2>
      <div className="grid grid-cols-1 gap-3">
        {courts.map((court) => (
          <CourtCard key={court.id} court={court} />
        ))}
      </div>
    </section>
  );
}
