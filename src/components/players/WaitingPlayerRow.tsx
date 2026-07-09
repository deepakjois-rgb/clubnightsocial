import { MESSAGES } from "@/constants/messages";
import { Badge, Button } from "@/components/ui";

const M = MESSAGES;

type WaitingPlayerRowAction = {
  label: string;
  onClick: () => void;
};

type WaitingPlayerRowProps = {
  name: string;
  gamesPlayed: number;
  waitingMinutes: number;
  action?: WaitingPlayerRowAction;
};

export function WaitingPlayerRow({
  name,
  gamesPlayed,
  waitingMinutes,
  action,
}: WaitingPlayerRowProps) {
  return (
    <li className="flex items-center justify-between gap-3 bg-card border border-border rounded-[var(--radius-lg)] px-4 py-3 shadow-[var(--shadow-card)] transition-shadow duration-200 hover:shadow-md">
      <div className="min-w-0 space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium truncate">{name}</span>
          <Badge className="bg-[var(--waiting)] text-[var(--waiting-text)]">
            {M.LABEL_WAITING}
          </Badge>
        </div>
        <p className="text-xs text-muted">
          <span className="font-medium text-foreground">
            {waitingMinutes} {M.LIVE_DURATION_MINUTES}
          </span>
          {" · "}
          {M.LIVE_GAMES_PLAYED} {gamesPlayed}
        </p>
      </div>
      {action && (
        <Button variant="secondary" className="!py-2 !px-3 text-xs shrink-0" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </li>
  );
}
