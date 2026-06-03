#!/bin/bash
# 通过 CloakBrowser CDP 获取网页 HTML
# 用法: bash fetch_url.sh <url>

CDP="http://10.13.3.8:9222"
URL="$1"

if [ -z "$URL" ]; then
    echo "用法: bash fetch_url.sh <url>"
    exit 1
fi

node -e "
const { chromium } = require('playwright-core');
(async () => {
    const browser = await chromium.connectOverCDP('${CDP}', { timeout: 15000 });
    const context = browser.contexts()[0] || await browser.newContext();
    const page = await context.newPage();
    await page.goto('${URL}', { waitUntil: 'networkidle', timeout: 30000 });
    for (let i = 0; i < 15; i++) {
        await page.waitForTimeout(1000);
        const t = await page.title();
        if (!t.includes('moment') && !t.includes('Cloudflare')) break;
    }
    console.log(await page.content());
    await page.close();
    await browser.close();
})().catch(e => { console.error(e.message); process.exit(1); });
"