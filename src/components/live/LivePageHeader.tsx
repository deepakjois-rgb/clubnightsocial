import { MESSAGES } from "@/constants/messages";
import { Button } from "@/components/ui";

const M = MESSAGES;

type LivePageHeaderProps = {
  onQueue: () => void;
};

export function LivePageHeader({ onQueue }: LivePageHeaderProps) {
  return (
    <header className="flex items-center justify-between gap-3">
      <h1 className="text-2xl font-bold text-court-green tracking-tight">
        {M.LIVE_PAGE_TITLE}
      </h1>
      <Button variant="secondary" onClick={onQueue}>
        {M.LIVE_QUEUE_BUTTON}
      </Button>
    </header>
  );
}
