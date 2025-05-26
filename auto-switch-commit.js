const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 依照你提供的順序填入 commit hash
const commits = [
  "77d6b83", // show 1 cards
  "6202d66", // show 2 cards
  "42f416b", // show 3 cards
  "c2025de", // show 4 cards
  "0a278b9", // show 5 cards
  "b65f7b9", // show 6 cards
  "ad1505d", // show 7 cards
  "caebc4b", // show 8 cards
  "31825a4", // show 9 cards
  "ca41de1", // show 10 cards
  "b4eadce", // show 11 cards
  "df08a6b", // show 12 cards
  "1badb5f", // show 13 cards
  "8dc9b17", // show 14 cards
  "b75bedd", // show 15 cards
  "c32bb64", // show 16 cards
  "323fc17", // show 17 cards
  "5384c15", // show 18 cards
  "d397eeb"  // show 19 cards
];

const stateFile = path.join(__dirname, 'commit_state.json');
let state = { index: 0 };

if (fs.existsSync(stateFile)) {
  state = JSON.parse(fs.readFileSync(stateFile, 'utf-8'));
}

function switchCommit() {
  if (state.index < commits.length) {
    const commit = commits[state.index];
    execSync(`git checkout ${commit}`);
    console.log(`已切換到 commit: ${commit}`);
    state.index++;
    fs.writeFileSync(stateFile, JSON.stringify(state), 'utf-8');
  } else {
    console.log('已經切換到最後一個 commit，不再自動切換。');
    clearInterval(timer);
  }
}

// 立即切換一次
switchCommit();

// 每分鐘切換一次
const timer = setInterval(switchCommit, 60 * 1000); 