// Web NFC API type definitions
// Most Web NFC API types are provided by the browser's standard library,
// but we define them here for better compatibility and documentation

// Web NFC API Standard Types
// Reference: https://w3c.github.io/web-nfc/
// Reference: https://developer.mozilla.org/en-US/docs/Web/API/Web_NFC_API

// NDEF Message Interface
// Reference: https://w3c.github.io/web-nfc/#ndefmessage-interface
export interface NDEFMessage {
  records: NDEFRecord[];
}

// NDEF Record Interface  
// Reference: https://w3c.github.io/web-nfc/#ndefrecord-interface
export interface NDEFRecord {
  recordType: string;
  mediaType?: string;
  id?: string;
  data?: DataView;
  encoding?: string;
  lang?: string;
}

// NDEF Reader Interface
// Reference: https://w3c.github.io/web-nfc/#ndefreader-interface
export interface NDEFReader {
  addEventListener(type: 'reading', listener: (event: NDEFReadingEvent) => void): void;
  addEventListener(type: 'readingerror', listener: (event: Event) => void): void;
  scan(options?: NDEFScanOptions): Promise<void>;
  write(message: NDEFMessage | string, options?: NDEFWriteOptions): Promise<void>;
}

// NDEF Reading Event Interface
// Reference: https://w3c.github.io/web-nfc/#ndefreadingevent-interface
export interface NDEFReadingEvent extends Event {
  serialNumber: string;
  message: NDEFMessage;
}

// NDEF Scan Options Dictionary
// Reference: https://w3c.github.io/web-nfc/#ndefscanoptions-dictionary
export interface NDEFScanOptions {
  signal?: AbortSignal;
}

// NDEF Write Options Dictionary
// Reference: https://w3c.github.io/web-nfc/#ndefwriteoptions-dictionary
export interface NDEFWriteOptions {
  overwrite?: boolean;
  signal?: AbortSignal;
}

// Custom Application-Specific Types
// These are not part of the Web NFC API standard

// Myki Card Data Structure
// Custom type for representing Myki transportation card data
// Reference: Myki card specification (proprietary)
export interface MykiCardData {
  cardNumber?: string;
  balance?: number;
  lastTransaction?: {
    date: Date;
    amount: number;
    type: 'debit' | 'credit';
    location?: string;
  };
  transactions?: Array<{
    date: Date;
    amount: number;
    type: 'debit' | 'credit';
    location?: string;
  }>;
}

// Browser NFC Support Detection
// Custom type for detecting NFC capabilities in the current environment
export interface NFCSupport {
  isSupported: boolean;
  isSecureContext: boolean;
  userAgent: string;
} 