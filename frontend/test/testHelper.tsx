import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

export function setup() {
  render(
    <QueryClientProvider client={queryClient}>
      <OutletProvider>
        <App />
      </OutletProvider>
    </QueryClientProvider>
  );
  const user = userEvent.setup();

  return { user, screen };
}
