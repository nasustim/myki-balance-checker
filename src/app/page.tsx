'use client';

import { useState } from 'react';
import NFCReader from '@/app/components/NFCReader';
import MykiCard from '@/app/components/MykiCard';
import { MykiCardData } from '@/features/nfc';

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
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Myki残高チェッカー
              </h1>
              <p className="text-gray-600 mt-1">
                NFCを使用してMykiカードの残高を確認
              </p>
            </div>
            {cardData && (
              <button
                onClick={clearData}
                className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                リセット
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
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
          <section className="bg-white p-6 border border-gray-200 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              アプリについて
            </h2>
            <div className="prose prose-sm text-gray-600">
              <p className="mb-3">
                このアプリはWeb NFC APIを使用してMykiカードから直接データを読み取り、
                残高と利用履歴を表示します。
              </p>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-yellow-800 mb-2">
                  ⚠️ 開発版について
                </h3>
                <ul className="text-yellow-700 text-sm space-y-1">
                  <li>• 現在はNFCカード検出の基本機能のみ実装</li>
                  <li>• Mykiカードの実際のデータ解析は今後実装予定</li>
                  <li>• 表示される残高・履歴は現在プレースホルダーです</li>
                </ul>
              </div>

              <h3 className="font-semibold text-gray-800 mb-2">
                対応環境
              </h3>
              <ul className="list-disc list-inside space-y-1 mb-4">
                <li>Android デバイス（NFC機能付き）</li>
                <li>Chrome for Android（バージョン89以降）</li>
                <li>HTTPS接続（セキュリティ要件）</li>
              </ul>

              <h3 className="font-semibold text-gray-800 mb-2">
                使用方法
              </h3>
              <ol className="list-decimal list-inside space-y-1">
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
      <footer className="bg-white border-t mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-gray-500 text-sm">
          <p className="mt-1">
            This website is created by <a href="https://github.com/nasustim" className="text-blue-500 hover:text-blue-600">nasustim</a> with <a className="text-blue-500 hover:text-blue-600" href="https://www.cursor.com/">Cursor</a>.
          </p>
        </div>
      </footer>
    </div>
  );
}
