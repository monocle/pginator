import { rest } from "msw";
import { mockTables } from "../mocks/handlers";
import { server } from "../mocks/server";
import {
  setup,
  screen,
  expectInDocument,
  expectNotInDocument,
  expectButtonToBeDisabled,
} from "../../test/testHelper";

async function setupForm() {
  const helpers = await setup();
  const regex = new RegExp(
    `editing the "${mockTables[0].table_name}" table`,
    "i"
  );

  await helpers.d.clickButton("Edit");
  expectInDocument(regex);

  return helpers;
}

describe("For a complete form", () => {
  it("can be submitted", async () => {
    const { d } = await setupForm();
    const lefttColumn = screen.getByTestId("app-layout-left-column");

    await d.selectOption({ label: "Alter Action", option: "ADD" });
    await d.fillIn({ label: /column name/i, value: "another_column" });

    await d.selectOption({ label: "Column Data Type", option: /text/i });
    await d.fillIn({ label: /modify/i, value: "bar" });
    await d.clickButton("Add Column");
    await d.clickButton("Update Table");

    expectInDocument("textbar", lefttColumn);
    expectNotInDocument(/editing the/i);
  });
});

describe("Form validation", () => {
  it("disables the 'Update Table' button when form is not complete", async () => {
    const { d } = await setupForm();

    expectButtonToBeDisabled("Update Table");

    await d.selectOption({ label: "Alter Action", option: "ADD" });
    expectButtonToBeDisabled("Update Table");
  });

  it("redisables the 'Update Table' button remaing SQL statement is deleted ", async () => {
    const { d, user } = await setupForm();

    await d.selectOption({ label: "Alter Action", option: "DROP" });
    expectButtonToBeDisabled("Update Table");

    await d.fillIn({ label: /remaining sql statement/i, value: "column_name" });
    expect(screen.getByRole("button", { name: "Update Table" })).toBeEnabled();

    await user.clear(screen.getByLabelText(/remaining sql/i));
    expectButtonToBeDisabled("Update Table");
  });
});

describe("Changing actions", () => {
  it("displays appropriate fields based on action selection", async () => {
    const { d } = await setupForm();

    await d.selectOption({ label: "Alter Action", option: "ADD" });
    expectInDocument(/column name/i);
    expectInDocument(/column data type/i);

    await d.selectOption({ label: "Alter Action", option: "DROP" });
    expectNotInDocument(/column name/i);
    expectNotInDocument(/column data type/i);
    expectInDocument(/remaining sql statement/i);
  });
});

describe("Error handling", () => {
  it("displays an error message when the request fails", async () => {
    const { d } = await setupForm();
    const errorMessage = "An error occurred while updating the table.";

    server.use(
      rest.put("api/v1/tables/:tableName", (req, res, ctx) => {
        return res(ctx.status(400), ctx.json({ error: errorMessage }));
      })
    );

    await d.selectOption({ label: "Alter Action", option: "DROP" });
    await d.fillIn({ label: /remaining sql statement/i, value: "column_name" });
    await d.clickButton("Update Table");

    expectInDocument(/error occurred/i);
  });
});
