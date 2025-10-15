#!/bin/bash

# Azure App Service用スタートアップスクリプト
echo "Starting Next.js application..."

# 環境変数を設定
export NEXT_PUBLIC_API_URL=https://app-002-gen10-step3-1-py-oshima19.azurewebsites.net

# Next.jsサーバーを起動
npm run start
