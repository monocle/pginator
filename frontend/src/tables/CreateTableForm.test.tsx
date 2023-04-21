import {
  setup,
  screen,
  expectInDocument,
  expectNotInDocument,
  expectButtonToBeDisabled,
} from "../../test/testHelper";
import { reservedWords } from "../common/postgres";

async function setupForm() {
  const helpers = await setup();

  await helpers.d.clickButton("+");
  expectInDocument(/create a new table/i);

  return helpers;
}

async function fillInCompleteForm(tableName = "my_table") {
  const { d, user } = await setupForm();

  await d.fillIn({ label: /table name/i, value: tableName });
  await d.fillIn({ label: /column name/i, value: "my_col_name" });
  await d.selectOption({ label: /data type/i, option: /text/i });
  await d.fillIn({ label: /modify/i, value: "foo" });
  await d.clickButton("Add Column");
  return { d, user };
}

describe("For a complete form", () => {
  it("can remove a column", async () => {
    const { d } = await fillInCompleteForm();
    const rightColumn = screen.getByTestId("form-layout-right-column");

    expectInDocument(/my_col_name/i, rightColumn);
    expectInDocument(/textfoo/i, rightColumn);

    await d.clickButton("X", { testId: "remove-column-my_col_name" });

    expectNotInDocument(/my_col_name/i, rightColumn);
    expectNotInDocument(/textfoo/i, rightColumn);
  });

  it("can submit the form", async () => {
    const { d } = await fillInCompleteForm();
    const lefttColumn = screen.getByTestId("app-layout-left-column");

    await d.clickButton("Create Table");

    expectNotInDocument(/create a new table/i);
    expectInDocument("my_table", lefttColumn);
    expectInDocument("my_col_name", lefttColumn);
    expectInDocument("textfoo", lefttColumn);
  });

  it("shows a server error", async () => {
    const { d } = await fillInCompleteForm("error400");

    await d.clickButton("Create Table");
    expectInDocument(/post error/i);
  });
});

describe("For an incomplete form", () => {
  it("can validate table name", async () => {
    const { d } = await setupForm();

    await d.fillIn({ label: /table name/i, value: reservedWords[0] });
    await d.fillIn({ label: /column name/i, value: "my_col_name" });
    await d.selectOption({ label: /data type/i, option: /text/i });
    await d.clickButton("Add Column");
    await d.clickButton("Create Table");

    expectInDocument(/invalid table name/i);
    expectButtonToBeDisabled("Create Table");
  });

  it("won't submit if there are no columns", async () => {
    const { d } = await setupForm();

    await d.fillIn({ label: /table name/i, value: "my_table" });
    expectButtonToBeDisabled("Add Column");
    expectButtonToBeDisabled("Create Table");
  });
});
