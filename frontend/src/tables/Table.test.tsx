import { waitFor } from "@testing-library/react";
import {
  setup,
  expectInDocument,
  expectNotInDocument,
} from "../../test/testHelper";
import { mockTables } from "../mocks/handlers";

describe("Table component", () => {
  it("renders Edit button and triggers onClick", async () => {
    const { d } = await setup();
    const regex = new RegExp(
      `editing the "${mockTables[0].table_name}" table`,
      "i"
    );

    await d.clickButton("Edit");
    expectInDocument(regex);
  });

  it("renders delete button and shows the modal", async () => {
    const { d } = await setup();

    await d.clickButton("X");
    expectInDocument(/permanently delete table/i);
  });

  it("handles modal confirm action", async () => {
    const { d } = await setup();
    const firstTableName = mockTables[0].table_name;

    await d.clickButton("X");
    await d.clickButton("Drop Table");

    expectNotInDocument(/permanently delete table/i);

    await waitFor(() => {
      expectNotInDocument(firstTableName);
    });
  });

  it("handles modal cancel action", async () => {
    const { d } = await setup();
    const firstTableName = mockTables[0].table_name;

    expectInDocument(firstTableName);

    await d.clickButton("X");
    await d.clickButton("Cancel");

    expectInDocument(firstTableName);
    expectNotInDocument(/permanently delete table/i);
  });
});
