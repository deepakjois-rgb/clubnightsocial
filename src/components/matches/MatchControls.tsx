import { MESSAGES } from "@/constants/messages";
import { Button } from "@/components/ui";

const M = MESSAGES;

type MatchControlsProps = {
  onComplete: () => void;
  onAbandon: () => void;
};

export function MatchControls({ onComplete, onAbandon }: MatchControlsProps) {
  return (
    <div className="flex items-stretch gap-2">
      <Button
        variant="primary"
        fullWidth
        className="py-2.5"
        onClick={onComplete}
      >
        {M.LIVE_COMPLETE_MATCH}
      </Button>
      <Button
        variant="destructive-outline"
        className="py-2.5 px-3 text-xs shrink-0"
        onClick={onAbandon}
      >
        {M.LIVE_ABANDON_MATCH_SHORT}
      </Button>
    </div>
  );
}
