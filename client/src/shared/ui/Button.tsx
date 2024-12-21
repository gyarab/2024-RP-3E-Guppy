import React from "react";

type ButtonVariant = "primary" | "secondary" | "accent" | "basic";
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
  noArrow?: boolean;
  onClick?: ButtonOnClick;
  children: React.ReactNode;
}

/**
 * Renders a button or a link based on provided props.
 */
function Button({
  variant = "secondary",
  type = "button",
  size = "medium",
  additionalClasses = "",
  disabled = false,
  href,
  noArrow = false,
  onClick,
  children,
}: ButtonProps) {
  let className = "btn";
  className += ` btn--${variant}`;
  className += ` btn--${size}`;
  if (additionalClasses) className += ` ${additionalClasses}`;
  if (disabled) className += " btn--disabled";

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
      {variant !== "basic" && !noArrow && (
        <div className="arrow-wrapper">
          <div className="arrow"></div>
        </div>
      )}
    </button>
  );
}

export default Button;
