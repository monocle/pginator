type PopoverPosition = "right" | "left" | "top" | "bottom";

interface Props {
  message: string;
  position?: PopoverPosition;
}

export default function ErrorMessagePopover({
  message,
  position = "right",
}: Props) {
  let positionStyles =
    "absolute rounded-md bg-red-600 p-2 text-xs text-white whitespace-nowrap min-w-max ";

  switch (position) {
    case "right":
      positionStyles += "left-full ml-2 bottom-0";
      break;
    case "left":
      positionStyles += "right-full mr-2 bottom-0";
      break;
    case "top":
      positionStyles += "bottom-full mb-2 right-0";
      break;
    case "bottom":
    default:
      positionStyles += "top-full mt-2 right-0";
      break;
  }

  return <div className={positionStyles}>{message}</div>;
}
