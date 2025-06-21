'use client';

import { useState } from 'react';
import MykiCard from '@/app/components/MykiCard';
import NFCReader from '@/app/components/NFCReader';
import type { MykiCardData } from '@/feature/myki';

export default function Home() {
  const [cardData, setCardData] = useState<MykiCardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCardRead = (data: MykiCardData) => {
    setCardData(data);
    setError(null);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setCardData(null);
  };

  const clearData = () => {
    setCardData(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto max-w-4xl px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-bold text-3xl text-gray-900">Myki残高チェッカー</h1>
              <p className="mt-1 text-gray-600">NFCを使用してMykiカードの残高を確認</p>
            </div>
            {cardData && (
              <button
                onClick={clearData}
                className="rounded-lg bg-gray-500 px-4 py-2 font-medium text-white transition-colors hover:bg-gray-600"
              >
                リセット
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="space-y-8">
          {/* NFC Reader Section */}
          <section>
            <NFCReader onCardRead={handleCardRead} onError={handleError} />
          </section>

          {/* Card Data Section */}
          <section>
            <MykiCard cardData={cardData} error={error} />
          </section>

          {/* Information Section */}
          <section className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-4 font-semibold text-gray-800 text-xl">アプリについて</h2>
            <div className="prose prose-sm text-gray-600">
              <p className="mb-3">
                このアプリはWeb NFC APIを使用してMykiカードから直接データを読み取り、
                残高と利用履歴を表示します。
              </p>

              <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-4">
                <h3 className="mb-2 font-semibold text-green-800">🏗️ アーキテクチャ改善完了</h3>
                <ul className="space-y-1 text-green-700 text-sm">
                  <li>• NFC汎用機能とMyki固有機能を分離</li>
                  <li>• 保守性と拡張性を大幅に向上</li>
                  <li>• 他の交通カードシステムへの対応が容易</li>
                  <li>• Phase 2のデータ解析エンジンを継承</li>
                </ul>
              </div>

              <h3 className="mb-2 font-semibold text-gray-800">対応環境</h3>
              <ul className="mb-4 list-inside list-disc space-y-1">
                <li>Android デバイス（NFC機能付き）</li>
                <li>Chrome for Android（バージョン89以降）</li>
                <li>HTTPS接続（セキュリティ要件）</li>
              </ul>

              <h3 className="mb-2 font-semibold text-gray-800">使用方法</h3>
              <ol className="list-inside list-decimal space-y-1">
                <li>デバイスのNFC設定を有効にする</li>
                <li>「カード読み取り開始」ボタンを押す</li>
                <li>Mykiカードをデバイスの背面に近づける</li>
                <li>読み取り完了まで待つ</li>
              </ol>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t bg-white">
        <div className="mx-auto max-w-4xl px-4 py-6 text-center text-gray-500 text-sm">
          <p className="mt-1">
            This website is created by{' '}
            <a href="https://github.com/nasustim" className="text-blue-500 hover:text-blue-600">
              nasustim
            </a>{' '}
            with{' '}
            <a className="text-blue-500 hover:text-blue-600" href="https://www.cursor.com/">
              Cursor
            </a>
            .
          </p>
        </div>
      </footer>
    </div>
  );
}
