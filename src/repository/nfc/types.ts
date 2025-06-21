// Web NFC API type definitions
// These are standard Web NFC API types for general NFC functionality
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

// Browser NFC Support Detection
// General type for detecting NFC capabilities in any environment
export interface NFCSupport {
  isSupported: boolean;
  isSecureContext: boolean;
  userAgent: string;
}
