interface Props {
  text: string;
  onClick: (payload?: unknown) => void;
}

export default function Link({ text, onClick }: Props) {
  return (
    <a className="link text-lg font-semibold" onClick={onClick}>
      {text}
    </a>
  );
}
