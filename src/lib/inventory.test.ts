import { describe, expect, it } from "vitest";
import { computeShortages, computeTransferCandidates, suggestedReorderQty } from "./inventory";
import type { Part } from "../types";

function makePart(overrides: Partial<Part> = {}): Part {
  return {
    id: "p1",
    partNumber: "PN-1",
    name: "Test Part",
    vehicleCompat: "Any",
    isOriginal: true,
    price: 100,
    costPrice: 60,
    reorderPoint: 10,
    safetyStock: 5,
    stockByBranch: [],
    ...overrides,
  };
}

describe("computeShortages", () => {
  it("flags a branch whose available stock is at or below the reorder point", () => {
    const part = makePart({
      stockByBranch: [
        { branch: "A", available: 10, reserved: 0, incoming: 0 }, // == reorderPoint -> short
        { branch: "B", available: 20, reserved: 0, incoming: 0 }, // above -> not short
      ],
    });
    const result = computeShortages([part]);
    expect(result).toHaveLength(1);
    expect(result[0].branch.branch).toBe("A");
  });

  it("returns nothing when every branch is comfortably stocked", () => {
    const part = makePart({ stockByBranch: [{ branch: "A", available: 50, reserved: 0, incoming: 0 }] });
    expect(computeShortages([part])).toHaveLength(0);
  });
});

describe("suggestedReorderQty", () => {
  it("suggests enough to double the reorder point above current stock", () => {
    const part = makePart({ reorderPoint: 10, safetyStock: 5 });
    expect(suggestedReorderQty(part, 3)).toBe(17); // 10*2 - 3
  });

  it("never suggests less than the safety stock, even near the reorder point", () => {
    const part = makePart({ reorderPoint: 10, safetyStock: 5 });
    expect(suggestedReorderQty(part, 9)).toBe(11);
    expect(suggestedReorderQty(part, 19)).toBe(5); // 10*2-19 = 1, floored up to safetyStock
  });
});

describe("computeTransferCandidates", () => {
  it("suggests moving stock from a branch with real surplus to one that's short", () => {
    const part = makePart({
      reorderPoint: 10,
      stockByBranch: [
        { branch: "Surplus", available: 30, reserved: 0, incoming: 0 }, // > 1.5x reorderPoint
        { branch: "Short", available: 2, reserved: 0, incoming: 0 },
      ],
    });
    const result = computeTransferCandidates([part]);
    expect(result).toHaveLength(1);
    expect(result[0].from.branch).toBe("Surplus");
    expect(result[0].to.branch).toBe("Short");
  });

  it("suggests nothing when no branch has real surplus, even if another is short", () => {
    const part = makePart({
      reorderPoint: 10,
      stockByBranch: [
        { branch: "A", available: 12, reserved: 0, incoming: 0 }, // short-adjacent but not surplus (needs >15)
        { branch: "Short", available: 2, reserved: 0, incoming: 0 },
      ],
    });
    expect(computeTransferCandidates([part])).toHaveLength(0);
  });
});
