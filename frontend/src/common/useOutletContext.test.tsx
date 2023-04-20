import React from "react";
import useOutletContext, { OutletProvider } from "./useOutletContext";
import { render, fireEvent, screen } from "@testing-library/react";

describe("OutletContext", () => {
  const TestComponent = () => {
    const { outlet, setOutlet, goBack } = useOutletContext();

    const setComponent = (text: string) => {
      setOutlet(<p data-testid={text}>{text}</p>);
    };

    return (
      <>
        <button onClick={() => setComponent("Component 1")}>
          Set Component 1
        </button>
        <button onClick={() => setComponent("Component 2")}>
          Set Component 2
        </button>
        <button onClick={goBack}>Go Back</button>
        {outlet}
      </>
    );
  };

  test("should render children inside OutletProvider", () => {
    render(
      <OutletProvider>
        <TestComponent />
      </OutletProvider>
    );
    expect(screen.getByText("Set Component 1")).toBeInTheDocument();
  });

  test("should set outlet component and navigate back in history", () => {
    render(
      <OutletProvider>
        <TestComponent />
      </OutletProvider>
    );
    fireEvent.click(screen.getByText("Set Component 1"));
    fireEvent.click(screen.getByText("Set Component 2"));
    fireEvent.click(screen.getByText("Go Back"));

    expect(screen.queryByTestId("Component 2")).not.toBeInTheDocument();
    expect(screen.getByTestId("Component 1")).toBeInTheDocument();
  });

  test("should handle empty history gracefully", () => {
    render(
      <OutletProvider>
        <TestComponent />
      </OutletProvider>
    );
    fireEvent.click(screen.getByText("Go Back"));

    expect(screen.queryByTestId("Component 1")).not.toBeInTheDocument();
    expect(screen.queryByTestId("Component 2")).not.toBeInTheDocument();
  });
});
