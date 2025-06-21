// Re-export all types for backward compatibility
export * from './types';

// Import types for function implementations
import type { NFCSupport, MykiCardData } from './types';

// NFC Utility Functions
// ====================

// Check if NFC is supported in the current environment
export function checkNFCSupport(): NFCSupport {
  const isSecureContext = typeof window !== 'undefined' && window.isSecureContext;
  const hasNDEF = typeof window !== 'undefined' && 'NDEFReader' in window;
  const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : '';

  return {
    isSupported: hasNDEF && isSecureContext,
    isSecureContext,
    userAgent
  };
}

// Get NFC reader instance
export function getNFCReader(): any {
  if (typeof window !== 'undefined' && 'NDEFReader' in window) {
    return new (window as any).NDEFReader();
  }
  return null;
}

// Parse Myki card data from NFC message
export function parseMykiCardData(message: any): MykiCardData {
  const cardData: MykiCardData = {};

  try {
    // This is a placeholder implementation
    // Actual Myki card data parsing would require reverse engineering
    // the card's data structure
    
    if (message.records && message.records.length > 0) {
      for (const record of message.records) {
        if (record.data) {
          // Extract card data from binary data
          // This would need to be implemented based on actual Myki card structure
          cardData.cardNumber = "Sample Card Number";
          cardData.balance = 0; // Placeholder
        }
      }
    }
  } catch (error) {
    console.error('Error parsing Myki card data:', error);
  }

  return cardData;
}

// Convert DataView to hex string for debugging
export function dataViewToHex(dataView: DataView): string {
  const bytes = new Uint8Array(dataView.buffer);
  return Array.from(bytes)
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join(' ');
}

// Log raw NFC data for analysis
export function logNFCData(message: any): void {
  console.log('NFC Message:', message);
  
  if (message.records) {
    message.records.forEach((record: any, index: number) => {
      console.log(`Record ${index}:`, {
        recordType: record.recordType,
        mediaType: record.mediaType,
        id: record.id,
        data: record.data ? dataViewToHex(record.data) : 'No data'
      });
    });
  }
} 