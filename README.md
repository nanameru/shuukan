# シュウカン (Shuukan) 📝

日本人のための美しい習慣トラッキングWebアプリ

## 概要

シュウカンは、毎日の習慣を簡単に記録・分析できる日本発の習慣トラッキングアプリです。
海外で人気の[Habitify](https://habitify.me)にインスパイアされ、日本市場向けに完全ローカライズしました。

## 機能

- 📝 **習慣管理** - 習慣の作成・編集・削除
- ✅ **日次チェックイン** - ワンクリックで習慣を記録
- 🔥 **ストリーク追跡** - 連続達成日数を自動計算
- 📊 **統計ダッシュボード** - 週間/カテゴリ別グラフ
- 📋 **テンプレート** - おすすめ習慣セットをワンクリック追加
- 🌙 **レスポンシブ** - PC・スマホ対応

## 技術スタック

- **フロントエンド**: Next.js 15 (App Router) + TypeScript + Tailwind CSS
- **バックエンド/DB**: Convex
- **認証**: Clerk
- **チャート**: recharts
- **アイコン**: lucide-react
- **フォント**: Noto Sans JP

## セットアップ

```bash
# 依存パッケージインストール
npm install

# 環境変数設定（.env.localを作成）
cp .env.example .env.local
# NEXT_PUBLIC_CONVEX_URL, NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, CLERK_SECRET_KEY を設定

# Convexセットアップ
npx convex dev --once --configure=new

# 開発サーバー起動
npm run dev
```

## 環境変数

| 変数名 | 説明 |
|--------|------|
| `NEXT_PUBLIC_CONVEX_URL` | Convex デプロイメントURL |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk Publishable Key |
| `CLERK_SECRET_KEY` | Clerk Secret Key |

## ライセンス

MIT
