// mathsprint.js — เลขเร็ว (คิดเลขให้ทันใน 30 วิ)
let root, el, score = 0, time = 30, ans = 0, clock = null, playing = false;

function rnd(n){ return Math.floor(Math.random() * n); }

function makeQ(){
  const ops = ['+', '-', '×'];
  const op = ops[rnd(3)];
  let a, b;
  if(op === '×'){ a = 2 + rnd(8); b = 2 + rnd(8); ans = a * b; }
  else if(op === '+'){ a = 5 + rnd(45); b = 5 + rnd(45); ans = a + b; }
  else { a = 20 + rnd(60); b = 1 + rnd(a - 1); ans = a - b; }
  el.q.textContent = `${a} ${op} ${b} = ?`;
  const opts = new Set([ans]);
  while(opts.size < 4){ const d = ans + (rnd(11) - 5) + (rnd(2) ? rnd(6) : 0); if(d >= 0 && d !== ans) opts.add(d); }
  const arr = [...opts].sort(() => Math.random() - 0.5);
  el.opts.innerHTML = arr.map(v => `<button class="choice-btn" data-v="${v}">${v}</button>`).join('');
  el.opts.querySelectorAll('.choice-btn').forEach(b => b.addEventListener('click', () => pick(Number(b.dataset.v), b)));
}

function pick(v, btn){
  if(!playing) return;
  if(v === ans){ score++; el.score.textContent = 'คะแนน: ' + score; makeQ(); }
  else { btn.classList.add('wrong'); time = Math.max(0, time - 3); el.time.textContent = '⏱ ' + time; }
}

function start(){
  stop();
  score = 0; time = 30; playing = true;
  el.score.textContent = 'คะแนน: 0';
  el.time.textContent = '⏱ 30';
  el.startBtn.textContent = 'กำลังเล่น…';
  el.startBtn.disabled = true;
  el.opts.style.pointerEvents = 'auto';
  makeQ();
  clock = setInterval(() => { time--; el.time.textContent = '⏱ ' + time; if(time <= 0) end(); }, 1000);
}
function stop(){ if(clock){ clearInterval(clock); clock = null; } }
function end(){
  stop(); playing = false;
  el.opts.style.pointerEvents = 'none';
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
        <h1 class="g-title">เลขเร็ว 🧮</h1>
        <p class="g-sub">คิดเลขแล้วแตะคำตอบให้ถูกมากที่สุดใน 30 วิ (ตอบผิดเสียเวลา)</p>
      </div>
      <div class="g-row" style="justify-content:space-between;max-width:320px;">
        <span class="g-tag" id="score">คะแนน: 0</span>
        <span class="g-tag" id="time">⏱ 30</span>
      </div>
      <div class="g-card"><div class="g-prompt" id="q" style="font-size:clamp(26px,8vw,36px);">พร้อม?</div></div>
      <div class="choice-list two" id="opts" style="pointer-events:none"></div>
      <button class="g-btn" id="startBtn">เริ่ม! 🧮</button>
      <div class="g-prompt-sub" id="status">แตะคำตอบที่ถูก</div>
    </div>`;
  el = { q: root.querySelector('#q'), opts: root.querySelector('#opts'), score: root.querySelector('#score'),
    time: root.querySelector('#time'), startBtn: root.querySelector('#startBtn'), status: root.querySelector('#status') };
  el.startBtn.addEventListener('click', start);
}
export function unmount(){ stop(); playing = false; root = null; el = null; }
