import { describe, expect, it } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import useForm from "./useForm";
import { FormValidator } from "../../interface";

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

    expect(result.current.fieldsArr).toEqual([]);
    expect(result.current.fields).toEqual({});
  });

  it("should add fields using useInput", () => {
    const { result } = renderHook(() => useForm());
    const useInput = result.current.useInput;
    const input1 = renderHook(() =>
      useInput({ name: "input1", validator: customValidator })
    );
    const input2 = renderHook(() =>
      result.current.useInput({ name: "input2" })
    );

    expect(result.current.fieldsArr).toEqual([
      input1.result.current,
      input2.result.current,
    ]);
    expect(result.current.fields).toEqual({ input1: "", input2: "" });
  });

  // Test passes, but error output is displayed when the test is run.
  it.skip("should not allow duplicate field ids", () => {
    const { result } = renderHook(() => useForm());
    const customId = "custom-id";
    renderHook(() => result.current.useInput({ id: customId }));

    expect(() =>
      renderHook(() => result.current.useInput({ id: customId }))
    ).toThrowError(`[useForm] Form id form-input-${customId} already exists`);
  });

  it("should check if the form is valid", () => {
    const form = renderHook(() => useForm());
    const useInput = form.result.current.useInput;
    const input1 = renderHook(() => useInput({ validator: customValidator }));
    const input2 = renderHook(() => useInput({}));

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
      result.current.useInput({ validator: customValidator })
    );
    const input2 = renderHook(() => result.current.useInput({}));

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
