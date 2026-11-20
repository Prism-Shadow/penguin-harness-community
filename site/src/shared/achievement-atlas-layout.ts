import type { AtlasMedal } from "./achievements";

/** Medals arrive in dependency order. Share a row only with a direct prerequisite. */
export function medalRows(medals: AtlasMedal[]): Map<string, number> {
  const rows = new Map<string, number>();
  const rowEnds: string[] = [];
  for (const medal of medals) {
    const parentRow = rowEnds.findIndex((id) => medal.requires.some((parent) => parent.id === id));
    const row = parentRow === -1 ? rowEnds.length : parentRow;
    rowEnds[row] = medal.id;
    rows.set(medal.id, row + 1);
  }
  return rows;
}
