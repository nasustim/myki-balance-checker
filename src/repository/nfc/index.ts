// Re-export all types for backward compatibility
export * from './types';

// Import types for function implementations
import type { NDEFMessage, NDEFReader, NDEFRecord, NFCSupport } from './types';

// NFC Repository - General NFC functionality
// ==========================================

// Check if NFC is supported in the current environment
export function checkNFCSupport(): NFCSupport {
  const isSecureContext = typeof window !== 'undefined' && window.isSecureContext;
  const hasNDEFReader = typeof window !== 'undefined' && 'NDEFReader' in window;

  return {
    isSupported: isSecureContext && hasNDEFReader,
    isSecureContext,
    hasNDEFReader,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
  };
}

// Get NFC reader instance
export function getNFCReader(): NDEFReader | null {
  if (typeof window !== 'undefined' && 'NDEFReader' in window) {
    return new (window as unknown as { NDEFReader: new () => NDEFReader }).NDEFReader();
  }
  return null;
}

// Convert DataView to hex string for debugging
export function dataViewToHex(dataView: DataView): string {
  const bytes = new Uint8Array(dataView.buffer);
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join(' ');
}

// Binary analysis utilities
export function calculateEntropy(data: Uint8Array): number {
  const frequency = new Array(256).fill(0);
  for (const byte of data) {
    frequency[byte]++;
  }

  let entropy = 0;
  const length = data.length;
  for (const freq of frequency) {
    if (freq > 0) {
      const probability = freq / length;
      entropy -= probability * Math.log2(probability);
    }
  }

  return entropy;
}

// General NFC data logging utility
export function logNFCData(message: NDEFMessage): void {
  console.log('📡 =========================');
  console.log('📡 NFC MESSAGE ANALYSIS');
  console.log('📡 =========================');

  if (!message || !message.records) {
    console.log('❌ No message or records found');
    return;
  }

  console.log(`📋 Found ${message.records.length} record(s)`);

  message.records.forEach((record: NDEFRecord, index: number) => {
    console.log(`\n📄 Record ${index + 1}:`);
    console.log('  Type:', record.recordType);
    console.log('  Media Type:', record.mediaType || 'N/A');
    console.log('  ID:', record.id || 'N/A');
    console.log('  Data Length:', record.data?.byteLength || 0);

    if (record.data) {
      const uint8Array = new Uint8Array(record.data);
      const hexString = Array.from(uint8Array)
        .map((byte) => byte.toString(16).padStart(2, '0'))
        .join(' ');
      console.log('  Data (hex):', hexString);

      // Try to extract text if it looks like text
      try {
        const decoder = new TextDecoder();
        const text = decoder.decode(record.data);
        if (/^[\x20-\x7E\s]*$/.test(text)) {
          console.log('  Data (text):', text);
        }
      } catch {
        // Ignore decode errors
      }
    }
  });

  console.log('\n📡 =========================');
}

export function findRepeatingPatterns(
  data: Uint8Array
): Array<{ pattern: Uint8Array; positions: number[] }> {
  const patterns: Array<{ pattern: Uint8Array; positions: number[] }> = [];
  const minPatternLength = 2;
  const maxPatternLength = Math.min(16, Math.floor(data.length / 2));

  for (let length = minPatternLength; length <= maxPatternLength; length++) {
    const patternMap = new Map<string, number[]>();

    for (let i = 0; i <= data.length - length; i++) {
      const pattern = data.slice(i, i + length);
      const key = Array.from(pattern).join(',');

      if (!patternMap.has(key)) {
        patternMap.set(key, []);
      }
      patternMap.get(key)?.push(i);
    }

    for (const [key, positions] of patternMap) {
      if (positions.length > 1) {
        const pattern = new Uint8Array(key.split(',').map(Number));
        patterns.push({ pattern, positions });
      }
    }
  }

  return patterns.sort((a, b) => b.positions.length - a.positions.length);
}

export function extractAsciiStrings(data: Uint8Array, minLength = 4): string[] {
  const strings: string[] = [];
  let currentString = '';

  for (const byte of data) {
    if (byte >= 32 && byte <= 126) {
      // Printable ASCII
      currentString += String.fromCharCode(byte);
    } else {
      if (currentString.length >= minLength) {
        strings.push(currentString);
      }
      currentString = '';
    }
  }

  if (currentString.length >= minLength) {
    strings.push(currentString);
  }

  return strings;
}

export function createHexDump(data: Uint8Array, bytesPerLine = 16): string {
  const lines: string[] = [];

  for (let i = 0; i < data.length; i += bytesPerLine) {
    const chunk = data.slice(i, i + bytesPerLine);
    const offset = i.toString(16).padStart(8, '0');
    const hex = Array.from(chunk)
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join(' ')
      .padEnd(bytesPerLine * 3 - 1, ' ');
    const ascii = Array.from(chunk)
      .map((byte) => (byte >= 32 && byte <= 126 ? String.fromCharCode(byte) : '.'))
      .join('');

    lines.push(`${offset}  ${hex}  |${ascii}|`);
  }

  return lines.join('\n');
}

export function detectTimestamps(data: Uint8Array): Date[] {
  const timestamps: Date[] = [];
  const minTimestamp = new Date('2020-01-01').getTime() / 1000;
  const maxTimestamp = new Date('2030-12-31').getTime() / 1000;

  // Check for Unix timestamps (32-bit)
  for (let i = 0; i <= data.length - 4; i++) {
    const view = new DataView(data.buffer, data.byteOffset + i, 4);

    // Try both little-endian and big-endian
    const timestampLE = view.getUint32(0, true);
    const timestampBE = view.getUint32(0, false);

    if (timestampLE >= minTimestamp && timestampLE <= maxTimestamp) {
      timestamps.push(new Date(timestampLE * 1000));
    }

    if (timestampBE >= minTimestamp && timestampBE <= maxTimestamp && timestampBE !== timestampLE) {
      timestamps.push(new Date(timestampBE * 1000));
    }
  }

  return timestamps;
}
