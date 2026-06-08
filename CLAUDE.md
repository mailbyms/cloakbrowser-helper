# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

通过 CloakBrowser 隐身 Chromium 获取网页 HTML 内容的工具，支持命令行、API 服务和本地调试三种方式。

## 技术栈

- **运行时**: Node.js + Bash
- **依赖**: `cloakbrowser`（内置 Playwright + 隐身 Chromium 二进制）
- **特性**: C++ 源码级指纹伪装，自动通过 Cloudflare 等反机器人检测

## 使用

```bash
# 命令行方式
bash fetch_url.sh "https://example.com"

# API 服务方式（headless）
npm start
# 然后调用: GET http://localhost:3000/fetch?url=https://example.com

# 本地调试（弹出浏览器窗口）
npm run debug -- "https://example.com"
```

返回完整 HTML，自动处理 Cloudflare 验证等待。
