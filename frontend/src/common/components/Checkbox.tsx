import React, { ChangeEvent } from "react";

interface Props {
  labelText: string;
  id?: string;
  checked: boolean;
  onChange: (isChecked: boolean) => void;
  className?: string;
}

export default function Checkbox({
  labelText,
  id = undefined,
  checked,
  onChange,
  className,
}: Props) {
  id = id ?? "checkbox-" + labelText;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.checked);
  };

  return (
    <div className={`${className}`}>
      <label className="input-label" htmlFor={id}>
        <input
          id={id}
          className="mr-2 h-5 w-5 rounded border-2 border-gray-500 bg-gray-700 checked:border-blue-500 checked:bg-blue-500 focus:border-indigo-500 focus:outline-none"
          type="checkbox"
          checked={checked}
          onChange={handleChange}
        />
        {labelText}
      </label>
    </div>
  );
}
