# POS Frontend

Next.js + TypeScript + Tailwind CSSベースのPOSセルフレジアプリ

## セットアップ

```bash
# パッケージインストール
npm install

# 環境変数設定
cp .env.local.example .env.local
# .env.localを編集してAPI URLを設定

# 開発サーバー起動
npm run dev
```

ブラウザで http://localhost:3000 にアクセス

## 本番ビルド

```bash
npm run build
npm run start
```

## 機能

- 商品コード検索
- カート管理（追加・数量変更・削除）
- 購入処理
- 合計金額表示
