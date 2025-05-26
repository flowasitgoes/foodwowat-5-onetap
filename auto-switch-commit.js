const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// commit hash 與版型名稱對應
const commits = [
  { hash: "77d6b83", name: "Studio-Alphonse" },
  { hash: "6202d66", name: "Casa Lunara" },
  { hash: "42f416b", name: "OH Architecture" },
  { hash: "c2025de", name: "Interior Design" },
  { hash: "0a278b9", name: "Nite Riot" },
  { hash: "b65f7b9", name: "Qudrix" },
  { hash: "ad1505d", name: "Atlaslogie" },
  { hash: "caebc4b", name: "Siena Film Foundation" },
  { hash: "31825a4", name: "SoScale" },
  { hash: "ca41de1", name: "Mirko Romanelli" },
  { hash: "b4eadce", name: "Yellow Fellow" },
  { hash: "df08a6b", name: "Showcase" },
  { hash: "1badb5f", name: "Moonbase" },
  { hash: "8dc9b17", name: "Otherlife Labs" },
  { hash: "b75bedd", name: "MOOOOR" },
  { hash: "c32bb64", name: "Coinsetters" },
  { hash: "323fc17", name: "Cask Exchange" },
  { hash: "5384c15", name: "Dropbox Brand Guidelines" },
  { hash: "d397eeb", name: "UNCOMMON" }
];

const stateFile = path.join(__dirname, 'commit_state.json');
const recordFile = path.join(__dirname, 'records-of-switch-commits.txt');
let state = { index: 0 };

if (fs.existsSync(stateFile)) {
  state = JSON.parse(fs.readFileSync(stateFile, 'utf-8'));
}

function getToday() {
  const d = new Date();
  return `${(d.getMonth()+1).toString().padStart(2, '0')}/${d.getDate().toString().padStart(2, '0')}/${d.getFullYear()}`;
}

function writeRecord(index, name) {
  const record = `\n第${index+1}次切換:\n${getToday()}\nFWA - 版型開發 - Templates Collection\n版型${index+1} - ${name}\n#視覺設計  #Branding #UI原型設計 #前後端工程整合\n`;
  fs.appendFileSync(recordFile, record, 'utf-8');
}

function switchCommit() {
  if (state.index < commits.length) {
    const { hash, name } = commits[state.index];
    execSync(`git checkout ${hash}`);
    writeRecord(state.index, name);
    console.log(`已切換到 commit: ${hash}，已寫入紀錄`);
    state.index++;
    fs.writeFileSync(stateFile, JSON.stringify(state), 'utf-8');
  } else {
    console.log('已經切換到最後一個 commit，不再自動切換。');
    clearInterval(timer);
  }
}

// 立即切換一次
switchCommit();

// 每天切換一次（24小時 = 86400000 毫秒）
const timer = setInterval(switchCommit, 24 * 60 * 60 * 1000); 