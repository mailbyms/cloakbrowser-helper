# 阶段一：下载并解压 CloakBrowser 二进制
FROM node:20-slim AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --production

# 下载隐身 Chromium（压缩包 + 解压后的文件都在此阶段）
RUN npx cloakbrowser install

# 阶段二：运行时镜像（不包含压缩包，体积更小）
FROM node:20-slim

WORKDIR /app

# 安装 Chromium 运行时系统依赖
RUN npx playwright install-deps chromium

# 从阶段一复制应用和 CloakBrowser 二进制
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /root/.cloakbrowser /root/.cloakbrowser
COPY server.js fetch_url.sh ./

EXPOSE 3000

CMD ["node", "server.js"]
