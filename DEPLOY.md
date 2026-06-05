# FRP 内网穿透部署指南

## 架构

```
frpc 控制通道:  frpc → frp.域名.com:8443(WSS) → Nginx → frps:7000
外部访问:      外部 → 服务器IP:3005（直连 frp 远程端口）
管理面板:      浏览器 → 服务器IP:7500（直连）
```

> Nginx 仅用于将 8443 端口的 WSS 流量反代到 frps:7000。当frpc客户端连接 frps 时，会指定后者打开 3005 端口监听。外部通过 frps 远程端口（3005）直接访问 helper-api，Dashboard 通过 7500 端口直连。

## 文件清单

| 文件 | 用途 | 位置 |
|------|------|------|
| `frpc.toml` | frpc 客户端配置 | 项目根目录 |
| `frps/frps.toml` | frps 服务端配置 | 云服务器 `/data/frp/` |
| `frps/docker-compose.yml` | frps Docker 编排 | 云服务器 `/data/frp/` |
| `frps/nginx-frp.conf` | Nginx WSS 反代配置 | 云服务器 |

## 一、云服务器部署

### 1. 上传文件

```bash
mkdir -p /data/frp
scp frps/frps.toml frps/docker-compose.yml frps/nginx-frp.conf root@你的服务器IP:/data/frp/
```

### 2. 修改配置

```bash
cd /data/frp
vim frps.toml
# 必改项：
#   webServer.password = "改为你的强密码"
#   auth.token 保持与客户端 frpc.toml 中的一致
```

### 3. 启动 frps

```bash
docker-compose up -d
```

### 4. 配置 Nginx（WSS 反代）

```bash
cp nginx-frp.conf /etc/nginx/sites-available/frp.conf
vim /etc/nginx/sites-available/frp.conf
# 替换 server_name 为实际域名
# 替换 ssl_certificate / ssl_certificate_key 为实际证书路径

ln -s /etc/nginx/sites-available/frp.conf /etc/nginx/sites-enabled/
nginx -t && nginx -s reload
```

## 二、本地客户端部署

### 1. 修改 frpc.toml

```bash
vim frpc.toml
# serverAddr = "frp.你的域名.com" 改为实际域名
# auth.token 保持与服务端一致
```

### 2. 启动

```bash
docker-compose up -d
```

## 三、验证

```bash
# 1. 检查 frpc 是否连接成功
docker logs frpc
# 应看到 "login to server success"

# 2. 访问 Dashboard
# 浏览器打开 http://服务器IP:7500

# 3. 测试外部访问（通过 frp 远程端口直连）
curl "http://服务器IP:3005/fetch?url=https://example.com"
```
