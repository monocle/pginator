import { useContext, useState, useEffect } from "react";
import { ServerTable } from "../interface";
import ModalContext from "../common/outletContext";
import FormLayout from "../common/components/FormLayout";
import Button from "../common/components/Button";
import { useCreateRow } from "./useRowsApi";

interface Props {
  table: ServerTable;
}

export default function CreateRowForm({ table }: Props) {
  const { resetOutlet } = useContext(ModalContext);
  const { request, createRow } = useCreateRow();

  const handleSubmit = () => {};

  return (
    <FormLayout
      heading="Create A New Row"
      onSumbit={handleSubmit}
      error={request.error}
      leftColumn={<></>}
      rightColumn={
        <>
          <h3 className="heading-3">SQL Statement</h3>
        </>
      }
      submitButton={
        <Button
          text="Create Row"
          type="submit"
          disabled={true}
          isLoading={false}
        />
      }
    />
  );
}
