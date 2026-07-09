type CardProps = {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
};

export function Card({ children, className = "", hoverable = false }: CardProps) {
  return (
    <div
      className={`
        bg-card rounded-[var(--radius-lg)] border border-border
        shadow-[var(--shadow-card)] p-4
        transition-shadow duration-200
        ${hoverable ? "hover:shadow-md focus-within:ring-2 focus-within:ring-court-green/20" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
