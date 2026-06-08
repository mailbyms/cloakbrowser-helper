const http = require('http');
const { URL } = require('url');

const PORT = process.env.PORT || 3000;

async function fetchPage(targetUrl) {
    const { launch } = await import('cloakbrowser');
    const browser = await launch({ headless: true });
    try {
        const page = await browser.newPage();
        await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 30000 });

        // 等待 Cloudflare 验证
        for (let i = 0; i < 15; i++) {
            await new Promise(r => setTimeout(r, 1000));
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
