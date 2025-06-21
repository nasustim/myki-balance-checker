// General binary data analysis utilities

// Calculate data entropy
export function calculateDataEntropy(bytes: Uint8Array): number {
  const freq: { [key: number]: number } = {};
  bytes.forEach((b) => {
    freq[b] = (freq[b] || 0) + 1;
  });

  const entropy = Object.values(freq).reduce((sum, count) => {
    const p = count / bytes.length;
    return sum - p * Math.log2(p);
  }, 0);

  return entropy;
}

// Find most frequent bytes
export function findMostFrequentBytes(bytes: Uint8Array): Array<{ byte: number; count: number }> {
  const freq: { [key: number]: number } = {};
  bytes.forEach((b) => {
    freq[b] = (freq[b] || 0) + 1;
  });

  return Object.entries(freq)
    .map(([byte, count]) => ({ byte: Number.parseInt(byte), count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
}

// Find sequential runs of the same byte
export function findSequentialRuns(
  bytes: Uint8Array
): Array<{ start: number; length: number; value: number }> {
  const runs: Array<{ start: number; length: number; value: number }> = [];

  for (let i = 0; i < bytes.length; i++) {
    let length = 1;
    while (i + length < bytes.length && bytes[i + length] === bytes[i]) {
      length++;
    }

    if (length > 2) {
      runs.push({ start: i, length, value: bytes[i] });
    }
    i += length - 1;
  }

  return runs;
}

// Find repeating patterns in byte array
export function findRepeatingPatterns(
  bytes: Uint8Array
): Array<{ pattern: number[]; positions: number[] }> {
  const patterns: { [key: string]: number[] } = {};

  // Look for 2-4 byte patterns
  for (let patternLength = 2; patternLength <= 4; patternLength++) {
    for (let i = 0; i <= bytes.length - patternLength; i++) {
      const pattern = Array.from(bytes.slice(i, i + patternLength));
      const key = pattern.join(',');

      if (!patterns[key]) patterns[key] = [];
      patterns[key].push(i);
    }
  }

  // Return patterns that appear more than once
  return Object.entries(patterns)
    .filter(([_, positions]) => positions.length > 1)
    .map(([patternStr, positions]) => ({
      pattern: patternStr.split(',').map(Number),
      positions,
    }))
    .slice(0, 10); // Limit to top 10 patterns
}

// Extract possible ASCII strings
export function extractPossibleStrings(bytes: Uint8Array): string[] {
  const strings: string[] = [];
  let currentString = '';

  bytes.forEach((byte) => {
    if (byte >= 32 && byte <= 126) {
      // Printable ASCII
      currentString += String.fromCharCode(byte);
    } else {
      if (currentString.length > 2) {
        strings.push(currentString);
      }
      currentString = '';
    }
  });

  if (currentString.length > 2) {
    strings.push(currentString);
  }

  return strings.slice(0, 10); // Limit to top 10 strings
}

// Find common data patterns
export function findDataPatterns(bytes: Uint8Array) {
  return {
    hasNullBytes: bytes.some((b) => b === 0x00),
    hasHighBytes: bytes.some((b) => b > 0x7f),
    startsWithPattern: bytes.slice(0, 4),
    endsWithPattern: bytes.slice(-4),
    commonValues: findMostFrequentBytes(bytes),
    sequentialRuns: findSequentialRuns(bytes),
  };
}
