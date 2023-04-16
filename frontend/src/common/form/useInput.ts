import { useState, useMemo } from "react";
import { FormValidator, UseInputProps } from "../../interface";

function generateUniqueId(): string {
  return `${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
}

export const defaultValidator: FormValidator = () => ({
  isValid: true,
  errorMessage: "",
});

export default function useInput({
  name = "",
  validator = defaultValidator,
  id = undefined,
}: UseInputProps = {}) {
  const [value, _setValue] = useState<string>("");
  const [isValid, setIsValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const setValue = (value: string) => {
    const { isValid, errorMessage } = validator(value);

    _setValue(value);
    setIsValid(isValid);
    setErrorMessage(isValid ? "" : errorMessage);
  };

  const reset = () => {
    _setValue("");
    setIsValid(false);
    setErrorMessage("");
  };

  const fullId = `form-input-${id || generateUniqueId()}`;

  const inputProps = useMemo(
    () => ({
      id: fullId,
      name,
      value,
      isValid,
      errorMessage,
      onChange: setValue,
    }),
    [id, value, isValid, errorMessage, setValue]
  );

  return {
    id: fullId,
    name,
    value,
    setValue,
    isValid,
    isBlank: value.trim() === "",
    errorMessage,
    reset,
    inputProps,
  };
}
