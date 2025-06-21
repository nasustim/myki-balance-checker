// Myki-specific type definitions
// These types are specific to Myki transportation card functionality

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

// Myki data analysis result
export interface MykiAnalysisResult {
  recordIndex: number;
  totalBytes: number;
  hexData: string;
  patterns: MykiDataPatterns;
  potentialFields: MykiPotentialField[];
  entropy: number;
  repeatingPatterns: Array<{ pattern: number[]; positions: number[] }>;
  possibleStrings: string[];
}

// Myki-specific data patterns
export interface MykiDataPatterns {
  hasNullBytes: boolean;
  hasHighBytes: boolean;
  startsWithPattern: Uint8Array;
  endsWithPattern: Uint8Array;
  commonValues: Array<{ byte: number; count: number }>;
  sequentialRuns: Array<{ start: number; length: number; value: number }>;
}

// Potential data fields found in Myki card
export interface MykiPotentialField {
  type: 'potential_balance' | 'potential_timestamp' | 'potential_card_id';
  offset: number;
  value: number | Date | string;
  encoding: string;
  confidence: number;
}
