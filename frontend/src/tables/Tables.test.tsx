import { vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import { OutletProvider } from "../common/outletContext";
import { ServerTables } from "../interface";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const mockTablesData: ServerTables = {
  tables: [
    {
      table_name: "table1",
      columns: [],
      primary_key: "",
    },
    {
      table_name: "table2",
      columns: [],
      primary_key: "",
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
});

describe("Tables", () => {
  beforeEach(() => {
    render(
      <QueryClientProvider client={queryClient}>
        <OutletProvider>
          <App />
        </OutletProvider>
      </QueryClientProvider>
    );
  });

  test("renders add table button and triggers onClick", async () => {
    const user = userEvent.setup();
    const addButton = screen.getByRole("button", { name: "+" });

    await user.click(addButton);

    expect(screen.queryByText("Create A New Table")).toBeInTheDocument();
  });
});
