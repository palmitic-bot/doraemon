// tapduel.js — ตบมือดวล (2 คนบนมือถือเครื่องเดียว ใครแตะครบ 25 ก่อนชนะ)
const TARGET = 25;
let root, el, p1 = 0, p2 = 0, active = false, cd = null;

function reset(){
  if(cd){ clearInterval(cd); cd = null; }
  p1 = 0; p2 = 0; active = false;
  update();
  el.top.classList.remove('win'); el.bot.classList.remove('win');
  el.startBtn.style.display = '';
  el.startBtn.textContent = 'เริ่มดวล! (แตะ)';
  el.status.textContent = 'คนบน–คนล่าง เตรียมพร้อม';
}

function update(){
  el.bar1.style.width = Math.min(100, p1 / TARGET * 100) + '%';
  el.bar2.style.width = Math.min(100, p2 / TARGET * 100) + '%';
  el.c1.textContent = p1; el.c2.textContent = p2;
}

function start(){
  el.startBtn.style.display = 'none';
  let n = 3;
  el.status.textContent = '3';
  cd = setInterval(() => {
    n--;
    if(n > 0) el.status.textContent = String(n);
    else if(n === 0) el.status.textContent = 'แตะรัวเลย! 🥊';
    else { clearInterval(cd); cd = null; active = true; el.status.textContent = 'สู้! แตะให้ครบ ' + TARGET; }
  }, 600);
}

function hit(who){
  if(!active) return;
  if(who === 1) p1++; else p2++;
  update();
  if(p1 >= TARGET || p2 >= TARGET){
    active = false;
    const win1 = p1 >= TARGET;
    (win1 ? el.top : el.bot).classList.add('win');
    el.status.textContent = win1 ? '🏆 คนบนชนะ! คนล่างดื่ม' : '🏆 คนล่างชนะ! คนบนดื่ม';
    el.startBtn.style.display = '';
    el.startBtn.textContent = 'ดวลใหม่ 🔄';
  }
}

export function mount(c){
  root = c;
  root.innerHTML = `
    <div class="g-wrap">
      <div class="g-head">
        <h1 class="g-title">ตบมือดวล 🥊</h1>
        <p class="g-sub">2 คนถือมือถือคนละฝั่ง แตะรัวให้ครบ ${TARGET} ก่อนชนะ! ใครแพ้ดื่ม</p>
      </div>
      <div class="duel-wrap">
        <button class="duel-half top" id="top">
          <div class="duel-bar-wrap"><div class="duel-bar" id="bar1"></div></div>
          <div class="duel-label">คนบน · <span id="c1">0</span></div>
          <div class="duel-tap">แตะ!</div>
        </button>
        <div class="duel-mid" id="status">เตรียมพร้อม</div>
        <button class="duel-half bot" id="bot">
          <div class="duel-tap">แตะ!</div>
          <div class="duel-label">คนล่าง · <span id="c2">0</span></div>
          <div class="duel-bar-wrap"><div class="duel-bar" id="bar2"></div></div>
        </button>
      </div>
      <button class="g-btn" id="startBtn">เริ่มดวล! (แตะ)</button>
    </div>`;
  el = { top: root.querySelector('#top'), bot: root.querySelector('#bot'),
    bar1: root.querySelector('#bar1'), bar2: root.querySelector('#bar2'),
    c1: root.querySelector('#c1'), c2: root.querySelector('#c2'),
    status: root.querySelector('#status'), startBtn: root.querySelector('#startBtn') };
  el.top.addEventListener('click', () => hit(1));
  el.bot.addEventListener('click', () => hit(2));
  el.startBtn.addEventListener('click', start);
  reset();
}
export function unmount(){ if(cd){ clearInterval(cd); cd = null; } active = false; root = null; el = null; }
