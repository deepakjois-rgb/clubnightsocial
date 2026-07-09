import type { ButtonHTMLAttributes } from "react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "destructive"
  | "destructive-outline"
  | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  fullWidth?: boolean;
};

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-court-green text-white hover:bg-court-green-hover focus-visible:ring-2 focus-visible:ring-court-green focus-visible:ring-offset-2",
  secondary:
    "bg-card text-foreground border border-border hover:bg-surface focus-visible:ring-2 focus-visible:ring-court-green focus-visible:ring-offset-2",
  destructive:
    "bg-danger-muted text-danger border border-red-200 hover:bg-red-100 focus-visible:ring-2 focus-visible:ring-danger focus-visible:ring-offset-2",
  "destructive-outline":
    "text-danger hover:bg-danger-muted focus-visible:ring-2 focus-visible:ring-danger focus-visible:ring-offset-2",
  ghost:
    "text-muted hover:text-foreground hover:bg-surface focus-visible:ring-2 focus-visible:ring-court-green focus-visible:ring-offset-2",
};

export function Button({
  variant = "primary",
  fullWidth = false,
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={`
        inline-flex items-center justify-center font-semibold text-sm
        rounded-[var(--radius)] px-4 py-3
        transition-[background-color,color,box-shadow] duration-200
        disabled:opacity-40 disabled:cursor-not-allowed
        ${VARIANT_CLASSES[variant]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
