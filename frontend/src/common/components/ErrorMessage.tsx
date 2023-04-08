import { ServerValidationError, ErrorResponse } from "../../interface";

const makeErrorMsg = (e: ServerValidationError): string => `${e.loc}: ${e.msg}`;

interface Props {
  errorResponse?: ErrorResponse | undefined | null;
}

export default function ErrorMessage({ errorResponse }: Props) {
  if (!errorResponse) return null;

  const error = errorResponse.error;
  let errorMessage: string = "An error occurred: ";

  if (typeof error === "string") {
    errorMessage += error;
  } else if (Array.isArray(error)) {
    errorMessage += error.map(makeErrorMsg).join(", ");
  } else {
    errorMessage += makeErrorMsg(error);
  }

  return (
    <div className="bg-red-100 text-red-700 p-4 rounded-md my-4">
      <h3 className="font-medium">Error</h3>
      <p>{errorMessage}</p>
    </div>
  );
}