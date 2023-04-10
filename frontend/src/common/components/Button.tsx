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
  let buttonStyle =
    "py-1 px-3 font-semibold rounded-sm transition-all duration-200 text-sm shadow-md ";
  let disabledStyle = "opacity-50 cursor-not-allowed ";

  switch (style) {
    case "primary":
      buttonStyle +=
        "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white";
      break;
    case "secondary":
      buttonStyle +=
        "bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white";
      break;
    case "danger":
      buttonStyle +=
        "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white";
      break;
    case "disabled":
      buttonStyle += "bg-gray-300 text-gray-600";
      break;
    default:
      buttonStyle +=
        "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white";
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
