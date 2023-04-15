import { useContext } from "react";
import { ErrorResponse } from "../../interface";
import OutletContext from "../../common/outletContext";

import Button from "../../common/components/Button";
import ErrorMessage from "../../common/components/ErrorMessage";

interface Props {
  heading: string;
  leftColumn: JSX.Element;
  rightColumn: JSX.Element;
  submitButton: JSX.Element;
  onSumbit: () => void;
  error: ErrorResponse | null;
}

export default function FormLayout({
  heading,
  leftColumn,
  rightColumn,
  submitButton,
  onSumbit,
  error,
}: Props) {
  const { resetOutlet } = useContext(OutletContext);

  const handleSubit = (e: React.FormEvent) => {
    e.preventDefault();
    onSumbit();
  };

  return (
    <div>
      <h2 className="heading-2 mb-4">{heading}</h2>

      <form onSubmit={handleSubit} className="rounded-lg bg-gray-900 p-4">
        <div className="flex flex-wrap justify-between">
          <div className="mb-4 md:w-6/12">{leftColumn}</div>

          <div className="mb-4 pl-6 md:w-6/12">{rightColumn}</div>

          <div className="mb-4">
            {submitButton}

            <Button
              text="Cancel"
              style="danger"
              className="ml-2"
              onClick={resetOutlet}
            />
          </div>
        </div>

        <ErrorMessage errorResponse={error} />
      </form>
    </div>
  );
}
