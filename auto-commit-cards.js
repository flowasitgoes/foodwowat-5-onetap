const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const htmlPath = path.join(__dirname, 'public-all', 'index.html');
const original = fs.readFileSync(htmlPath, 'utf-8');
const lines = original.split('\n');

// 找到 grid template-works div 的起始行
const gridStart = lines.findIndex(line => line.includes('class="grid') && line.includes('template-works'));
if (gridStart === -1) {
    console.error('找不到 grid template-works div');
    process.exit(1);
}

// 先移除所有卡片的註解（只針對grid內部）
function removeAllCardComments(lines) {
    const newLines = [...lines];
    let inComment = false;
    for (let i = gridStart + 1; i < newLines.length; i++) {
        if (newLines[i].includes('<!--')) {
            inComment = true;
            newLines[i] = newLines[i].replace('<!--', '');
        }
        if (inComment && newLines[i].includes('-->')) {
            newLines[i] = newLines[i].replace('-->', '');
            inComment = false;
        }
    }
    return newLines;
}

// 找到所有 card 的起始和結束行
function getCardRanges(lines) {
    const cardRanges = [];
    let currentCardStart = -1;
    let divCount = 0;
    for (let i = gridStart + 1; i < lines.length; i++) {
        const line = lines[i];
        if (line.includes('<div class="card')) {
            currentCardStart = i;
            divCount = 1;
        } else if (line.includes('<div')) {
            divCount++;
        } else if (line.includes('</div>')) {
            divCount--;
            if (divCount === 0 && currentCardStart !== -1) {
                cardRanges.push([currentCardStart, i]);
                currentCardStart = -1;
            }
        }
    }
    return cardRanges;
}

for (let n = 1; n <= 19; n++) {
    let newLines = removeAllCardComments(lines);
    const cardRanges = getCardRanges(newLines);
    if (cardRanges.length !== 19) {
        console.error(`找到的卡片數量不正確：${cardRanges.length}，應該是19個`);
        process.exit(1);
    }
    // 註解掉第n+1到第19個卡片
    for (let i = n; i < 19; i++) {
        const [start, end] = cardRanges[i];
        newLines[start] = '<!-- ' + newLines[start];
        newLines[end] = newLines[end] + ' -->';
    }
    fs.writeFileSync(htmlPath, newLines.join('\n'), 'utf-8');
    execSync('git add public-all/index.html');
    execSync(`git commit -m "show ${n} cards"`);
    console.log(`已提交第 ${n} 個版本：顯示 ${n} 個卡片`);
}

// 恢復原始文件
fs.writeFileSync(htmlPath, original, 'utf-8');
console.log('完成所有提交，已恢復原始文件'); 