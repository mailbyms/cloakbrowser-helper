# CloakBrowser Helper

通过 CloakBrowser CDP 服务器获取网页内容的工具，支持命令行和 API 服务两种方式。

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

## 外网访问（FRP 内网穿透）

项目集成了 frpc 客户端，可将本地服务通过 frps 服务器暴露到公网。

```bash
# 启动全部服务（含 frpc）
docker-compose up -d

# 查看 frpc 连接状态
docker logs -f frpc
```

### 配置

编辑 `frpc.toml`，修改服务器地址和认证 token：

```toml
serverAddr = "frp.你的域名.com"
serverPort = 8443
auth.token = "你的token"
```

### 服务端部署

服务端（frps）配置文件在 `frps/` 目录下，详见 [DEPLOY.md](./DEPLOY.md)。

### 架构

```
frpc 控制通道:  frpc → frp.域名.com:8443(WSS) → Nginx → frps:7000
外部访问:      外部 → 服务器IP:3005 → frps → frpc → helper-api:3000
管理面板:      浏览器 → 服务器IP:7500（直连）
```
