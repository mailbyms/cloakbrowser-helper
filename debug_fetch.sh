#!/bin/bash
# 本地调试模式 - 使用 CloakBrowser 启动隐身浏览器窗口
# 用法: bash debug_fetch.sh <url>

URL="$1"

if [ -z "$URL" ]; then
    echo "用法: bash debug_fetch.sh <url>"
    echo "示例: bash debug_fetch.sh \"https://example.com\""
    exit 1
fi

node -e "
(async () => {
    const { launch } = await import('cloakbrowser');
    console.log('启动 CloakBrowser 隐身浏览器...');
    const browser = await launch({
        headless: false,
        humanize: true,
    });

    const page = await browser.newPage();
    console.log('导航到: ${URL}');
    await page.goto('${URL}', { waitUntil: 'networkidle', timeout: 60000 });

    console.log('检查 Cloudflare 验证...');
    for (let i = 0; i < 15; i++) {
        await new Promise(r => setTimeout(r, 1000));
        const t = await page.title();
        if (!t.includes('moment') && !t.includes('Cloudflare')) break;
    }

    console.log('页面标题:', await page.title());
    console.log('浏览器保持打开，按 Ctrl+C 退出');
    await new Promise(() => {});
})().catch(e => { console.error('错误:', e.message); process.exit(1); });
"
