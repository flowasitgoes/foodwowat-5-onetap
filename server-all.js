const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3004; // 使用新的端口

// 设置静态文件目录
app.use(express.static(path.join(__dirname, 'public-all')));

// 动态路由处理
app.get('/:page', (req, res) => {
    const pageName = req.params.page;
    const filePath = path.join(__dirname, 'public-all', `${pageName}.html`);
    
    // 检查文件是否存在
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).send('页面未找到');
    }
});

// 默认路由重定向到index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public-all', 'index.html'));
});

// 启动服务器
app.listen(port, () => {
    console.log(`服务器运行在 http://localhost:${port}`);
}); 