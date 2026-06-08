/**
 * 本地调试模式 - 使用 CloakBrowser 启动隐身浏览器窗口
 * 用法: node debug_fetch.js <url>
 *
 * CloakBrowser 特性:
 *  - C++ 源码级指纹伪装，通过所有反机器人检测
 *  - headless: false 弹出真实浏览器窗口
 *  - humanize: true 模拟人类鼠标/键盘/滚动行为
 *  - 自动处理 Cloudflare 等验证
 */

const url = process.argv[2];
if (!url) {
    console.error('用法: node debug_fetch.js <url>');
    console.error('示例: node debug_fetch.js "https://example.com"');
    process.exit(1);
}

(async () => {
    const { launch } = await import('cloakbrowser');

    console.log('启动 CloakBrowser 隐身浏览器...');

    const browser = await launch({
        headless: false,       // 显示浏览器窗口，观察整个过程
        humanize: true,        // 模拟人类操作行为（鼠标曲线、打字节奏）
    });

    const page = await browser.newPage();

    console.log(`导航到: ${url}`);
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });

    // 等待 Cloudflare 验证（如有）
    console.log('检查 Cloudflare 验证...');
    for (let i = 0; i < 15; i++) {
        await new Promise(r => setTimeout(r, 1000));
        const title = await page.title();
        if (!title.includes('moment') && !title.includes('Cloudflare')) break;
    }

    const title = await page.title();
    const html = await page.content();

    console.log(`\n页面标题: ${title}`);
    console.log(`HTML 长度: ${html.length} 字符`);
    console.log('\n浏览器保持打开，可手动操作页面');
    console.log('按 Ctrl+C 关闭浏览器并退出');

    // 保持浏览器打开，等待用户手动关闭
    await new Promise(() => {});
})().catch(e => {
    console.error('错误:', e.message);
    process.exit(1);
});
