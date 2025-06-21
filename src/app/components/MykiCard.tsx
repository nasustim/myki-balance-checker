'use client';

import { MykiCardData } from '@/features/nfc';

interface MykiCardProps {
  cardData: MykiCardData | null;
  error: string | null;
}

export default function MykiCard({ cardData, error }: MykiCardProps) {
  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-lg font-semibold text-red-800 mb-2">
          エラーが発生しました
        </h3>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!cardData) {
    return (
      <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg text-center">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z" clipRule="evenodd" />
          </svg>
        </div>
        <p className="text-gray-500">カード情報がありません</p>
        <p className="text-sm text-gray-400 mt-2">
          上記のカード読み取り機能を使用してMykiカードをスキャンしてください
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Card Overview */}
      <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Mykiカード</h2>
          <div className="text-right">
            <p className="text-sm opacity-90">カード番号</p>
            <p className="font-mono text-lg">
              {cardData.cardNumber || 'N/A'}
            </p>
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-sm opacity-90">現在の残高</p>
          <p className="text-4xl font-bold">
            ${cardData.balance?.toFixed(2) || '0.00'}
          </p>
        </div>
      </div>

      {/* Last Transaction */}
      {cardData.lastTransaction && (
        <div className="bg-white p-6 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            最新の取引
          </h3>
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium text-gray-900">
                {cardData.lastTransaction.type === 'debit' ? '支払い' : 'チャージ'}
              </p>
              <p className="text-sm text-gray-500">
                {cardData.lastTransaction.location || '場所不明'}
              </p>
              <p className="text-sm text-gray-500">
                {cardData.lastTransaction.date.toLocaleDateString('ja-JP')}
              </p>
            </div>
            <div className={`text-right font-semibold ${
              cardData.lastTransaction.type === 'debit' 
                ? 'text-red-600' 
                : 'text-green-600'
            }`}>
              {cardData.lastTransaction.type === 'debit' ? '-' : '+'}
              ${cardData.lastTransaction.amount.toFixed(2)}
            </div>
          </div>
        </div>
      )}

      {/* Transaction History */}
      {cardData.transactions && cardData.transactions.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">
              利用履歴
            </h3>
          </div>
          <div className="divide-y divide-gray-200">
            {cardData.transactions.slice(0, 10).map((transaction, index) => (
              <div key={index} className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900">
                    {transaction.type === 'debit' ? '支払い' : 'チャージ'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {transaction.location || '場所不明'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {transaction.date.toLocaleDateString('ja-JP')} {transaction.date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className={`font-semibold ${
                  transaction.type === 'debit' 
                    ? 'text-red-600' 
                    : 'text-green-600'
                }`}>
                  {transaction.type === 'debit' ? '-' : '+'}
                  ${transaction.amount.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          {cardData.transactions.length > 10 && (
            <div className="p-4 text-center text-sm text-gray-500 border-t border-gray-200">
              {cardData.transactions.length - 10}件の履歴が省略されています
            </div>
          )}
        </div>
      )}

      {/* Debug Information */}
      <details className="bg-gray-50 border border-gray-200 rounded-lg">
        <summary className="p-4 cursor-pointer text-sm font-medium text-gray-700">
          デバッグ情報
        </summary>
        <div className="p-4 border-t border-gray-200">
          <pre className="text-xs text-gray-600 overflow-auto">
            {JSON.stringify(cardData, null, 2)}
          </pre>
        </div>
      </details>
    </div>
  );
} 