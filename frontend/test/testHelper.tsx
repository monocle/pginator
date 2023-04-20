import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { UserEvent } from "@testing-library/user-event/dist/types/setup/setup";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { OutletProvider } from "../src/common/useOutletContext";
import App from "../src/App";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
});

export function setup(component = <App />) {
  render(
    <QueryClientProvider client={queryClient}>
      <OutletProvider>{component}</OutletProvider>
    </QueryClientProvider>
  );
  const user = userEvent.setup();

  return { user, screen };
}

type ButtonName = "Edit" | "+" | "X" | "Drop Table" | "Cancel";

export async function clickButton(name: ButtonName, user: UserEvent, idx = 0) {
  await waitFor(async () => {
    await user.click(screen.getAllByRole("button", { name })[idx]);
  });
}
