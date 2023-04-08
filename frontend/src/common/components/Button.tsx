import React from "react";
import { ButtonStyle } from "../../interface";

function Spinner() {
  return (
    <svg className="... mr-3 h-5 w-5 animate-spin" viewBox="0 0 24 24">
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 016 12H2c0 3.042 1.135 5.824 3 7.938l-.001-3.647zm11.196-5.767A3.99 3.99 0 0016 12a3.99 3.99 0 00-1.196-2.824l1.414-1.414A5.978 5.978 0 0118 12a5.978 5.978 0 01-1.788 4.242l-1.414-1.414zM8 12a3.99 3.99 0 001.196 2.824l-1.414 1.414A5.978 5.978 0 016 12a5.978 5.978 0 011.788-4.242l1.414 1.414A3.99 3.99 0 008 12z"
      ></path>
    </svg>
  );
}

type ButtonProps = {
  text: string | React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
  style?: ButtonStyle;
  isLoading?: boolean;
  [x: string]: any;
};

export default function Button({
  text,
  onClick = () => {},
  disabled = false,
  className = "",
  type = "button",
  style = "primary",
  isLoading = false,
  ...rest
}: ButtonProps) {
  let buttonStyle = "py-2 px-4 font-semibold rounded-md";
  let disabledStyle = "opacity-50 cursor-not-allowed";

  switch (style) {
    case "primary":
      buttonStyle += " bg-blue-500 text-white";
      break;
    case "secondary":
      buttonStyle += " bg-gray-700 hover:bg-gray-600 text-white";
      break;
    case "danger":
      buttonStyle += " bg-red-600 hover:bg-red-500 text-white";
      break;
    case "disabled":
      buttonStyle += " bg-gray-300 text-gray-600";
      break;
    default:
      buttonStyle += " bg-blue-500 text-white";
      break;
  }

  if (isLoading) {
    disabled = true;
    buttonStyle += " opacity-50 cursor-not-allowed";
  }

  return (
    <button
      className={`${buttonStyle} ${disabled ? disabledStyle : ""} ${className}`}
      type={type}
      disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      {isLoading ? <Spinner /> : null}
      {text}
    </button>
  );
}
