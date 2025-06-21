# Myki残高チェッカー

NFCを使用してMykiカードから直接残高と利用履歴を読み取るWebアプリケーション

## 🚀 機能

- **NFC読み取り**: Web NFC APIを使用してMykiカードを直接読み取り
- **残高表示**: カードの現在残高をリアルタイム表示
- **利用履歴**: 最近の取引履歴を表示
- **オフライン対応**: PWA技術により、オフラインでも利用可能
- **レスポンシブ**: モバイルデバイスに最適化されたUI

## 📱 対応環境

- **Android デバイス** (NFC機能付き)
- **Chrome for Android** (バージョン89以降)
- **HTTPS接続** (セキュリティ要件)

## 🛠 技術スタック

- **Frontend**: Next.js 15 + React 19
- **スタイリング**: Tailwind CSS v4
- **型システム**: TypeScript 5
- **API**: Web NFC API
- **PWA**: Service Worker + Web App Manifest
- **デプロイ**: 静的サイト生成 (`next export`)

## 🔧 開発セットアップ

### 前提条件

- Node.js 20以降
- npm または yarn

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/your-username/myki-balance-checker.git
cd myki-balance-checker

# 依存関係をインストール
npm install
```

### 開発サーバー起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてアプリを確認できます。

### 静的サイト生成

```bash
# 本番ビルド
npm run build

# 静的サイト生成
npm run static
```

## 📋 使用方法

1. **デバイス準備**:
   - AndroidデバイスのNFC設定を有効にする
   - Chrome for Androidでアプリにアクセス
   - HTTPS接続が必要（本番環境）

2. **カード読み取り**:
   - 「カード読み取り開始」ボタンをタップ
   - Mykiカードをデバイスの背面に近づける
   - 読み取り完了まで待つ

3. **結果確認**:
   - 残高情報を確認
   - 利用履歴をチェック
   - デバッグ情報で詳細データを確認

## ⚠️ 開発状況

### 完了した機能
- ✅ Next.js + TypeScript セットアップ
- ✅ Web NFC API 統合
- ✅ NFCカード検出機能
- ✅ 基本UI/UXデザイン
- ✅ PWA対応
- ✅ 静的サイト生成設定
- ✅ レスポンシブデザイン

### 開発中の機能
- 🔄 Mykiカードデータ解析ロジック
- 🔄 実際の残高・履歴データ抽出
- 🔄 データ永続化（localStorage）
- 🔄 エラーハンドリングの改善

### 計画中の機能
- 📋 お気に入りカード管理
- 📋 残高少額時の通知機能
- 📋 データエクスポート機能
- 📋 複数カード対応

## 🔍 技術詳細

### NFCデータ解析

現在、アプリはNFCカードの基本的な検出のみ実装しています。実際のMykiカードデータ解析には以下が必要です：

- Mykiカードのデータ構造調査
- バイナリデータの解析ロジック
- 暗号化された部分の復号化（可能であれば）

### セキュリティ考慮事項

- Web NFC APIはHTTPS必須
- カード番号等の個人情報は一時的な保存のみ
- 読み取ったデータはブラウザローカルに保存
- 外部サーバーへのデータ送信なし

## 📄 ライセンス

このプロジェクトは教育目的で開発されています。

## 🤝 貢献

プルリクエストやイシューの報告を歓迎します。

## ⚡ コマンド一覧

```bash
# 開発サーバー起動
npm run dev

# 本番ビルド
npm run build

# 静的サイト生成
npm run static

# コードチェック
npm run check

# コードフォーマット
npm run format:fix

# Lint実行
npm run lint:fix
```

## 📞 サポート

問題が発生した場合は、GitHubのIssuesページで報告してください。
