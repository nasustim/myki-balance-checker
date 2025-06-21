// Known Myki card data patterns and constants
export const MYKI_PATTERNS = {
  // Common card prefixes and identifiers
  CARD_PREFIXES: [0x30, 0x31, 0x32, 0x33, 0x34, 0x35], // Common Myki prefixes
  BALANCE_INDICATORS: [0x0a, 0x0b, 0x0c], // Potential balance field indicators
  DATE_PATTERNS: [0x20, 0x21, 0x22, 0x23], // Date field patterns

  // Expected data lengths
  MIN_CARD_DATA_LENGTH: 16,
  TYPICAL_CARD_DATA_LENGTH: 64,

  // Balance conversion factors (Myki uses cents)
  CENTS_TO_DOLLARS: 100,
};
