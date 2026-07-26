// oddoneout.js — หาตัวต่าง (แตะอิโมจิที่ต่างจากพวก เลเวลยากขึ้น)
const SETS = [
  ['🙂','🙃'], ['😀','😃'], ['🐶','🐱'], ['🍎','🍏'], ['⭐','✨'], ['❤️','🧡'],
  ['🔵','🟣'], ['😺','😸'], ['🌕','🌝'], ['👍','👌'], ['🥳','🤩'], ['🍅','🍎'],
];
let root, el, level = 1, oddIdx = 0, playing = false;

function build(){
  playing = true;
  const cols = Math.min(3 + Math.floor(level / 2), 7);
  const rows = Math.min(3 + Math.floor(level / 3), 7);
  const n = cols * rows;
  const pair = SETS[Math.floor(Math.random() * SETS.length)];
  oddIdx = Math.floor(Math.random() * n);
  el.grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  let html = '';
  for(let i = 0; i < n; i++) html += `<button class="odd-cell" data-i="${i}">${i === oddIdx ? pair[1] : pair[0]}</button>`;
  el.grid.innerHTML = html;
  el.grid.querySelectorAll('.odd-cell').forEach(b => b.addEventListener('click', () => tap(Number(b.dataset.i))));
  el.level.textContent = 'เลเวล ' + level;
  el.status.textContent = 'แตะตัวที่ต่างจากพวก';
}

function tap(i){
  if(!playing) return;
  if(i === oddIdx){ level++; build(); }
  else {
    playing = false;
    el.status.textContent = `ผิด! ❌ ไปได้ถึงเลเวล ${level} — ดื่ม! กดเริ่มใหม่`;
    el.grid.querySelectorAll('.odd-cell').forEach(b => b.disabled = true);
    el.grid.querySelectorAll('.odd-cell')[oddIdx].classList.add('reveal');
  }
}

export function mount(c){
  root = c; level = 1;
  root.innerHTML = `
    <div class="g-wrap">
      <div class="g-head">
        <h1 class="g-title">หาตัวต่าง 🔍</h1>
        <p class="g-sub">แตะอิโมจิที่แตกต่างจากตัวอื่นให้ไว ยิ่งเลเวลสูงยิ่งเนียน!</p>
      </div>
      <div class="g-row" style="justify-content:space-between;max-width:300px;">
        <span class="g-tag" id="level">เลเวล 1</span>
        <button class="g-btn ghost sm" id="resetBtn">เริ่มใหม่ 🔄</button>
      </div>
      <div class="odd-grid" id="grid"></div>
      <div class="g-prompt-sub" id="status">แตะตัวที่ต่างจากพวก</div>
    </div>`;
  el = { grid: root.querySelector('#grid'), level: root.querySelector('#level'), status: root.querySelector('#status') };
  root.querySelector('#resetBtn').addEventListener('click', () => { level = 1; build(); });
  build();
}
export function unmount(){ playing = false; root = null; el = null; }
