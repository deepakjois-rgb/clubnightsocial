import { MESSAGES } from "@/constants/messages";
import { Button } from "@/components/ui";

const M = MESSAGES;

type QueuePageHeaderProps = {
  onBack: () => void;
};

export function QueuePageHeader({ onBack }: QueuePageHeaderProps) {
  return (
    <header className="flex items-center justify-between gap-3">
      <h1 className="text-2xl font-bold text-court-green tracking-tight">
        {M.QUEUE_PAGE_TITLE}
      </h1>
      <Button variant="secondary" onClick={onBack}>
        {M.QUEUE_BACK_BUTTON}
      </Button>
    </header>
  );
}
