/** Добавляет альфа-канал к hex-цвету (например '20' для ~12% прозрачности). */
export const withAlpha = (hexColor: string, alphaHex: string): string =>
  `${hexColor}${alphaHex}`;
