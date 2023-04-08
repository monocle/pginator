import { useState } from "react";
import { FormValidatorResult, FormInputChangeResult } from "../../interface";

type InputType = "text" | "email" | "address";

interface Props {
  labelText: string;
  type?: InputType;
  id?: string;
  value: string;
  isValid: boolean;
  errorMessage: string;
  onChange: (value: string) => void;
  [x: string]: any;
}

let idNum = 0;

export default function Input({
  labelText,
  type = "text",
  id = undefined,
  value,
  isValid,
  errorMessage,
  onChange = () => {},
  ...rest
}: Props) {
  const inputId = "input-error-" + idNum++;

  return (
    <div {...rest}>
      <label className="mb-1 block font-medium text-gray-300">
        {labelText}
        <input
          id={id}
          className="mt-1 w-full rounded-md border-2 border-gray-500 bg-gray-700 px-3 py-2 text-gray-100 focus:border-indigo-500 focus:outline-none"
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-describedby={inputId}
        />
      </label>
      {!isValid && <div id={inputId}>{errorMessage}</div>}
    </div>
  );
}
