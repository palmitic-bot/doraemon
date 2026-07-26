// tfmath.js — ถูกหรือผิด (สมการนี้ถูกไหม? แตะให้ทันใน 30 วิ)
let root, el, score = 0, time = 30, isTrue = false, clock = null, playing = false;

function rnd(n){ return Math.floor(Math.random() * n); }

function makeQ(){
  const ops = ['+', '-', '×'];
  const op = ops[rnd(3)];
  let a, b, real;
  if(op === '×'){ a = 2 + rnd(9); b = 2 + rnd(9); real = a * b; }
  else if(op === '+'){ a = 5 + rnd(45); b = 5 + rnd(45); real = a + b; }
  else { a = 20 + rnd(50); b = 1 + rnd(a - 1); real = a - b; }
  isTrue = Math.random() < 0.5;
  let shown = real;
  if(!isTrue){ let off = (rnd(2) ? 1 : -1) * (1 + rnd(9)); shown = Math.max(0, real + off); if(shown === real) shown = real + 1; }
  el.q.textContent = `${a} ${op} ${b} = ${shown}`;
}

function answer(saidTrue){
  if(!playing) return;
  if(saidTrue === isTrue){ score++; el.score.textContent = 'คะแนน: ' + score; makeQ(); }
  else { time = Math.max(0, time - 3); el.time.textContent = '⏱ ' + time; el.q.classList.add('miss'); setTimeout(() => el.q && el.q.classList.remove('miss'), 160); }
}

function start(){
  stop();
  score = 0; time = 30; playing = true;
  el.score.textContent = 'คะแนน: 0';
  el.time.textContent = '⏱ 30';
  el.startBtn.textContent = 'กำลังเล่น…';
  el.startBtn.disabled = true;
  el.btns.style.pointerEvents = 'auto';
  makeQ();
  clock = setInterval(() => { time--; el.time.textContent = '⏱ ' + time; if(time <= 0) end(); }, 1000);
}
function stop(){ if(clock){ clearInterval(clock); clock = null; } }
function end(){
  stop(); playing = false;
  el.btns.style.pointerEvents = 'none';
  el.time.textContent = '⏱ 0';
  el.q.textContent = 'หมดเวลา!';
  el.startBtn.textContent = 'เล่นอีกครั้ง 🔄';
  el.startBtn.disabled = false;
  el.status.textContent = `ตอบถูก ${score} ข้อ 🎉 (น้อยสุดในวงดื่ม)`;
}

export function mount(c){
  root = c;
  root.innerHTML = `
    <div class="g-wrap">
      <div class="g-head">
        <h1 class="g-title">ถูกหรือผิด ➗</h1>
        <p class="g-sub">สมการที่เห็นถูกต้องไหม? แตะ ถูก/ผิด ให้ทันใน 30 วิ (ผิดเสียเวลา)</p>
      </div>
      <div class="g-row" style="justify-content:space-between;max-width:320px;">
        <span class="g-tag" id="score">คะแนน: 0</span>
        <span class="g-tag" id="time">⏱ 30</span>
      </div>
      <div class="g-card"><div class="g-prompt" id="q" style="font-size:clamp(28px,9vw,40px);">พร้อม?</div></div>
      <div class="g-row" id="btns" style="pointer-events:none">
        <button class="g-btn" data-t="1">ถูก ✅</button>
        <button class="g-btn alt" data-t="0">ผิด ❌</button>
      </div>
      <button class="g-btn ghost sm" id="startBtn">เริ่ม! ➗</button>
      <div class="g-prompt-sub" id="status">ตัดสินให้ไว</div>
    </div>`;
  el = { q: root.querySelector('#q'), score: root.querySelector('#score'), time: root.querySelector('#time'),
    startBtn: root.querySelector('#startBtn'), status: root.querySelector('#status'), btns: root.querySelector('#btns') };
  el.btns.querySelectorAll('[data-t]').forEach(b => b.addEventListener('click', () => answer(b.dataset.t === '1')));
  el.startBtn.addEventListener('click', start);
}
export function unmount(){ stop(); playing = false; root = null; el = null; }
