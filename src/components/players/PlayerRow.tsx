import type { PlayerState } from "@/types";
import { Badge, Button } from "@/components/ui";
import { getPlayerStateBadgeClass, getPlayerStateLabel } from "@/lib/labels";

type PlayerRowAction = {
  label: string;
  onClick: () => void;
};

type PlayerRowProps = {
  name: string;
  state: PlayerState;
  action?: PlayerRowAction;
};

export function PlayerRow({ name, state, action }: PlayerRowProps) {
  return (
    <li className="flex items-center justify-between gap-3 bg-card border border-border rounded-[var(--radius-lg)] px-4 py-3 shadow-[var(--shadow-card)] transition-shadow duration-200 hover:shadow-md">
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-sm font-medium truncate">{name}</span>
        <Badge className={getPlayerStateBadgeClass(state)}>
          {getPlayerStateLabel(state)}
        </Badge>
      </div>
      {action && (
        <Button variant="secondary" className="!py-2 !px-3 text-xs shrink-0" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </li>
  );
}
