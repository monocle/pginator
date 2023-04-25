import React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import type { Screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { UserEvent } from "@testing-library/user-event/dist/types/setup/setup";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { OutletProvider } from "../src/common/useOutletContext";
import App from "../src/App";
import { mockTables } from "../src/mocks/handlers";

interface ClickElementOptions {
  user: UserEvent;
  testId?: string;
  idx?: number;
  role: "button" | "link";
  name?: ButtonName | LinkName;
}

type LinkName = string | RegExp;

type ButtonName =
  | "+"
  | "X"
  | "Cancel"
  | "Edit"
  | "Add Column"
  | "Create Table"
  | "Update Table"
  | "Drop Table";

type SelectLabel = "Column Data Type" | "Alter Action";

interface SelectOptionOptions {
  label: SelectLabel | RegExp;
  option: string | RegExp;
  user: UserEvent;
  screen: Screen;
}

export { screen };

export function expectInDocument(
  text: string | RegExp,
  component?: HTMLElement
) {
  const queryByText = component
    ? within(component).queryByText
    : screen.queryByText;
  expect(queryByText(text)).toBeInTheDocument();
}

export function expectNotInDocument(
  text: string | RegExp,
  component?: HTMLElement
) {
  const queryByText = component
    ? within(component).queryByText
    : screen.queryByText;
  expect(queryByText(text)).not.toBeInTheDocument();
}

export function expectButtonToBeDisabled(name: ButtonName) {
  expect(screen.getByRole("button", { name })).toBeDisabled();
}

export async function clickElement(options: ClickElementOptions) {
  const { name, testId, user, idx = 0, role } = options;

  if (!name && !testId) {
    throw new Error("Either 'name' or 'testId' should be provided.");
  }

  await waitFor(async () => {
    if (testId) {
      await user.click(screen.getByTestId(testId));
    } else if (name) {
      await user.click(screen.getAllByRole(role, { name })[idx]);
    }
  });
}

export async function clickButton(
  name: ButtonName,
  options: Omit<ClickElementOptions, "role" | "name">
) {
  await clickElement({ ...options, role: "button", name });
}

export async function clickLink(
  name: LinkName,
  options: Omit<ClickElementOptions, "role" | "name">
) {
  await clickElement({ ...options, role: "link", name });
}

interface FillInOptions {
  label: string | RegExp;
  value: string;
  user: UserEvent;
  screen: Screen;
}

export async function fillIn({ label, value, user, screen }: FillInOptions) {
  await user.click(screen.getByLabelText(label));
  await user.keyboard(value);
}

export async function selectOption({
  label,
  option,
  user,
  screen,
}: SelectOptionOptions) {
  await user.selectOptions(
    screen.getByRole("combobox", { name: label }),
    screen.getByRole("option", { name: option })
  );
}

export async function setup(component = <App />) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
      },
    },
  });

  render(
    <QueryClientProvider client={queryClient}>
      <OutletProvider>{component}</OutletProvider>
    </QueryClientProvider>
  );
  const user = userEvent.setup();

  const d = {
    clickButton: (
      name: ButtonName,
      options?: Omit<ClickElementOptions, "user" | "screen" | "role" | "name">
    ) => clickButton(name, { ...options, user }),

    clickLink: (
      name: LinkName,
      options?: Omit<ClickElementOptions, "user" | "screen" | "role" | "name">
    ) => clickLink(name, { ...options, user }),

    fillIn: (options: Omit<FillInOptions, "user" | "screen">) =>
      fillIn({ ...options, user, screen }),

    selectOption: (options: Omit<SelectOptionOptions, "user" | "screen">) =>
      selectOption({ ...options, user, screen }),
  };

  await waitFor(() =>
    expect(screen.queryByText(mockTables[0].table_name)).toBeInTheDocument()
  );

  return { user, screen, d };
}
