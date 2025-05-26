const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 最新的19個 commit hash，依照你剛剛的GitHub畫面順序
const commits = [
  "8e6e33e", // show 1 cards
  "84e46b9", // show 2 cards
  "a0e43c3", // show 3 cards
  "c078017", // show 4 cards
  "7a7c392", // show 5 cards
  "9217a94", // show 6 cards
  "fe72cfb", // show 7 cards
  "28e50ed", // show 8 cards
  "4d34b76", // show 9 cards
  "1cf749a", // show 10 cards
  "79fc6af", // show 11 cards
  "a947afd", // show 12 cards
  "bca0554", // show 13 cards
  "a3d66cf", // show 14 cards
  "218eb7b", // show 15 cards
  "a126f93", // show 16 cards
  "78841bb", // show 17 cards
  "2f9c774", // show 18 cards
  "9ce5eef"  // show 19 cards
];

const stateFile = path.join(__dirname, 'commit_state.json');
// 每次測試前自動重置 commit_state.json
if (fs.existsSync(stateFile)) {
  fs.unlinkSync(stateFile);
}
let state = { index: 0 };

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

const timer = setInterval(switchCommit, 60 * 1000);
switchCommit(); 