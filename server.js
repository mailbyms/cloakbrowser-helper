const http = require('http');
const { URL } = require('url');

const PORT = process.env.PORT || 3000;

const ts = () => new Date().toLocaleString('sv-SE', { hour12: false });
const log = (msg) => console.log(`[${ts()}] ${msg}`);
const logError = (msg) => console.error(`[${ts()}] ${msg}`);

async function fetchPage(targetUrl) {
    const startTime = Date.now();
    log(`开始请求: ${targetUrl}`);

    const { launch } = await import('cloakbrowser');
    log('启动 CloakBrowser...');

    const browser = await launch({ headless: true });
    log('CloakBrowser 已启动');

    try {
        const page = await browser.newPage();
        log('新页面已创建');

        log(`正在导航到: ${targetUrl}`);
        await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 30000 });
        log('页面导航完成');

        // 等待 Cloudflare 验证
        log('检查 Cloudflare 验证...');
        for (let i = 0; i < 15; i++) {
            await new Promise(r => setTimeout(r, 1000));
            const title = await page.title();
            log(`第 ${i + 1} 次检查, 标题: ${title}`);
            if (!title.includes('moment') && !title.includes('Cloudflare')) break;
        }

        const title = await page.title();
        const html = await page.content();
        const elapsed = Date.now() - startTime;

        log('获取完成');
        log(`  标题: ${title}`);
        log(`  HTML 长度: ${html.length} 字符`);
        log(`  耗时: ${elapsed}ms`);

        await page.close();
        log('页面已关闭');
        return html;
    } finally {
        await browser.close();
        log('浏览器已关闭');
    }
}

const server = http.createServer(async (req, res) => {
    const reqStart = Date.now();
    const parsed = new URL(req.url, `http://localhost:${PORT}`);

    log(`收到请求: ${req.method} ${req.url}`);

    if (parsed.pathname !== '/fetch') {
        log(`404 - 路径不存在: ${parsed.pathname}`);
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not Found' }));
        return;
    }

    const targetUrl = parsed.searchParams.get('url');
    if (!targetUrl) {
        log('400 - 缺少 url 参数');
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: '缺少 url 参数' }));
        return;
    }

    try {
        log(`开始处理: ${targetUrl}`);
        const html = await fetchPage(targetUrl);
        const elapsed = Date.now() - reqStart;
        log(`响应完成, 总耗时: ${elapsed}ms, 返回 ${html.length} 字符`);
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(html);
    } catch (err) {
        const elapsed = Date.now() - reqStart;
        logError(`请求失败, 耗时: ${elapsed}ms`);
        logError(`  错误: ${err.message}`);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
    }
});

server.listen(PORT, () => {
    log(`CloakBrowser Helper API 运行于 http://localhost:${PORT}`);
    log('用法: GET /fetch?url=https://example.com');
});
