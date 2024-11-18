import { ReactNode } from "react";

export type AlertVariant =
  | "alert-success"
  | "alert-error"
  | "alert-warning"
  | "alert-info";

interface AlertProps {
  variant: AlertVariant;
  children: ReactNode;
}

function Alert({ variant, children }: AlertProps) {
  return (
    <div className={`alert ${variant}`} aria-live="assertive">
      {children}
    </div>
  );
}

export default Alert;
