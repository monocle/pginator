import { renderHook, act } from "@testing-library/react";
import useInput from "./useInput";
import { FormValidator } from "../../interface";

const customValidator: FormValidator = (value) => {
  const isValid = value.length >= 3;
  return {
    isValid,
    errorMessage: "Value must be at least 3 characters long.",
  };
};

describe("useInput", () => {
  it("should initialize with default values", () => {
    const { result } = renderHook(() => useInput());

    expect(result.current.value).toBe("");
    expect(result.current.isValid).toBe(false);
    expect(result.current.errorMessage).toBe("");
  });

  it("should validate with defaultValidator", () => {
    const { result } = renderHook(() => useInput());

    act(() => result.current.setValue("test"));

    expect(result.current.value).toBe("test");
    expect(result.current.isValid).toBe(true);
    expect(result.current.errorMessage).toBe("");
  });

  it("should validate with customValidator", () => {
    const { result } = renderHook(() =>
      useInput({ validator: customValidator })
    );

    act(() => result.current.setValue("te"));

    expect(result.current.value).toBe("te");
    expect(result.current.isValid).toBe(false);
    expect(result.current.errorMessage).toBe(
      "Value must be at least 3 characters long."
    );
  });

  it("should reset the input values", () => {
    const { result } = renderHook(() =>
      useInput({ validator: customValidator })
    );

    act(() => result.current.setValue("test"));
    act(() => result.current.reset());

    expect(result.current.value).toBe("");
    expect(result.current.isValid).toBe(false);
    expect(result.current.errorMessage).toBe("");
  });

  it("should provide inputProps for easy use with input elements", () => {
    const { result } = renderHook(() =>
      useInput({ validator: customValidator })
    );

    expect(result.current.inputProps).toMatchObject({
      id: expect.stringMatching(/^form-input-/),
      value: "",
      isValid: false,
      errorMessage: "",
      onChange: expect.any(Function),
    });
  });
});

it("should properly set the isBlank property", () => {
  const { result } = renderHook(() => useInput());

  act(() => result.current.setValue(" "));

  expect(result.current.isBlank).toBe(true);

  act(() => result.current.setValue("test"));

  expect(result.current.isBlank).toBe(false);
});

it("should generate unique ids when not provided", () => {
  const { result: result1 } = renderHook(() => useInput());
  const { result: result2 } = renderHook(() => useInput());

  expect(result1.current.id).not.toBe(result2.current.id);
});

it("should use the provided id", () => {
  const { result } = renderHook(() => useInput({ id: "custom-id" }));

  expect(result.current.id).toBe("form-input-custom-id");
});

it("should handle onChange event in inputProps", () => {
  const { result } = renderHook(() => useInput({ validator: customValidator }));
  const onChangeFn = result.current.inputProps.onChange;

  act(() => onChangeFn("testing"));

  expect(result.current.value).toBe("testing");
  expect(result.current.isValid).toBe(true);
});
