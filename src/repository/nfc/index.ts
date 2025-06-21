// Re-export all types for backward compatibility
export * from './types';

// Import types for function implementations
import type { NFCSupport } from './types';

// NFC Repository - General NFC functionality
// ==========================================

// Check if NFC is supported in the current environment
export function checkNFCSupport(): NFCSupport {
  const isSecureContext = typeof window !== 'undefined' && window.isSecureContext;
  const hasNDEF = typeof window !== 'undefined' && 'NDEFReader' in window;
  const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : '';

  return {
    isSupported: hasNDEF && isSecureContext,
    isSecureContext,
    userAgent,
  };
}

// Get NFC reader instance
export function getNFCReader(): any {
  if (typeof window !== 'undefined' && 'NDEFReader' in window) {
    return new (window as any).NDEFReader();
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

// General NFC data logging utility
export function logNFCData(message: any): void {
  console.log('📡 =========================');
  console.log('📡 NFC MESSAGE ANALYSIS');
  console.log('📡 =========================');
  console.log('Raw NFC Message:', message);

  if (message.records) {
    console.log(`📋 Found ${message.records.length} record(s)`);

    message.records.forEach((record: any, index: number) => {
      console.log(`\n📄 Record ${index + 1}:`);
      console.log('  Type:', record.recordType);
      console.log('  Media Type:', record.mediaType || 'N/A');
      console.log('  ID:', record.id || 'N/A');
      console.log('  Data Length:', record.data ? record.data.byteLength : 0, 'bytes');

      if (record.data && record.data.byteLength > 0) {
        const hexData = dataViewToHex(record.data);
        console.log('  Hex Data:', hexData);

        // Additional analysis for debugging
        const bytes = new Uint8Array(record.data.buffer);
        console.log(
          '  First 8 bytes:',
          Array.from(bytes.slice(0, 8))
            .map((b) => `0x${b.toString(16).padStart(2, '0')}`)
            .join(' ')
        );
        console.log(
          '  Last 8 bytes:',
          Array.from(bytes.slice(-8))
            .map((b) => `0x${b.toString(16).padStart(2, '0')}`)
            .join(' ')
        );

        // Look for potential text data
        const possibleText = Array.from(bytes)
          .map((b) => (b >= 32 && b <= 126 ? String.fromCharCode(b) : '.'))
          .join('');
        console.log('  Possible text:', possibleText);
      }
    });
  } else {
    console.log('⚠️ No records found in NFC message');
  }

  console.log('📡 =========================\n');
}

// General binary data analysis utilities
class BinaryAnalysis {
  // Calculate data entropy
  static calculateDataEntropy(bytes: Uint8Array): number {
    const freq: { [key: number]: number } = {};
    bytes.forEach((b) => (freq[b] = (freq[b] || 0) + 1));

    const entropy = Object.values(freq).reduce((sum, count) => {
      const p = count / bytes.length;
      return sum - p * Math.log2(p);
    }, 0);

    return entropy;
  }

  // Find most frequent bytes
  static findMostFrequentBytes(bytes: Uint8Array): Array<{ byte: number; count: number }> {
    const freq: { [key: number]: number } = {};
    bytes.forEach((b) => (freq[b] = (freq[b] || 0) + 1));

    return Object.entries(freq)
      .map(([byte, count]) => ({ byte: Number.parseInt(byte), count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }

  // Find sequential runs of the same byte
  static findSequentialRuns(
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
  static findRepeatingPatterns(
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
  static extractPossibleStrings(bytes: Uint8Array): string[] {
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
  static findDataPatterns(bytes: Uint8Array) {
    return {
      hasNullBytes: bytes.some((b) => b === 0x00),
      hasHighBytes: bytes.some((b) => b > 0x7f),
      startsWithPattern: bytes.slice(0, 4),
      endsWithPattern: bytes.slice(-4),
      commonValues: BinaryAnalysis.findMostFrequentBytes(bytes),
      sequentialRuns: BinaryAnalysis.findSequentialRuns(bytes),
    };
  }
}
