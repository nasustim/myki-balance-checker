'use client';

import { useEffect, useState } from 'react';
import { type MykiCardData, parseMykiCardData } from '@/feature/myki';
import type { NFCSupport } from '@/repository/nfc';
import { checkNFCSupport, getNFCReader, logNFCData } from '@/repository/nfc';

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
      reader.addEventListener(
        'reading',
        ({ message, serialNumber }: { message: any; serialNumber: string }) => {
          console.log('NFC card detected:', serialNumber);

          // Log raw data for analysis
          logNFCData(message);

          // Parse Myki card data
          const cardData = parseMykiCardData(message);
          cardData.cardNumber = serialNumber;

          onCardRead(cardData);
          setIsReading(false);
        }
      );

      reader.addEventListener('readingerror', (event: Event) => {
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
      <div className="rounded-lg bg-gray-100 p-6">
        <p className="text-gray-600">NFC対応状況を確認中...</p>
      </div>
    );
  }

  if (!nfcSupport.isSupported) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6">
        <h3 className="mb-2 font-semibold text-lg text-red-800">NFC非対応</h3>
        <div className="space-y-2 text-red-600">
          <p>このデバイスまたはブラウザはNFCに対応していません。</p>

          <div className="text-sm">
            <p className="font-medium">対応要件:</p>
            <ul className="mt-1 list-inside list-disc space-y-1">
              <li>Android デバイス (NFC機能付き)</li>
              <li>Chrome for Android (バージョン89以降)</li>
              <li>HTTPS接続 (セキュリティ要件)</li>
            </ul>
          </div>

          <div className="mt-3 rounded bg-red-100 p-3 text-sm">
            <p className="font-medium">現在の状況:</p>
            <ul className="mt-1 space-y-1">
              <li>• セキュアコンテキスト: {nfcSupport.isSecureContext ? '✅' : '❌'}</li>
              <li>• NFC API利用可能: {nfcSupport.isSupported ? '✅' : '❌'}</li>
              <li>• ユーザーエージェント: {nfcSupport.userAgent.substring(0, 50)}...</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
      <h3 className="mb-4 font-semibold text-blue-800 text-lg">Mykiカード読み取り</h3>

      {!isReading ? (
        <div className="space-y-4">
          <p className="text-blue-600">
            カードをデバイスの背面に近づけて、読み取りボタンを押してください。
          </p>
          <button
            type="button"
            onClick={startReading}
            className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
          >
            📱 カード読み取り開始
          </button>
        </div>
      ) : (
        <div className="space-y-4 text-center">
          <div className="animate-pulse">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-blue-300" />
          </div>
          <p className="font-medium text-blue-700">カードをデバイスに近づけてください...</p>
          <button
            type="button"
            onClick={stopReading}
            className="rounded bg-gray-500 px-4 py-2 font-semibold text-white transition-colors hover:bg-gray-600"
          >
            キャンセル
          </button>
        </div>
      )}

      <div className="mt-4 rounded bg-blue-100 p-3 text-blue-700 text-sm">
        <p className="font-medium">注意事項:</p>
        <ul className="mt-1 list-inside list-disc space-y-1">
          <li>デバイスのNFC設定を有効にしてください</li>
          <li>カードをデバイスの背面中央に近づけてください</li>
          <li>読み取りには数秒かかる場合があります</li>
        </ul>
      </div>
    </div>
  );
}
