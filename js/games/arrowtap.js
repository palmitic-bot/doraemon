// arrowtap.js — ปัดให้ถูก (แตะปุ่มลูกศรให้ตรงทิศ ภายใน 20 วิ)
const DIRS = [{ k:'up', e:'⬆️' }, { k:'down', e:'⬇️' }, { k:'left', e:'⬅️' }, { k:'right', e:'➡️' }];
let root, el, score = 0, time = 20, cur = 0, clock = null, playing = false;

function newArrow(){ cur = Math.floor(Math.random() * 4); el.arrow.textContent = DIRS[cur].e; }

function start(){
  stop();
  score = 0; time = 20; playing = true;
  el.score.textContent = 'คะแนน: 0';
  el.time.textContent = '⏱ 20';
  el.startBtn.textContent = 'กำลังเล่น…';
  el.startBtn.disabled = true;
  el.pads.style.pointerEvents = 'auto';
  newArrow();
  clock = setInterval(() => { time--; el.time.textContent = '⏱ ' + time; if(time <= 0) end(); }, 1000);
}
function stop(){ if(clock){ clearInterval(clock); clock = null; } }
function tap(k){
  if(!playing) return;
  if(k === DIRS[cur].k){ score++; el.score.textContent = 'คะแนน: ' + score; newArrow(); }
  else { time = Math.max(0, time - 1); el.time.textContent = '⏱ ' + time; el.arrow.classList.add('miss'); setTimeout(() => el.arrow && el.arrow.classList.remove('miss'), 160); }
}
function end(){
  stop(); playing = false;
  el.pads.style.pointerEvents = 'none';
  el.time.textContent = '⏱ 0';
  el.arrow.textContent = '🏁';
  el.startBtn.textContent = 'เล่นอีกครั้ง 🔄';
  el.startBtn.disabled = false;
  el.status.textContent = `ได้ ${score} คะแนน 🎉 (น้อยสุดในวงดื่ม)`;
}

export function mount(c){
  root = c;
  root.innerHTML = `
    <div class="g-wrap">
      <div class="g-head">
        <h1 class="g-title">ปัดให้ถูก ⬆️</h1>
        <p class="g-sub">แตะปุ่มลูกศรให้ตรงกับทิศที่แสดงให้ได้มากที่สุดใน 20 วิ (ผิดเสียเวลา)</p>
      </div>
      <div class="g-row" style="justify-content:space-between;max-width:300px;">
        <span class="g-tag" id="score">คะแนน: 0</span>
        <span class="g-tag" id="time">⏱ 20</span>
      </div>
      <div class="g-card"><div class="arrow-big" id="arrow">⬆️</div></div>
      <div class="arrow-pads" id="pads" style="pointer-events:none">
        <button class="arrow-btn up" data-k="up">⬆️</button>
        <div class="arrow-mid">
          <button class="arrow-btn" data-k="left">⬅️</button>
          <button class="arrow-btn" data-k="right">➡️</button>
        </div>
        <button class="arrow-btn down" data-k="down">⬇️</button>
      </div>
      <button class="g-btn" id="startBtn">เริ่ม! ⬆️</button>
      <div class="g-prompt-sub" id="status">แตะทิศให้ตรง</div>
    </div>`;
  el = { arrow: root.querySelector('#arrow'), score: root.querySelector('#score'), time: root.querySelector('#time'),
    startBtn: root.querySelector('#startBtn'), status: root.querySelector('#status'), pads: root.querySelector('#pads') };
  el.pads.querySelectorAll('.arrow-btn').forEach(b => b.addEventListener('click', () => tap(b.dataset.k)));
  el.startBtn.addEventListener('click', start);
}
export function unmount(){ stop(); playing = false; root = null; el = null; }
