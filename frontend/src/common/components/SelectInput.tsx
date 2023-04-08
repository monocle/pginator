interface Props {
  labelText: string;
  options: string[];
  prompt?: string;
  value: string;
  onChange: (value: string) => void;
  [x: string]: any;
}

export default function SelectInput({
  labelText,
  options,
  prompt = "Select A Value",
  value,
  onChange,
  ...rest
}: Props) {
  return (
    <div {...rest}>
      <label className="mb-1 block font-medium text-gray-300">
        {labelText}
        <select
          className="mt-1 w-full rounded-md border border-gray-400 px-4 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option className="py-1" key="blank" value="">
            {prompt}
          </option>
          {options.map((option) => (
            <option className="py-1" key={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
