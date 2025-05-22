const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function downloadPages() {
    try {
        // 读取extracted_links4.txt文件
        const content = fs.readFileSync('extracted_links4.txt', 'utf8');
        const lines = content.split('\n').filter(line => line.trim());
        
        // 确保public4目录存在
        const publicDir = path.join(__dirname, 'public4');
        if (!fs.existsSync(publicDir)) {
            fs.mkdirSync(publicDir);
        }

        // 处理每一对标题和URL
        for (let i = 0; i < lines.length; i += 2) {
            const title = lines[i].trim();
            const url = lines[i + 1].trim();
            
            if (!title || !url) continue;

            // 生成文件名（取第一个英文单词并转为小写）
            const firstWord = title.split(' ')[0].toLowerCase();
            const fileName = `${firstWord}.html`;
            
            try {
                // 下载页面内容
                const response = await axios.get(url);
                
                // 保存到文件
                const filePath = path.join(publicDir, fileName);
                fs.writeFileSync(filePath, response.data);
                
                console.log(`已下载 ${title} 到 ${fileName}`);
            } catch (error) {
                console.error(`下载 ${title} 时发生错误：`, error.message);
            }
        }
        
        console.log('所有页面下载完成！');
    } catch (error) {
        console.error('处理过程中发生错误：', error.message);
    }
}

// 执行下载
downloadPages(); 