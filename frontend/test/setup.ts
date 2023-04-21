// https://www.robinwieruch.de/vitest-react-testing-library/
import { expect, beforeEach, beforeAll, afterEach, afterAll } from "vitest";
import matchers from "@testing-library/jest-dom/matchers";
import { cleanup } from "@testing-library/react";
import { server } from "../src/mocks/server.js";
import { initMockTables } from "../src/mocks/handlers.js";

expect.extend(matchers);

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));

beforeEach(() => {
  initMockTables();
});

afterEach(() => {
  cleanup();
  server.resetHandlers();
});

afterAll(() => server.close());
