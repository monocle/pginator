import { waitFor } from "@testing-library/react";
import { setup } from "../../test/testHelper";

it("renders add table button and triggers onClick", async () => {
  const { user, screen } = setup();
  let addButton: HTMLElement | undefined = undefined;

  await waitFor(() => {
    addButton = screen.getByRole("button", { name: "+" });
  });

  if (addButton) {
    await user.click(addButton);
  }

  expect(screen.queryByText("Create A New Table")).toBeInTheDocument();
});
