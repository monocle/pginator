import { ButtonStyle } from "../../interface";
import Button from "./Button";

interface Props {
  heading: string | JSX.Element;
  message: string | JSX.Element;
  confirmButtonText?: string | JSX.Element;
  cancelButtonText?: string | JSX.Element;
  confirmButtonStyle?: ButtonStyle;
  cancelButtonStyle?: ButtonStyle;
  isLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDeleteModal({
  heading,
  message,
  confirmButtonText = "Continue",
  cancelButtonText = "Cancel",
  confirmButtonStyle = "secondary",
  cancelButtonStyle = "danger",
  isLoading = false,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-black bg-opacity-90">
      <div className="rounded-lg bg-gray-800 p-4">
        <h2 className="mb-2 text-lg font-bold">{heading}</h2>
        <p className="mb-4">{message}</p>
        <div className="flex justify-end">
          <Button
            className="mr-6"
            text={confirmButtonText}
            style={confirmButtonStyle}
            isLoading={isLoading}
            disabled={isLoading}
            onClick={onConfirm}
          />
          <Button
            text={cancelButtonText}
            style={cancelButtonStyle}
            onClick={onCancel}
          />
        </div>
      </div>
    </div>
  );
}
