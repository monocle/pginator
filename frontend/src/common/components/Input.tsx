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
      <label>
        {labelText}
        <input
          id={id}
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
