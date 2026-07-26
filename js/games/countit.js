// countit.js — นับให้ไว (นับว่ามีอิโมจิเป้าหมายกี่ตัว)
const FILLERS = ['🍏','🍊','🍋','🍇','🍓','🫐','🍒','🥝','🍑','🍍'];
let root, el, streak = 0, best = 0, answer = 0, locked = false;

function rnd(n){ return Math.floor(Math.random() * n); }

function build(){
  locked = false;
  const target = FILLERS[rnd(FILLERS.length)];
  let others = FILLERS.filter(e => e !== target);
  const total = 14 + rnd(8);
  answer = 2 + rnd(6);
  const cells = [];
  for(let i = 0; i < answer; i++) cells.push(target);
  while(cells.length < total) cells.push(others[rnd(others.length)]);
  for(let i = cells.length - 1; i > 0; i--){ const j = rnd(i + 1); [cells[i], cells[j]] = [cells[j], cells[i]]; }
  el.field.innerHTML = cells.map(e => `<span>${e}</span>`).join('');
  el.q.textContent = `มี ${target} กี่ตัว?`;
  const opts = new Set([answer]);
  while(opts.size < 4){ const d = Math.max(1, answer + (rnd(5) - 2)); if(d !== answer) opts.add(d); }
  const arr = [...opts].sort(() => Math.random() - 0.5);
  el.opts.innerHTML = arr.map(v => `<button class="choice-btn" data-v="${v}">${v}</button>`).join('');
  el.opts.querySelectorAll('.choice-btn').forEach(b => b.addEventListener('click', () => pick(Number(b.dataset.v))));
  el.status.textContent = 'นับแล้วเลือกคำตอบ';
}

function pick(v){
  if(locked) return;
  locked = true;
  if(v === answer){ streak++; best = Math.max(best, streak); el.status.textContent = 'ถูก! ✅ ' + answer + ' ตัว'; el.streak.textContent = 'สตรีค: ' + streak; setTimeout(build, 600); }
  else { el.status.textContent = `ผิด! ❌ มี ${answer} ตัว สตรีคจบที่ ${streak} (ดีสุด ${best}) — ดื่ม!`; streak = 0; el.streak.textContent = 'สตรีค: 0'; el.opts.querySelectorAll('.choice-btn').forEach(b => b.disabled = true); setTimeout(build, 1400); }
}

export function mount(c){
  root = c; streak = 0; best = 0;
  root.innerHTML = `
    <div class="g-wrap">
      <div class="g-head">
        <h1 class="g-title">นับให้ไว 👀</h1>
        <p class="g-sub">นับจำนวนอิโมจิเป้าหมายให้ถูกและไว ตอบผิด = ดื่ม!</p>
      </div>
      <span class="g-tag" id="streak">สตรีค: 0</span>
      <div class="count-field" id="field"></div>
      <div class="g-prompt" id="q" style="font-size:clamp(20px,5.5vw,26px);">พร้อม?</div>
      <div class="choice-list two" id="opts"></div>
      <div class="g-prompt-sub" id="status">นับแล้วเลือกคำตอบ</div>
    </div>`;
  el = { field: root.querySelector('#field'), q: root.querySelector('#q'), opts: root.querySelector('#opts'),
    status: root.querySelector('#status'), streak: root.querySelector('#streak') };
  build();
}
export function unmount(){ root = null; el = null; }
