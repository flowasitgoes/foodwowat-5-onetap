const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

async function extractLinks() {
    try {
        // 发送GET请求获取页面内容
        const response = await axios.get('https://www.one-tab.com/page/BYyanFY0SVunXdPKTCMVvA');
        
        // 使用cheerio加载HTML内容
        const $ = cheerio.load(response.data);
        
        // 提取所有链接
        const links = [];
        $('a').each((index, element) => {
            const href = $(element).attr('href');
            const text = $(element).text().trim();
            if (href && href.startsWith('http')) {
                links.push(`${text}\n${href}\n`);
            }
        });

        // 将链接写入文件
        fs.writeFileSync('extracted_links.txt', links.join('\n'), 'utf8');
        
        console.log('链接已成功提取并保存到 extracted_links.txt');
        console.log(`共提取了 ${links.length} 个链接`);
    } catch (error) {
        console.error('提取过程中发生错误：', error.message);
    }
}

// 执行提取
extractLinks(); 