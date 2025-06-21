'use client';

import { useEffect, useState } from 'react';
import { type MykiCardData, parseMykiCardData } from '@/feature/myki';
import type { NFCSupport } from '@/repository/nfc';
import { checkNFCSupport, getNFCReader, logNFCData } from '@/repository/nfc';
import { ErrorCard, InfoCard } from './Card';
import LoadingSpinner from './LoadingSpinner';
import StatusBadge from './StatusBadge';

interface NFCReaderProps {
  onCardRead: (data: MykiCardData) => void;
  onError: (error: string) => void;
}

// Define NFC Reader type for better type safety
interface NFCReaderData {
  message: unknown;
  serialNumber: string;
}

interface NFCReader {
  addEventListener: (event: string, callback: (data: NFCReaderData) => void) => void;
  scan: () => Promise<void>;
}

export default function NFCReader({ onCardRead, onError }: NFCReaderProps) {
  const [nfcSupport, setNfcSupport] = useState<NFCSupport | null>(null);
  const [isReading, setIsReading] = useState(false);
  const [reader, setReader] = useState<NFCReader | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<
    'idle' | 'connecting' | 'scanning' | 'reading'
  >('idle');

  useEffect(() => {
    // Check NFC support on component mount
    const support = checkNFCSupport();
    setNfcSupport(support);

    if (support.isSupported) {
      const nfcReader = getNFCReader() as NFCReader | null;
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
      setConnectionStatus('connecting');

      // Set up event listeners
      reader.addEventListener(
        'reading',
        ({ message, serialNumber }: { message: unknown; serialNumber: string }) => {
          console.log('NFC card detected:', serialNumber);
          setConnectionStatus('reading');

          // Log raw data for analysis
          logNFCData(message as never);

          // Parse Myki card data
          const cardData = parseMykiCardData(message as never);
          cardData.cardNumber = serialNumber;

          onCardRead(cardData);
          setIsReading(false);
          setConnectionStatus('idle');
        }
      );

      reader.addEventListener('readingerror', (event: unknown) => {
        console.error('NFC reading error:', event);
        onError('カードの読み取りに失敗しました');
        setIsReading(false);
        setConnectionStatus('idle');
      });

      // Start scanning
      setConnectionStatus('scanning');
      await reader.scan();
    } catch (error) {
      console.error('NFC scan error:', error);
      onError(`NFC読み取りエラー: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsReading(false);
      setConnectionStatus('idle');
    }
  };

  const stopReading = () => {
    setIsReading(false);
    setConnectionStatus('idle');
    // Note: Web NFC API doesn't have a direct stop method
    // The scan operation can be cancelled using AbortController
  };

  if (!nfcSupport) {
    return (
      <InfoCard className="animate-fade-in-up text-center">
        <LoadingSpinner size="md" message="NFC対応状況を確認中..." />
      </InfoCard>
    );
  }

  if (!nfcSupport.isSupported) {
    return (
      <ErrorCard className="animate-fade-in-up">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-red-100 p-2">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-label="Warning icon"
              >
                <title>Warning</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-red-800">NFC非対応</h3>
              <p className="text-red-600">このデバイスまたはブラウザはNFCに対応していません</p>
            </div>
          </div>

          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <h4 className="mb-2 font-medium text-red-800">対応要件:</h4>
            <ul className="space-y-1 text-red-700 text-sm">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                Android デバイス (NFC機能付き)
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                Chrome for Android (バージョン89以降)
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                HTTPS接続 (セキュリティ要件)
              </li>
            </ul>
          </div>

          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <h4 className="mb-2 font-medium text-gray-800">現在の状況:</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">セキュアコンテキスト:</span>
                <StatusBadge status={nfcSupport.isSecureContext ? 'success' : 'error'}>
                  {nfcSupport.isSecureContext ? '対応' : '非対応'}
                </StatusBadge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">NFC API:</span>
                <StatusBadge status={nfcSupport.isSupported ? 'success' : 'error'}>
                  {nfcSupport.isSupported ? '利用可能' : '利用不可'}
                </StatusBadge>
              </div>
            </div>
          </div>
        </div>
      </ErrorCard>
    );
  }

  return (
    <InfoCard className="animate-fade-in-up">
      <div className="space-y-6">
        <div className="text-center">
          <div className="mb-3 inline-flex items-center gap-3">
            <div className="rounded-full bg-blue-100 p-3">
              <svg
                className="h-8 w-8 text-blue-600"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-label="NFC icon"
              >
                <title>NFC</title>
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
              </svg>
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-blue-800 text-xl">Mykiカード読み取り</h3>
              <p className="text-blue-600 text-sm">NFCでカード情報を取得します</p>
            </div>
          </div>

          {/* Connection Status */}
          <div className="mb-4">
            {connectionStatus === 'idle' && (
              <StatusBadge status="info" size="lg">
                待機中
              </StatusBadge>
            )}
            {connectionStatus === 'connecting' && (
              <StatusBadge status="loading" size="lg">
                接続中...
              </StatusBadge>
            )}
            {connectionStatus === 'scanning' && (
              <StatusBadge status="loading" size="lg">
                スキャン中...
              </StatusBadge>
            )}
            {connectionStatus === 'reading' && (
              <StatusBadge status="success" size="lg" animated>
                読み取り中...
              </StatusBadge>
            )}
          </div>
        </div>

        {!isReading ? (
          <div className="space-y-4 text-center">
            <div className="rounded-xl border-2 border-blue-200 border-dashed bg-gradient-to-br from-blue-50 to-green-50 p-6">
              <div className="mb-4">
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                  <svg
                    className="h-8 w-8 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-label="Mobile device icon"
                  >
                    <title>Mobile Device</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <p className="font-medium text-blue-700">
                  カードをデバイスの背面に近づけて、読み取りボタンを押してください
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={startReading}
              className="focus-ring w-full transform rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-4 font-semibold text-white transition-all-smooth hover:scale-105 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg"
            >
              <span className="flex items-center justify-center gap-3">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-label="Start reading icon"
                >
                  <title>Start Reading</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                カード読み取り開始
              </span>
            </button>
          </div>
        ) : (
          <div className="space-y-6 text-center">
            <div className="rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-green-50 p-8">
              <LoadingSpinner
                size="xl"
                variant="primary"
                message="カードをデバイスに近づけてください..."
              />
            </div>

            <button
              type="button"
              onClick={stopReading}
              className="focus-ring rounded-lg bg-gray-500 px-6 py-3 font-semibold text-white transition-all-smooth hover:bg-gray-600"
            >
              キャンセル
            </button>
          </div>
        )}

        {/* Instructions */}
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <h4 className="mb-3 flex items-center gap-2 font-medium text-blue-800">
            <svg
              className="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-label="Information icon"
            >
              <title>Information</title>
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            使用方法
          </h4>
          <ul className="space-y-2 text-blue-700 text-sm">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-200 font-bold text-blue-800 text-xs">
                1
              </span>
              デバイスのNFC設定を有効にしてください
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-200 font-bold text-blue-800 text-xs">
                2
              </span>
              Mykiカードをデバイスの背面中央に近づけてください
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-200 font-bold text-blue-800 text-xs">
                3
              </span>
              読み取りには数秒かかる場合があります
            </li>
          </ul>
        </div>
      </div>
    </InfoCard>
  );
}
