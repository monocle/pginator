// https://www.robinwieruch.de/vitest-react-testing-library/
import { expect, afterEach } from "vitest";
import matchers from "@testing-library/jest-dom/matchers";
import { cleanup } from "@testing-library/react";

expect.extend(matchers);

afterEach(() => {
  cleanup();
});
