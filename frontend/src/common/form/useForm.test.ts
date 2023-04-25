import { renderHook, act } from "@testing-library/react";
import type { FormValidator } from "../../interface";
import useForm from "./useForm";

const customValidator: FormValidator = (value) => {
  const isValid = value.length >= 3;
  return {
    isValid,
    errorMessage: "Value must be at least 3 characters long.",
  };
};

describe("useForm", () => {
  it("should initialize with an empty set of fields", () => {
    const { result } = renderHook(() => useForm());

    expect(result.current.getFields()).toEqual({});
  });

  it("should add fields using useInput", () => {
    const { result } = renderHook(() => useForm());
    const useInput = result.current.useInput;
    const input1 = renderHook(() =>
      useInput({ name: "input1", validator: customValidator })
    );

    renderHook(() => result.current.useInput({ name: "input2" }));

    expect(result.current.getFields()).toEqual({ input1: "", input2: "" });

    act(() => input1.result.current.setValue("foo"));

    expect(result.current.getFields()).toEqual({ input1: "foo", input2: "" });
  });

  it("should check if the form is valid", () => {
    const form = renderHook(() => useForm());
    const useInput = form.result.current.useInput;
    const input1 = renderHook(() =>
      useInput({ name: "input1", validator: customValidator })
    );
    const input2 = renderHook(() => useInput({ name: "input2" }));

    act(() => {
      input1.result.current.setValue("test");
      input2.result.current.setValue("example");
    });

    expect(form.result.current.isValid()).toBe(true);

    act(() => {
      input1.result.current.setValue("te");
    });

    expect(form.result.current.isValid()).toBe(false);
  });

  it("should reset all fields in the form", () => {
    const { result } = renderHook(() => useForm());
    const input1 = renderHook(() =>
      result.current.useInput({ name: "input1", validator: customValidator })
    );
    const input2 = renderHook(() =>
      result.current.useInput({ name: "input2" })
    );

    act(() => {
      input1.result.current.setValue("t");
      input2.result.current.setValue("example");
      result.current.reset();
    });

    expect(input1.result.current.value).toBe("");
    expect(input1.result.current.isValid).toBe(false);
    expect(input1.result.current.errorMessage).toBe("");

    expect(input2.result.current.value).toBe("");
    expect(input2.result.current.isValid).toBe(false);
    expect(input2.result.current.errorMessage).toBe("");
  });
});
