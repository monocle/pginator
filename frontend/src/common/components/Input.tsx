import React, { useState, useEffect } from "react";
import InputErrorMessage from "../../common/components/InputErrorMessage";

type InputType = "text" | "email" | "address";

interface Props {
  labelText: string;
  type?: InputType;
  className?: string;
  id?: string;
  value: string;
  isValid: boolean;
  errorMessage: string;
  onChange?: (value: string) => void;
}

let idNum = 0;

export default function Input({
  labelText,
  type = "text",
  className = "",
  id = undefined,
  value,
  isValid,
  errorMessage,
  onChange,
  ...rest
}: Props) {
  const inputErrorId = "input-error-" + idNum++;
  const inputId = id ?? "input-" + idNum;
  const [hasInteracted, setHasInteracted] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setHasInteracted(newValue !== "");
    if (onChange) onChange(newValue);
  };

  useEffect(() => {
    if (value === "") {
      setHasInteracted(false);
    }
  }, [value]);

  return (
    <div {...rest} className={"relative " + className}>
      <label className="input-label mb-1" htmlFor={inputId}>
        {labelText}
        <input
          id={inputId}
          className={`mt-1 w-full rounded-md border-2 px-3 py-2 focus:outline-none ${
            isValid || !hasInteracted
              ? "border-gray-500 bg-gray-700 text-gray-100 focus:border-indigo-500"
              : "border-red-500 bg-gray-700 text-gray-100 focus:border-red-600"
          }`}
          type={type}
          value={value}
          onChange={handleInputChange}
          aria-describedby={inputErrorId}
        />
      </label>

      {!isValid && hasInteracted && (
        <InputErrorMessage message={errorMessage} />
      )}
    </div>
  );
}
