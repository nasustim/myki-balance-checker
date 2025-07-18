'use client';

import {
  CashIcon,
  CreditCardIcon,
  DocumentTextIcon,
  InformationCircleIcon,
  XCircleIcon,
} from '@/components/ui/icons';
import type { MykiCardData } from '@/feature/myki';
import { ErrorCard, InfoCard } from './Card';

interface MykiCardProps {
  cardData: MykiCardData | null;
  error: string | null;
}

export default function MykiCard({ cardData, error }: MykiCardProps) {
  if (error) {
    return (
      <ErrorCard className="animate-fade-in-up">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 rounded-full bg-red-100 p-2">
            <XCircleIcon className="h-5 w-5 text-red-600" aria-label="Error icon" title="Error" />
          </div>
          <div>
            <h3 className="mb-1 font-semibold text-red-800">エラーが発生しました</h3>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </div>
      </ErrorCard>
    );
  }

  if (!cardData) {
    return (
      <InfoCard className="animate-fade-in-up text-center">
        <div className="py-12">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
            <CreditCardIcon
              className="h-10 w-10 text-gray-400"
              aria-label="Card placeholder"
              title="Card Placeholder"
            />
          </div>
          <h3 className="mb-2 font-medium text-gray-600 text-lg">カード情報</h3>
          <p className="text-gray-500 text-sm">
            NFCリーダーでMykiカードを読み取ると、
            <br />
            ここに残高と利用履歴が表示されます
          </p>
        </div>
      </InfoCard>
    );
  }

  return (
    <div className="animate-fade-in-up space-y-6">
      {/* Balance Card */}
      <BalanceCard cardData={cardData} />

      {/* Transaction History */}
      <TransactionHistory cardData={cardData} />

      {/* Debug Information */}
      <DebugInfo cardData={cardData} />
    </div>
  );
}

function BalanceCard({ cardData }: { cardData: MykiCardData }) {
  return (
    <div className="rounded-xl bg-gradient-to-br from-blue-600 to-green-600 p-6 text-white shadow-xl">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
            <CreditCardIcon className="h-6 w-6" aria-label="Myki card" title="Myki Card" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Myki Card</h3>
            <p className="text-sm text-white/80">残高情報</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-white/80">Card Number</p>
          <p className="font-mono text-sm">{cardData.cardNumber || 'Unknown'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <BalanceItem label="推定残高" value={cardData.balance || 0} unit="AUD" />
        <BalanceItem
          label="最終更新"
          value={cardData.lastTransaction?.date.toLocaleDateString('ja-JP') || '不明'}
          unit=""
        />
      </div>
    </div>
  );
}

function BalanceItem({
  label,
  value,
  unit,
}: {
  label: string;
  value: number | string;
  unit: string;
}) {
  return (
    <div className="rounded-lg bg-white/10 p-4">
      <p className="mb-1 text-sm text-white/80">{label}</p>
      <div className="flex items-baseline gap-2">
        <span className="font-bold text-2xl">
          {typeof value === 'number' ? `$${value.toFixed(2)}` : value}
        </span>
        {unit && <span className="text-sm text-white/80">{unit}</span>}
      </div>
    </div>
  );
}

function TransactionHistory({ cardData }: { cardData: MykiCardData }) {
  if (!cardData.transactions || cardData.transactions.length === 0) {
    return (
      <InfoCard>
        <div className="py-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <DocumentTextIcon
              className="h-8 w-8 text-gray-400"
              aria-label="No transactions"
              title="No Transactions"
            />
          </div>
          <h3 className="mb-2 font-medium text-gray-600 text-lg">取引履歴</h3>
          <p className="text-gray-500 text-sm">取引履歴が見つかりませんでした</p>
        </div>
      </InfoCard>
    );
  }

  return (
    <InfoCard>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <DocumentTextIcon
            className="h-5 w-5 text-blue-600"
            aria-label="Transaction history"
            title="Transaction History"
          />
          <h3 className="font-semibold text-gray-800 text-lg">取引履歴</h3>
          <span className="rounded-full bg-blue-100 px-2 py-1 font-medium text-blue-800 text-xs">
            {cardData.transactions.length}件
          </span>
        </div>

        <div className="space-y-3">
          {cardData.transactions.map((transaction, index) => (
            <TransactionItem
              key={`transaction-${transaction.date.getTime()}-${index}`}
              transaction={transaction}
            />
          ))}
        </div>
      </div>
    </InfoCard>
  );
}

function TransactionItem({
  transaction,
}: {
  transaction: {
    date: Date;
    amount: number;
    type: 'debit' | 'credit';
    location?: string;
  };
}) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full ${
            transaction.type === 'debit' ? 'bg-red-100' : 'bg-green-100'
          }`}
        >
          <CashIcon
            className={`h-4 w-4 ${
              transaction.type === 'debit' ? 'text-red-600' : 'text-green-600'
            }`}
            aria-label="Transaction"
            title="Transaction"
          />
        </div>
        <div>
          <p className="font-medium text-gray-800">
            {transaction.type === 'debit' ? '支払い' : 'チャージ'}
          </p>
          <p className="text-gray-500 text-sm">
            {transaction.date.toLocaleDateString('ja-JP')}{' '}
            {transaction.date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p
          className={`font-semibold text-lg ${
            transaction.type === 'debit' ? 'text-red-600' : 'text-green-600'
          }`}
        >
          {transaction.type === 'debit' ? '-' : '+'}${transaction.amount.toFixed(2)}
        </p>
        <p className="text-gray-500 text-sm">{transaction.location || '場所不明'}</p>
      </div>
    </div>
  );
}

function DebugInfo({ cardData }: { cardData: MykiCardData }) {
  return (
    <InfoCard>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <InformationCircleIcon
            className="h-5 w-5 text-gray-600"
            aria-label="Debug information"
            title="Debug Information"
          />
          <h3 className="font-semibold text-gray-800 text-lg">デバッグ情報</h3>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <DebugItem label="カード番号" value={cardData.cardNumber || 'N/A'} />
          <DebugItem
            label="残高"
            value={cardData.balance ? `$${cardData.balance.toFixed(2)}` : 'N/A'}
          />
          <DebugItem label="取引数" value={`${cardData.transactions?.length || 0}`} />
          <DebugItem label="読み取り時刻" value={new Date().toLocaleString('ja-JP')} />
        </div>

        <div className="mt-4">
          <h4 className="mb-2 font-medium text-gray-700">カードデータ (JSON)</h4>
          <div className="overflow-x-auto rounded-lg bg-gray-900 p-3 font-mono text-green-400 text-xs">
            <pre>{JSON.stringify(cardData, null, 2)}</pre>
          </div>
        </div>
      </div>
    </InfoCard>
  );
}

function DebugItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-gray-50 p-3">
      <p className="mb-1 text-gray-600 text-sm">{label}</p>
      <p className="font-mono text-gray-800 text-sm">{value}</p>
    </div>
  );
}
