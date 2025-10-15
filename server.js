#!/usr/bin/env node

/**
 * Azure App Service用のNext.jsサーバー起動スクリプト
 */

const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

// 開発モードかどうか
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// ポート設定 - Azure App Service用に8080をデフォルトに
const port = process.env.PORT || 8080;

console.log('🚀 Starting POS Next.js server...');
console.log(`📦 Current directory: ${process.cwd()}`);
console.log(`🔌 Port: ${port}`);
console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
console.log(`📄 Files in current directory:`, require('fs').readdirSync('.').slice(0, 10));

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);

    // デバッグログ
    if (parsedUrl.pathname.startsWith('/api/')) {
      console.log(`🔗 API request: ${req.method} ${parsedUrl.pathname}`);
    }

    handle(req, res, parsedUrl);
  });

  server.listen(port, '0.0.0.0', (err) => {
    if (err) {
      console.error('❌ Server startup error:', err);
      throw err;
    }

    console.log('✅ Next.js server started successfully');
    console.log(`🌐 Server listening on http://0.0.0.0:${port}`);
  });
}).catch((err) => {
  console.error('❌ Next.js app preparation failed:', err);
  process.exit(1);
});
