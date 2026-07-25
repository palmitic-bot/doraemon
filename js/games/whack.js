// whack.js — ตบตัวตุ่น (แตะตัวตุ่นที่โผล่ให้ไวใน 20 วิ)
let root, el, score = 0, time = 20, popT = null, clockT = null, playing = false, active = -1;

function stopAll(){ if(popT){ clearInterval(popT); popT = null; } if(clockT){ clearInterval(clockT); clockT = null; } }

function start(){
  stopAll();
  score = 0; time = 20; playing = true; active = -1;
  el.score.textContent = 'คะแนน: 0';
  el.time.textContent = '⏱ 20';
  el.startBtn.textContent = 'กำลังเล่น…';
  el.startBtn.disabled = true;
  clearHoles();
  popT = setInterval(pop, 720);
  clockT = setInterval(() => {
    time--;
    el.time.textContent = '⏱ ' + time;
    if(time <= 0){ end(); }
  }, 1000);
}

function clearHoles(){ el.holes.forEach(h => h.classList.remove('up')); }

function pop(){
  clearHoles();
  active = Math.floor(Math.random() * el.holes.length);
  el.holes[active].classList.add('up');
}

function hit(i){
  if(!playing) return;
  if(i === active && el.holes[i].classList.contains('up')){
    score++; el.score.textContent = 'คะแนน: ' + score;
    el.holes[i].classList.remove('up');
    el.holes[i].classList.add('bonk');
    setTimeout(() => el.holes[i] && el.holes[i].classList.remove('bonk'), 200);
    active = -1;
  }
}

function end(){
  stopAll(); playing = false; clearHoles();
  el.time.textContent = '⏱ 0';
  el.startBtn.textContent = 'เล่นอีกครั้ง 🔄';
  el.startBtn.disabled = false;
  el.status.textContent = `จบเกม! ได้ ${score} คะแนน 🎉 (น้อยสุดในวงดื่ม)`;
}

export function mount(c){
  root = c;
  const holes = Array.from({ length: 9 }, (_, i) => `<button class="mole-hole" data-i="${i}"><span class="mole">🐹</span></button>`).join('');
  root.innerHTML = `
    <div class="g-wrap">
      <div class="g-head">
        <h1 class="g-title">ตบตัวตุ่น 🐹</h1>
        <p class="g-sub">แตะตัวตุ่นที่โผล่ให้ไวที่สุดใน 20 วินาที ผลัดกันเล่นแล้วเทียบคะแนน</p>
      </div>
      <div class="g-row" style="justify-content:space-between;max-width:320px;">
        <span class="g-tag" id="score">คะแนน: 0</span>
        <span class="g-tag" id="time">⏱ 20</span>
      </div>
      <div class="mole-grid" id="grid">${holes}</div>
      <button class="g-btn" id="startBtn">เริ่ม! 🔨</button>
      <div class="g-prompt-sub" id="status">แตะให้โดนตัวตุ่น ระวังแตะพลาด</div>
    </div>`;
  el = { score: root.querySelector('#score'), time: root.querySelector('#time'),
    startBtn: root.querySelector('#startBtn'), status: root.querySelector('#status'),
    holes: Array.from(root.querySelectorAll('.mole-hole')) };
  el.holes.forEach((h, i) => h.addEventListener('click', () => hit(i)));
  el.startBtn.addEventListener('click', start);
}
export function unmount(){ stopAll(); playing = false; root = null; el = null; }
