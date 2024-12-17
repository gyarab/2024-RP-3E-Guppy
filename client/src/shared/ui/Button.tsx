import React from "react";

type ButtonVariant = "primary" | "secondary" | "accent";
type ButtonSize = "small" | "medium" | "large";
type ButtonType = "submit" | "button" | "reset";
type ButtonOnClick = (() => void) | ((e: React.MouseEvent) => void);

interface ButtonProps {
  variant?: ButtonVariant;
  type?: ButtonType;
  size?: ButtonSize;
  additionalClasses?: string;
  disabled?: boolean;
  href?: string;
  onClick?: ButtonOnClick;
  children: React.ReactNode;
}

/**
 * Vykreslí jednoduché tlačítko nebo odkaz na základě zadaných vlastností
 * @param variant - barva tlačítka
 * @param type - typ tlačítka
 * @param additionalClasses - další CSS třídy
 * @param disabled - zakáže tlačítko
 * @param href - odkaz
 * @param onClick - událost kliknutí
 * @param children - obsah tlačítka
 * @example
 * <Button type="submit" additionalClasses="btn--large" disabled={false} href="/home">Click me</Button>
 * @example
 * <Button variant="secondary" additionalClasses="btn--small" disabled={true}>Click me</Button>
 */
function Button({
  variant = "secondary",
  type = "button",
  size = "medium",
  additionalClasses = "",
  disabled = false,
  href,
  onClick,
  children,
}: ButtonProps) {
  let className = `btn btn--${variant}`;
  if (additionalClasses) {
    className += ` ${additionalClasses}`;
  }
  if (size) {
    className += ` btn--${size}`;
  }

  if (href) {
    return (
      <a className={className} href={href}>
        {children}
      </a>
    );
  }

  return (
    <button
      className={className}
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
      <div className="arrow-wrapper">
        <div className="arrow"></div>
      </div>
    </button>
  );
}

export default Button;
