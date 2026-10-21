export type ContactSheetLayout = { columns: number; rows: number; width: number; height: number; tileWidth: number; tileHeight: number; };

export function getContactSheetLayout(imageCount: number, columns: number): ContactSheetLayout {
  if (!Number.isInteger(imageCount) || imageCount < 1 || imageCount > 20) throw new RangeError("Image count must be between 1 and 20.");
  if (![2, 3, 4].includes(columns)) throw new RangeError("Columns must be 2, 3, or 4.");
  const tileWidth = 360;
  const tileHeight = 280;
  const rows = Math.ceil(imageCount / columns);
  return { columns, rows, width: columns * tileWidth, height: rows * tileHeight, tileWidth, tileHeight };
}
