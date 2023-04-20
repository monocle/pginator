import { setup, clickButton } from "../../test/testHelper";

it("renders add table button and triggers onClick", async () => {
  const { user, screen } = setup();

  await clickButton("+", user);
  expect(screen.queryByText("Create A New Table")).toBeInTheDocument();
});
