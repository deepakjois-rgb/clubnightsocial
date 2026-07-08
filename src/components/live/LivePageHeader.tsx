import { MESSAGES } from "@/constants/messages";

const M = MESSAGES;

type LivePageHeaderProps = {
  onQueue: () => void;
  onEndSession: () => void;
};

export function LivePageHeader({ onQueue, onEndSession }: LivePageHeaderProps) {
  return (
    <header className="flex items-center justify-between gap-3">
      <h1 className="text-2xl font-bold">{M.LIVE_PAGE_TITLE}</h1>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onQueue}
          className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          {M.LIVE_QUEUE_BUTTON}
        </button>
        <button
          type="button"
          onClick={onEndSession}
          className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          {M.LIVE_END_SESSION_BUTTON}
        </button>
      </div>
    </header>
  );
}
