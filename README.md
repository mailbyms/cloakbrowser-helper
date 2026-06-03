# CloakBrowser Helper

通过 CloakBrowser CDP 服务器获取网页内容的命令行工具。

## 安装

```bash
npm install
```

## 部署 CloakBrowser CDP 服务器

```bash
docker-compose up -d
```

服务器启动后监听 `localhost:9222`。

## 使用

```bash
bash fetch_url.sh "https://example.com"
```

输出目标页面的完整 HTML，自动处理 Cloudflare 等安全验证等待。

## 依赖

- Node.js
- [playwright-core](https://www.npmjs.com/package/playwright-core)
- 运行中的 CloakBrowser CDP 服务器（默认 `localhost:9222`）
