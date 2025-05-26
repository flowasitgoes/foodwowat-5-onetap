const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// commit hash 與版型名稱對應
const commits = [
  { hash: "fe9960e", name: "Studio-Alphonse" },
  { hash: "4285095", name: "Casa Lunara" },
  { hash: "e35bc33", name: "OH Architecture" },
  { hash: "6a575c8", name: "Interior Design" },
  { hash: "da8b365", name: "Nite Riot" },
  { hash: "0f9f6eb", name: "Qudrix" },
  { hash: "2680ed2", name: "Atlaslogie" },
  { hash: "2d9b31a", name: "Siena Film Foundation" },
  { hash: "ac3ba0b", name: "SoScale" },
  { hash: "6fd99a2", name: "Mirko Romanelli" },
  { hash: "ede1066", name: "Yellow Fellow" },
  { hash: "84f4cf9", name: "Showcase" },
  { hash: "4a5d8de", name: "Moonbase" },
  { hash: "135bb72", name: "Otherlife Labs" },
  { hash: "f33075d", name: "MOOOOR" },
  { hash: "c03e768", name: "Coinsetters" },
  { hash: "ad3cc04", name: "Cask Exchange" },
  { hash: "d574731", name: "Dropbox Brand Guidelines" },
  { hash: "7a8ff63", name: "UNCOMMON" }
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
// const timer = setInterval(switchCommit, 60 * 1000);
