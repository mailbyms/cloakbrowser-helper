# CloakBrowser Helper

通过 CloakBrowser CDP 服务器获取网页内容的工具。

## 快速开始（Docker 一键部署）

```bash
docker-compose up -d
```

启动后访问 `http://localhost:3000/fetch?url=https://example.com`

## 单独使用

### 安装依赖

```bash
npm install
```

### 命令行方式

```bash
bash fetch_url.sh "https://example.com"
```

### API 服务方式

```bash
npm start
```

服务启动后监听 `http://localhost:3000`，调用接口：

```bash
curl "http://localhost:3000/fetch?url=https://example.com"
```

## 环境变量

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `CDP_URL` | `http://10.13.3.8:9222` | CloakBrowser CDP 服务器地址 |
| `PORT` | `3000` | API 服务监听端口 |

## 依赖

- Node.js
- [playwright-core](https://www.npmjs.com/package/playwright-core)
- 运行中的 CloakBrowser CDP 服务器
