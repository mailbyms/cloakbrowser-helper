#!/bin/bash
# 通过 CloakBrowser 获取网页 HTML
# 用法: bash fetch_url.sh <url>

URL="$1"

if [ -z "$URL" ]; then
    echo "用法: bash fetch_url.sh <url>"
    exit 1
fi

node -e "
(async () => {
    const { launch } = await import('cloakbrowser');
    const browser = await launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('${URL}', { waitUntil: 'networkidle', timeout: 30000 });
    for (let i = 0; i < 15; i++) {
        await new Promise(r => setTimeout(r, 1000));
        const t = await page.title();
        if (!t.includes('moment') && !t.includes('Cloudflare')) break;
    }
    console.log(await page.content());
    await page.close();
    await browser.close();
})().catch(e => { console.error(e.message); process.exit(1); });
"
