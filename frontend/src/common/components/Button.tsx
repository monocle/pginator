import React from "react";

type ButtonProps = {
  text: string | React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
  [x: string]: any;
};

export default function Button({
  text,
  onClick = () => {},
  disabled = false,
  className = "",
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      className={className}
      type={type}
      disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      {text}
    </button>
  );
}
