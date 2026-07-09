import { MESSAGES } from "@/constants/messages";
import { Button } from "@/components/ui";

const M = MESSAGES;

type MatchControlsProps = {
  onComplete: () => void;
  onAbandon: () => void;
};

export function MatchControls({ onComplete, onAbandon }: MatchControlsProps) {
  return (
    <div className="space-y-2">
      <Button variant="primary" fullWidth onClick={onComplete}>
        {M.LIVE_COMPLETE_MATCH}
      </Button>
      <div className="text-center">
        <Button variant="destructive-outline" onClick={onAbandon}>
          {M.LIVE_ABANDON_MATCH}
        </Button>
      </div>
    </div>
  );
}
