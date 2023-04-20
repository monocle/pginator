import { waitFor, waitForElementToBeRemoved } from "@testing-library/react";
import { setup, clickButton } from "../../test/testHelper";
import { mockTables } from "../mocks/handlers";

describe("Table component", () => {
  it("renders Edit button and triggers onClick", async () => {
    const { user, screen } = setup();
    const regex = new RegExp(
      `editing the "${mockTables[0].table_name}" table`,
      "i"
    );

    await clickButton("Edit", user);
    expect(screen.getByText(regex)).toBeInTheDocument();
  });

  it("renders delete button and shows the modal", async () => {
    const { user, screen } = setup();

    await clickButton("X", user);
    expect(screen.getByText(/permanently delete table/i)).toBeInTheDocument();
  });

  it("handles modal confirm action", async () => {
    const { user, screen } = setup();
    const firstTableName = mockTables[0].table_name;

    expect(screen.getByText(firstTableName)).toBeInTheDocument();

    await clickButton("X", user);
    await clickButton("Drop Table", user);

    expect(
      screen.queryByText(/permanently delete table/i)
    ).not.toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText(firstTableName)).not.toBeInTheDocument();
    });
  });

  it("handles modal cancel action", async () => {
    const { user, screen } = setup();
    const firstTableName = mockTables[0].table_name;

    expect(screen.getByText(firstTableName)).toBeInTheDocument();

    await clickButton("X", user);
    await clickButton("Cancel", user);

    expect(screen.getByText(firstTableName)).toBeInTheDocument();
    expect(
      screen.queryByText(/permanently delete table/i)
    ).not.toBeInTheDocument();
  });
});
