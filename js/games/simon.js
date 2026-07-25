// simon.js — ทำตามลำดับ (จำแล้วกดตามลำดับที่ไฟกระพริบ)
const PADS = [
  { c:'#e0435c' }, { c:'#3fae5c' }, { c:'#4a7bff' }, { c:'#eab949' },
];
let root, el, seq = [], step = 0, round = 0, showing = false, timers = [];

function clearTimers(){ timers.forEach(t => clearTimeout(t)); timers = []; }

function flash(i, on){
  const pad = el.pads[i];
  if(!pad) return;
  pad.classList.toggle('lit', on);
}

function playSeq(){
  showing = true;
  el.status.textContent = 'ดูให้ดี…';
  let d = 400;
  seq.forEach((i, idx) => {
    timers.push(setTimeout(() => flash(i, true), d));
    timers.push(setTimeout(() => flash(i, false), d + 320));
    d += 560;
  });
  timers.push(setTimeout(() => { showing = false; step = 0; el.status.textContent = 'ตาคุณ! กดตามลำดับ'; }, d));
}

function nextRound(){
  clearTimers();
  round++;
  seq.push(Math.floor(Math.random() * 4));
  el.round.textContent = 'รอบ ' + round;
  playSeq();
}

function press(i){
  if(showing || seq.length === 0) return;
  flash(i, true);
  setTimeout(() => flash(i, false), 160);
  if(i === seq[step]){
    step++;
    if(step === seq.length){
      el.status.textContent = '✅ ถูก! รอบต่อไป…';
      timers.push(setTimeout(nextRound, 800));
    }
  } else {
    el.status.textContent = `❌ ผิด! ไปได้ ${round - 1} รอบ — ดื่ม! กดเริ่มใหม่`;
    seq = []; round = 0;
    el.startBtn.textContent = 'เริ่มใหม่ ▶';
    el.startBtn.disabled = false;
  }
}

function start(){
  clearTimers();
  seq = []; round = 0; step = 0;
  el.startBtn.textContent = 'กำลังเล่น…';
  el.startBtn.disabled = true;
  nextRound();
}

export function mount(c){
  root = c;
  const pads = PADS.map((p, i) => `<button class="simon-pad" data-i="${i}" style="--pc:${p.c}"></button>`).join('');
  root.innerHTML = `
    <div class="g-wrap">
      <div class="g-head">
        <h1 class="g-title">ทำตามลำดับ 🔴</h1>
        <p class="g-sub">จำลำดับไฟที่กระพริบ แล้วกดตามให้ถูก ยาวขึ้นทุกรอบ!</p>
      </div>
      <span class="g-tag" id="round">รอบ 0</span>
      <div class="simon-grid" id="pads">${pads}</div>
      <button class="g-btn" id="startBtn">เริ่ม! ▶</button>
      <div class="g-prompt-sub" id="status">กดเริ่มเพื่อเล่น</div>
    </div>`;
  el = { pads: Array.from(root.querySelectorAll('.simon-pad')), round: root.querySelector('#round'),
    status: root.querySelector('#status'), startBtn: root.querySelector('#startBtn') };
  el.pads.forEach((p, i) => p.addEventListener('click', () => press(i)));
  el.startBtn.addEventListener('click', start);
}
export function unmount(){ clearTimers(); showing = false; root = null; el = null; }
