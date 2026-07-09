import { Button } from "./Button";

type EmptyStateProps = {
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
};

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="text-center py-8 px-4">
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <p className="text-sm text-muted mt-1 max-w-xs mx-auto">{description}</p>
      {action && (
        <div className="mt-4">
          <Button variant="primary" onClick={action.onClick}>
            {action.label}
          </Button>
        </div>
      )}
    </div>
  );
}
