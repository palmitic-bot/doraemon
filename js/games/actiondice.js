// actiondice.js — เต๋าคำสั่ง (ทอยได้ "คำสั่ง × จำนวน")
const ACTIONS = [
  { e:'🍺', t:'ดื่ม' }, { e:'👉', t:'แจกให้คนอื่นดื่ม' }, { e:'🎯', t:'เลือกคนดื่ม' },
  { e:'💃', t:'ทำท่าโชว์' }, { e:'🤐', t:'ตอบคำถามจริง' }, { e:'😎', t:'รอด ปลอดภัย' },
  { e:'🔄', t:'สลับที่นั่ง' }, { e:'🎤', t:'ร้องเพลง 1 ท่อน' },
];
let root, el, spinning = false, timers = [];

function clearTimers(){ timers.forEach(t => clearInterval(t)); timers.forEach(t => clearTimeout(t)); timers = []; }

function roll(){
  if(spinning) return;
  spinning = true;
  el.btn.disabled = true;
  el.result.textContent = '';
  const act = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
  const num = 1 + Math.floor(Math.random() * 4);
  const ai = setInterval(() => { const a = ACTIONS[Math.floor(Math.random() * ACTIONS.length)]; el.action.textContent = a.e; el.actionT.textContent = a.t; }, 80);
  const ni = setInterval(() => { el.num.textContent = '×' + (1 + Math.floor(Math.random() * 4)); }, 80);
  timers.push(ai, ni);
  const done = setTimeout(() => {
    clearInterval(ai); clearInterval(ni);
    el.action.textContent = act.e;
    el.actionT.textContent = act.t;
    el.num.textContent = '×' + num;
    el.result.textContent = `👉 ${act.t} × ${num}`;
    el.btn.disabled = false;
    el.btn.textContent = 'ทอยอีก 🎲';
    spinning = false;
  }, 900);
  timers.push(done);
}

export function mount(c){
  root = c; spinning = false;
  root.innerHTML = `
    <div class="g-wrap">
      <div class="g-head">
        <h1 class="g-title">เต๋าคำสั่ง 🎲</h1>
        <p class="g-sub">ทอยได้ "คำสั่ง × จำนวน" แล้วทำตามที่ออก!</p>
      </div>
      <div class="adice-box">
        <div class="adice">
          <div class="adice-e" id="action">🍺</div>
          <div class="adice-t" id="actionT">ดื่ม</div>
        </div>
        <div class="adice num"><div class="adice-e" id="num">×1</div></div>
      </div>
      <div class="g-result" id="result" style="min-height:1.3em;"></div>
      <button class="g-btn" id="btn">ทอย! 🎲</button>
    </div>`;
  el = { action: root.querySelector('#action'), actionT: root.querySelector('#actionT'),
    num: root.querySelector('#num'), result: root.querySelector('#result'), btn: root.querySelector('#btn') };
  el.btn.addEventListener('click', roll);
}
export function unmount(){ clearTimers(); spinning = false; root = null; el = null; }
