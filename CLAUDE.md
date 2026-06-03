# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

通过 CloakBrowser CDP 服务器获取网页 HTML 内容的工具，支持命令行和 API 服务两种方式。

## 技术栈

- **运行时**: Node.js + Bash
- **依赖**: `playwright-core`
- **协议**: Chrome DevTools Protocol (CDP)
- **服务器镜像**: `registry.cn-shenzhen.aliyuncs.com/janeyre/cloakbrowser`

## 使用

```bash
# 部署 CDP 服务器
docker-compose up -d

# 命令行方式
bash fetch_url.sh "https://example.com"

# API 服务方式
npm start
# 然后调用: GET http://localhost:3000/fetch?url=https://example.com
```

返回完整 HTML，自动处理 Cloudflare 验证等待。
