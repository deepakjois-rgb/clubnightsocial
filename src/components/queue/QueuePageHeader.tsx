import { MESSAGES } from "@/constants/messages";

const M = MESSAGES;

type QueuePageHeaderProps = {
  onBack: () => void;
};

export function QueuePageHeader({ onBack }: QueuePageHeaderProps) {
  return (
    <header className="flex items-center justify-between gap-3">
      <h1 className="text-2xl font-bold">{M.QUEUE_PAGE_TITLE}</h1>
      <button
        type="button"
        onClick={onBack}
        className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50"
      >
        {M.QUEUE_BACK_BUTTON}
      </button>
    </header>
  );
}
