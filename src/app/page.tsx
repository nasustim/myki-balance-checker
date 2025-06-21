'use client';

import { useState } from 'react';
import { InfoCard, SuccessCard } from '@/components/composite/Card';
import MykiCard from '@/components/composite/MykiCard';
import NFCReader from '@/components/composite/NFCReader';
import StatusBadge from '@/components/composite/StatusBadge';
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
                <svg
                  className="h-8 w-8"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-label="NFC icon"
                >
                  <title>NFC</title>
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                </svg>
              </div>
              <div>
                <h1 className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text font-bold text-3xl text-transparent">
                  Myki残高チェッカー
                </h1>
                <p className="flex items-center gap-2 text-gray-600">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-label="Information"
                  >
                    <title>Information</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
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
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-label="Reset"
                  >
                    <title>Reset</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
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
                  <svg
                    className="h-5 w-5 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-label="Secure"
                  >
                    <title>Secure</title>
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  セキュア
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="h-5 w-5 text-blue-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-label="Fast"
                  >
                    <title>Fast</title>
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  高速
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="h-5 w-5 text-purple-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-label="Offline"
                  >
                    <title>Offline</title>
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
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
                    <svg
                      className="h-8 w-8 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-label="NFC Reading"
                    >
                      <title>NFC Reading</title>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
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
                    <svg
                      className="h-8 w-8 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-label="Data Analysis"
                    >
                      <title>Data Analysis</title>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
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
                    <svg
                      className="h-8 w-8 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-label="Privacy"
                    >
                      <title>Privacy</title>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
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
                    <svg
                      className="h-6 w-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-label="Step 1"
                    >
                      <title>Step 1</title>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
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
                        <svg
                          className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          aria-label="Success"
                        >
                          <title>Success</title>
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
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
                          <svg
                            className="h-4 w-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            aria-label="Device"
                          >
                            <title>Device</title>
                            <path
                              fillRule="evenodd"
                              d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z"
                              clipRule="evenodd"
                            />
                          </svg>
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
                          <svg
                            className="h-4 w-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            aria-label="Security"
                          >
                            <title>Security</title>
                            <path
                              fillRule="evenodd"
                              d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
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
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-label="NFC Footer"
                >
                  <title>NFC Footer</title>
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-800">Myki Balance Checker</p>
                <p className="text-gray-600 text-sm">Phase 3: UI/UX Development Complete</p>
              </div>
            </div>

            <div className="text-center text-gray-500 text-sm">
              <p>
                Created by{' '}
                <a
                  href="https://github.com/nasustim"
                  className="font-medium text-blue-500 transition-colors hover:text-blue-600"
                >
                  nasustim
                </a>{' '}
                with{' '}
                <a
                  className="font-medium text-blue-500 transition-colors hover:text-blue-600"
                  href="https://www.cursor.com/"
                >
                  Cursor
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
