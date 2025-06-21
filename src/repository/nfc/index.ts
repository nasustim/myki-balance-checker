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
