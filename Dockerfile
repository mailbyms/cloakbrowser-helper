FROM node:20-slim

WORKDIR /app

# 安装 Chromium 系统依赖
RUN npx playwright install-deps chromium

COPY package.json package-lock.json* ./
RUN npm install --production && npx cloakbrowser install

COPY server.js fetch_url.sh ./

EXPOSE 3000

CMD ["node", "server.js"]
