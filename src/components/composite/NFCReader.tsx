'use client';

import { useEffect, useState } from 'react';
import {
  ExclamationIcon,
  InformationCircleIcon,
  MobileDeviceIcon,
  NFCIcon,
} from '@/components/ui/icons';
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
              <ExclamationIcon
                className="h-6 w-6 text-red-600"
                aria-label="Warning icon"
                title="Warning"
              />
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
              <NFCIcon className="h-8 w-8 text-blue-600" aria-label="NFC icon" title="NFC" />
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
                  <MobileDeviceIcon
                    className="h-8 w-8 text-blue-600"
                    aria-label="Mobile device icon"
                    title="Mobile Device"
                  />
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
                <MobileDeviceIcon
                  className="h-6 w-6"
                  aria-label="Start reading icon"
                  title="Start Reading"
                />
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
            <InformationCircleIcon
              className="h-5 w-5"
              aria-label="Information icon"
              title="Information"
            />
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
