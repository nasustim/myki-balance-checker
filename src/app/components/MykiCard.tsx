'use client';

import type { MykiCardData } from '@/feature/myki';

interface MykiCardProps {
  cardData: MykiCardData | null;
  error: string | null;
}

export default function MykiCard({ cardData, error }: MykiCardProps) {
  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6">
        <h3 className="mb-2 font-semibold text-lg text-red-800">エラーが発生しました</h3>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!cardData) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center">
        <div className="mb-4 text-gray-400">
          <svg className="mx-auto h-16 w-16" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <p className="text-gray-500">カード情報がありません</p>
        <p className="mt-2 text-gray-400 text-sm">
          上記のカード読み取り機能を使用してMykiカードをスキャンしてください
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Card Overview */}
      <div className="rounded-lg bg-gradient-to-r from-green-400 to-blue-500 p-6 text-white shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-bold text-2xl">Mykiカード</h2>
          <div className="text-right">
            <p className="text-sm opacity-90">カード番号</p>
            <p className="font-mono text-lg">{cardData.cardNumber || 'N/A'}</p>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm opacity-90">現在の残高</p>
          <p className="font-bold text-4xl">${cardData.balance?.toFixed(2) || '0.00'}</p>
          {cardData.balance && <p className="mt-1 text-sm opacity-75">データ解析による推定値</p>}
        </div>
      </div>

      {/* Analysis Status */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
        <h3 className="mb-2 flex items-center font-semibold text-blue-800 text-lg">
          🔬 データ解析ステータス
        </h3>
        <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
          <div className="text-center">
            <div
              className={`mx-auto mb-1 h-3 w-3 rounded-full ${cardData.balance ? 'bg-green-500' : 'bg-gray-300'}`}
            />
            <p className="font-medium">残高解析</p>
            <p className="text-gray-600">{cardData.balance ? '成功' : '未検出'}</p>
          </div>
          <div className="text-center">
            <div
              className={`mx-auto mb-1 h-3 w-3 rounded-full ${cardData.lastTransaction ? 'bg-green-500' : 'bg-gray-300'}`}
            />
            <p className="font-medium">取引履歴</p>
            <p className="text-gray-600">{cardData.lastTransaction ? '検出済み' : '未検出'}</p>
          </div>
          <div className="text-center">
            <div
              className={`mx-auto mb-1 h-3 w-3 rounded-full ${cardData.cardNumber ? 'bg-green-500' : 'bg-gray-300'}`}
            />
            <p className="font-medium">カード識別</p>
            <p className="text-gray-600">{cardData.cardNumber ? '完了' : '未完了'}</p>
          </div>
        </div>
      </div>

      {/* Last Transaction */}
      {cardData.lastTransaction && (
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-3 flex items-center font-semibold text-gray-800 text-lg">
            🕒 最新の取引
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">
                {cardData.lastTransaction.type === 'debit' ? '支払い' : 'チャージ'}
              </p>
              <p className="text-gray-500 text-sm">
                {cardData.lastTransaction.location || '場所不明'}
              </p>
              <p className="text-gray-500 text-sm">
                {cardData.lastTransaction.date.toLocaleDateString('ja-JP')}
              </p>
            </div>
            <div
              className={`text-right font-semibold ${
                cardData.lastTransaction.type === 'debit' ? 'text-red-600' : 'text-green-600'
              }`}
            >
              {cardData.lastTransaction.type === 'debit' ? '-' : '+'}$
              {cardData.lastTransaction.amount.toFixed(2)}
            </div>
          </div>
        </div>
      )}

      {/* Transaction History */}
      {cardData.transactions && cardData.transactions.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white">
          <div className="border-gray-200 border-b p-6">
            <h3 className="flex items-center font-semibold text-gray-800 text-lg">
              📊 利用履歴
              <span className="ml-2 font-normal text-gray-500 text-sm">(推定データ)</span>
            </h3>
          </div>
          <div className="divide-y divide-gray-200">
            {cardData.transactions.slice(0, 10).map((transaction, index) => (
              <div key={index} className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium text-gray-900">
                    {transaction.type === 'debit' ? '支払い' : 'チャージ'}
                  </p>
                  <p className="text-gray-500 text-sm">{transaction.location || '場所不明'}</p>
                  <p className="text-gray-500 text-sm">
                    {transaction.date.toLocaleDateString('ja-JP')}{' '}
                    {transaction.date.toLocaleTimeString('ja-JP', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <div
                  className={`font-semibold ${
                    transaction.type === 'debit' ? 'text-red-600' : 'text-green-600'
                  }`}
                >
                  {transaction.type === 'debit' ? '-' : '+'}${transaction.amount.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          {cardData.transactions.length > 10 && (
            <div className="border-gray-200 border-t p-4 text-center text-gray-500 text-sm">
              {cardData.transactions.length - 10}件の履歴が省略されています
            </div>
          )}
        </div>
      )}

      {/* Refactored Architecture Info */}
      <div className="rounded-lg border border-green-200 bg-green-50 p-4">
        <h3 className="mb-2 flex items-center font-semibold text-green-800 text-lg">
          🏗️ アーキテクチャ改善完了
        </h3>
        <div className="space-y-2 text-green-700 text-sm">
          <p className="font-medium">新しい構造:</p>
          <ul className="ml-4 list-inside list-disc space-y-1">
            <li>
              <code>src/repository/nfc/</code> - NFC汎用機能
            </li>
            <li>
              <code>src/feature/myki/</code> - Myki固有機能
            </li>
            <li>関心の分離による保守性向上</li>
            <li>再利用可能なコンポーネント設計</li>
          </ul>
          <p className="mt-3">
            <strong>利点:</strong> 他の交通カード（Suica、Octopusなど）への拡張が容易になりました。
          </p>
        </div>
      </div>

      {/* Enhanced Debug Information */}
      <details className="rounded-lg border border-gray-200 bg-gray-50">
        <summary className="flex cursor-pointer items-center p-4 font-medium text-gray-700 text-sm">
          🔍 詳細デバッグ情報
          <span className="ml-2 text-gray-500 text-xs">(開発者向け)</span>
        </summary>
        <div className="space-y-4 border-gray-200 border-t p-4">
          <div>
            <h4 className="mb-2 font-semibold text-gray-800">解析済みカードデータ:</h4>
            <pre className="overflow-auto rounded border bg-white p-3 text-gray-600 text-xs">
              {JSON.stringify(cardData, null, 2)}
            </pre>
          </div>

          <div className="rounded bg-blue-50 p-3">
            <h4 className="mb-2 font-semibold text-blue-800">開発者向けヒント:</h4>
            <ul className="space-y-1 text-blue-700 text-sm">
              <li>• ブラウザの開発者ツールでコンソールログを確認</li>
              <li>• NFCデータの詳細解析結果を確認可能</li>
              <li>
                • <code>@/repository/nfc</code> - 汎用NFC機能
              </li>
              <li>
                • <code>@/feature/myki</code> - Myki固有解析機能
              </li>
            </ul>
          </div>
        </div>
      </details>
    </div>
  );
}
