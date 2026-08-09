import type { BranchStock, Part } from "../types";

export interface ShortageRow {
  part: Part;
  branch: BranchStock;
}

export interface TransferCandidate {
  part: Part;
  from: BranchStock;
  to: BranchStock;
}

export function computeShortages(parts: Part[]): ShortageRow[] {
  return parts.flatMap((p) =>
    p.stockByBranch.filter((b) => b.available <= p.reorderPoint).map((b) => ({ part: p, branch: b })),
  );
}

export function suggestedReorderQty(part: Part, available: number): number {
  return Math.max(part.reorderPoint * 2 - available, part.safetyStock);
}

export function computeTransferCandidates(parts: Part[]): TransferCandidate[] {
  return parts.flatMap((p) => {
    const short = p.stockByBranch.filter((b) => b.available <= p.reorderPoint);
    const surplus = p.stockByBranch.filter((b) => b.available > p.reorderPoint * 1.5);
    if (short.length === 0 || surplus.length === 0) return [];
    return short.map((s) => ({ part: p, from: surplus[0], to: s }));
  });
}
