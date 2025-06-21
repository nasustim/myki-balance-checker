import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Myki残高チェッカー | NFC対応交通カード残高確認アプリ',
  description:
    'Web NFC技術を使用してMykiカードの残高と利用履歴をリアルタイムで確認。メルボルンの交通をもっと便利に。',
  keywords: [
    'Myki',
    'NFC',
    'Melbourne',
    'Transport',
    'Balance',
    'Card',
    'PWA',
    'Web NFC',
    'メルボルン',
    '交通カード',
    '残高確認',
  ],
  authors: [{ name: 'nasustim', url: 'https://github.com/nasustim' }],
  creator: 'nasustim',
  publisher: 'nasustim',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: 'https://myki-balance-checker.vercel.app',
    title: 'Myki残高チェッカー',
    description: 'Web NFC技術を使用してMykiカードの残高と利用履歴をリアルタイムで確認',
    siteName: 'Myki Balance Checker',
    images: [
      {
        url: '/icon-512x512.png',
        width: 512,
        height: 512,
        alt: 'Myki Balance Checker Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Myki残高チェッカー',
    description: 'Web NFC技術を使用してMykiカードの残高と利用履歴をリアルタイムで確認',
    images: ['/icon-512x512.png'],
    creator: '@nasustim',
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Myki残高チェッカー',
  },
  formatDetection: {
    telephone: false,
  },
  category: 'technology',
  classification: 'Transportation App',
  other: {
    'mobile-web-app-capable': 'yes',
    'application-name': 'Myki Balance Checker',
    'msapplication-TileColor': '#2563eb',
    'msapplication-config': '/browserconfig.xml',
    'theme-color': '#2563eb',
  },
};
