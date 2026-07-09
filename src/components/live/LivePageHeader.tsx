import { MESSAGES } from "@/constants/messages";
import { Button } from "@/components/ui";

const M = MESSAGES;

type LivePageHeaderProps = {
  onQueue: () => void;
  onEndSession: () => void;
};

export function LivePageHeader({ onQueue, onEndSession }: LivePageHeaderProps) {
  return (
    <header className="flex items-center justify-between gap-3">
      <h1 className="text-2xl font-bold text-court-green tracking-tight">
        {M.LIVE_PAGE_TITLE}
      </h1>
      <div className="flex items-center gap-2 shrink-0">
        <Button
          variant="destructive-outline"
          className="px-3 py-2 text-xs"
          onClick={onEndSession}
        >
          {M.LIVE_END_SESSION_BUTTON}
        </Button>
        <Button variant="secondary" className="px-3 py-2" onClick={onQueue}>
          {M.LIVE_QUEUE_BUTTON}
        </Button>
      </div>
    </header>
  );
}
