'use client';

import { useState, useEffect } from 'react';
import { 
  checkNFCSupport, 
  getNFCReader, 
  parseMykiCardData, 
  logNFCData,
  MykiCardData, 
  NFCSupport 
} from '@/features/nfc';

interface NFCReaderProps {
  onCardRead: (data: MykiCardData) => void;
  onError: (error: string) => void;
}

export default function NFCReader({ onCardRead, onError }: NFCReaderProps) {
  const [nfcSupport, setNfcSupport] = useState<NFCSupport | null>(null);
  const [isReading, setIsReading] = useState(false);
  const [reader, setReader] = useState<any>(null);

  useEffect(() => {
    // Check NFC support on component mount
    const support = checkNFCSupport();
    setNfcSupport(support);

    if (support.isSupported) {
      const nfcReader = getNFCReader();
      setReader(nfcReader);
    }
  }, []);

  const startReading = async () => {
    if (!reader) {
      onError('NFC reader not available');
      return;
    }

    try {
      setIsReading(true);

      // Set up event listeners
      reader.addEventListener('reading', ({ message, serialNumber }: any) => {
        console.log('NFC card detected:', serialNumber);
        
        // Log raw data for analysis
        logNFCData(message);
        
        // Parse Myki card data
        const cardData = parseMykiCardData(message);
        cardData.cardNumber = serialNumber;
        
        onCardRead(cardData);
        setIsReading(false);
      });

      reader.addEventListener('readingerror', (event: any) => {
        console.error('NFC reading error:', event);
        onError('カードの読み取りに失敗しました');
        setIsReading(false);
      });

      // Start scanning
      await reader.scan();
      
    } catch (error) {
      console.error('NFC scan error:', error);
      onError(`NFC読み取りエラー: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsReading(false);
    }
  };

  const stopReading = () => {
    setIsReading(false);
    // Note: Web NFC API doesn't have a direct stop method
    // The scan operation can be cancelled using AbortController
  };

  if (!nfcSupport) {
    return (
      <div className="p-6 bg-gray-100 rounded-lg">
        <p className="text-gray-600">NFC対応状況を確認中...</p>
      </div>
    );
  }

  if (!nfcSupport.isSupported) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-lg font-semibold text-red-800 mb-2">
          NFC未対応
        </h3>
        <div className="text-red-600 space-y-2">
          {!nfcSupport.isSecureContext && (
            <p>• HTTPSプロトコルが必要です</p>
          )}
          <p>• Chrome for Android（バージョン89以降）でのみ対応</p>
          <p>• デバイスにNFC機能が必要です</p>
        </div>
        <details className="mt-4">
          <summary className="text-sm text-red-500 cursor-pointer">
            技術詳細
          </summary>
          <p className="text-xs text-red-400 mt-2">
            User Agent: {nfcSupport.userAgent}
          </p>
        </details>
      </div>
    );
  }

  return (
    <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
      <h3 className="text-lg font-semibold text-blue-800 mb-4">
        Mykiカード読み取り
      </h3>
      
      {!isReading ? (
        <div className="space-y-4">
          <p className="text-blue-600">
            カードをデバイスの背面に近づけて、読み取りボタンを押してください。
          </p>
          <button
            onClick={startReading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            📱 カード読み取り開始
          </button>
        </div>
      ) : (
        <div className="text-center space-y-4">
          <div className="animate-pulse">
            <div className="w-16 h-16 bg-blue-300 rounded-full mx-auto mb-4"></div>
          </div>
          <p className="text-blue-700 font-medium">
            カードをデバイスに近づけてください...
          </p>
          <button
            onClick={stopReading}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded transition-colors"
          >
            キャンセル
          </button>
        </div>
      )}
      
      <div className="mt-4 p-3 bg-blue-100 rounded text-sm text-blue-700">
        <p className="font-medium">注意事項:</p>
        <ul className="list-disc list-inside mt-1 space-y-1">
          <li>デバイスのNFC設定を有効にしてください</li>
          <li>カードをデバイスの背面中央に近づけてください</li>
          <li>読み取りには数秒かかる場合があります</li>
        </ul>
      </div>
    </div>
  );
} 