interface Props {
  options: string[];
  prompt?: string;
  value: string;
  onChange: (value: string) => void;
}

export default function SelectInput({
  options,
  prompt = "Select A Value",
  value,
  onChange,
}: Props) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      <option key="blank" value="">
        {prompt}
      </option>
      {options.map((option) => (
        <option key={option}>{option}</option>
      ))}
    </select>
  );
}
