import { vi } from "vitest";
import { setup } from "../../test/testHelper";
import { ServerTables } from "../interface";

const mockTablesData: ServerTables = {
  tables: [
    {
      table_name: "table1",
      columns: [{ name: "col1", data_type: "dt1" }],
      primary_key: "col1",
    },
    {
      table_name: "table2",
      columns: [{ name: "col2", data_type: "dt2" }],
      primary_key: "col2",
    },
  ],
};

vi.mock("@tanstack/react-query", async () => {
  const mod = await vi.importActual<typeof import("@tanstack/react-query")>(
    "@tanstack/react-query"
  );

  const useIsFetching = () => 0;
  return { ...mod, useIsFetching };
});

vi.mock("./useTablesApi", () => {
  const useGetTables = () => ({
    data: mockTablesData,
  });
  const useDeleteTable = () => ({
    request: vi.fn(),
  });
  const useCreateTable = () => ({
    request: vi.fn(),
  });
  return { useGetTables, useDeleteTable, useCreateTable };
});

it("renders add table button and triggers onClick", async () => {
  const { user, screen } = setup();
  const addButton = screen.getByRole("button", { name: "+" });

  await user.click(addButton);

  expect(screen.queryByText("Create A New Table")).toBeInTheDocument();
});
