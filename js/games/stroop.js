// stroop.js — จับผิดสี (แตะ "สีของตัวอักษร" ไม่ใช่ความหมายคำ)
const COLORS = [
  { n:'แดง', c:'#e0435c' }, { n:'เขียว', c:'#3fae5c' },
  { n:'น้ำเงิน', c:'#4a7bff' }, { n:'เหลือง', c:'#eab949' },
];
let root, el, score = 0, time = 20, inkIdx = 0, clock = null, playing = false;

function rand(n){ return Math.floor(Math.random() * n); }

function nextWord(){
  const wordIdx = rand(4);
  inkIdx = rand(4);
  el.word.textContent = COLORS[wordIdx].n;
  el.word.style.color = COLORS[inkIdx].c;
}

function start(){
  stop();
  score = 0; time = 20; playing = true;
  el.score.textContent = 'คะแนน: 0';
  el.time.textContent = '⏱ 20';
  el.startBtn.textContent = 'กำลังเล่น…';
  el.startBtn.disabled = true;
  el.pads.style.pointerEvents = 'auto';
  nextWord();
  clock = setInterval(() => {
    time--; el.time.textContent = '⏱ ' + time;
    if(time <= 0) end();
  }, 1000);
}
function stop(){ if(clock){ clearInterval(clock); clock = null; } }

function tap(i){
  if(!playing) return;
  if(i === inkIdx){ score++; el.score.textContent = 'คะแนน: ' + score; nextWord(); }
  else { time = Math.max(0, time - 2); el.time.textContent = '⏱ ' + time; el.word.classList.add('miss'); setTimeout(() => el.word && el.word.classList.remove('miss'), 200); }
}

function end(){
  stop(); playing = false;
  el.pads.style.pointerEvents = 'none';
  el.time.textContent = '⏱ 0';
  el.startBtn.textContent = 'เล่นอีกครั้ง 🔄';
  el.startBtn.disabled = false;
  el.word.textContent = 'จบ!'; el.word.style.color = 'var(--cream)';
  el.status.textContent = `ได้ ${score} คะแนน 🎉 (น้อยสุดในวงดื่ม)`;
}

export function mount(c){
  root = c;
  const pads = COLORS.map((col, i) =>
    `<button class="swatch" data-i="${i}" style="background:${col.c}">${col.n}</button>`).join('');
  root.innerHTML = `
    <div class="g-wrap">
      <div class="g-head">
        <h1 class="g-title">จับผิดสี 🎨</h1>
        <p class="g-sub">แตะปุ่มที่ตรงกับ "สีของตัวอักษร" ไม่ใช่ความหมายของคำ! (20 วิ)</p>
      </div>
      <div class="g-row" style="justify-content:space-between;max-width:320px;">
        <span class="g-tag" id="score">คะแนน: 0</span>
        <span class="g-tag" id="time">⏱ 20</span>
      </div>
      <div class="g-card"><div class="stroop-word" id="word">พร้อม?</div></div>
      <div class="stroop-pads" id="pads" style="pointer-events:none">${pads}</div>
      <button class="g-btn" id="startBtn">เริ่ม! 🎨</button>
      <div class="g-prompt-sub" id="status">ดูสีของตัวอักษร แล้วแตะสีนั้น</div>
    </div>`;
  el = { word: root.querySelector('#word'), score: root.querySelector('#score'),
    time: root.querySelector('#time'), startBtn: root.querySelector('#startBtn'),
    status: root.querySelector('#status'), pads: root.querySelector('#pads') };
  el.pads.querySelectorAll('.swatch').forEach(b => b.addEventListener('click', () => tap(Number(b.dataset.i))));
  el.startBtn.addEventListener('click', start);
}
export function unmount(){ stop(); playing = false; root = null; el = null; }
