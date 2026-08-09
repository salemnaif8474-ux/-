import { describe, expect, it, vi } from "vitest";
import { exportToCsv } from "./exportCsv";

describe("exportToCsv", () => {
  it("does nothing when there are no rows", () => {
    const spy = vi.spyOn(document, "createElement");
    exportToCsv("empty", []);
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it("triggers a download for non-empty rows", () => {
    URL.createObjectURL = vi.fn(() => "blob:mock");
    URL.revokeObjectURL = vi.fn();

    const clickSpy = vi.fn();
    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, "createElement").mockImplementation((tag: string) => {
      const el = originalCreateElement(tag);
      if (tag === "a") el.click = clickSpy;
      return el;
    });

    exportToCsv("test", [{ name: 'Say "hi", please', qty: 3 }]);

    expect(clickSpy).toHaveBeenCalledOnce();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:mock");

    vi.restoreAllMocks();
  });
});
