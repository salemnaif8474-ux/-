import { describe, expect, it } from "vitest";
import { getEffectiveThreadId, isRoleAllowed } from "./chatAccess";

describe("getEffectiveThreadId", () => {
  it("gives a regular employee only their own thread, even if a stale selection points elsewhere", () => {
    expect(getEffectiveThreadId("e2", "preparer", "e4")).toBe("e2");
    expect(getEffectiveThreadId("e2", "preparer", null)).toBe("e2");
  });

  it("lets owner/manager view whichever thread is selected", () => {
    expect(getEffectiveThreadId("e6", "owner", "e2")).toBe("e2");
    expect(getEffectiveThreadId("e13", "manager", "e4")).toBe("e4");
  });

  it("returns null for a viewer with no thread selected yet", () => {
    expect(getEffectiveThreadId("e6", "owner", null)).toBeNull();
  });

  it("branch managers are not thread viewers - they only ever see their own thread", () => {
    expect(getEffectiveThreadId("e3", "branch_manager", "e2")).toBe("e3");
  });
});

describe("isRoleAllowed", () => {
  it("allows a role present in the allowed list", () => {
    expect(isRoleAllowed("owner", ["owner", "manager"])).toBe(true);
  });

  it("blocks a role not present in the allowed list", () => {
    expect(isRoleAllowed("seller", ["owner", "manager"])).toBe(false);
  });

  it("blocks everyone when the allowed list is empty", () => {
    expect(isRoleAllowed("owner", [])).toBe(false);
  });
});
