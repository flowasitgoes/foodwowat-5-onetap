const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const htmlPath = path.join(__dirname, 'public-all', 'index.html');
const original = fs.readFileSync(htmlPath, 'utf-8');
const lines = original.split('\n');

// 找到 .template-works grid 的起止行
const gridStart = lines.findIndex(line => line.includes('<div class="grid') && line.includes('template-works'));
let gridEnd = gridStart;
let openDivs = 0;
for (let i = gridStart; i < lines.length; i++) {
    if (lines[i].includes('<div')) openDivs++;
    if (lines[i].includes('</div>')) openDivs--;
    if (openDivs === 0 && i > gridStart) {
        gridEnd = i;
        break;
    }
}

// 找到所有卡片的起止行号
let cardRanges = [];
for (let i = gridStart + 1; i < gridEnd; i++) {
    if (lines[i].includes('<div class="card')) {
        let start = i;
        let depth = 0;
        for (let j = i; j <= gridEnd; j++) {
            if (lines[j].includes('<div')) depth++;
            if (lines[j].includes('</div>')) depth--;
            if (depth === 0) {
                cardRanges.push([start, j]);
                i = j;
                break;
            }
        }
    }
}

if (cardRanges.length !== 19) {
    console.error('卡片数量不是19，实际为：', cardRanges.length);
    process.exit(1);
}

// 依次生成commit
for (let n = 1; n <= 19; n++) {
    let newLines = [...lines];
    // 注释掉第n+1到第19个卡片
    for (let i = n; i < 19; i++) {
        const [start, end] = cardRanges[i];
        newLines[start] = '<!-- ' + newLines[start];
        newLines[end] = newLines[end] + ' -->';
    }
    fs.writeFileSync(htmlPath, newLines.join('\n'), 'utf-8');
    execSync('git add public-all/index.html');
    execSync(`git commit -m "show ${n} cards"`);
    console.log(`Committed: show ${n} cards`);
}
// 恢复原始文件
fs.writeFileSync(htmlPath, original, 'utf-8');
console.log('全部完成，index.html已还原'); 