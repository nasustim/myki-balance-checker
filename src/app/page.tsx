'use client';

import Link from 'next/link';
import { useState } from 'react';
import { InfoCard, SuccessCard } from '@/components/composite/Card';
import MykiCard from '@/components/composite/MykiCard';
import NFCReader from '@/components/composite/NFCReader';
import StatusBadge from '@/components/composite/StatusBadge';
import {
  ChartIcon,
  CheckmarkIcon,
  DeviceIcon,
  InformationIcon,
  LockIcon,
  MobileDeviceIcon,
  NFCIcon,
  ResetIcon,
  ShieldIcon,
} from '@/components/ui/icons';
import type { MykiCardData } from '@/feature/myki';

export default function Home() {
  const [cardData, setCardData] = useState<MykiCardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleCardRead = (data: MykiCardData) => {
    setCardData(data);
    setError(null);
    setIsSuccess(true);

    // Reset success animation after delay
    setTimeout(() => setIsSuccess(false), 2000);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setCardData(null);
    setIsSuccess(false);
  };

  const clearData = () => {
    setCardData(null);
    setError(null);
    setIsSuccess(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="sticky top-0 z-50 border-white/20 border-b bg-white/80 shadow-sm backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex animate-slide-in-right items-center gap-4">
              <div className="rounded-xl bg-gradient-to-br from-blue-500 to-green-500 p-3 text-white shadow-lg">
                <NFCIcon className="h-8 w-8" />
              </div>
              <div>
                <h1 className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text font-bold text-3xl text-transparent">
                  Myki残高チェッカー
                </h1>
                <p className="flex items-center gap-2 text-gray-600">
                  <InformationIcon className="h-4 w-4" />
                  NFCを使用してMykiカードの残高を確認
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {isSuccess && (
                <StatusBadge status="success" animated>
                  読み取り成功！
                </StatusBadge>
              )}
              {cardData && (
                <button
                  type="button"
                  onClick={clearData}
                  className="focus-ring flex items-center gap-2 rounded-lg bg-gray-500 px-4 py-2 font-medium text-white transition-all-smooth hover:scale-105 hover:bg-gray-600"
                >
                  <ResetIcon className="h-4 w-4" />
                  リセット
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="space-y-8">
          {/* Hero Section */}
          <section className="animate-fade-in-up py-8 text-center">
            <div className="mx-auto max-w-3xl">
              <h2 className="mb-4 font-bold text-4xl text-gray-900">
                メルボルンの交通をもっと便利に
              </h2>
              <p className="mb-6 text-gray-600 text-xl">
                Web NFC技術を使用してMykiカードの残高と利用履歴をリアルタイムで確認できます
              </p>
              <div className="flex items-center justify-center gap-6 text-gray-500 text-sm">
                <div className="flex items-center gap-2">
                  <CheckmarkIcon
                    className="h-5 w-5 text-green-500"
                    aria-label="Secure"
                    title="Secure"
                  />
                  セキュア
                </div>
                <div className="flex items-center gap-2">
                  <CheckmarkIcon className="h-5 w-5 text-blue-500" aria-label="Fast" title="Fast" />
                  高速
                </div>
                <div className="flex items-center gap-2">
                  <CheckmarkIcon
                    className="h-5 w-5 text-purple-500"
                    aria-label="Offline"
                    title="Offline"
                  />
                  オフライン対応
                </div>
              </div>
            </div>
          </section>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
            {/* NFC Reader Section */}
            <section className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="mb-4">
                <h3 className="mb-2 flex items-center gap-2 font-semibold text-2xl text-gray-900">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 font-bold text-sm text-white">
                    1
                  </span>
                  カード読み取り
                </h3>
                <p className="text-gray-600">Mykiカードをデバイスに近づけて情報を取得</p>
              </div>
              <NFCReader onCardRead={handleCardRead} onError={handleError} />
            </section>

            {/* Card Data Section */}
            <section className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="mb-4">
                <h3 className="mb-2 flex items-center gap-2 font-semibold text-2xl text-gray-900">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 font-bold text-sm text-white">
                    2
                  </span>
                  カード情報
                </h3>
                <p className="text-gray-600">読み取ったカードの残高と利用履歴を表示</p>
              </div>
              <MykiCard cardData={cardData} error={error} />
            </section>
          </div>

          {/* Features Section */}
          <section className="animate-fade-in-up py-12" style={{ animationDelay: '0.3s' }}>
            <div className="mb-12 text-center">
              <h2 className="mb-4 font-bold text-3xl text-gray-900">主な機能</h2>
              <p className="mx-auto max-w-2xl text-gray-600">
                最新のWeb技術を使用して、Mykiカードの情報を安全かつ高速に取得します
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <InfoCard hover className="text-center">
                <div className="p-4">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                    <MobileDeviceIcon
                      className="h-8 w-8 text-blue-600"
                      aria-label="NFC Reading"
                      title="NFC Reading"
                    />
                  </div>
                  <h3 className="mb-2 font-semibold text-gray-900 text-lg">NFC読み取り</h3>
                  <p className="text-gray-600 text-sm">
                    Web NFC APIを使用してカード情報を直接読み取り
                  </p>
                </div>
              </InfoCard>

              <InfoCard hover className="text-center">
                <div className="p-4">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                    <ChartIcon
                      className="h-8 w-8 text-green-600"
                      aria-label="Data Analysis"
                      title="Data Analysis"
                    />
                  </div>
                  <h3 className="mb-2 font-semibold text-gray-900 text-lg">データ解析</h3>
                  <p className="text-gray-600 text-sm">
                    高度なアルゴリズムでカードデータを解析し残高を推定
                  </p>
                </div>
              </InfoCard>

              <InfoCard hover className="text-center">
                <div className="p-4">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
                    <LockIcon
                      className="h-8 w-8 text-purple-600"
                      aria-label="Privacy"
                      title="Privacy"
                    />
                  </div>
                  <h3 className="mb-2 font-semibold text-gray-900 text-lg">プライバシー</h3>
                  <p className="text-gray-600 text-sm">
                    すべての処理はローカルで実行、データは外部送信されません
                  </p>
                </div>
              </InfoCard>
            </div>
          </section>

          {/* Information Section */}
          <section className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <InfoCard>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 rounded-full bg-blue-100 p-3">
                    <MobileDeviceIcon
                      className="h-6 w-6 text-blue-600"
                      aria-label="Step 1"
                      title="Step 1"
                    />
                  </div>
                  <div className="flex-1">
                    <h2 className="mb-3 font-semibold text-gray-800 text-xl">アプリについて</h2>
                    <p className="mb-4 text-gray-600">
                      このアプリはWeb NFC APIを使用してMykiカードから直接データを読み取り、
                      残高と利用履歴を表示します。すべての処理はブラウザ内で完結し、
                      カード情報が外部に送信されることはありません。
                    </p>

                    <SuccessCard className="mb-6">
                      <div className="flex items-start gap-3">
                        <CheckmarkIcon
                          className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600"
                          aria-label="Success"
                          title="Success"
                        />
                        <div>
                          <h3 className="mb-2 font-semibold text-green-800">
                            🏗️ Phase 3: UI/UX開発完了
                          </h3>
                          <ul className="space-y-1 text-green-700 text-sm">
                            <li>• 美しいアニメーションとトランジション</li>
                            <li>• 再利用可能なUIコンポーネント</li>
                            <li>• レスポンシブデザインの改善</li>
                            <li>• アクセシビリティの向上</li>
                            <li>• モダンなビジュアルデザイン</li>
                          </ul>
                        </div>
                      </div>
                    </SuccessCard>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div>
                        <h3 className="mb-3 flex items-center gap-2 font-semibold text-gray-800">
                          <DeviceIcon className="h-4 w-4" aria-label="Device" title="Device" />
                          対応デバイス
                        </h3>
                        <ul className="space-y-2 text-gray-600 text-sm">
                          <li className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                            Android デバイス（NFC機能付き）
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                            Chrome for Android（バージョン89以降）
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                            HTTPS接続（セキュリティ要件）
                          </li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="mb-3 flex items-center gap-2 font-semibold text-gray-800">
                          <ShieldIcon className="h-4 w-4" aria-label="Security" title="Security" />
                          セキュリティ要求
                        </h3>
                        <p className="text-gray-600 text-sm">
                          セキュリティのために、NFC通信はHTTPS接続を使用します。
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </InfoCard>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-white/20 border-t bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-gradient-to-br from-blue-500 to-green-500 p-2 text-white">
                <NFCIcon className="h-5 w-5" aria-label="NFC Footer" title="NFC Footer" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">Myki Balance Checker</p>
                <p className="text-gray-600 text-sm">Phase 3: UI/UX Development Complete</p>
              </div>
            </div>

            <div className="text-center text-gray-500 text-sm">
              <p>
                Created by{' '}
                <Link
                  href="https://github.com/nasustim"
                  className="font-medium text-blue-500 transition-colors hover:text-blue-600"
                >
                  nasustim
                </Link>{' '}
                with{' '}
                <Link
                  className="font-medium text-blue-500 transition-colors hover:text-blue-600"
                  href="https://www.cursor.com/"
                >
                  Cursor
                </Link>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
