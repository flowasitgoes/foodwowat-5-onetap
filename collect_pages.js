const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

// 要处理的URL列表
const urls = [
    'https://www.one-tab.com/page/v8M8-eD1Trm5iv52FktJVg',
    'https://www.one-tab.com/page/c97ZUaoHSoiAHWXau3t9-w',
    'https://www.one-tab.com/page/vkhYva4lR_aengge9q7O0A',
    'https://www.one-tab.com/page/f6Gfae2qSxKuLhRZdBtYcg'
];

// 创建public-all目录
const publicAllDir = path.join(__dirname, 'public-all');
if (!fs.existsSync(publicAllDir)) {
    fs.mkdirSync(publicAllDir);
}

async function extractAndCopyPages() {
    try {
        const allPages = new Set(); // 使用Set来存储唯一的页面路径

        // 处理每个URL
        for (const url of urls) {
            const response = await axios.get(url);
            const $ = cheerio.load(response.data);
            
            // 提取所有链接
            $('a').each((index, element) => {
                const href = $(element).attr('href');
                const text = $(element).text().trim();
                if (href && href.startsWith('http')) {
                    // 从文本中提取第一个英文单词作为文件名
                    const firstWord = text.split(' ')[0].toLowerCase();
                    allPages.add(firstWord);
                }
            });
        }

        // 复制文件
        for (const pagePath of allPages) {
            // 检查所有可能的源目录
            const sourceDirs = ['public', 'public2', 'public3', 'public4'];
            let found = false;

            for (const dir of sourceDirs) {
                const sourceFile = path.join(__dirname, dir, `${pagePath}.html`);
                const targetFile = path.join(publicAllDir, `${pagePath}.html`);

                if (fs.existsSync(sourceFile)) {
                    fs.copyFileSync(sourceFile, targetFile);
                    console.log(`已复制: ${pagePath}.html (从 ${dir})`);
                    found = true;
                    break;
                }
            }

            if (!found) {
                console.log(`未找到源文件: ${pagePath}.html`);
            }
        }

        console.log(`总共处理了 ${allPages.size} 个页面`);
    } catch (error) {
        console.error('处理过程中发生错误：', error.message);
    }
}

// 执行收集和复制
extractAndCopyPages(); 