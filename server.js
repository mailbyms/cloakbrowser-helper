const http = require('http');
const { URL } = require('url');
const { chromium } = require('playwright-core');

const CDP = process.env.CDP_URL || 'http://10.13.3.8:9222';
const PORT = process.env.PORT || 3000;

async function fetchPage(targetUrl) {
    const browser = await chromium.connectOverCDP(CDP, { timeout: 15000 });
    try {
        const context = browser.contexts()[0] || await browser.newContext();
        const page = await context.newPage();
        await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 30000 });

        // 等待 Cloudflare 验证
        for (let i = 0; i < 15; i++) {
            await page.waitForTimeout(1000);
            const title = await page.title();
            if (!title.includes('moment') && !title.includes('Cloudflare')) break;
        }

        const html = await page.content();
        await page.close();
        return html;
    } finally {
        await browser.close();
    }
}

const server = http.createServer(async (req, res) => {
    const parsed = new URL(req.url, `http://localhost:${PORT}`);

    if (parsed.pathname !== '/fetch') {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not Found' }));
        return;
    }

    const targetUrl = parsed.searchParams.get('url');
    if (!targetUrl) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: '缺少 url 参数' }));
        return;
    }

    try {
        const html = await fetchPage(targetUrl);
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(html);
    } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
    }
});

server.listen(PORT, () => {
    console.log(`CloakBrowser Helper API 运行于 http://localhost:${PORT}`);
    console.log(`用法: GET /fetch?url=https://example.com`);
});
