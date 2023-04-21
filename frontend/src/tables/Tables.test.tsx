import { setup, expectInDocument } from "../../test/testHelper";

it("renders add table button and triggers onClick", async () => {
  const { d } = await setup();

  await d.clickButton("+");
  expectInDocument("Create A New Table");
});
